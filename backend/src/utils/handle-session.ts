import { ddbClient } from "../utils/aws";

export async function verifyUserSessionDDB(sessionId: string) {
  return await ddbClient
    .get({
      TableName: "user_session_info",
      Key: {
        session_id: sessionId,
      },
    })
    .promise();
}

export async function createUserSessionDDB(sessionId: string, clerkId: string) {
  ddbClient.put(
    {
      TableName: "user_session_info",
      Item: {
        session_id: sessionId,
        clerk_id: clerkId,
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

export async function deleteUserSessionDDB(sessionId: string) {
  return await ddbClient
    .delete({
      TableName: "user_session_info",
      Key: {
        session_id: sessionId,
      },
    })
    .promise();
}
