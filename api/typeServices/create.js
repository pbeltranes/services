import uuid from "uuid";
import AWS from "aws-sdk";

const dynamoDb = new AWS.dynamoDb.DocumentClient();

export function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "typeServices",
    // 'Item' contains the type of services that we offerts to users
    // - 'creatorId': user identities who created
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'serviceId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    typeService: {
      typeServiceId: uuid.v1(),
      creatorId: event.requestContext.identity.cognitoIdentityId,
      nameService: data.name,
      typeService: data.typeService,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  dynamoDb.put(params, (error, data)=>{
      // Set reponse headers to enable cors
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      };

      if (error) {
        const response = {
          statusCode: 500,
          headers: headers,
          body: JSON.stringify({ status: false })
        };
        callback(null, response);
        return;
      }
      // Return status code 200 with newly created item
      const response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(params.Item)
      };
      callback(null, response);
    });
}
