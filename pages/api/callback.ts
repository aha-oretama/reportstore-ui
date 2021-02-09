import auth0 from '../../utils/auth0';
import { NextApiRequest, NextApiResponse } from 'next';

// Login callback api is called when auth0 redirect the user to our app
// https://github.com/auth0/nextjs-auth0
export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    await auth0.handleCallback(req, res, { redirectTo: '/gh' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}
