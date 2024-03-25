const Cart = require("../models/Cart");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//CREATE

router.post("/", async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Update cart
router.put("/:id", async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        const { __v, ...others } = updatedCart._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Delete cart
router.delete("/:id", async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted.");
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get user cart
router.get("/find/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        const { __v, ...others } = cart._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get all
router.get("/", async (req, res) => {
    try {
        const carts = await Cart.find();
        const { __v, ...others } = carts._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;