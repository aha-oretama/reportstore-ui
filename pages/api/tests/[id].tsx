import { NextApiHandler } from 'next';
import { getTestData, GetTestDataReturnType } from '../../../lib/tests';

const idApi: NextApiHandler<GetTestDataReturnType> = async (req, res) => {
  const {
    query: { id },
  } = req;
  const testData = await getTestData(Number(id));
  res.status(200).json(testData);
};

export default idApi;
