import HttpClient from '@/clients/http_client';

class Judge0Client extends HttpClient {
  constructor() {
    const { JUDGE0_URL, JUDGE0_AUTH } = process.env;

    super(JUDGE0_URL, {
      'Content-Type': 'application/json',
      'X-Auth-User': JUDGE0_AUTH,
    });
  }
}

export default Judge0Client;
