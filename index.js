const http = require('http');
const { authenticate } = require('./auth');

const PORT = process.env.PORT || 3000;

function readJson(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
if (req.url === '/about') {
res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
      res.end('About Page\n');
return;
  }

  if (req.url === '/health') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/login') {
    const { username, password } = await readJson(req);
    const ok = authenticate(username, password);
    res.statusCode = ok ? 200 : 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(ok ? { message: `Welcome, ${username}!` } : { error: 'Invalid credentials' }));
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Welcome to the RP Kigali DevOps web app!\n');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
