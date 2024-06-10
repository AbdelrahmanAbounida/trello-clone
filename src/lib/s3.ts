"use server";
import crypto from "crypto";
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { prismadb } from "./db";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// 1- S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGIONN!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  apiVersion: "2011-12-05",
  // signatureVersion: 'v4',
});

// util functions
export const createRandomImageKey = async (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

export const fileToBuffer = async (file: File): Promise<Buffer> => {
  return sharp(await file.arrayBuffer())
    .webp()
    .toBuffer();
};

export const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

// main functions
export const uploadImageAsThumbnailtoS3 = async (
  file: File
): Promise<string> => {
  const thumbnail = await sharp(await file.arrayBuffer())
    .webp()
    .resize(300, 300)
    .toBuffer();
  return uploadBufferToS3(thumbnail, "image/webp");
};

export const uploadImageToS3 = async (file: File): Promise<string> => {
  const buffer = await fileToBuffer(file);
  const imageUrl = await uploadBufferToS3(buffer, "image/webp");
  return imageUrl;
};
export const uploadBoardImage = async ({
  boardId,
  checksum,
}: {
  boardId: string;
  checksum: string;
}) => {
  // update board background image

  try {
    const board = await prismadb.board.findUnique({
      where: {
        id: boardId,
      },
    });
    const generatedKey = board?.backgroundImage
      ? board?.backgroundImage?.split("/").pop()
      : await createRandomImageKey();

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAMEE!,
      Key: generatedKey,
      Metadata: {
        boardId,
      },
      ChecksumSHA256: checksum,
    });
    const url = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 60,
    });

    await prismadb.board.update({
      where: {
        id: boardId,
      },
      data: {
        backgroundImage: url.split("?")[0],
      },
    });

    return { url };
  } catch (error) {
    console.log({ error });
    return { error: "Failed to upload the image" };
  }
};

export const uploadWorkpaceLogo = async ({
  workspaceId,
  checksum,
}: {
  workspaceId: string;
  checksum: string;
}) => {
  // update workspace logo

  try {
    const workspace = await prismadb.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });
    const generatedKey = workspace?.logo
      ? workspace?.logo?.split("/").pop()
      : await createRandomImageKey();

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAMEE!,
      Key: generatedKey,
      Metadata: {
        workspaceId,
      },
      ChecksumSHA256: checksum,
    });
    const url = await getSignedUrl(
      s3Client,
      putObjectCommand,
      { expiresIn: 60 } // 60 seconds
    );
    await prismadb.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        logo: url.split("?")[0],
      },
    });

    return { url };
  } catch (error) {
    console.log({ error });
    return { error: "Failed to upload the logo" };
  }
};

// main upload / delete functions
export const uploadBufferToS3 = async (
  buffer: Buffer,
  contentType: string,
  metadata?: object
): Promise<string> => {
  /** return image url including generated key of uploaded buffer */

  const generatedKey = await createRandomImageKey();
  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET_NAMEE!,
    Key: generatedKey,
    Metadata: metadata as {},
    Body: buffer,
    ContentType: contentType,
    //   ChecksumSHA256: checksum,
  };

  const command = new PutObjectCommand(params);
  try {
    const data = await s3Client.send(command);
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${generatedKey}`;
    return imageUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};

export const deleteImageFromS3 = async (imageKey: string): Promise<boolean> => {
  // return false in case of failure

  const params: DeleteObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET_NAMEE!,
    Key: imageKey,
  };

  const command = new DeleteObjectCommand(params);
  try {
    const data = await s3Client.send(command);
    return true;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return false;
  }
};
