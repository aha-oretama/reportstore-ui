import { getIdpToken } from '../../../utils/auth0';
import { Octokit } from '@octokit/rest';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function organizations(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      query: { userId },
    } = req;
    const idpToken = await getIdpToken(<string>userId);

    const octokit = new Octokit({
      auth: idpToken,
    });

    const users = await octokit.users.getAuthenticated();
    res.status(200).json(users.data);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
