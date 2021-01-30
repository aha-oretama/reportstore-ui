import { getIdpToken } from '../../../utils/auth0';
import { Octokit } from '@octokit/rest';
import { NextApiRequest, NextApiResponse } from 'next';
import { Endpoints } from '@octokit/types';

export type ListUserReposResponse = Endpoints['GET /user/repos']['response']['data'];

export default async function repositories(
  req: NextApiRequest,
  res: NextApiResponse<ListUserReposResponse>
) {
  try {
    const {
      query: { userId },
    } = req;
    const idpToken = await getIdpToken(userId as string);

    const octokit = new Octokit({
      auth: idpToken,
    });

    // https://octokit.github.io/rest.js/v18#repos-list-for-authenticated-user
    const octokitRes = await octokit.repos.listForAuthenticatedUser({
      visibility: 'all',
      per_page: 100, // max
    });
    res.status(200).json(octokitRes.data);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
