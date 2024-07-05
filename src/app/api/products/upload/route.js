// import formidable from "formidable";
// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";

// export const config = {
//   api: {
//     bodyParser: false, // Disable body parsing since we handle it manually
//   },
// };

// const parseForm = (req) => {
//   const form = new formidable.IncomingForm({ multiples: true });
//   return new Promise((resolve, reject) => {
//     form.parse(req, (err, fields, files) => {
//       if (err) reject(err);
//       resolve({ fields, files });
//     });
//   });
// };

// export async function POST(req) {
//   if (req.method !== "POST") {
//     return NextResponse.error({ error: "Method not allowed" }, { status: 405 });
//   }

//   try {
//     const { fields, files } = await parseForm(req);
//     const uploadedFiles = files.images;

//     const saveFile = (file) => {
//       const data = fs.readFileSync(file.path);
//       const filePath = path.join(process.cwd(), "public", "uploads", file.name);
//       fs.writeFileSync(filePath, data);
//       fs.unlinkSync(file.path); // remove the temporary file
//       return { filename: file.name, url: `/uploads/${file.name}` };
//     };

//     const uploadResults = Array.isArray(uploadedFiles)
//       ? uploadedFiles.map(saveFile)
//       : [saveFile(uploadedFiles)];

//     return NextResponse.json(
//       {
//         message: "Files uploaded successfully",
//         files: uploadResults,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("An error occurred while uploading the image", error);
//     return NextResponse.error(
//       { error: "An error occurred while uploading the images" },
//       { status: 500 }
//     );
//   }
// }

// // import formidable from "formidable";
// // import { NextResponse } from "next/server";
// // import { getRawBody } from "next/server";

// // const parseForm = async (req) => {
// //   const rawBody = await getRawBody(req);
// //   const form = formidable({ multiples: true });
// //   return new Promise((resolve, reject) => {
// //     form.parse(rawBody, (err, fields, files) => {
// //       console.log({ fields, files });
// //       if (err) reject(err);
// //       resolve({ fields, files });
// //     });
// //   });
// // };

// // export async function POST(req) {
// //   try {
// //     // uploading images
// //     const { files } = await parseForm(req);
// //     if (!files || !files.images) {
// //       return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
// //     }
// //     const uploadedFiles = Array.isArray(files.images)
// //       ? files.images
// //       : [files.images];
// //     const uploadResults = uploadedFiles.map((file) => ({
// //       filename: file.name,
// //       size: file.size,
// //       type: file.type,
// //       url: `/uploads/${file.name}`, // Replace with appropriate URL or data structure
// //     }));
// //     const uploadPromises = uploadedFiles.map((file) => uploadtoS3(file));
// //     // const uploadResults = await Promise.all(uploadPromises);
// //     console.log({ uploadResults });
// //     return NextResponse.json(
// //       {
// //         message: "Files uploaded successfully",
// //         files: uploadResults,
// //       },
// //       { status: 201 }
// //     );
// //   } catch (error) {
// //     console.error(
// //       { error: "An error occurred while uploading the image" },
// //       error
// //     );
// //     return NextResponse.error(
// //       { error: "An error occurred while uploading the images" },
// //       { status: 400 }
// //     );
// //   }
// // }

// // export const preferredRegion = "auto";
// // export const bodyParser = { sizeLimit: "10mb" }; // Adjust as necessary
