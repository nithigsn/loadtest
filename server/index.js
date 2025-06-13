const express = require('express');
const cors = require('cors');
const autocannon = require('autocannon');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const resultsDir = path.join(__dirname, 'results');
if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir);

app.post('/run', async (req, res) => {
  const { url, method, connections, rate, duration, headers, body } = req.body;

  const instance = autocannon({
    url,
    method,
    connections: Number(connections),
    pipelining: 1,
    duration: Number(duration),
    headers,
    requests: body ? [{ method, body: JSON.stringify(body) }] : [{ method }],
    rate: Number(rate)
  }, (err, result) => {
    if (err) return console.error('Benchmark error:', err);
    const filename = `result-${Date.now()}.json`;
    const filepath = path.join(resultsDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
  });

  res.json({ message: 'Benchmark started', id: instance.url });
});

app.get('/results', (req, res) => {
  const files = fs.readdirSync(resultsDir);
  const results = files.map(file => {
    const data = fs.readFileSync(path.join(resultsDir, file));
    return JSON.parse(data);
  });
  res.json(results);
});

app.listen(5000, () => console.log('Server running on port 5000'));
