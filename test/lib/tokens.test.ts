import {findByToken, storeToken} from "../../lib/tokens";
import db from "../../models";

describe('tokens', () => {
  it('can be stored and search it', async () => {
    const {token} = await storeToken("gh/aha-oretama/testerve-ui");
    expect(token).not.toBeNull();

    const {repository_id} = await findByToken(token);
    expect(repository_id).toBe('gh/aha-oretama/testerve-ui');
  });
})

afterAll(async () => {
  await db.integration.destroy({
    truncate: true,
    cascade: true,
  });
  db.sequelize.close();
});
