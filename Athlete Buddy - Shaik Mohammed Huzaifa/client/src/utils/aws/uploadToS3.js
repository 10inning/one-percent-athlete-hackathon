import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

async function uploadToS3(file, fileName) {
  // Create an S3 client instance
  const s3Client = new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
    },
  });

  const params = {
    Bucket: import.meta.env.VITE_AWS_BUCKET_NAME, // Replace with your bucket name
    Key: fileName,
    Body: file,
  };

  try {
    // Create and send the upload command
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    console.log("File uploaded successfully", response);
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export default uploadToS3;
