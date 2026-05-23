const { CognitoJwtVerifier } = require('aws-jwt-verify');

let _verifier;
const getVerifier = () => {
  if (!_verifier) {
    _verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      clientId:   process.env.COGNITO_CLIENT_ID,
      tokenUse:   'access',
    });
  }
  return _verifier;
};

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const payload = await getVerifier().verify(header.slice(7));
    req.cognitoSub = payload.sub;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
