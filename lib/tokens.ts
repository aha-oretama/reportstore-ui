import db from "../models";
import crypto from 'crypto';

const encryptOption = 'compress-algo=1, cipher-algo=aes256';

const getRandomKey = () => {
  return crypto.randomBytes(64);
}

export const storeToken = async (key: string) => {
  return await db.integration.create({
    key: key,
    token: db.Sequelize.fn('PGP_SYM_ENCRYPT', getRandomKey(), encryptOption)
  })
}

export const findByToken = async (token: string) => {
  return await db.integration.findOne({
    where: {
      token: token
    }
  })
}
