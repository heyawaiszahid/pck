import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    error: "Image key is missing. Please provide a valid image key in your request.",
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image") as File;
  const filename = formData.get("filename") as string;

  const Bucket = process.env.AMPLIFY_BUCKET;
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });

  const Body = (await image.arrayBuffer()) as Buffer;
  const response = await s3.send(
    new PutObjectCommand({
      Bucket,
      Key: filename,
      Body,
      ContentType: image.type,
    })
  );

  if (response.$metadata.httpStatusCode !== 200)
    return NextResponse.json(
      { error: "An error occured. Please try again." },
      { status: response.$metadata.httpStatusCode }
    );

  return NextResponse.json({ success: true, filename });
}
