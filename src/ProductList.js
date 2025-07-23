import React, { useState, useEffect } from 'react';
import axios from 'axios'; // We'll install axios shortly
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage errors

  useEffect(() => {
    // This function runs once after the component mounts
    const fetchProducts = async () => {
      try {
        // Make GET request to your Django API
        const response = await axios.get('http://127.0.0.1:8000/products/list/');
        setProducts(response.data); // Update state with fetched data
        setLoading(false); // Set loading to false
      } catch (err) {
        setError('Failed to fetch products. Please try again later.'); // Set error message
        setLoading(false); // Set loading to false
        console.error('Error fetching products:', err); // Log the actual error
      }
    };

    fetchProducts(); // Call the fetch function
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="product-list">
      <h2>Our Products</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
               <Link to={`/products/${product.id}`} className="product-card-link"> {/* <--- ADD THIS LINK WRAPPER */}
              {product.image ? (
                <img src={product.image} alt={product.name} className="product-image" />
              ) : (
                <div className="no-image-placeholder-small">No Image</div>
              )}
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <p className="product-company">Company: {product.company || 'N/A'}</p> {/* Display manufacturer if available */}
              <p className="product-availability">Available: {product.available ? 'Yes' : 'No'}</p>
            </Link> 
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;