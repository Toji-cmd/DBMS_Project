import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { openDB } from "idb";
import "./CheckoutPage.css";

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });

    const API_URL = process.env.REACT_APP_API_BACKEND;
    const navigate = useNavigate();

    const initDB = async () => {
        return openDB("EstoreDB", 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains("cart")) {
                    db.createObjectStore("cart", { keyPath: "product_id" });
                }
            },
        });
    };

    const fetchCartItems = async () => {
        const db = await initDB();
        const storedItems = await db.getAll("cart");

        const productDetails = await Promise.all(
            storedItems.map(async (item) => {
                try {
                    const response = await fetch(`${API_URL}products/${item.product_id}`);
                    if (!response.ok) throw new Error("Failed to fetch product");
                    const productData = await response.json();
                    return { ...item, ...productData }; // Merge stored data with fetched product details
                } catch (error) {
                    console.error("Error fetching product details:", error);
                    return null;
                }
            })
        );

        setCartItems(productDetails.filter((item) => item !== null));

        // Calculate Total Price
        const total = productDetails.reduce((sum, item) => {
            return sum + ((item.product_price || 0) * (item.quantity || 1));
        }, 0);

        setTotalPrice(total);
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const clearCart = async () => {
        const db = await initDB();
        const tx = db.transaction("cart", "readwrite");
        const store = tx.objectStore("cart");
        await store.clear();
        await tx.done;

        setCartItems([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, address, cardNumber, expiryDate, cvv } = formData;
        if (!name || !email || !address || !cardNumber || !expiryDate || !cvv) {
            alert("Please fill all required fields.");
            return;
        }

        alert("Order placed successfully!");

        // Clear Cart
        const db = await initDB();
        const tx = db.transaction("cart", "readwrite");
        await tx.objectStore("cart").clear();
        await tx.done;

        setCartItems([]);
        setTotalPrice(0);

        navigate("/thank-you");
    };

    return (
        <div>
            <div className="homepage__header">
                <h2>Checkout</h2>
            </div>
            <div className="checkout-container">
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <ul>
                            {cartItems.map((item) => (
                                <li key={item.product_id} className="order-item">
                                    <img
                                        src={item.product_image_url || "https://via.placeholder.com/60"}
                                        alt={item.product_name}
                                        className="order-item-image"
                                    />
                                    <div className="order-item-details">
                                        <h3>{item.product_name}</h3>
                                        <p>
                                            ₹{(item.product_price || 0).toFixed(2)} x {item.quantity || 1}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    <h3>Total: ₹{(totalPrice || 0).toFixed(2)}</h3>
                </div>

                <div className="checkout-form">
                    <h3>Billing & Shipping Details</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Shipping Address</label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <h3>Payment Information</h3>

                        <div className="form-group">
                            <label htmlFor="cardNumber">Card Number</label>
                            <input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="expiryDate">Expiry Date</label>
                            <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cvv">CVV</label>
                            <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <button type="submit" className="checkout-btn">
                            Place Order
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
