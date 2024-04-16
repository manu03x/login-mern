const Product = require('../model/Product');

const addProduct = async (req, res, next) => {
    const { name, price, stock } = req.body;

    const product = new Product({
        name,
        price,
        stock
    });

    try {
        await product.save();
        return res.status(201).json({ message: "Product added successfully", product });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const deleteProduct = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product deleted successfully", product });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateProduct = async (req, res, next) => {
    const productId = req.params.productId;
    const { name, price, stock } = req.body;

    try {
        const product = await Product.findByIdAndUpdate(productId, { name, price, stock }, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product updated successfully", product });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ products });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    addProduct,
    deleteProduct,
    updateProduct,
    getProducts
};
