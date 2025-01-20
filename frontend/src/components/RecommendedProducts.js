import React, { useState } from "react";
import data from "../data.json";
import { Link } from "react-router-dom";
import './RecommendedProducts.css';

const RecommendedProducts = ({ category }) => {
  const recommended = data.filter((product) => product.product_category === category);

  const [visibleItems, setVisibleItems] = useState(6); // Show 6 products initially

  // Function to load more items
  const loadMore = () => {
    setVisibleItems(visibleItems + 6); // Load 6 more items
  };

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
