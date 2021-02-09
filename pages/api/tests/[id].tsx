import { NextApiHandler } from 'next';
import { getTestData } from '../../../lib/tests';
import { Await } from '../tokens';

export type GetTestResponseType = Await<ReturnType<typeof getTestData>>;

const idApi: NextApiHandler = async (req, res) => {
  const {
    query: { id },
  } = req;
  const testData = await getTestData(Number(id));
  res.status(200).json(testData);
};

export default idApi;
