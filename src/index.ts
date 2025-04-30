import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

dotenv.config({ path: '.env.development' }); // or just dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_USER = process.env.API_USER!;
const API_PASS = process.env.API_PASS!;
const BASE_URL = process.env.BASE_URL!;

// 快取 token
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function fetchAuthToken(): Promise<string> {
  console.log('🔍 Requesting:', `${BASE_URL}/System_Login`, {
    sUserName: API_USER,
    sPassword: API_PASS,
  });
  const resp = await axios.get(`${BASE_URL}/System_Login`, {
    params: { sUserName: API_USER, sPassword: API_PASS },
    responseType: 'text',
  });

  console.log('📥 RAW XML:', resp.data);
  // 解析 XML，explicitArray: false 讓單一 tag 不包陣列
  const result = await parseStringPromise(resp.data as string, {
    explicitArray: false,
  });
  // 拿到 result.string._
  const token = result.string._.trim();
  console.log('🔑 Parsed token:', token);
  return token;
}

async function getAuthToken(): Promise<string> {
  const now = Date.now();
  if (!cachedToken || now >= tokenExpiresAt) {
    const token = await fetchAuthToken();
    cachedToken = token;
    tokenExpiresAt = now + 1000 * 60 * 60;
  }
  return cachedToken!;
}

// 根路由（Health Check）
app.get('/', (_req, res) => {
  res.send('API is up!');
});

app.get('/login', async (_req, res) => {
  try {
    const token = await getAuthToken();
    res.json({ success: true, token });
  } catch (err) {
    console.error('❌ Error in /login:', err);
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// 404 處理
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
