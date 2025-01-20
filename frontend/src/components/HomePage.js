import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";
import { FaSearch } from "react-icons/fa";


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


    const uniqueCategories = useMemo(() => {
        const categories = [];
        filteredProducts.forEach((product) => {
            if (!categories.includes(product.product_category)) {
                categories.push(product.product_category);
            }
        });
        return categories;
    }, [filteredProducts]);

    const uniqueBrands = useMemo(() => {
        const brands = [];
        filteredProducts.forEach((product) => {
            if (!brands.includes(product.product_brand)) {
                brands.push(product.product_brand);
            }
        });
        return brands;
    }, [filteredProducts]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = "http://localhost:3300/products?";


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

                url += "limit=80&page=1";

                console.log("Fetching products with URL:", url);

                const response = await fetch(url);
                const data = await response.json();

                console.log("API Response:", data);


                const productArray = Array.isArray(data) ? data : Object.values(data);


                if (Array.isArray(productArray) && productArray.length > 0) {
                    setFilteredProducts(productArray);
                    setNoProductsMessage("");
                } else {
                    setFilteredProducts([]);
                    setNoProductsMessage("No products found matching the criteria");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setFilteredProducts([]);
                setNoProductsMessage("Error fetching products. Please try again later.");
            }
        };


        fetchProducts();
    }, [appliedFilters]);


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
    };

    return (
        <div className="homepage-container">

            <section className="banner-section">
                <div className="banner-content">
                    <h2>Exclusive Deals This Week!</h2>
                    <p>Shop the latest deals in electronics and more, only this week!</p>
                    <button className="shop-now-btn">Shop Now</button>
                </div>
            </section>


            <header className="header">
                <div className="logo">E-Shop</div>
                <div onClick={()=>navigate("/search")}>
                    <FaSearch />
                </div>
            </header>

            <div className="main-content">

                <div className="sidebar">
                    <h3>Filters</h3>


                    <div className="filter-section">
                        <h4>Brand</h4>
                        <input
                            type="text"
                            value={searchBrand}
                            onChange={handleSearchBrand}
                            placeholder="Search brand"
                            className="search-brand"
                        />
                        {showDropdown && (
                            <div className="dropdown">
                                {filteredBrands.map((brand, index) => (
                                    <div
                                        key={index}
                                        className="dropdown-item"
                                        onClick={() => setSearchBrand(brand)}
                                    >
                                        {brand}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    <div className="filter-section">
                        <h4>Price Range</h4>
                        <select onChange={(e) => setSelectedPriceRange(e.target.value)}>
                            <option value="">Select Price Range</option>
                            <option value="0-1000">₹0 - ₹1000</option>
                            <option value="1001-5000">₹1001 - ₹5000</option>
                            <option value="5001-10000">₹5001 - ₹10000</option>
                            <option value="10001-20000">₹10001 - ₹20000</option>
                        </select>
                    </div>


                    <div className="filter-section">
                        <h4>Rating</h4>
                        <select onChange={(e) => setSelectedRating(e.target.value)}>
                            <option value="">Select Rating</option>
                            <option value="4">4 stars & above</option>
                            <option value="3">3 stars & above</option>
                            <option value="2">2 stars & above</option>
                        </select>
                    </div>


                    <div className="filter-section">
                        <h4>Category</h4>
                        <select onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="">Select Category</option>
                            {uniqueCategories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>


                    <button onClick={handleApplyFilters} className="apply-filters-btn">
                        Apply Filters
                    </button>
                </div>



                <div className="product-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (

                            product.product_price && !isNaN(product.product_price) && product.product_price > 0 ? (
                                <Link to={`/product/${product.product_id}`} key={product.product_id}>
                                    <div className="product-card">
                                        <img src={product.product_image_url} alt={product.product_name} />
                                        <h3>{product.product_name}</h3>
                                        <p className="price">
                                            ₹{product.product_price.toFixed(2)}
                                        </p>
                                        <p className="rating">Rating: {product.product_rating}⭐</p>
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


            <div className="footer-app" style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                padding: '10px',
                fontSize: '14px',
            }}>
                &copy; 2025 EDB-Shop. All rights reserved.
            </div>
        </div>
    );
};

export default HomePage;
