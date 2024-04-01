const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Update product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        const { __v, ...others } = updatedProduct._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Delete user
router.delete("/:id", verifyTokenAndAdmin, async (req,res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted.");
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get product
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const { __v, ...others } = product._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get all products
router.get("/", async (req, res) => {
    const newQuery = req.query.new;
    const categoryQuery = req.query.category;
    const saleQuery = req.query.sale;
    try {
        let products;

        if (newQuery) {
            products = await Product.find({
                categories: { 
                    $nin: ["sale"],
                },
            }).sort({ createdAt: -1 }).limit(5);
        } else if (categoryQuery) {
            products = await Product.find({ 
                categories: { 
                    $in: [categoryQuery],
                },
            });
        } else if (saleQuery) {
            products = await Product.find({ 
                categories: { 
                    $in: [saleQuery],
                },
            });
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;