import db, { Integration } from '../models';
import crypto from 'crypto';
import { Transactionable } from 'sequelize';

const encryptOption = 'compress-algo=1, cipher-algo=aes256';

const getRandomKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const storeToken = async (
  repositoryId: number,
  transactionable: Transactionable = {}
): Promise<{ token: string; repositoryId: number }> => {
  const token = getRandomKey();
  await db.integration.create(
    {
      repository_id: repositoryId,
      token: db.Sequelize.fn('PGP_SYM_ENCRYPT', token, encryptOption),
    },
    transactionable
  );
  return {
    token,
    repositoryId,
  };
};

type FindByRepositoryIdReturnType = Pick<
  Integration,
  'repository_id' | 'token'
>;

export const findByRepositoryId = async (
  repositoryId: number
): Promise<FindByRepositoryIdReturnType> => {
  return await db.integration.findByPk(repositoryId, {
    attributes: [
      'repository_id',
      [
        db.Sequelize.fn(
          'PGP_SYM_DECRYPT',
          db.Sequelize.cast(db.Sequelize.col('token'), 'bytea'),
          encryptOption
        ),
        'token',
      ],
    ],
  });
};

type FindByRepositoryIdsReturnType = Pick<Integration, 'repository_id'>;

export const findByRepositoryIds = async (
  repositoryIds: number[]
): Promise<FindByRepositoryIdsReturnType[]> => {
  return await db.integration.findAll({
    attributes: ['repository_id'],
    where: {
      repository_id: [...repositoryIds],
    },
  });
};

type FindByTokenReturnType = Omit<Integration, 'reports'>;

export const findByToken = async (
  token: string
): Promise<FindByTokenReturnType> => {
  return await db.integration.findOne({
    where: db.Sequelize.where(
      db.Sequelize.fn(
        'PGP_SYM_DECRYPT',
        db.Sequelize.cast(db.Sequelize.col('token'), 'bytea'),
        encryptOption
      ),
      token
    ),
  });
};
