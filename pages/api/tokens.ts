import { NextApiRequest, NextApiResponse } from 'next';
import { findByRepositoryId } from '../../lib/tokens';

type Await<T> = T extends Promise<infer U> ? U : T;
export type TokenResponseType = Await<ReturnType<typeof findByRepositoryId>>;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<TokenResponseType>
) => {
  const { repositoryId } = req.query;
  const result = await findByRepositoryId(Number(repositoryId));
  res.status(200).json(result);
};
