import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Builds the Amplify configuration JSON from .env values.
/// Pool ID and Client ID are provided by CDK outputs (UserPoolId, UserPoolClientId).
String buildAmplifyConfig() {
  final poolId = dotenv.env['COGNITO_USER_POOL_ID'] ?? '';
  final clientId = dotenv.env['COGNITO_CLIENT_ID'] ?? '';
  final region = dotenv.env['COGNITO_REGION'] ?? 'us-east-1';

  return '''
{
  "UserAgent": "aws-amplify-cli/2.0",
  "Version": "1.0",
  "auth": {
    "plugins": {
      "awsCognitoAuthPlugin": {
        "UserAgent": "aws-amplify-cli/2.0",
        "Version": "1.0",
        "IdentityManager": { "Default": {} },
        "CognitoUserPool": {
          "Default": {
            "PoolId": "$poolId",
            "AppClientId": "$clientId",
            "Region": "$region"
          }
        },
        "Auth": {
          "Default": {
            "authenticationFlowType": "USER_SRP_AUTH"
          }
        }
      }
    }
  }
}''';
}
