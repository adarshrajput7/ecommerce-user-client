// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ArrowRight, LucideTruck, MapPin, Phone } from "lucide-react";
// import { setOrderRedux } from "@/redux/orderSlice";
// import { Button } from "../ui/button";
// import { useCart } from "./CartContext";

// const Order = () => {
//   const { cartItems } = useCart();
//   const { user } = useSelector((store) => store.auth);
//   const { orderGet, refreshTrigger } = useSelector((store) => store.orderStore);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isProcessing, setIsProcessing] = useState(false);

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       if (window.Razorpay) return resolve(true);
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePayment = async ({ orderId, user, onSuccess, onFailure }) => {
//     if (isProcessing) return;
//     setIsProcessing(true);

//     const isLoaded = await loadRazorpayScript();
//     if (!isLoaded) {
//       alert("Razorpay SDK load nahi ho paya!");
//       setIsProcessing(false);
//       return;
//     }

//     try {
//       const { data } = await axios.post(
//         `http://localhost:5000/api/payments/create/${orderId}`,
//         {},
//         { withCredentials: true }
//       );

//       if (!data?.success) {
//         alert("Payment order create fail ho gaya!");
//         setIsProcessing(false);
//         return;
//       }

//       const { order, razorpayKeyId } = data;

//       const options = {
//         key: razorpayKeyId,
//         amount: order.amount,
//         currency: order.currency,
//         name: "My Store",
//         description: `Payment for Order #${orderId}`,
//         order_id: order.id,

//         handler: async (response) => {
//           try {
//             const verifyRes = await axios.post(
//               "http://localhost:5000/api/payments/verify",
//               {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 orderId,
//               },
//               { withCredentials: true }
//             );

//             if (verifyRes.data?.success) {
//               alert("Payment Verified & Success!");
//               onSuccess?.(verifyRes.data);
//             } else {
//               alert("Payment verification failed!");
//               onFailure?.(verifyRes.data);
//             }
//           } catch (error) {
//             console.error("Verification error:", error);
//             alert("Server verification me error aayi!");
//             onFailure?.(error);
//           } finally {
//             setIsProcessing(false);
//           }
//         },

//         prefill: {
//           name: `${user?.fullName?.firstName || ""} ${user?.fullName?.lastName || ""}`.trim(),
//           email: user?.email || "",
//           contact: user?.addresses?.[0]?.phone || "",
//         },

//         theme: { color: "#00FFFF" },

//         modal: {
//           ondismiss: () => setIsProcessing(false),
//         },
//       };

//       const razorpayInstance = new window.Razorpay(options);

//       razorpayInstance.on("payment.failed", (response) => {
//         alert(`Payment Fail: ${response.error.description}`);
//         setIsProcessing(false);
//         onFailure?.(response.error);
//       });

//       razorpayInstance.open();
//     } catch (error) {
//       console.error("Payment initiation error:", error);
//       alert(error.response?.data?.message || "Payment trigger nahi hua");
//       setIsProcessing(false);
//     }
//   };

//   const getOrder = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/order/me", { withCredentials: true });
//       if (res.data?.success) dispatch(setOrderRedux(res.data));
//     } catch (error) {
//       console.error("Fetch order error:", error);
//     }
//   };

//   useEffect(() => {
//     getOrder();
//   }, [refreshTrigger]);

//   const ordersList = orderGet?.orders || [];
//   const currentOrder = ordersList[0];
//   const shippingAddress = currentOrder?.shippingAddress;

//   const totalAmount = currentOrder?.totalPrice?.amount ?? cartItems.reduce(
//     (total, item) => total + (item.price?.amount || 0) * (item.qty || 1),
//     0
//   );

//   const totalItems = currentOrder?.items?.reduce(
//     (total, item) => total + (item.quantity || 0),
//     0
//   ) || cartItems.length;

//   return (
//     <div className="mt-20 flex w-full flex-col gap-8 px-4 pb-10 sm:px-6 lg:flex-row lg:px-20 xl:px-40">
//       <div className="w-full rounded-xl bg-gray-100 p-4 lg:w-1/2">
//         {ordersList.length > 0 ? (
//           ordersList.map((order) => (
//             <div key={order._id} className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//               <div className="flex items-center justify-between border-b pb-3">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Order ID: <span className="font-semibold text-gray-800">{order._id}</span></p>
//                   <p className="text-xs text-gray-400">Status: <span className="font-semibold text-yellow-600">{order.status || "PENDING"}</span></p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs text-gray-500">Total Price</p>
//                   <p className="text-sm font-bold text-gray-900">₹{order.totalPrice?.amount || 0}</p>
//                 </div>
//               </div>

//               <div className="divide-y divide-gray-100">
//                 {order.items?.map((item, idx) => (
//                   <div key={item._id || idx} className="flex items-center justify-between gap-4 py-3">
//                     <div className="flex min-w-0 items-center gap-3">
//                       <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
//                         <img src={item.images?.[0] || item.images?.[0] || "https://via.placeholder.com/150"} alt={item.title || "Product"} className="h-full w-full object-cover object-center" />
//                       </div>

//                       <div className="min-w-0">
//                         <h4 className="truncate text-sm font-semibold text-gray-800">{item.title || "Product"}</h4>
//                         <p className="text-xs text-gray-500">Size: <span className="font-medium text-gray-700">{item.size || "N/A"}</span></p>
//                         <p className="text-xs text-gray-500">Qty: <span className="font-medium text-gray-700">{item.quantity || 1}</span></p>
//                       </div>
//                     </div>

//                     <div className="shrink-0 text-right">
//                       <span className="text-sm font-bold text-gray-900">₹{item.price?.amount || 0}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="py-6 text-center text-gray-500">No orders found.</p>
//         )}
//       </div>

//       <div className="w-full lg:sticky lg:top-24 lg:h-fit lg:w-[30vw] xl:w-[25vw]">
//         <div className="flex flex-col gap-5">

//           {shippingAddress && (
//             <div className="rounded-xl border bg-white p-4 shadow-sm">
//               <p className="font-semibold text-gray-800">Deliver to:</p>

//               <div className="mt-3">
//                 <div className="flex items-center gap-2">
//                   <p className="font-semibold text-gray-800">{user?.fullName?.firstName} {user?.fullName?.lastName}</p>
//                   <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Shipping Address</span>
//                 </div>

//                 <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
//                   <MapPin size={20} className="shrink-0 rounded-sm bg-[#00FFFF] p-1 text-black" />
//                   {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}, {shippingAddress.country}
//                 </p>

//                 <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
//                   <Phone size={20} className="shrink-0 rounded-sm bg-[#00FFFF] p-1 text-black" />
//                   {shippingAddress.phone}
//                 </p>
//               </div>
//             </div>
//           )}

//           <div className="rounded-xl border bg-white p-5 shadow-sm">
//             <h2 className="mb-4 text-lg font-bold">Payment Details</h2>

//             <div className="flex justify-between text-sm text-gray-600">
//               <p>Total Items ({totalItems})</p>
//               <p>₹{Number(totalAmount).toLocaleString()}</p>
//             </div>

//             <div className="mt-3 flex justify-between text-sm text-gray-600">
//               <p>Delivery</p>
//               <p className="text-green-600">FREE</p>
//             </div>

//             <div className="mt-4 flex justify-between border-t pt-4">
//               <p className="font-bold">Total Amount</p>
//               <p className="font-bold">₹{Number(totalAmount).toLocaleString()}</p>
//             </div>

//             <button
//               onClick={() => {
//                 if (!currentOrder) {
//                   alert("Koi active order nahi mila!");
//                   return;
//                 }

//                 handlePayment({
//                   orderId: currentOrder._id,
//                   user,
//                   onSuccess: () => navigate("/orders"),
//                   onFailure: (error) => console.error("Payment failed", error),
//                 });
//               }}
//               disabled={isProcessing || !currentOrder}
//               className="mt-5 w-full rounded-md bg-[#00FFFF] py-3 font-bold text-gray-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {isProcessing ? "Processing..." : "Checkout securely"}
//             </button>
//           </div>
//         </div>

//         <Button onClick={() => navigate("/cart")} className="mt-5 w-full bg-gray-900 text-gray-50 hover:bg-gray-800 lg:mt-10">
//           View My Orders <LucideTruck /> <ArrowRight />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Order;


import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { ArrowRight, CheckCircle2, LucideTruck, MapPin, Phone } from "lucide-react";
import { setOrderRedux } from "@/redux/orderSlice";
import { Button } from "../ui/button";

const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux store se user aur order data nikalna
  const { user } = useSelector((store) => store.auth);
  const { orderGet, refreshTrigger } = useSelector((store) => store.orderStore);

  // States
  const [selectedOrderId, setSelectedOrderId] = useState(null); // User ne konsa order chuna hai
  const [isProcessing, setIsProcessing] = useState(false); // Payment loading state

  // Backend se user ke saare orders fetch karna
  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/order/me", {
        withCredentials: true,
      });
      if (res.data?.success) {
        dispatch(setOrderRedux(res.data));
      }
    } catch (error) {
      console.error("Order fetch karne me error:", error);
    }
  };

  // Component load hone par ya refreshTrigger change hone par orders call karna
  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  const ordersList = orderGet?.orders || [];
  console.log('Order list 💗',ordersList)

  // Default selection: Pehla unpaid order auto-select karna
  useEffect(() => {
    if (ordersList.length > 0 && !selectedOrderId) {
      const firstUnpaid = ordersList.find((o) => !o.payment?.isPaid);
      if (firstUnpaid) {
        setSelectedOrderId(firstUnpaid._id);
      }
    }
  }, [ordersList, selectedOrderId]);

  // Jo order user ne select kiya hai uska pura data nikalna
  const selectedOrder = ordersList.find((order) => order._id === selectedOrderId);
  const shippingAddress = selectedOrder?.shippingAddress;

  // Razorpay ka script dynamically browser me load karna
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Payment process handle karna
  const handlePayment = async () => {
    if (!selectedOrder) {
      alert("Kripya pehle ek order chuniye!");
      return;
    }

    // Safety check: Agar order already paid hai to payment nahi hone denge
    if (selectedOrder.payment?.isPaid) {
      alert("Yeh order pehle se hi paid ho chuka hai!");
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    // 1. Script load check
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK load nahi ho paya. Internet connection check karein.");
      setIsProcessing(false);
      return;
    }

    try {
      // 2. Backend se Razorpay order ID create karwana
      const { data } = await axios.post(
        `/api/payments/create/${selectedOrder._id}`,
        {},
        { withCredentials: true }
      );

      if (!data?.success) {
        alert("Payment order banne me fail ho gaya!");
        setIsProcessing(false);
        return;
      }

      const { order, razorpayKeyId } = data;

      // 3. Razorpay Checkout Popup ke options
      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "My Store",
        description: `Payment for Order #${selectedOrder._id}`,
        order_id: order.id,

        // Payment success hone par verification API call karna
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              "/api/payments/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: selectedOrder._id,
              },
              { withCredentials: true }
            );

            if (verifyRes.data?.success) {
              await axios.patch(`/api/order/pay/${selectedOrder._id}`,{}, {
                withCredentials:true
              })
              alert("Payment safal ho gaya!");
              fetchOrders(); // List update karna taaki status 'PAID' ho jaye
              navigate("/cart/order");
            } else {
              alert("Payment verification fail ho gaya!");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verify karne me server par error aayi!");
          } finally {
            setIsProcessing(false);
          }
        },

        prefill: {
          name: `${user?.fullName?.firstName || ""} ${user?.fullName?.lastName || ""}`.trim(),
          email: user?.email || "",
          contact: selectedOrder?.shippingAddress?.phone || user?.addresses?.[0]?.phone || "",
        },
        theme: { color: "#00FFFF" },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      // Agar user ka payment fail ho jaye
      razorpayInstance.on("payment.failed", (response) => {
        alert(`Payment Fail: ${response.error.description}`);
        setIsProcessing(false);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert(error.response?.data?.message || "Payment shuru nahi ho paya!");
      setIsProcessing(false);
    }
  };

  if (!user) {
          return <Navigate to="/login" replace />;
      }

  return (
    <div className="mt-20 flex w-full flex-col gap-8 px-4 pb-10 sm:px-6 lg:flex-row lg:px-20 xl:px-40">
      {/* LEFT SECTION: Har order ka alag card */}
      <div className="flex w-full flex-col gap-4 rounded-xl bg-gray-100 p-4 lg:w-1/2">
        <h2 className="text-lg font-bold text-gray-800">Select an Order to Pay</h2>

        {ordersList.length > 0 ? (
          ordersList.map((order) => {
            const isOrderPaid = order.payment?.isPaid;
            const isSelected = selectedOrderId === order._id;

            return (
              <div
                key={order._id}
                onClick={() => {
                  // Sirf unpaid order ko select karne ki permission
                  if (!isOrderPaid) setSelectedOrderId(order._id);
                }}
                className={`relative cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition ${
                  isSelected ? "border-cyan-500 ring-2 ring-cyan-400" : "border-gray-200"
                } ${isOrderPaid ? "cursor-not-allowed bg-gray-50 opacity-80" : "hover:border-cyan-300"}`}
              >
                {/* Header: Radio Button, Order ID aur Payment Status */}
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="selectedOrder"
                      checked={isSelected}
                      disabled={isOrderPaid}
                      onChange={() => setSelectedOrderId(order._id)}
                      className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
                    />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Order ID: <span className="font-semibold text-gray-800">{order._id}</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        Status: <span className="font-semibold text-yellow-600">{order.status || "PENDING"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {/* Paid ya Unpaid badge */}
                    {isOrderPaid ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                        <CheckCircle2 size={13} /> Paid
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                        Unpaid
                      </span>
                    )}
                    <p className="mt-1 text-sm font-bold text-gray-900">₹{order.totalPrice?.amount || 0}</p>
                  </div>
                </div>

                {/* Items list is order ke andar */}
                <div className="divide-y divide-gray-100">
                  {order.items?.map((item, idx) => (
                    <div key={item._id || idx} className="flex items-center justify-between gap-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-gray-100">
                          <img
                            src={item.images?.[0] || "https://via.placeholder.com/150"}
                            alt={item.title || "Product"}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-semibold text-gray-800">{item.title || "Product"}</h4>
                          <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-sm font-bold text-gray-900">₹{item.price?.amount || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="py-6 text-center text-gray-500">Koi order nahi mila.</p>
        )}
      </div>

      {/* RIGHT SECTION: Selected Order ki details aur checkout */}
      <div className="w-full lg:sticky lg:top-24 lg:h-fit lg:w-[30vw] xl:w-[25vw]">
        <div className="flex flex-col gap-5">
          {/* Selected Order ka Shipping Address */}
          {shippingAddress && (
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="font-semibold text-gray-800">Deliver to:</p>
              <div className="mt-3">
                <p className="font-semibold text-gray-800">
                  {user?.fullName?.firstName} {user?.fullName?.lastName}
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={20} className="shrink-0 rounded-sm bg-[#00FFFF] p-1 text-black" />
                  {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                </p>
                {shippingAddress.phone && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                    <Phone size={20} className="shrink-0 rounded-sm bg-[#00FFFF] p-1 text-black" />
                    {shippingAddress.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Payment Summary Box */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Selected Order Summary</h2>

            {selectedOrder ? (
              <>
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Total Items ({selectedOrder.items?.reduce((t, i) => t + (i.quantity || 1), 0) || 0})</p>
                  <p>₹{selectedOrder.totalPrice?.amount || 0}</p>
                </div>

                <div className="mt-3 flex justify-between text-sm text-gray-600">
                  <p>Delivery</p>
                  <p className="text-green-600 font-medium">FREE</p>
                </div>

                <div className="mt-4 flex justify-between border-t pt-4">
                  <p className="font-bold text-gray-800">Total Payable</p>
                  <p className="font-bold text-gray-900">₹{selectedOrder.totalPrice?.amount || 0}</p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || !selectedOrderId || selectedOrder.payment?.isPaid}
                  className="mt-5 w-full rounded-md bg-[#00FFFF] py-3 font-bold text-gray-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing
                    ? "Processing..."
                    : selectedOrder.payment?.isPaid
                    ? "Already Paid"
                    : `Pay ₹${selectedOrder.totalPrice?.amount || 0}`}
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-500">Kripya payment karne ke liye ek unpaid order chunein.</p>
            )}
          </div>
        </div>

        <Button onClick={() => navigate("/cart")} className="mt-5 w-full bg-gray-900 text-gray-50 hover:bg-gray-800 lg:mt-10">
          Back to Cart <LucideTruck /> <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default Order;