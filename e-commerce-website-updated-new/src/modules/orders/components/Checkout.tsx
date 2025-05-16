import React, { useState } from 'react';
import { useCartStore } from '../../cart/hooks/cart-hook';
import { useAuth } from '../../auth/hooks/use-auth';
import { useNavigate } from 'react-router-dom';


const Checkout: React.FC = () => {
    const phone = localStorage.getItem('phone');
    const address = localStorage.getItem('address');
  const { cartItems, removeItem } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const loadRazorpay = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      alert('You need to log in before proceeding to checkout.');
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    
    const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Failed to load payment gateway.');
      setIsProcessing(false);
      return;
    }

    const options = {
      key: 'rzp_test_xQJcS49E6NLbJj', // Replace with your Razorpay API key
      amount: totalAmount * 100,
      currency: 'USD',
      name: 'E-Commerce Checkout',
      description: 'Test Transaction',
      image: '/logo.png',
      handler: function (response: any) {
        alert('Payment successful! Your order has been placed.');
        
        // Save order details to localStorage
        const orderHistoryKey = `orders_${user.uid}`;
        const existingOrders = JSON.parse(localStorage.getItem(orderHistoryKey) || '[]');
        const newOrder = {
          id: response.razorpay_payment_id,
          items: cartItems,
          totalAmount,
          date: new Date().toLocaleString(),
        };
        localStorage.setItem(orderHistoryKey, JSON.stringify([...existingOrders, newOrder]));
        
        // Clear the cart after payment
        cartItems.forEach((item) => removeItem(item.id));
        
        // Redirect to order history page
        navigate('/orders');
      },
      prefill: {
        email: user.email,
        contact: '9999999999',
      },
      theme: {
        color: '#3399cc',
      },
    };
    
    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. Add some products before checking out.</p>
      ) : (
        <>
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
    <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Order Details</h2>
     <h4>Welcome , {user.displayName}</h4>   
    <div className="space-y-3">
        {/* Phone Details */}
        <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-semibold">📞 Phone:</span>
            <span className={phone ? "text-gray-900" : "text-red-500 font-medium"}>
                {phone || "Not Provided"}
            </span>
        </div>

        {/* Address Details */}
        <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-semibold">🏠 Address:</span>
            <span className={address ? "text-gray-900" : "text-red-500 font-medium"}>
                {address || "Not Provided"}
            </span>
        </div>
    </div>
</div>
          <ul className="mb-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between border-b py-2">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="text-right font-bold text-lg mb-4">
            Total Amount: ${totalAmount.toFixed(2)}
          </div>
          <button
            onClick={handlePayment}
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;


/*
const Checkout = () => {
    const phone = localStorage.getItem('phone');
    const address = localStorage.getItem('address');

    return (
        <div>
            <h2>Order Details</h2>
            <p><strong>Phone:</strong> {phone || 'Not Provided'}</p>
            <p><strong>Address:</strong> {address || 'Not Provided'}</p>
            <button onClick={() => alert('Order Placed Successfully!')}>Place Order</button>
        </div>
    );
};

export default Checkout;
*/