const express = require('express');
const router = express.Router();
const { Setting, Product, Guild } = require('../models');
const { cekLoginAPI } = require('../middlewares/auth');

// Endpoint Token Bot
router.get('/settings', cekLoginAPI, async (req, res) => {
    const token = await Setting.findByPk('main_bot_token');
    res.json({ bot_token: token ? token.value : '' });
});

router.post('/settings', cekLoginAPI, async (req, res) => {
    await Setting.upsert({ key: 'main_bot_token', value: req.body.bot_token });
    res.json({ success: true });
});

// Endpoint CRUD Produk
router.get('/products', cekLoginAPI, async (req, res) => {
    const products = await Product.findAll({ order: [['id', 'DESC']] });
    res.json(products);
});

router.post('/products', cekLoginAPI, async (req, res) => {
    const { guild_id, name, price, stock } = req.body;
    // Bikin record server kalau belum ada
    await Guild.findOrCreate({ where: { guild_id } });
    // Masukin barang baru
    const prod = await Product.create({ guild_id, name, price, stock });
    res.json({ success: true, id: prod.id });
});

router.delete('/products/:id', cekLoginAPI, async (req, res) => {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
});

module.exports = router;
