import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './Order.css';

const Order = () => {
  const { productId } = useParams(); // Get the productId from URL params
  const [product, setProduct] = useState(null);  // State to store the product details
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // Fetch product details from API
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BACKEND}products/${productId}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);  // Set the fetched product data
        setLoading(false);  // Set loading to false after the data is fetched
      } catch (err) {
        setError(err.message);  // Handle error and set the error state
        setLoading(false);  // Set loading to false if error occurs
      }
    };

    fetchProductDetails();  // Fetch product details when the component mounts
  }, [productId]);  // Dependency array ensures this runs when productId changes

  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Validate form (basic validation)
  const validateForm = () => {
    const { name, email, address, cardNumber, expiryDate, cvv } = formData;
    if (name && email && address && cardNumber && expiryDate && cvv) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Proceed with checkout (you can add more logic here like submitting the order)
    alert("Order submitted successfully!");
  };

  // Loading, Error, or Product Not Found State
  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="order-page">
      <h2>Checkout</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="product-details">
          <img src={product.product_image_url} alt={product.product_name} />
          <div>
            <h4>{product.product_name}</h4>
            <p>Price: ₹{product.product_price.toFixed(2)}</p>
            <p>Quantity: 1</p>
          </div>
        </div>
        <p><strong>Total: ₹{product.product_price.toFixed(2)}</strong></p>
      </div>

      <div className="checkout-form">
        <h3>Shipping Information</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={validateForm}
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
              onBlur={validateForm}
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
              onBlur={validateForm}
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
              onBlur={validateForm}
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
              onBlur={validateForm}
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
              onBlur={validateForm}
              required
            />
          </div>

          <button type="submit" disabled={!isFormValid} className="checkout-btn">
            Proceed to Checkout
          </button>
        </form>
      </div>
    </div>
  );
};

export default Order;
