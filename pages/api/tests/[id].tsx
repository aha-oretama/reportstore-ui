import {NextApiHandler} from 'next';
import { getTestData } from '../../../lib/tests';
import { Await } from '../tokens';

export type GetTestResponseType = Await<ReturnType<typeof getTestData>>;

const idApi: NextApiHandler = async (req, res) => {
  let {
    query: { id },
  } = req;
  id = id as string;
  const testData = await getTestData(id);
  res.status(200).json(testData);
};

export default idApi;
