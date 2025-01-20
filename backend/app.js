const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware
const admin = require('firebase-admin');
require('dotenv').config();


const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dbms-class-project-default-rtdb.firebaseio.com",
});

const db = admin.database();

const app = express();

app.use(cors()); 
app.use(bodyParser.json({ limit: '50mb' }));

// POST endpoint to add a new product
app.post('/products', async (req, res) => {
    try {
        const product = req.body;
        const ref = db.ref('products');
        const newProductRef = ref.push();
        await newProductRef.set(product);
        res.status(201).json({ message: 'Product added successfully', id: newProductRef.key });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET endpoint to filter products with pagination
app.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 80; 
        const page = parseInt(req.query.page) || 1; 
        const startAt = (page - 1) * limit;

        // Get filter criteria from query parameters
        const name = req.query.name ? req.query.name.toLowerCase() : null;
        const brand = req.query.brand ? req.query.brand.toLowerCase() : null;
        const minRating = req.query.minRating ? parseFloat(req.query.minRating) : null;
        const maxRating = req.query.maxRating ? parseFloat(req.query.maxRating) : null;
        const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
        const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
        const category = req.query.category ? req.query.category.toLowerCase() : null;

        const ref = db.ref('products');
        
        // Fetch all products from Firebase
        ref.once('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Filter products based on query parameters
                const filteredProducts = Object.values(data).filter(product => {
                    let isValid = true;

                    if (name && !product.name.toLowerCase().includes(name)) {
                        isValid = false;
                    }
                    if (brand && !product.product_brand.toLowerCase().includes(brand)) {
                        isValid = false;
                    }
                    if (minRating && product.product_rating < minRating) {
                        isValid = false;
                    }
                    if (maxRating && product.product_rating > maxRating) {
                        isValid = false;
                    }
                    if (minPrice && product.product_price < minPrice) {
                        isValid = false;
                    }
                    if (maxPrice && product.product_price > maxPrice) {
                        isValid = false;
                    }
                    if (category && !product.product_category.toLowerCase().includes(category)) {
                        isValid = false;
                    }

                    return isValid;
                });

                // Apply pagination after filtering
                const paginatedProducts = filteredProducts.slice(startAt, startAt + limit);

                if (paginatedProducts.length > 0) {
                    res.status(200).json(paginatedProducts);
                } else {
                    res.status(404).json({ message: 'No products found matching the criteria' });
                }
            } else {
                res.status(404).json({ message: 'No products found' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET endpoint for retrieving a single product by ID
app.get('/products/:product_id', async (req, res) => {
    try {
        const productId = parseInt(req.params.product_id, 10);
        const ref = db.ref('products');

        ref.orderByChild('product_id').equalTo(productId).once('value', (snapshot) => {
            const products = snapshot.val();
            if (products) {
                const productKey = Object.keys(products)[0];
                const product = products[productKey];
                res.status(200).json(product);
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT endpoint for updating a product by ID
app.put('/products/:product_id', async (req, res) => {
    try {
        const productId = parseInt(req.params.product_id, 10);
        const updates = req.body;
        const ref = db.ref('products');

        ref.orderByChild('product_id').equalTo(productId).once('value', async (snapshot) => {
            const products = snapshot.val();
            if (!products) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const productKey = Object.keys(products)[0];
            const productRef = db.ref(`products/${productKey}`);
            await productRef.update(updates);
            res.status(200).json({ message: 'Product updated successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE endpoint for removing a product by ID
app.delete('/products/:product_id', async (req, res) => {
    try {
        const productId = parseInt(req.params.product_id, 10);
        const ref = db.ref('products');

        ref.orderByChild('product_id').equalTo(productId).once('value', async (snapshot) => {
            const products = snapshot.val();
            if (!products) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const productKey = Object.keys(products)[0];
            const productRef = db.ref(`products/${productKey}`);
            await productRef.remove();
            res.status(200).json({ message: 'Product deleted successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Seach product
app.get('/search', async (req, res) => {
    try{
        const query = req.query.q;
        const ref = db.ref('products');

        ref.once('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const filteredProducts = Object.values(data).filter(product => {
                    return product.product_name.toLowerCase().includes(query.toLowerCase()) ||
                        product.product_brand.toLowerCase().includes(query.toLowerCase());
                });

                res.status(200).json(filteredProducts);
            } else {
                res.status(404).json({ message: 'No products found' });
            }
        });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
});

// Bulk insert products
const CHUNK_SIZE = 500;
app.post('/products/bulk', async (req, res) => {
    try {
        const products = req.body;
        const ref = db.ref('products');

        for (let i = 0; i < products.length; i += CHUNK_SIZE) {
            const chunk = products.slice(i, i + CHUNK_SIZE);

            const updates = {};
            chunk.forEach(product => {
                const newProductRef = ref.push();
                updates[`/${newProductRef.key}`] = product;
            });

            await ref.update(updates);
        }

        res.status(201).json({ message: 'Multiple products added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
