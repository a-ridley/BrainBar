import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import { ImageS3Service } from "../../lib/s3Service";

const imageS3Service = new ImageS3Service();

export async function GET() {
  
  const images = await imageS3Service.getAllItems();

  // Return the images array to the client
  return Response.json(images);
}

// export async function PUT(req: Request) {
//   // Retrieve the data from f.e. and upload to bucket
//   const {
//     ideaText,
//     ideaDescription
//   } = await req.json();

//   const uniqueObjectKey = `text/${uuidv4()}.json`;
//   // Create a command to create the object from the bucket
//   const command = new PutObjectCommand({
//     Bucket: process.env.BUCKET_NAME,
//     Key: uniqueObjectKey,
//     Body: Buffer.from(JSON.stringify({
//       ideaText,
//       ideaDescription,
//     })),
//     ContentEncoding: 'base64',
//     ContentType: 'application/json'
//   });
  

//   await S3.send(command);
//   return Response.json({ message: "ok", id: uniqueObjectKey });
// }