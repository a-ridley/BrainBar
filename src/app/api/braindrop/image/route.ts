import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import { ImageS3Service } from "../../lib/s3Service";

const imageS3Service = new ImageS3Service();

export interface UploadImageData {
  imageFile: File
}

export async function GET() {

  const images = await imageS3Service.getAllItems();

  // Return the images array to the client
  return Response.json(images);
}

export async function PUT(req: Request) {
  // Retrieve the data from f.e. and upload to bucket
  const formData = await req.formData();
  const id = formData.get("id")?.valueOf() as string | null;
  const imageFile = formData.get("imageFile")?.valueOf() as File | null;
  // console.log({
  //   id,
  //   imageFile
  // });

  if (id === null || imageFile === null) {
    console.error('no form id or image file');
    return Response.json(
      { message: "no form id or image file" },
      { status: 400 }
    );
  }

  // upload the image file using the imageS3Service and make sure it uses the same id from the formdata
  await imageS3Service.putItem({
    imageFile
  }, id)
  return Response.json({});
}