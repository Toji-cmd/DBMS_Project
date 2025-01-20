import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";

import HomePage from "./components/HomePage";

import ProductDetail from "./components/ProductDetail";
import Order from "./components/Order";
import SearchPage from "./components/Search";


const About = () => <h1>About Us</h1>;
const Contact = () => <h1>Contact Us</h1>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/order/:productId" element={<Order />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
