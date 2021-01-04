import { NextApiRequest, NextApiResponse } from 'next';
import { storeTestData } from '../../lib/tests';

interface Response {
  result: string;
}

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  if (req.method === 'POST') {
    await storeTestData(req.body);
    res.status(200).json({ result: 'uploaded' });
  } else {
    res.status(400).json({ result: 'not found' });
  }
};
