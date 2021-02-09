import {NextApiHandler} from 'next';
import { findByRepositoryId } from '../../lib/tokens';

export type Await<T> = T extends Promise<infer U> ? U : T;
export type TokenResponseType = Await<ReturnType<typeof findByRepositoryId>>;

const tokenApi: NextApiHandler<TokenResponseType> = async (
  req,
  res
) => {
  const {repositoryId} = req.query;
  const result = await findByRepositoryId(Number(repositoryId));
  res.status(200).json(result);
};

export default tokenApi;
