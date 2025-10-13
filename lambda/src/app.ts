import express from 'express';
import path from 'path';
import fs from 'fs';
import {verifyHash} from './utils/verifyHash'
import { parseOrderId } from './utils/parseOrderId';
import {OrderApi} from '@kibocommerce/rest-sdk/clients/Commerce'
import { Configuration } from '@kibocommerce/rest-sdk';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/assets', express.static(path.join(__dirname, 'frontend-dist', 'assets')));

  app.get('/api/hello', (_req, res) => {
    res.json({ message: 'Hello from Express API!' });
  });

  app.post('/home', async (req, res) => {
    const body = req.body;
    const query = req.query
    const rawContent = decodeURIComponent(new URLSearchParams(body).toString())
    const {dt = "", messageHash = ""} = query

    const isValidHash = verifyHash(messageHash as string, dt as string, rawContent)

    if(isValidHash){
      const indexPath = path.join(__dirname, 'frontend-dist', 'index.html');

      if (!fs.existsSync(indexPath)) {
        return res.status(500).send('Error');
      }

      let html = fs.readFileSync(indexPath, 'utf8');

      const orderApi = new OrderApi(Configuration.fromEnv())
      const orderId = parseOrderId(body['x-vol-return-url'])

      const orderData = await orderApi.getOrder({orderId})

      const injectedScript = `<script>window.__ORDER_DATA__ = ${JSON.stringify(orderData)};</script>`;

      html = html.replace('</head>', `${injectedScript}</head>`);

      res.send(html);

    } else {
      res.status(403).send('Not Authorized')
    }
  });

  app.all('*', (_req, res) => {
    res.status(404).send('Not Found');
  });

  return app;
}