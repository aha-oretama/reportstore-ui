import { NextApiHandler } from 'next';
import {
  findByRepositoryId,
  FindByRepositoryIdReturnType,
} from '../../lib/tokens';

const tokenApi: NextApiHandler<FindByRepositoryIdReturnType> = async (
  req,
  res
) => {
  const { repositoryId } = req.query;
  const result = await findByRepositoryId(Number(repositoryId));
  res.status(200).json(result);
};

export default tokenApi;
