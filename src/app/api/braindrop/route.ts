import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';

// Create an S3 client, which is used to connect to the Tigris bucket
const S3 = new S3Client({
  region: "auto",
  endpoint: `https://fly.storage.tigris.dev`,
});


export async function GET() {
  // Create a command to list all objects in the bucket
  const command = new ListObjectsV2Command({
    Bucket: process.env.BUCKET_NAME,
    Prefix: 'image/',
  });

  // Execute the command and retrieve all objects in the bucket
  let isTruncated = true;
  let contents: any[] = [];
  while (isTruncated) {
    const { Contents, IsTruncated, NextContinuationToken } = await S3.send(command);
    contents = contents.concat(Contents);
    isTruncated = !!IsTruncated;

    command.input.ContinuationToken = NextContinuationToken;
  }

  // Create a signed URL for each object in the bucket
  const files = []
  for (let content of contents) {
    // any empty files are most likely folders and not usable files so we skip.
    if (content.Size === 0) {
      continue;
    }
    const imageUrl = await getSignedUrl(S3,
      new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: content.Key
      }),
      { expiresIn: 3600 }
    )

    files.push({
      Key: content.Key,
      LastModified: content.LastModified,
      Url: imageUrl
    });
  }

  // Return the files array to the client
  return Response.json(files);
}

export async function PUT(req: Request) {
  // Retrieve the data from f.e. and upload to bucket
  const {
    ideaText,
    ideaDescription
  } = await req.json();

  const uniqueObjectKey = `text/${uuidv4()}.json`;
  // Create a command to create the object from the bucket
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: uniqueObjectKey,
    Body: Buffer.from(JSON.stringify({
      ideaText,
      ideaDescription,
    })),
    ContentEncoding: 'base64',
    ContentType: 'application/json'
  });
  

  await S3.send(command);
  return Response.json({ message: "ok", id: uniqueObjectKey });
}