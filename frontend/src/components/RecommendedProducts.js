import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './RecommendedProducts.css';

const RecommendedProducts = ({ category }) => {
  const [recommended, setRecommended] = useState([]);
  const [visibleItems, setVisibleItems] = useState(6); // Show 6 products initially
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recommended products based on category
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_BACKEND;
        const response = await fetch(`${API_URL}products?category=${category}`);

        if (!response.ok) {
          throw new Error("Failed to fetch recommended products");
        }

        const data = await response.json();
        setRecommended(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchRecommendedProducts();
    }
  }, [category]);

  // Function to load more items
  const loadMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 6);
  };

  if (loading) return <p>Loading recommended products...</p>;
  if (error) return <p>Error: {error}</p>;
  if (recommended.length === 0) return <p>No recommended products found.</p>;

  return (
    <div className="recommended-products">
      <h3>Recommended Products</h3>
      <div className="recommended-grid">
        {recommended.slice(0, visibleItems).map((product) => (
          <Link to={`/product/${product.product_id}`} key={product.product_id}>
            <div className="recommended-product-card">
              <img src={product.product_image_url} alt={product.product_name} className="recommended-product-image" />
              <p className="recommended-product-name">{product.product_name}</p>
              <p className="recommended-product-price">₹{product.product_price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
      {visibleItems < recommended.length && (
        <button onClick={loadMore} className="load-more-btn">
          Load More
        </button>
      )}
    </div>
  );
};

export default RecommendedProducts;
