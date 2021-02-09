import {NextApiHandler} from 'next';
import { storeToken } from '../../lib/tokens';

const integrationApi: NextApiHandler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const body = JSON.parse(req.body);
      const repositoryId = Number(body.repositoryId);
      const result = await storeToken(repositoryId);
      res.status(200).json(result);
    } else {
      res.status(400).json({result: 'not found'});
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
};

export default integrationApi;
