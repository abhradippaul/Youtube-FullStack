import dotenv from "dotenv";
dotenv.config();

import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.AWS_REGION!, // Specify the AWS region from environment variables
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID!, // Access key ID from environment variables
    secretAccessKey: process.env.AWS_SECRETACCESSKEY!, // Secret access key from environment variables
  },
});

export { AWS };
