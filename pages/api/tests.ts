import { NextApiRequest, NextApiResponse } from 'next';
import { BuildInfo, storeBuildInfo, storeTestData } from '../../lib/tests';
import { Form } from 'multiparty';

interface Response {
  result: string;
}

// To parse form-data by formidable, https://stackoverflow.com/questions/60020241/next-js-file-upload-via-api-routes-formidable-not-working
export const config = {
  api: {
    bodyParser: false,
  },
};

interface ResolveData {
  fields: any;
  files: any;
}

async function getBody(req: NextApiRequest): Promise<ResolveData> {
  const form = new Form({encoding: 'utf-8'});
  return await new Promise<ResolveData>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        fields,
        files,
      });
    });
  });
}

const getBuildInfo = (reportId: number, fields: any) => {
  const [repositoryUrl] = fields['repositoryUrl'];
  const [branch] = fields['branch'];
  const [commitHash] = fields['commitHash'];
  const [tag] = fields['tag'] || [];
  const [pullRequestUrl] = fields['pullRequestUrl'] || [];
  const [buildUrl] = fields['buildUrl'];

  return {
    reportId,
    repositoryUrl,
    branch,
    commitHash,
    tag,
    pullRequestUrl,
    buildUrl,
  } as BuildInfo;
};

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  req.on('data', (c) => console.log(c));
  req.on('end', () => console.log('ended'));
  if (req.method === 'POST') {
    const body = await getBody(req);

    // files returns array when multiples is true, but never enable it
    const path = Array.isArray(body.files.file)
      ? body.files.file[0].path
      : body.files.file.path;
    const report = await storeTestData(path);
    await storeBuildInfo(getBuildInfo(report.id, body.fields));
    res.status(200).json({ result: 'uploaded' });
  } else {
    res.status(400).json({ result: 'not found' });
  }
};
