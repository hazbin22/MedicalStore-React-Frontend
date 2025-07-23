import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams(); // Get the 'id' from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For potential back navigation or redirect

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/products/${id}/`);
        setProduct(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching product details:', err);
        if (err.response && err.response.status === 404) {
          setError('Product not found.');
        } else {
          setError('Failed to fetch product details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]); // Re-run effect if ID changes

  if (loading) {
    return <div className="loading-message">Loading product details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div className="no-product-message">No product found.</div>;
  }

  return (
    <div className="product-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">← Back to Products</button>
      <h2 className="product-detail-name">{product.name}</h2>
      <div className="product-detail-content">
        <div className="product-detail-image-wrapper">
          {product.image ? (
            <img src={product.image} alt={product.name} className="product-detail-image" />
          ) : (
            <div className="no-image-placeholder">No Image Available</div>
          )}
        </div>
        <div className="product-detail-info">
          <p className="product-detail-description"><strong>Description:</strong> {product.description}</p>
          <p className="product-detail-price"><strong>Price:</strong> ${product.price}</p>
          <p className="product-detail-stock"><strong>Stock:</strong> {product.stock > 0 ? product.stock : 'Out of Stock'}</p>
          {product.category && <p className="product-detail-category"><strong>Category:</strong> {product.category}</p>}
          {product.manufacturer && <p className="product-detail-manufacturer"><strong>Manufacturer:</strong> {product.manufacturer}</p>}
          <p className="product-detail-availability">
            <strong>Available:</strong> {product.available ? 'Yes' : 'No'}
          </p>
          {/* Add more details as needed */}
          <button className="add-to-cart-button" disabled={!product.available || product.stock <= 0}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;