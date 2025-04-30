"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
dotenv_1.default.config({ path: '.env.development' }); // or just dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
const API_USER = process.env.API_USER;
const API_PASS = process.env.API_PASS;
const BASE_URL = process.env.BASE_URL;
// 快取 token
let cachedToken = null;
let tokenExpiresAt = 0;
async function fetchAuthToken() {
    console.log('🔍 Requesting:', `${BASE_URL}/System_Login`, {
        sUserName: API_USER,
        sPassword: API_PASS,
    });
    const resp = await axios_1.default.get(`${BASE_URL}/System_Login`, {
        params: { sUserName: API_USER, sPassword: API_PASS },
        responseType: 'text',
    });
    console.log('📥 RAW XML:', resp.data);
    // 解析 XML，explicitArray: false 讓單一 tag 不包陣列
    const result = await (0, xml2js_1.parseStringPromise)(resp.data, {
        explicitArray: false,
    });
    // 拿到 result.string._
    const token = result.string._.trim();
    console.log('🔑 Parsed token:', token);
    return token;
}
async function getAuthToken() {
    const now = Date.now();
    if (!cachedToken || now >= tokenExpiresAt) {
        const token = await fetchAuthToken();
        cachedToken = token;
        tokenExpiresAt = now + 1000 * 60 * 60;
    }
    return cachedToken;
}
app.get('/login', async (_req, res) => {
    try {
        const token = await getAuthToken();
        res.json({ success: true, token });
    }
    catch (err) {
        console.error('❌ Error in /login:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map