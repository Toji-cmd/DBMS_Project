import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";

import HomePage from "./components/HomePage";

import ProductDetail from "./components/ProductDetail";
import SearchPage from "./components/Search";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import ThankYouPage from "./components/ThankYouPage";

const About = () => <h1>About Us</h1>;
const Contact = () => <h1>Contact Us</h1>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
