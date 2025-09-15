import { ddbClient } from "../utils/aws";

export async function getVideoUploadUrlDDB(userId: string) {
  return await ddbClient
    .get({
      TableName: "video_upload_info",
      Key: {
        user_id: userId,
      },
    })
    .promise();
}

export async function createVideoUrlDDB(
  uploadId: string,
  uploadUrl: string,
  userId: string
) {
  ddbClient.put(
    {
      TableName: "video_upload_info",
      Item: {
        user_id: userId,
        upload_id: uploadId,
        upload_url: uploadUrl,
        created_at: Date.now(),
      },
    },
    (err, data) => {
      if (err) {
        console.error("Error updating item:", JSON.stringify(err, null, 2));
      } else {
        console.log(
          "Item updated successfully:",
          JSON.stringify(data, null, 2)
        );
      }
    }
  );
}

export async function deleteVideoUploadUrlDDB(userId: string) {
  return await ddbClient
    .delete({
      TableName: "video_upload_info",
      Key: {
        user_id: userId,
      },
    })
    .promise();
}

export async function updateVideoUploadUrlDDB(
  userId: string,
  videoUrl: string
) {
  return await ddbClient
    .update({
      TableName: "video_upload_info",
      Key: {
        user_id: userId,
      },
      UpdateExpression: "SET #attr1 = :set_url, #attr1 = :set_time",
      ExpressionAttributeNames: {
        "#attr1": "upload_url",
        "#attr2": "created_at",
      },
      ExpressionAttributeValues: {
        ":set_url": videoUrl,
        ":set_time": Date.now(),
      },
    })
    .promise();
}
