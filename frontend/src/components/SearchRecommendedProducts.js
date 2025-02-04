import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SearchRecommendedProducts.css"; // Updated CSS for tile layout

const RecommendedProducts = () => {
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [noProductsMessage, setNoProductsMessage] = useState("");
    const [page, setPage] = useState(1);



    // Load more products when the "View More" button is clicked
    const handleViewMore = () => {
        setPage((prev) => prev + 1);  // Increment the page to load next batch
    };

    useEffect(() => {
        // Fetch products with 4+ rating and update the state
        const fetchRecommendedProducts = async () => {
            try {
                const url = `${process.env.REACT_APP_API_BACKEND}products?minRating=4&page=${page}&limit=8`;
                const response = await fetch(url);
                const data = await response.json();
                const productArray = Array.isArray(data) ? data : Object.values(data);

                if (productArray.length > 0) {
                    setRecommendedProducts((prev) => [...prev, ...productArray]);
                    setNoProductsMessage("");
                } else {
                    setNoProductsMessage("No recommended products available.");
                }
            } catch (error) {
                console.error("Error fetching recommended products:", error);
                setNoProductsMessage("Error fetching recommended products. Please try again later.");
            }
        };
        fetchRecommendedProducts();
    }, [page]);

    // Show the first 8 products, then more when the "View More" button is clicked
    useEffect(() => {
        setVisibleProducts(recommendedProducts.slice(0, page * 8));
    }, [recommendedProducts, page]);

    return (
        <div className="recommended-products-container">
            <h3>Recommended Products</h3>
            {visibleProducts.length > 0 ? (
                <>
                    <div className="product-grid">
                        {visibleProducts.map((product) => (
                            <Link to={`/product/${product.product_id}`} key={product.product_id} className="product-card">
                                <img
                                    src={product.product_image_url}
                                    alt={product.product_name}
                                    className="product-image"
                                />
                                <h4 className="product-name">{product.product_name}</h4>
                                <p className="product-price">₹{product.product_price}</p>
                            </Link>
                        ))}
                    </div>

                    <button onClick={handleViewMore} className="view-more-btn">
                        View More
                    </button>
                </>
            ) : (
                <p>{noProductsMessage}</p>
            )}
        </div>
    );
};

export default RecommendedProducts;
