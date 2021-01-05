import { NextApiRequest, NextApiResponse } from 'next';
import { Fields, Files, IncomingForm } from 'formidable';
import { BuildInfo, storeBuildInfo, storeTestData } from '../../lib/tests';

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
  fields: Fields;
  files: Files;
}

async function getBody(req: NextApiRequest): Promise<ResolveData> {
  const form = new IncomingForm();
  form.keepExtensions = true;
  return await new Promise<ResolveData>((resolve, reject) => {
    form.parse(req, (err, fields: Fields, files: Files) => {
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

const getBuildInfo = (reportId: number, fields: Fields) => {
  return {
    reportId,
    repositoryUrl: fields['repositoryUrl'],
    branch: fields['branch'],
    commitHash: fields['commitHash'],
    tag: fields['tag'],
    pullRequestUrl: fields['pullRequestUrl'],
    buildUrl: fields['buildUrl'],
  } as BuildInfo;
};

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
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
