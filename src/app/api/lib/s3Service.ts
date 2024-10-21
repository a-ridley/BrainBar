import { ListObjectsV2Command, GetObjectCommand, S3Client, PutObjectCommand, _Object } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';


// Create an S3 client, which is used to connect to the Tigris bucket
const S3 = new S3Client({
  region: "auto",
  endpoint: `https://fly.storage.tigris.dev`,
});

/*
 This class should be able to:
 * list all items in an s3 buckets folder
 * upload a new object
 * update an existing object
 */
abstract class BaseS3Service<ExistingItemType, UploadItemType> {

  bucketName = process.env.BUCKET_NAME;
  abstract prefixName: string;
  abstract contentType: string;

  async getAllItems(): Promise<ExistingItemType[]> {
    // Create a command to list all objects in the bucket
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: this.prefixName,
    });

    // Execute the command and retrieve all objects in the bucket
    let isTruncated = true;
    let contents: _Object[] = [];
    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await S3.send(command);
      contents = contents.concat(Contents!);
      isTruncated = !!IsTruncated;

      command.input.ContinuationToken = NextContinuationToken;
    }

    // Create a signed URL for each object in the bucket
    const files: ExistingItemType[] = []
    for (let content of contents) {
      // any empty files are most likely folders and not usable files so we skip.
      if (content.Size === 0) {
        continue;
      }

      files.push(await this.processGetItem(content));
    }
    return files;
  }

  protected abstract processGetItem(s3Object: _Object): Promise<ExistingItemType>;
  abstract uploadItem(data: UploadItemType): Promise<string>;

  protected async uploadItemInternal(data: Buffer): Promise<string> {
    // INFO: make sure i notice that prefixName is missing slash
    const uniqueObjectKey = `${this.prefixName}${uuidv4()}.json`;
    // Create a command to create the object from the bucket
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: uniqueObjectKey,
      Body: data,
      ContentEncoding: 'base64',
      ContentType: this.contentType
    });

    await S3.send(command);
    return uniqueObjectKey;
  }

  updateItem(): string {
    return "";
  }
}

export interface BrainDropImage {
  key: string,
  lastModified: Date,
  url: string
}

export class ImageS3Service extends BaseS3Service<BrainDropImage, Buffer> {
  prefixName: string = 'image/';
  // TODO: Different image types
  contentType: string = 'image/jpeg';

  async processGetItem(s3Object: _Object): Promise<BrainDropImage> {
    console.log({ s3Object });
    const imageUrl = await getSignedUrl(S3,
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: s3Object.Key
      }),
      { expiresIn: 3600 }
    );

    return {
      key: s3Object.Key!,
      lastModified: s3Object.LastModified!,
      url: imageUrl
    }
  }

  uploadItem(data: Buffer): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

export interface BrainDropText {
  key: string,
  lastModified: Date,
  ideaText: string,
  ideaDescription: string
}

export interface CreateBrainDropText {
  ideaText: string,
  ideaDescription: string
}

export class TextS3Service extends BaseS3Service<BrainDropText, CreateBrainDropText> {
  prefixName: string = 'text/';
  contentType: string = 'application/json';

  async processGetItem(s3Object: _Object): Promise<BrainDropText> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: s3Object.Key
    });
    const { Body } = await S3.send(command);
    const jsonDataString = await Body!.transformToString("utf8");
    const jsonData = JSON.parse(jsonDataString);

    return {
      key: s3Object.Key!,
      lastModified: s3Object.LastModified!,
      ideaText: jsonData.ideaText,
      ideaDescription: jsonData.ideaDescription,
    };
  }

  async uploadItem(data: CreateBrainDropText): Promise<string> {
    return await this.uploadItemInternal(Buffer.from(JSON.stringify(data)))
  }
}