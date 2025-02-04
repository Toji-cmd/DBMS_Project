import React, { useState, useEffect } from "react";
import { openDB } from "idb";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai"; // Import close icon
import "./CartPage.css";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const API_URL = process.env.REACT_APP_API_BACKEND;

    // Initialize IndexedDB
    const initDB = async () => {
        return openDB("EstoreDB", 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains("cart")) {
                    db.createObjectStore("cart", { keyPath: "product_id" });
                }
            },
        });
    };

    // Fetch Cart Items and Get Full Product Details
    const fetchCartItems = async () => {
        const db = await initDB();
        const storedItems = await db.getAll("cart");

        // Fetch full product details for each product_id
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

        // Filter out any null results (failed API calls)
        setCartItems(productDetails.filter((item) => item !== null));
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    // Remove a single item from cart
    const removeFromCart = async (id) => {
        const db = await initDB();
        const tx = db.transaction("cart", "readwrite");
        const store = tx.objectStore("cart");
        await store.delete(id);
        await tx.done;

        setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== id));
    };

    // Update quantity of an item in the cart
    const updateQuantity = async (id, quantity) => {
        const newQuantity = parseInt(quantity, 10); // Convert quantity to integer
        if (newQuantity < 1) return; // Prevent negative or zero quantity

        const db = await initDB();
        const tx = db.transaction("cart", "readwrite");
        const store = tx.objectStore("cart");

        const item = await store.get(id);
        if (item) {
            item.quantity = newQuantity;
            await store.put(item);
            await tx.done;

            setCartItems((prevItems) =>
                prevItems.map((i) => (i.product_id === id ? { ...i, quantity: newQuantity } : i))
            );
        }
    };

    // Clear entire cart
    const clearCart = async () => {
        const db = await initDB();
        const tx = db.transaction("cart", "readwrite");
        const store = tx.objectStore("cart");
        await store.clear();
        await tx.done;

        setCartItems([]);
    };

    return (
        <div className="cart-container">
            <h1>Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <p className="empty-cart">Your cart is empty.</p>
            ) : (
                <ul className="cart-list">
                    {cartItems.map((item) => (
                        <li key={item.product_id} className="cart-item">
                            <img
                                src={item.product_image_url}
                                alt={item.product_name}
                                className="cart-item-image"
                            />
                            <div className="cart-item-details">
                                <h3>{item.product_name}</h3>
                                <p>Price: ₹{item.product_price ? item.product_price.toFixed(2) : "N/A"}</p>
                                <div className="cart-item-quantity">
                                    <input
                                        type="number"
                                        value={item.quantity || 1}
                                        onChange={(e) =>
                                            updateQuantity(item.product_id, e.target.value)
                                        }
                                        min="1"
                                    />
                                    <button
                                        onClick={() => removeFromCart(item.product_id)}
                                        className="remove-btn"
                                    >
                                        <AiOutlineClose /> {/* Replace "x" with an icon */}
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {cartItems.length > 0 && (
                <div className="cart-actions">
                    <button className="clear-cart-btn" onClick={clearCart}>
                        Clear Cart
                    </button>
                    <Link to="/checkout">
                        <button className="checkout-btn">Proceed to Checkout</button>
                    </Link>
                </div>
            )}
        </div>
    );
}
