import fs from 'node:fs/promises'
import express from 'express'
import { Storage, SecureStorage } from '@mondaycom/apps-sdk';
import * as dotenv from 'dotenv';

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
// server.js
app.post('/api/vendors', async (req, res) => {
  try {
    /*
    const { userId, accountId, backToUrl } = jwt.verify(state, process.env.SIGNING_SECRET);
    const secureStorage = new SecureStorage();
    const token = await secureStorage.get(userId);*/
    const storage = new Storage(process.env.VITE_API_TOKEN);
    const { version, success, error } = await storage.set('vendors', JSON.stringify(req.body),{ shared: true });
    res.json({ success, version }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save vendor' });
  }
});

app.get('/api/vendors', async (req, res) => {
  try {
    const storage = new Storage(process.env.VITE_API_TOKEN);
    const { value, version, success } = await storage.get('vendors', { shared: true } );
    console.log(value);
    console.log(typeof value);
    res.setHeader("Content-Type", "application/json");
    res.send(value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

//routes for oauth flow
router.get("/authorization", (req, res) => {
  const { token } = req.query;

  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    state: token
  });
  console.log(process.env.CLIENT_ID);
  console.log(params);

  res.redirect(
    `https://auth.monday.com/oauth2/authorize?${params}`
  );
});

router.get("/oauth/callback", async (req, res) => {
  const { code, state } = req.query;
  const { userId, accountId, backToUrl } = jwt.verify(state, process.env.SIGNING_SECRET);

  // Get access token
  const token = await monday.oauthToken(code, process.env.CLIENT_ID, process.env.CLIENT_SECRET)
  
  // TODO - Store the token in a secure way in a way you'll can later on find it using the user ID. 
  const secureStorage = new SecureStorage();
  await secureStorage.set(userId, token);

  // Redirect back to monday
  return res.redirect(backToUrl);
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