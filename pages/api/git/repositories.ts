import { getIdpToken } from '../../../utils/auth0';
import { Octokit } from '@octokit/rest';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function repositories(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      query: { userId },
    } = req;
    const idpToken = await getIdpToken(userId as string);

    const octokit = new Octokit({
      auth: idpToken,
    });

    const octokitRes = await octokit.repos.listForAuthenticatedUser();
    res.status(200).json(octokitRes.data);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
