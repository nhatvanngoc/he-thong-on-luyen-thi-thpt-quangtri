import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent shared database for all students & devices
const DATA_FILE = path.resolve(process.cwd(), 'leaderboard_data.json');
const DELETED_NAMES_FILE = path.resolve(process.cwd(), 'leaderboard_deleted_names.json');

export interface ServerLeaderboardEntry {
  name: string;
  score: number;
  level: number;
  updatedAt: string;
}

function loadLeaderboard(): ServerLeaderboardEntry[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading leaderboard file:', err);
  }
  return [];
}

function saveLeaderboard(records: ServerLeaderboardEntry[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing leaderboard file:', err);
  }
}

let inMemoryRecords: ServerLeaderboardEntry[] = loadLeaderboard();
function loadDeletedNames(): Set<string> {
  try {
    const parsed = JSON.parse(fs.readFileSync(DELETED_NAMES_FILE, 'utf8'));
    if (Array.isArray(parsed)) return new Set(parsed.filter((name): name is string => typeof name === 'string').map(normalizeName));
  } catch {}
  return new Set();
}
function saveDeletedNames(names: Set<string>) {
  try { fs.writeFileSync(DELETED_NAMES_FILE, JSON.stringify([...names], null, 2), 'utf8'); }
  catch (err) { console.error('Error writing leaderboard deletion markers:', err); }
}
function normalizeName(name: string) { return name.trim().normalize('NFC').toLocaleLowerCase('vi'); }
let deletedNames = loadDeletedNames();

// Connected clients for real-time live broadcasts
const sseClients = new Set<express.Response>();

function broadcastLeaderboard() {
  const payload = `data: ${JSON.stringify(inMemoryRecords)}\n\n`;
  const deletionPayload = `event: leaderboard-deleted\ndata: ${JSON.stringify([...deletedNames])}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
      client.write(deletionPayload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// REST API endpoint to retrieve all shared records
app.get('/api/leaderboard', (req, res) => {
  res.json(inMemoryRecords);
});

app.get('/api/leaderboard/deleted', (req, res) => {
  res.json([...deletedNames]);
});

// REST API endpoint to post or update a student's score
app.post('/api/leaderboard', (req, res) => {
  const { name, score, level } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const cleanName = name.trim();
  deletedNames.delete(normalizeName(cleanName));
  saveDeletedNames(deletedNames);
  const validScore = typeof score === 'number' ? score : 0;
  const validLevel = typeof level === 'number' ? level : 1;
  const now = new Date().toISOString();

  const existingIndex = inMemoryRecords.findIndex(
    (r) => r.name.toLowerCase() === cleanName.toLowerCase()
  );

  if (existingIndex >= 0) {
    inMemoryRecords[existingIndex] = {
      name: cleanName,
      score: Math.max(inMemoryRecords[existingIndex].score, validScore),
      level: Math.max(inMemoryRecords[existingIndex].level, validLevel),
      updatedAt: now,
    };
  } else {
    inMemoryRecords.push({
      name: cleanName,
      score: validScore,
      level: validLevel,
      updatedAt: now,
    });
  }

  // Sort descending by score
  inMemoryRecords.sort((a, b) => b.score - a.score);
  saveLeaderboard(inMemoryRecords);

  // Broadcast to all online users in real time!
  broadcastLeaderboard();

  res.json({ success: true, records: inMemoryRecords });
});

// Delete selected local ranking rows. This is intentionally guarded by the
// display-name gate requested for this small study app.
app.delete('/api/leaderboard', (req, res) => {
  const adminName = typeof req.body?.adminName === 'string' ? req.body.adminName.trim() : '';
  const names = Array.isArray(req.body?.names) ? req.body.names.filter((name: unknown): name is string => typeof name === 'string') : [];
  if (adminName.normalize('NFC').toLocaleLowerCase('vi') !== 'Văn Ngọc Nhật Anh'.normalize('NFC').toLocaleLowerCase('vi')) {
    return res.status(403).json({ error: 'Không có quyền quản trị bảng xếp hạng.' });
  }

  const selected = new Set<string>(names.map((name: string) => normalizeName(name)));
  selected.delete(normalizeName('Văn Ngọc Nhật Anh'));
  selected.forEach((name) => deletedNames.add(name));
  saveDeletedNames(deletedNames);
  const before = inMemoryRecords.length;
  inMemoryRecords = inMemoryRecords.filter((record) => !selected.has(record.name.trim().normalize('NFC').toLocaleLowerCase('vi')));
  saveLeaderboard(inMemoryRecords);
  broadcastLeaderboard();
  return res.json({ success: true, deletedCount: before - inMemoryRecords.length, records: inMemoryRecords });
});

// Server-Sent Events (SSE) for zero-latency live updates across all devices
app.get('/api/leaderboard/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send current leaderboard immediately upon connection
  res.write(`data: ${JSON.stringify(inMemoryRecords)}\n\n`);
  res.write(`event: leaderboard-deleted\ndata: ${JSON.stringify([...deletedNames])}\n\n`);

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
