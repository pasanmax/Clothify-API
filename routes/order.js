const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//CREATE

router.post("/", async (req, res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Update order
router.put("/:id", async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        const { __v, ...others } = updatedOrder._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Delete cart
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted.");
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get user order
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.find({ userId: req.params.userId });
        const { __v, ...others } = order._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        const { __v, ...others } = orders._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get monthly income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;