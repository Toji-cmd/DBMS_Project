import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { openDB } from "idb";  // Import IndexedDB wrapper
import RecommendedProducts from "./RecommendedProducts";
import "./ProductDetail.css";
import { FaShoppingCart } from "react-icons/fa";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(""); // Message for cart feedback

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_BACKEND;
        const response = await fetch(`${API_URL}products/${productId}`);

        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // IndexedDB Setup
  const initDB = async () => {
    return openDB("EstoreDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("cart")) {
          db.createObjectStore("cart", { keyPath: "product_id" });
        }
      },
    });
  };

  // Add Product to Cart
  const addToCart = async () => {
    const db = await initDB();
    const tx = db.transaction("cart", "readwrite");
    const store = tx.objectStore("cart");
    
    await store.put({ product_id: product.product_id });
    await tx.done;

    setCartMessage("Added to Cart!");
    setTimeout(() => setCartMessage(""), 2000); // Clear message after 2 sec
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-header">
        <Link to="/" className="back-to-home">Back to Home</Link>
        <Link to="/cart" className="forwart-to-cart"><FaShoppingCart size={20} /></Link>
      </div>

      <div className="product-detail-container">
        <div className="product-detail-image">
          <img src={product.product_image_url} alt={product.product_name} />
        </div>
        <div className="product-detail-info">
          <h2>{product.product_name}</h2>
          <p className="product-description">{product.product_description}</p>
          <p className="price">₹{product.product_price.toFixed(2)}</p>
          <p className="rating">Rating: {product.product_rating}⭐</p>
          <p className="brand">Brand: {product.product_brand}</p>
          <p className="weight">Weight: {product.product_weight}kg</p>
          
          {/* Add to Cart Button */}
          <button className="buy-now-btn" onClick={addToCart}>{cartMessage === ""? "Add to Cart":cartMessage}</button>
        </div>
      </div>

      <RecommendedProducts category={product.product_category} />
    </div>
  );
};

export default ProductDetail;
