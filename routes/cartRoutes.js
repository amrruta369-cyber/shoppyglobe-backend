const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/// ADD to cart
router.post("/", auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.json({ msg: "Product not found" });

        const cartItem = new Cart({
            userId: req.user.id,
            productId,
            quantity
        });

        await cartItem.save();
        res.json({ msg: "Added to cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/// UPDATE cart
router.put("/:id", auth, async (req, res) => {
    try {
        const { quantity } = req.body;

        await Cart.findByIdAndUpdate(req.params.id, { quantity });
        res.json({ msg: "Cart updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/// DELETE cart
router.delete("/:id", auth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.json({ msg: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
