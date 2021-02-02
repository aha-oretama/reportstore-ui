import { getIdpToken } from '../../../utils/auth0';
import { Octokit } from '@octokit/rest';
import { NextApiRequest, NextApiResponse } from 'next';
import { Endpoints } from '@octokit/types';
import { findByRepositoryIds } from '../../../lib/tokens';

type ListUserRepoResponse = Endpoints['GET /user/repos']['response']['data'][number] & {
  integrated: boolean;
};
export type ListUserReposResponse = ListUserRepoResponse[];

export type RepoResponse = Endpoints['GET /user/repos']['response']['data'][number];

async function getRepositories(
  octokit: Octokit
): Promise<ListUserReposResponse> {
  // https://octokit.github.io/rest.js/v18#repos-list-for-authenticated-user
  const octokitRes = await octokit.repos.listForAuthenticatedUser({
    visibility: 'all',
    per_page: 100, // max
  });

  const ids = octokitRes.data.map((repo) => repo.id);
  const integrations = await findByRepositoryIds(ids);
  const results = octokitRes.data.map((repo) =>
    Object.assign({}, repo, {
      integrated: integrations
        .map((integrate) => integrate.repository_id)
        .includes(repo.id),
    })
  );
  return results;
}

export default async function repositories(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      query: { userId, repositoryId },
    } = req;
    const idpToken = await getIdpToken(userId as string);

    const octokit = new Octokit({
      auth: idpToken,
    });
    if (repositoryId) {
      // https://github.com/octokit/rest.js/issues/163
      const octokitResponse = await octokit.request('GET /repositories/:id', {
        id: repositoryId,
      });
      res.status(200).json(octokitResponse.data);
    } else {
      const results = await getRepositories(octokit);
      res.status(200).json(results);
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
