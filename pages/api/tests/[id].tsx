import { NextApiRequest, NextApiResponse } from 'next';
import { getTestData } from '../../../lib/tests';

export default (
  req: NextApiRequest,
  res: NextApiResponse<ReturnType<typeof getTestData>>
) => {
  const {
    query: { id },
  } = req;
  res.status(200).json(getTestData(id));
};
