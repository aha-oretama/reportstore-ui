import { NextApiRequest, NextApiResponse } from 'next';
import { getTestData } from '../../../lib/tests';
import { Await } from '../tokens';

export type GetTestResponseType = Await<ReturnType<typeof getTestData>>;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
  } = req;
  const testData = await getTestData(id);
  res.status(200).json(testData);
};
