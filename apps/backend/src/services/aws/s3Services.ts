import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";    
import { selectStorageNode } from "../storageService";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


export async function generatePresignedUrl(fileName: string, fileType: string) {
  const storageNode = await selectStorageNode();
  const command = new PutObjectCommand({
    Bucket: storageNode.bucket,
    Key: fileName,
    ContentType: fileType,
  });
  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return { presignedUrl, bucket: storageNode.bucket, nodeId: storageNode.id, key: fileName };
}