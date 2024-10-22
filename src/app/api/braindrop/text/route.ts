export const dynamic = 'force-dynamic';
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

  const objectKey = await textS3Service.putItem({
    ideaText,
    ideaDescription
  }, null);

  return Response.json({ message: "ok", id: objectKey });
}

export async function POST(req: Request) {
  const {
    id,
    ideaText,
    ideaDescription,
  } = await req.json();

  const objectKey = await textS3Service.putItem({
    ideaText,
    ideaDescription
  }, id);

  return Response.json({ message: "ok", id: objectKey });
}