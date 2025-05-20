import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import Tooltip from '../components/tooltp'; // ✅ Ensure filename is tooltp.jsx
import Skeleton from '../components/skeleton';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ShopPage({ searchQuery }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState(new Set());
  const [tooltipVisibleId, setTooltipVisibleId] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const itemsPerPage = 8;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    const fetchWishlist = async () => {
      try {
        const res = await axios.get('https://frescobackend.onrender.com/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const wishlistProductIds = res.data.map((item) => item.productId);
        setWishlist(new Set(wishlistProductIds));
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      }
    };
    fetchWishlist();
  }, [token]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await axios.get('https://frescobackend.onrender.com/products');
        if (!Array.isArray(res.data)) throw new Error('Products response is not an array');
        setProducts(res.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://frescobackend.onrender.com/api/categories');
        if (!Array.isArray(res.data)) throw new Error('Categories response is not an array');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, searchQuery]);

  const addToCart = async (product) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("User not logged in.");
  
    const cartItem = {
      productId: product.id,
      quantity: 1,
      productName: product.name,
      price: product.price,
    };
  
    try {
      setLoadingCart(true);
      await axios.post(`https://frescobackend.onrender.com/cart/${userId}`, cartItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const productInCart = cart.find((item) => item.productId === product.id);
      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.push(cartItem);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
  
      setTooltipVisibleId(product.id);
      
      // Show toast popup message
      toast.success('Added to Cart!');
  
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setLoadingCart(false);
    }
  };
  

  const toggleWishlist = async (productId) => {
    if (!token) {
      alert('Please log in to manage your wishlist.');
      return;
    }

    try {
      if (wishlist.has(productId)) {
        await axios.delete(`https://frescobackend.onrender.com/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist((prev) => {
          const updated = new Set(prev);
          updated.delete(productId);
          return updated;
        });
      } else {
        await axios.post(
          'https://frescobackend.onrender.com/wishlist',
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist((prev) => new Set(prev).add(productId));
      }
    } catch (err) {
      alert('Failed to update wishlist.');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category?.name === selectedCategory
      : true;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesPrice && matchesSearch;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="bg-[#fcf8f0] min-h-screen">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 p-6 bg-white shadow-md">
          <h3 className="text-xl font-bold mb-4 text-[#2f271d]">Categories</h3>

          <select
            className="block w-full mb-4 md:hidden border border-gray-300 rounded p-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <ul className="hidden md:block space-y-2">
            <li
              className={`cursor-pointer ${selectedCategory === '' ? 'font-bold text-[#6b0b05]' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </li>
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={`cursor-pointer ${selectedCategory === cat.name ? 'font-bold text-[#6b0b05]' : ''}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </li>
            ))}
          </ul>

          {/* Price Filter */}
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2 text-[#2f271d]">Filter by Price</h3>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={0}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                className="border p-1 w-20"
              />
              <span>-</span>
              <input
                type="number"
                min={0}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                className="border p-1 w-20"
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4 p-6">
          <h2 className="text-3xl font-bold text-[#2f271d] mb-6">Shop Our Collection</h2>

          {error && <p className="text-red-600 text-center mb-4">Error: {error}</p>}

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-lg text-[#2f271d]">No products found</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 z-10"
                      aria-label="Toggle wishlist"
                    >
                      <FaHeart
                        size={24}
                        color={wishlist.has(product.id) ? 'red' : 'gray'}
                        className="transition-colors duration-300"
                      />
                    </button>

                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    </Link>

                    <div className="p-4">
            <h3 className="text-lg font-semibold text-[#2f271d]">{product.name}</h3>
            <p className="text-[#6b0b05] font-bold">${product.price.toFixed(2)}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 bg-[#6b0b05] text-white px-4 py-2 rounded hover:bg-[#501103]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}

      {/* Add ToastContainer once in your app */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

          
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center space-x-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1
                          ? 'bg-[#6b0b05] text-white'
                          : 'bg-gray-200 text-[#2f271d]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                </div>
                
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
