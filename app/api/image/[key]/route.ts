import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mime from "mime-types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { key: string } }) {
  const Bucket = process.env.AMPLIFY_BUCKET;
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });

  const command = new GetObjectCommand({ Bucket, Key: params.key });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  const response = await fetch(url);
  const imageData = await response.arrayBuffer();

  const contentType = mime.contentType(params.key) || "application/octet-stream";

  const res = new NextResponse(imageData, {
    status: 200,
    headers: new Headers({
      "Content-Type": contentType,
    }),
  });

  return res;
}
