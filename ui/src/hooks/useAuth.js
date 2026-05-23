import { useState, useCallback } from 'react';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

export const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
});

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signIn = useCallback((email, password) => {
    setLoading(true);
    setError(null);
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username: email, Pool: userPool });
      user.authenticateUser(new AuthenticationDetails({ Username: email, Password: password }), {
        onSuccess: () => { setLoading(false); resolve(true); },
        onFailure: (err) => {
          setLoading(false);
          setError(err.message ?? 'Sign in failed');
          reject(err);
        },
      });
    });
  }, []);

  const signUp = useCallback((email, password, name) => {
    setLoading(true);
    setError(null);
    const attributes = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'name',  Value: name }),
    ];
    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, attributes, null, (err, result) => {
        setLoading(false);
        if (err) { setError(err.message ?? 'Sign up failed'); reject(err); return; }
        resolve(result);
      });
    });
  }, []);

  const signOut = useCallback(() => {
    const current = userPool.getCurrentUser();
    if (current) current.signOut();
  }, []);

  return { signIn, signUp, signOut, loading, error };
}
