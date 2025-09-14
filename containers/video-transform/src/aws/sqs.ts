import { AWS } from "./aws.js";

const s3UploadNotificationSQS = new AWS.SQS();
const queueUrl = process.env.AWS_S3_UPLOAD_SQS!;

const paramsReceiveMessage = {
  QueueUrl: queueUrl,
  MaxNumberOfMessages: 10, // Max number of messages to retrieve
  VisibilityTimeout: 30, // Time in seconds messages are hidden from other consumers
  WaitTimeSeconds: 20, // Enable short polling (0) or long polling (up to 20)
  // Optional: MessageAttributeNames, AttributeNames
};

export async function reciveMessage() {
  try {
    const { $response, Messages } = await s3UploadNotificationSQS
      .receiveMessage(paramsReceiveMessage)
      .promise();
    // console.log(Messages);
    if ($response.error) {
      console.error("Error receiving messages:", $response.error);
    } else if (Messages?.length) {
      Messages?.forEach((message) => {
        console.log("Received message:", message.Body);
      });
    }

    // s3UploadNotificationSQS.receiveMessage(
    //   paramsReceiveMessage,
    //   function (err, data) {
    //     if (err) {
    //       console.log("Receive Error", err);
    //     } else if (data.Messages) {
    //       console.log(data.Messages);
    //     }
    //   }
    // );

    //     , (err, data) => {
    //     if (err) {
    //         console.error("Error receiving messages:", err);
    //     } else if (data.Messages) {
    //         data.Messages.forEach(message => {
    //             console.log("Received message:", message.Body);
    //             // Process the message
    //             // After processing, delete the message
    //             const deleteParams = {
    //                 QueueUrl: queueUrl,
    //                 ReceiptHandle: message.ReceiptHandle,
    //             };
    //             sqs.deleteMessage(deleteParams, (deleteErr, deleteData) => {
    //                 if (deleteErr) {
    //                     console.error("Error deleting message:", deleteErr);
    //                 } else {
    //                     console.log("Message deleted:", message.MessageId);
    //                 }
    //             });
    //         });
    //     } else {
    //         console.log("No messages to receive.");
    //     }
    // });
  } catch (err) {
    console.log(err);
  }
}
