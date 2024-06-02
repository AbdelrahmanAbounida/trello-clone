// import { useState } from "react";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// interface UploadedFile {
//   name: string;
//   url: string;
//   key: any;
// }

// const useUploadFile = () => {
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const [progresses, setProgresses] = useState<{ [key: string]: number }>({});
//   const [isUploading, setIsUploading] = useState(false);

//   const s3Client = new S3Client({
//     region: process.env.AWS_BUCKET_REGIONN!,
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEYY!,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEYY!,
//     },
//   });

//   const uploadFiles = async (files: File[]) => {
//     setIsUploading(true);

//     const uploadFile = async (file: File) => {
//       const params = {
//         Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
//         Key: file.name,
//         Body: file,
//         ContentType: file.type,
//       };

//       try {
//         const command = new PutObjectCommand(params);
//         await s3Client.send(command);
//         setUploadedFiles((prev) => [
//           ...prev,
//           { name: file.name, key: file.lastModified, url: file.type },
//         ]);
//       } catch (error) {
//         console.error("Error uploading file:", file.name, error);
//       }
//     };

//     const promises = Array.from(files).map((file) => uploadFile(file));
//     await Promise.all(promises);
//     setIsUploading(false);
//   };

//   return {
//     uploadedFiles,
//     progresses,
//     uploadFiles,
//     isUploading,
//   };
// };

// export default useUploadFile;
