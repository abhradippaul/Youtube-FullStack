import { ddbClient } from "../utils/aws";

export async function createUserDDB(userId: string) {
  ddbClient.put(
    {
      TableName: "user_info",
      Item: {
        user_id: userId,
        subscribers: 0,
        last_checked: `${new Date()}`,
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

export async function incrementSubscribeCountDDB(userId: string) {
  return await ddbClient
    .update({
      TableName: "user_info",
      Key: {
        user_id: userId,
      },
      UpdateExpression: "SET #attr1 = if_not_exists(#attr1, :start) + :inc",
      ExpressionAttributeNames: {
        "#attr1": "subscribers",
      },
      ExpressionAttributeValues: {
        ":inc": 1,
        ":start": 0,
      },
    })
    .promise();
}

export async function decrementSubscribeCountDDB(userId: string) {
  return await ddbClient
    .update({
      TableName: "user_info",
      Key: {
        user_id: userId,
      },
      UpdateExpression: "SET #attr1 = if_not_exists(#attr1, :start) + :dec",
      ExpressionAttributeNames: {
        "#attr1": "subscribers",
      },
      ExpressionAttributeValues: {
        ":dec": -1,
        ":start": 0,
      },
    })
    .promise();
}

export async function getUserDDB(userId: string) {
  return await ddbClient
    .get({
      TableName: "user_info",
      Key: {
        user_id: userId,
      },
    })
    .promise();
}
