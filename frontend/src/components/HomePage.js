import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";
import { FaShoppingCart } from "react-icons/fa";

const HomePage = () => {
    const navigate = useNavigate();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchBrand, setSearchBrand] = useState("");
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const [selectedPriceRange, setSelectedPriceRange] = useState("");
    const [selectedRating, setSelectedRating] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const [appliedFilters, setAppliedFilters] = useState({
        searchQuery: "",
        searchBrand: "",
        selectedPriceRange: "",
        selectedRating: "",
        selectedCategory: ""
    });

    const [noProductsMessage, setNoProductsMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [isLoading, setIsLoading] = useState(false); // Track loading state

    const itemsPerPage = 8; // Change this if you want more/less items per page

    // Memoized list of unique categories
    const uniqueCategories = useMemo(() => {
        const categories = [];
        filteredProducts.forEach((product) => {
            if (!categories.includes(product.product_category)) {
                categories.push(product.product_category);
            }
        });
        return categories;
    }, [filteredProducts]);

    // Memoized list of unique brands
    const uniqueBrands = useMemo(() => {
        const brands = [];
        filteredProducts.forEach((product) => {
            if (!brands.includes(product.product_brand)) {
                brands.push(product.product_brand);
            }
        });
        return brands;
    }, [filteredProducts]);

    // Fetch products when page loads or when filters are applied
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true); // Start loading

                let url = `${process.env.REACT_APP_API_BACKEND}products?`;

                // Apply filters to the URL
                if (appliedFilters.searchQuery) url += `name=${appliedFilters.searchQuery}&`;
                if (appliedFilters.searchBrand) url += `brand=${appliedFilters.searchBrand}&`;

                if (appliedFilters.selectedPriceRange) {
                    const [min, max] = appliedFilters.selectedPriceRange.split("-");
                    if (min && max) {
                        url += `minPrice=${min}&maxPrice=${max}&`;
                    }
                }

                if (appliedFilters.selectedRating) url += `minRating=${appliedFilters.selectedRating}&`;
                if (appliedFilters.selectedCategory) url += `category=${appliedFilters.selectedCategory}&`;

                // Add pagination parameters
                url += `limit=${itemsPerPage}&page=${currentPage}`;

                console.log("Fetching products with URL:", url);

                const response = await fetch(url);
                const data = await response.json();

                const productArray = Array.isArray(data) ? data : Object.values(data);

                if (Array.isArray(productArray) && productArray.length > 0) {
                    // Append new products if the page is greater than 1
                    if (currentPage > 1) {
                        setFilteredProducts((prevProducts) => [...prevProducts, ...productArray]);
                    } else {
                        setFilteredProducts(productArray);
                    }
                    setNoProductsMessage("");
                } else {
                    setFilteredProducts([]);
                    setNoProductsMessage("No products found matching the criteria");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setFilteredProducts([]);
                setNoProductsMessage("Error fetching products. Please try again later.");
            } finally {
                setIsLoading(false); // End loading
            }
        };

        fetchProducts();
    }, [appliedFilters, currentPage]); // Refetch when filters or current page change

    const handleSearchBrand = (e) => {
        const value = e.target.value;
        setSearchBrand(value);
        setFilteredBrands(uniqueBrands.filter((brand) => brand.toLowerCase().includes(value.toLowerCase())));
        setShowDropdown(true);
    };

    const handleApplyFilters = () => {
        setAppliedFilters({
            searchBrand,
            selectedPriceRange,
            selectedRating,
            selectedCategory
        });
        setCurrentPage(1); // Reset to first page when filters are applied
    };

    const handleLoadMore = () => {
        setCurrentPage((prevPage) => prevPage + 1); // Increment page number to load more products
    };

    return (
        <div className="homepage">
            {/* <section className="homepage__banner">
                <div className="homepage__banner-content">
                    <h2 className="homepage__banner-title">Exclusive Deals This Week!</h2>
                    <p className="homepage__banner-text">Shop the latest deals in electronics and more, only this week!</p>
                    <button className="homepage__shop-now-btn">Shop Now</button>
                </div>
            </section> */}

            <header className="homepage__header">
                <div className="homepage__logo">E-Shop</div>
                <div className="homepage__search_bar" onClick={() => navigate("/search")}>
                    Search
                </div>
                <div className="homepage__cart-icon" onClick={() => navigate("/cart")}>
                    <FaShoppingCart />
                </div>
            </header>

            <div className="homepage__main-content">
                <div className="homepage__sidebar">
                    <h3 className="homepage__sidebar-title">Filters</h3>

                    <div className="homepage__filter-section">
                        <h4 className="homepage__filter-title">Brand</h4>
                        <input
                            type="text"
                            value={searchBrand}
                            onChange={handleSearchBrand}
                            placeholder="Search brand"
                            className="homepage__search-brand"
                        />
                        {showDropdown && (
                            <div className="homepage__dropdown">
                                {filteredBrands.map((brand, index) => (
                                    <div
                                        key={index}
                                        className="homepage__dropdown-item"
                                        onClick={() => setSearchBrand(brand)}
                                    >
                                        {brand}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="homepage__filter-section">
                        <h4 className="homepage__filter-title">Price Range</h4>
                        <select onChange={(e) => setSelectedPriceRange(e.target.value)} className="homepage__select">
                            <option value="">Select Price Range</option>
                            <option value="0-1000">₹0 - ₹1000</option>
                            <option value="1001-5000">₹1001 - ₹5000</option>
                            <option value="5001-10000">₹5001 - ₹10000</option>
                            <option value="10001-20000">₹10001 - ₹20000</option>
                        </select>
                    </div>

                    <div className="homepage__filter-section">
                        <h4 className="homepage__filter-title">Rating</h4>
                        <select onChange={(e) => setSelectedRating(e.target.value)} className="homepage__select">
                            <option value="">Select Rating</option>
                            <option value="4">4 stars & above</option>
                            <option value="3">3 stars & above</option>
                            <option value="2">2 stars & above</option>
                        </select>
                    </div>

                    <div className="homepage__filter-section">
                        <h4 className="homepage__filter-title">Category</h4>
                        <select onChange={(e) => setSelectedCategory(e.target.value)} className="homepage__select">
                            <option value="">Select Category</option>
                            {uniqueCategories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button onClick={handleApplyFilters} className="homepage__apply-filters-btn">
                        Apply Filters
                    </button>
                </div>

                <div className="homepage__product-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            product.product_price && !isNaN(product.product_price) && product.product_price > 0 ? (
                                <Link to={`/product/${product.product_id}`} key={product.product_id} className="homepage__product-link">
                                    <div className="homepage__product-card">
                                        <img src={product.product_image_url} alt={product.product_name} className="homepage__product-image" />
                                        <h3 className="homepage__product-name">{product.product_name}</h3>
                                        <p className="homepage__product-price">
                                            ₹{product.product_price.toFixed(2)}
                                        </p>
                                        <p className="homepage__product-rating">Rating: {product.product_rating}⭐</p>
                                    </div>
                                </Link>
                            ) : (
                                <div>No Products</div>
                            )
                        ))
                    ) : (
                        <p>{noProductsMessage}</p>
                    )}
                </div>
            </div>

            {/* Load More Button */}
            <div className="homepage__load-more-container">
                <button
                    onClick={handleLoadMore}
                    className="homepage__load-more-btn"
                    disabled={isLoading} // Disable button while loading
                >
                    {isLoading ? "Loading..." : "Load More"}
                </button>
            </div>

            <footer className="homepage__footer">
                <div className="homepage__footer-text">
                    &copy; 2025 EDB-Shop. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
