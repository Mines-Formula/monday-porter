import fs from 'node:fs/promises'
import express from 'express'
import { SecureStorage, EnvironmentVariablesManager, SecretsManager } from '@mondaycom/apps-sdk';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import querystring from 'querystring';
import mondaySdk from "monday-sdk-js";
import {
 ApiClient
} from "@mondaydotcomorg/api";

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

// Create http server
const app = express()
const router = express.Router();
app.use(express.json())
app.use(router);
dotenv.config();

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

//api to access storage
app.post('/api/vendors', async (req, res) => {
  try {
    const storage = new SecureStorage();
    await storage.set('vendors', JSON.stringify(req.body),{ shared: true });
    res.json({ success, version }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save vendor' });
  }
});

app.get('/api/vendors', async (req, res) => {
  try {
    const storage = new SecureStorage();
    const value = await storage.get('vendors');
    res.setHeader("Content-Type", "application/json");
    res.send(value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

app.post('/api/budgetChange', async (req, res) => {
  try {
    const storage = new SecureStorage();
    await storage.set('budgetChange', JSON.stringify(req.body),{ shared: true });
    res.json({ success, version }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save budgetChange' });
  }
});

app.get('/api/budgetChange', async (req, res) => {
  try {
    const storage = new SecureStorage();
    const value = await storage.get('budgetChange');
    res.setHeader("Content-Type", "application/json");
    res.send(value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

app.post('/api/subsystemBudgets', async (req, res) => {
  try {
    const storage = new SecureStorage();
    await storage.set('subsystemBudgets', JSON.stringify(req.body),{ shared: true });
    res.status(200).json({message: 'Successfuly saved subsystemBudgets'}); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save subsystemBudgets' });
  }
});

app.get('/api/subsystemBudgets', async (req, res) => {
  try {
    const storage = new SecureStorage();
    const value = await storage.get('subsystemBudgets');
    res.setHeader("Content-Type", "application/json");
    res.send(value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

app.post('/api/indexBalances', async (req, res) => {
  try {
    const storage = new SecureStorage();
    await storage.set('indexBalances', JSON.stringify(req.body),{ shared: true });
    res.status(200).json({message: 'Successfuly saved index balances'}); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save index balances' });
  }
});

app.get('/api/indexBalances', async (req, res) => {
  try {
    const storage = new SecureStorage();
    const value = await storage.get('indexBalances');
    res.setHeader("Content-Type", "application/json");
    res.send(value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

app.post('/api/revenueChanges', async (req, res) => {
  try {
    const storage = new SecureStorage();
    await storage.set('revenueChanges', JSON.stringify(req.body),{ shared: true });
    res.status(200).json({message: 'Successfuly saved revenue changes'}); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save revenue changes' });
  }
});

app.get('/api/revenueChanges', async (req, res) => {
  try {
    const storage = new SecureStorage();
    const value = await storage.get('revenueChanges');
    res.setHeader("Content-Type", "application/json");
    res.send(value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

//api to get information from the ordering queue
app.get('/api/orderingQueue', async (req, res) => {
  try {
    const secureStorage = new SecureStorage();
    const apiToken = await secureStorage.get("API_TOKEN");
    const client = new ApiClient({ token: apiToken });
    const response = await client.request(`query { boards(ids: 9377407776) { name columns { title id } items_page( limit: 500 query_params: {order_by: [{column_id: "__creation_log__", direction: desc}]} ) { cursor items { id name column_values { text value __typename } } } } }`);
    res.setHeader("Content-Type", "application/json");
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

//routes for oauth flow
router.get("/authorization", (req, res) => {
  const { token } = req.query;
  const envManager = new EnvironmentVariablesManager();
  return res.redirect('https://auth.monday.com/oauth2/authorize?' +
    querystring.stringify({
      client_id: envManager.get("CLIENT_ID"),
      state: token
    })
  );
});

router.get("/oauth/callback", async (req, res) => {
  const { code, state } = req.query;
  const envManager = new EnvironmentVariablesManager();

  // Get access token
  const monday = mondaySdk();
  monday.setApiVersion("2023-10");
  const token = await monday.oauthToken(code, envManager.get("CLIENT_ID"), envManager.get("CLIENT_SECRET"))
  //Store the token in a secure way
  const secureStorage = new SecureStorage();
  await secureStorage.set("API_TOKEN", token.access_token);

  // Redirect back to monday
  return res.send("You may return to the main page now and reload it.");
});

// Serve HTML
app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    /** @type {string} */
    let template
    /** @type {import('./src/entry-server.js').render} */
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})