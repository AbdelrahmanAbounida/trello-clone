import crypto from "crypto";
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

// 1- S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGIONN!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
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
  const generatedImageKey = await uploadBufferToS3(buffer, "image/webp");
  return generatedImageKey;
};

// main upload / delete functions
export const uploadBufferToS3 = async (
  buffer: Buffer,
  contentType: string,
  metadata?: object
): Promise<string> => {
  /** return generated key of uploaded buffer */

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
    return generatedKey;
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
