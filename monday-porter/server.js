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
    res.status(200).json({message: 'Successfuly saved budgetChange'});
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

app.post('/api/spending', async (req, res) => {
  try {
    const storage = new SecureStorage();
    await storage.set('spending', JSON.stringify(req.body),{ shared: true });
    res.status(200).json({message: 'Successfuly saved spending changes'}); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save spending changes' });
  }
});

app.get('/api/spending', async (req, res) => {
  try {
    const storage = new SecureStorage();
    const value = await storage.get('spending');
    res.setHeader("Content-Type", "application/json");
    res.send(value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

app.post('/api/teamBudget', async (req, res) => {
  try {
    const storage = new SecureStorage();
    await storage.set('teamBudget', JSON.stringify(req.body),{ shared: true });
    res.status(200).json({message: 'Successfuly saved team budget changes'}); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save team budget changes' });
  }
});

app.get('/api/teamBudget', async (req, res) => {
  try {
    const storage = new SecureStorage();
    const value = await storage.get('teamBudget');
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
    //setup
    const secureStorage = new SecureStorage();
    const envManager = new EnvironmentVariablesManager();
    const apiToken = await secureStorage.get("API_TOKEN");
    //const apiToken = envManager.get("VITE_API_TOKEN");
    const client = new ApiClient({ token: apiToken });
    await secureStorage.set("lastID", "na");

    const lastID = await secureStorage.get("lastID");
    console.log("lastID = " + lastID);
    let result;
    let columns;//an array for the column names
    let orders;//an array of every item in the ordering queue
    if (lastID == null || lastID == "na") {
      //then we need to get all of the information becasue it hasn't been updated from default values yet
      let response = await client.request(`query { boards(ids: 9377407776) { name columns { title id } items_page( limit: 500 query_params: {order_by: [{column_id: "__creation_log__", direction: desc}]} ) { cursor items { id name column_values { text value __typename } } } } }`);
      columns = response.boards[0].columns;
      orders = response.boards[0].items_page.items;      
      //set lastID to be the first ID that we get from the response
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].title == "ID") {
          await secureStorage.set("lastID", orders[0].column_values[i-1]);
        }
      }
      
      let cursor = response.boards[0].items_page.cursor;
      while (cursor != null) {
        response = await client.request('query { next_items_page (cursor: "' + cursor + '" limit: 500) { cursor items { id name column_values { text value __typename } } } }')
        let nextOrders = response.next_items_page.items;
        orders.push(...nextOrders);
        cursor = response.next_items_page.cursor;
      }
      //append columns to orders
      let columnsJSON = JSON.stringify(columns);
      let ordersJSON = JSON.stringify(orders);
      result = '{ "columns": ' + columnsJSON + ', "orders": ' + ordersJSON + ', "fromBudget": true}';
    } else {
      let response = await client.request(`query { boards(ids: 9377407776) { name columns { title id } items_page( limit: 50 query_params: {order_by: [{column_id: "__creation_log__", direction: desc}]} ) { cursor items { id name column_values { text value __typename } } } } }`);
      columns = response.boards[0].columns;
      orders = response.boards[0].items_page.items;      
      let idIdx;
      //set lastID to be the first ID that we get from the response
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].title == "ID") {
          idIdx = i-1;
          await secureStorage.set("lastID", orders[0].column_values[i-1]);
        }
      }
      let idxChecked = -1;
      //check where the item is in the thing
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].column_values[idIdx].text == lastID) {
          idxChecked = i;
          break;
        }
      }
      let cursor = response.boards[0].items_page.cursor;
      while (idxChecked == -1 && cursor != null ) {
        response = await client.request('query { next_items_page (cursor: "' + cursor + '" limit: 500) { cursor items { id name column_values { text value __typename } } } }')
        let nextOrders = response.next_items_page.items;
        orders.push(...nextOrders);
        cursor = response.next_items_page.cursor;
        for (let i = 0; i < orders.length; i++) {
          if (orders[i].column_values[idIdx].text == lastID) {
            idxChecked = i;
            break;
          }
        }
      }
      let newOrders = orders.splice(0, idxChecked);
      let columnsJSON = JSON.stringify(columns);
      let ordersJSON = JSON.stringify(newOrders);
      result = '{ "columns": ' + columnsJSON + ', "orders": ' + ordersJSON + ', "fromBudget": false}';
    }
    res.setHeader("Content-Type", "application/json");
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

//routes for oauth flow
router.get("/authorization", (req, res) => {
  const envManager = new EnvironmentVariablesManager();
  return res.redirect('https://auth.monday.com/oauth2/authorize?' +
    querystring.stringify({
      client_id: envManager.get("CLIENT_ID"),
      state: ""
    })
  );
});

router.get("/oauth/callback", async (req, res) => {
  const { code, state } = req.query;
  const envManager = new EnvironmentVariablesManager();

  // Get access token
  const monday = mondaySdk();
  monday.setApiVersion("2023-10");
  const token = await monday.oauthToken(code, envManager.get("CLIENT_ID"), envManager.get("CLIENT_SECRET"));
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