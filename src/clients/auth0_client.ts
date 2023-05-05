import { ManagementClient } from 'auth0';
class Auth0Client extends ManagementClient {
  constructor() {
    const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET } = process.env;
    super({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
      scope: 'read:users',
    });
  }
}

export default Auth0Client;
