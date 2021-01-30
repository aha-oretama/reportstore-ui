import { NextApiRequest, NextApiResponse } from 'next';
import { BuildInfo, storeBuildInfo, storeTestData } from '../../lib/tests';
import { IncomingHttpHeaders } from 'http';
import { findByToken } from '../../lib/tokens';

interface Response {
  result: string;
}

const getBuildInfo = (reportId: number, headers: IncomingHttpHeaders) => {
  return {
    reportId,
    repositoryUrl: headers['x-repository-url'],
    branch: headers['x-branch'],
    commitHash: headers['x-commit-hash'],
    tag: headers['x-tag'],
    pullRequestUrl: headers['x-pull-request-url'],
    buildUrl: headers['x-build-rl'],
  } as BuildInfo;
};

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  if (req.method === 'POST') {
    // TODO: Expected codes are https://github.com/aha-oretama/testerve-ui/blob/f64acb5219af0bba7e136ccd633917dc2139c504/pages/api/tests.ts#L10-L59
    // Using headers is workaround
    // Vercel is running in lambda in AWS.
    // When posting FormData with file upload, server api always failed in parsing the body.
    // Related discussion, https://github.com/vercel/next.js/discussions/11634#discussioncomment-143941
    const token = req.headers['x-token'];
    const integration = await findByToken(token as string);
    if(!integration) {
      res.status(400).json({ result: 'token is needed' });
      return;
    }
    const report = await storeTestData(integration.repository_id, req.body);
    await storeBuildInfo(getBuildInfo(report.id, req.headers));
    res.status(200).json({ result: 'uploaded' });
  } else {
    res.status(400).json({ result: 'not found' });
  }
};
