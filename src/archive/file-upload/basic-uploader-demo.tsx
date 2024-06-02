// "use client";

// import { FileUploader } from "./file-uploader";
// import { UploadedFilesCard } from "./uploaded-files-card";
// import useUploadFile from "./use-upload-file";

// export function MainFileUpload() {
//   const { uploadFiles, progresses, uploadedFiles, isUploading } =
//     useUploadFile();

//   return (
//     <div className="space-y-6">
//       <FileUploader
//         maxFiles={4}
//         maxSize={4 * 1024 * 1024}
//         progresses={progresses}
//         onUpload={uploadFiles}
//         disabled={isUploading}
//       />
//       <UploadedFilesCard uploadedFiles={uploadedFiles} />
//     </div>
//   );
// }
