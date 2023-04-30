import { OAuth2Client } from 'google-auth-library';

class GoogleAuth {
  public async validate(credential: string): Promise<object | null> {
    const client = new OAuth2Client(process.env.GOOGLE_AUTH_AUDIENCE);

    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_AUTH_AUDIENCE,
      });

      const payload = ticket.getPayload();
      const username = payload.email.split('@')[0] as string;

      return {
        email: payload.email,
        username: username,
        img: payload.picture,
        verified: true,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return null;
    }
  }
}

export default new GoogleAuth();
