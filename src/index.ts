import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_USER = process.env.API_USER!;
const API_PASS = process.env.API_PASS!;
const BASE_URL = process.env.BASE_URL!;

// 1. 取得 token
async function getAuthToken(): Promise<string> {
  const res = await axios.post(
    `${BASE_URL}/System_Login`,
    new URLSearchParams({
      sUserName: API_USER,
      sPassword: API_PASS,
    }).toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  // 真實的回傳請取 res.data 裡的 token 欄位
  return 'ztOWkYeu7p/SP3kOK+UGVg==';
}

// 2. 呼叫 Xact_CreateTO
async function callCreateTOApi(token: string): Promise<any> {
  const res = await axios.post(
    `${BASE_URL}/Xact_CreateTO`,
    { jTxn: '{"SN":0,"SC":"1","Items":[{"BC":"82064035","QU":3000}]}' },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

app.get('/test', async (_req, res) => {
  try {
    const token = await getAuthToken();
    const data = await callCreateTOApi(token);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: (e as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
