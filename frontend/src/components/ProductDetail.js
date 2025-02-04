import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";  
import RecommendedProducts from "./RecommendedProducts";  
import "./ProductDetail.css";

const ProductDetail = () => {
  const { productId } = useParams();  
  const [product, setProduct] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        console.log("API URL:", process.env.REACT_APP_API_BACKEND);
        const API_URL = process.env.REACT_APP_API_BACKEND;
        const response = await fetch(`${API_URL}products/${productId}`);
  
        if (!response.ok) {
          throw new Error('Product not found');
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
   

  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-header">
        <Link to="/" className="back-to-home">Back to Home</Link>
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
          
          <Link to={`/order/${product.product_id}`}>
            <button className="buy-now-btn">Buy Now</button>
          </Link>
        </div>
      </div>

      <RecommendedProducts category={product.product_category} />
    </div>
  );
};

export default ProductDetail;
