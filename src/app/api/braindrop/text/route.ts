import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import { TextS3Service } from "../../lib/s3Service";


const textS3Service = new TextS3Service();

export async function GET() {
  const texts = await textS3Service.getAllItems();
  // Return the texts array to the client
  return Response.json(texts);
}

export async function PUT(req: Request) {
  // Retrieve the data from f.e. and upload to bucket
  const {
    ideaText,
    ideaDescription
  } = await req.json();

  const uniqueObjectKey = await textS3Service.uploadItem({
    ideaText,
    ideaDescription
  });

  return Response.json({ message: "ok", id: uniqueObjectKey });
}