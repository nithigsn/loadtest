import { useState } from 'react';
import axios from 'axios';
import './App.css'; // for external styling (optional)

function App() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [connections, setConnections] = useState(10);
  const [rate, setRate] = useState(50);
  const [duration, setDuration] = useState(10);
  const [results, setResults] = useState([]);

  const runTest = async () => {
    try {
      await axios.post('http://localhost:5000/run', {
        url, method, connections, rate, duration
      });
      setTimeout(fetchResults, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResults = async () => {
    const res = await axios.get('http://localhost:5000/results');
    setResults(res.data);
  };

  return (
    <div className="app-container">
      <h2>Benchmarking Suite</h2>
      <div className="form-group">
        <label>Target URL</label>
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" />
      </div>

      <div className="form-group">
        <label>HTTP Method</label>
        <select value={method} onChange={e => setMethod(e.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </div>

      <div className="form-group">
        <label>Connections</label>
        <input type="number" value={connections} onChange={e => setConnections(+e.target.value)} />
      </div>

      <div className="form-group">
        <label>Requests/Second</label>
        <input type="number" value={rate} onChange={e => setRate(+e.target.value)} />
      </div>

      <div className="form-group">
        <label>Duration (sec)</label>
        <input type="number" value={duration} onChange={e => setDuration(+e.target.value)} />
      </div>

      <button className="run-btn" onClick={runTest}>Run Benchmark</button>

      <h3>Results</h3>
      <pre className="results-output">{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}

export default App;
