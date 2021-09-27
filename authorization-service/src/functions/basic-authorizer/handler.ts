import 'source-map-support/register';
import { middyfy } from '../../libs/lambda';

export const basicAuthorizer: any = async (event, ctx, cb) => {

  try {
    console.log('event ' + event)
    const authorizationToken = event.authorizationToken;

    const encodedCreds = authorizationToken.split(' ')[1];
    const plainCreeds = Buffer.from(encodedCreds, 'base64').toString().split(':');
    const username = plainCreeds[0];
    const password = plainCreeds[1];

    console.log('Username: ' + username + ' Password: ' + password);

    const storedUserPassword = process.env[username];
    const effect = !storedUserPassword || storedUserPassword != password ? 'Deny' : 'Allow';

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    cb(null, policy);

  } catch (err) {
    cb('Unauthorized: ' + err.message)
  };
};

const generatePolicy = (principalId, resource, effect = 'Allow') => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}

export const main = middyfy(basicAuthorizer);
