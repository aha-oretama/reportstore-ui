import { findByToken, storeToken } from '../../lib/tokens';
import db from '../../models';
import crypto from 'crypto';

const token = '1234567890abcdefghij1234567890abcdefghij1234567890abcdefghij';
crypto.randomBytes = jest.fn().mockReturnValue(token);

describe('tokens', () => {
  it('can be stored and search it', async () => {
    await storeToken(123);

    const { repository_id } = await findByToken(token);
    expect(repository_id).toBe(123);
  });
});

afterAll(async () => {
  await db.integration.destroy({
    truncate: true,
    cascade: true,
  });
  db.sequelize.close();
});
