// "use server"

// import { prismadb } from "@/lib/db"
// import { uploadImageToS3 } from "@/lib/s3"
// import {createBoardSchema} from "@/schemas/board-schemas"

// export const createNewBoard = async({
//     title,
//     imageFile
// }:createBoardSchema)=>{

//     try{
//         // 1- check board title uniqeness
//         const newBoard = await prismadb.board.findFirst({
//             where:{
//                 title
//             }
//         })

//         if(newBoard){
//             return {error: "You already have a board with this title"}
//         }

//         // 2- upload image to s3
//         const imageUrl = await uploadImageToS3(imageFile)

//         // 3- store image in database
//         const newCreatedBoard = await prismadb.board.create({
//             data:{
//                 backgroundImage: imageUrl,

//             }
//         })

//     }
//     catch(error){
//         console.log({error})
//     }
// }
