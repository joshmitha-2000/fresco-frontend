// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function BuyNowPage() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const product = location.state?.product;

//   const [quantity, setQuantity] = useState(1);
//   const [paymentMethod, setPaymentMethod] = useState("");

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 text-lg font-semibold">
//         No product selected for purchase.
//       </div>
//     );
//   }

//   const handleQuantityChange = (e) => {
//     const val = Number(e.target.value);
//     if (val >= 1) {
//       setQuantity(val);
//     }
//   };

//   const handleConfirmPurchase = async () => {
//     if (!paymentMethod) {
//       toast.error("❌ Please select a payment method", {
//         position: "top-center",
//         autoClose: 3000,
//       });
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         toast.error("❌ You must be logged in to place an order", {
//           position: "top-center",
//           autoClose: 3000,
//         });
//         return;
//       }

//       const response = await fetch("https://frescobackend.onrender.com/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           productId: product.id,
//           quantity: quantity,
//           amount: product.price * quantity,
//           orderDate: new Date().toISOString(),
//           paymentMethod: paymentMethod,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to place order");
//       }

//       toast.success("🎉 Your order has been confirmed!", {
//         position: "top-center",
//         autoClose: 3000,
//       });

//       setTimeout(() => {
//         navigate("/");
//       }, 3500);
//     } catch (error) {
//       toast.error("❌ Could not confirm your order. Please try again.", {
//         position: "top-center",
//         autoClose: 3000,
//       });
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center p-4">
//         <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full flex flex-col md:flex-row p-6 md:p-10 gap-8">
//           {/* Left side: Image */}
//           <div className="flex-1 flex justify-center items-center">
//             <img
//               src={product.image}
//               alt={product.name}
//               className="rounded-lg max-w-full max-h-80 object-cover"
//             />
//           </div>

//           {/* Right side: Info + Quantity + Payment + Button */}
//           <div className="flex-1 flex flex-col justify-between">
//             <div>
//               <h1 className="text-3xl font-semibold text-[#4b3b2b] mb-2">{product.name}</h1>
//               {/* Description */}
//               <p className="text-gray-700 mb-6 leading-relaxed">{product.description || "No description available."}</p>

//               <p className="text-xl font-bold text-blue-600 mb-2">
//                 Price per item: ₹{product.price.toFixed(2)}
//               </p>

//               {/* Quantity */}
//               <div className="mb-4 flex items-center gap-4">
//                 <label
//                   htmlFor="quantity"
//                   className="text-[#4b3b2b] font-semibold text-lg"
//                 >
//                   Quantity:
//                 </label>
//                 <input
//                   id="quantity"
//                   type="number"
//                   min={1}
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   className="border border-gray-300 rounded-md px-3 py-1 w-20 text-lg"
//                 />
//               </div>

//               <p className="text-2xl font-bold text-blue-800 mb-8">
//                 Total: ₹{(product.price * quantity).toFixed(2)}
//               </p>

//               {/* Payment options */}
//               <div className="mb-8 flex gap-8 flex-wrap">
//                 <label
//                   className={`flex items-center cursor-pointer text-lg font-semibold ${
//                     paymentMethod === "Cash on Delivery"
//                       ? "text-[#6b4b27]"
//                       : "text-[#4b3b2b]"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="payment"
//                     value="Cash on Delivery"
//                     checked={paymentMethod === "Cash on Delivery"}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                     className="mr-2 cursor-pointer"
//                   />
//                   Cash on Delivery
//                 </label>

//                 <label
//                   className={`flex items-center cursor-pointer text-lg font-semibold ${
//                     paymentMethod === "Pay Online"
//                       ? "text-[#6b4b27]"
//                       : "text-[#4b3b2b]"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="payment"
//                     value="Pay Online"
//                     checked={paymentMethod === "Pay Online"}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                     className="mr-2 cursor-pointer"
//                   />
//                   Pay Online
//                 </label>
//               </div>
//             </div>

//             {/* Confirm button */}
//             <button
//               onClick={handleConfirmPurchase}
//               disabled={!paymentMethod}
//               className={`w-full py-3 rounded-md text-white font-bold text-xl transition ${
//                 paymentMethod
//                   ? "bg-[#8B4513] hover:bg-[#5c2e00] shadow-lg"
//                   : "bg-[#c8a97e] cursor-not-allowed"
//               }`}
//             >
//               Confirm Purchase
//             </button>
//           </div>
//         </div>
//       </div>

//       <ToastContainer />
//     </>
//   );
// }
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BuyNowPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Product details passed via router state
  const product = location.state?.product;

  // States for quantity, payment method, and loading indicator
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 text-lg font-semibold">
        No product selected for purchase.
      </div>
    );
  }

  const handleQuantityChange = (e) => {
    const val = Number(e.target.value);
    if (val >= 1) {
      setQuantity(val);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!paymentMethod) {
      toast.error("❌ Please select a payment method", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("❌ You must be logged in to place an order", {
          position: "top-center",
          autoClose: 3000,
        });
        setIsLoading(false);
        return;
      }

      if (paymentMethod === "Pay Online") {
        // TODO: Implement online payment flow integration here
        toast.info("⚠️ Online payment integration coming soon!", {
          position: "top-center",
          autoClose: 3000,
        });
        setIsLoading(false);
        return;
      }

      // For "Cash on Delivery", create the order directly
      const response = await fetch("https://frescobackend.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          amount: product.price * quantity,
          orderDate: new Date().toISOString(),
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      toast.success("🎉 Your order has been confirmed!", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/");
      }, 3500);
    } catch (error) {
      toast.error("❌ Could not confirm your order. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full flex flex-col md:flex-row p-6 md:p-10 gap-8">
          {/* Left side: Product Image */}
          <div className="flex-1 flex justify-center items-center">
            <img
              src={product.image}
              alt={product.name}
              className="rounded-lg max-w-full max-h-80 object-cover"
            />
          </div>

          {/* Right side: Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#4b3b2b] mb-2">{product.name}</h1>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description || "No description available."}
              </p>

              <p className="text-xl font-bold text-blue-600 mb-2">
                Price per item: ₹{product.price.toFixed(2)}
              </p>

              {/* Quantity selector */}
              <div className="mb-4 flex items-center gap-4">
                <label htmlFor="quantity" className="text-[#4b3b2b] font-semibold text-lg">
                  Quantity:
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border border-gray-300 rounded-md px-3 py-1 w-20 text-lg"
                  aria-label="Select quantity"
                />
              </div>

              <p className="text-2xl font-bold text-blue-800 mb-8">
                Total: ₹{(product.price * quantity).toFixed(2)}
              </p>

              {/* Payment options */}
              <div className="mb-8 flex gap-8 flex-wrap">
                <label
                  className={`flex items-center cursor-pointer text-lg font-semibold ${
                    paymentMethod === "Cash on Delivery"
                      ? "text-[#6b4b27]"
                      : "text-[#4b3b2b]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2 cursor-pointer"
                    aria-checked={paymentMethod === "Cash on Delivery"}
                  />
                  Cash on Delivery
                </label>

                <label
                  className={`flex items-center cursor-pointer text-lg font-semibold ${
                    paymentMethod === "Pay Online"
                      ? "text-[#6b4b27]"
                      : "text-[#4b3b2b]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Pay Online"
                    checked={paymentMethod === "Pay Online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2 cursor-pointer"
                    aria-checked={paymentMethod === "Pay Online"}
                  />
                  Pay Online
                </label>
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleConfirmPurchase}
              disabled={!paymentMethod || isLoading}
              className={`w-full py-3 rounded-md text-white font-bold text-xl transition ${
                paymentMethod && !isLoading
                  ? "bg-[#8B4513] hover:bg-[#5c2e00] shadow-lg"
                  : "bg-[#c8a97e] cursor-not-allowed"
              }`}
              aria-disabled={!paymentMethod || isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Purchase"}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
