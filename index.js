const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/api/bybit-price', async (req, res) => {
  try {
    const { fiat = 'VND', side = 'buy' } = req.query;
    const sideCode = side === 'buy' ? "1" : "2";

    const response = await axios.post(
      'https://api2.bybit.com/fiat/otc/item/online',
      {
        userId: "",
        tokenId: "USDT",
        currencyId: fiat,
        payment: [],
        side: sideCode,
        size: "",
        page: 1,
        rows: 1,
        amount: ""
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    const result = response.data?.result;
    const items = result?.items;

    if (items && items.length > 0) {
      res.json({ price: items[0].price });
    } else {
      console.warn('Không tìm thấy dữ liệu từ Bybit:', response.data);
      res.status(404).json({ error: 'Không tìm thấy dữ liệu từ Bybit' });
    }
  } catch (error) {
    console.error('❌ Lỗi khi gọi API Bybit:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }

    res.status(500).json({
      error: 'Lỗi máy chủ',
      detail: error.response?.data || error.message
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Bybit proxy đang chạy tại http://localhost:${port}`);
});
