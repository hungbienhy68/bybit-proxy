const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/api/bybit-price', async (req, res) => {
  try {
    const { fiat = 'VND', side = 'buy' } = req.query;
    const response = await axios.get(
      'https://api2.bybit.com/fiat/otc/item/online',
      {
        params: {
          userId: '',
          tokenId: 'USDT',
          currencyId: fiat,
          payment: '',
          side: side === 'buy' ? 1 : 0,
          size: 10,
          page: 1
        },
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    const data = response.data.result.items;
    if (data && data.length > 0) {
      res.json({ price: data[0].price });
    } else {
      res.status(404).json({ error: 'Không tìm thấy dữ liệu' });
    }
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

app.listen(port, () => {
  console.log(`Proxy đang chạy tại http://localhost:${port}`);
});
