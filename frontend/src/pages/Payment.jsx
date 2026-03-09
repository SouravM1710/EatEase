import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useOrders } from "../context/OrderContext"

const Payment = () => {
    const navigate = useNavigate()
    const { cartItems, clearCart } = useCart()
    const { placeOrder } = useOrders()
    const [processing, setProcessing] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )
    const deliveryFee = 40
    const tax = Math.round(subtotal * 0.05)
    const total = subtotal + deliveryFee + tax

    const handlePlaceOrder = async () => {
        setProcessing(true)
        setError("")
        try {
            const restaurantId = cartItems[0]?.restaurantId
            const items = cartItems.map((item) => ({
                dish: { id: item.id },
                quantity: item.quantity,
            }))
            await placeOrder(restaurantId, items)
            clearCart()
            setSuccess(true)
            setTimeout(() => navigate("/dashboard"), 2000)
        } catch (err) {
            setError(err.message || "Order placement failed. Please try again.")
            setProcessing(false)
        }
    }

    const openRazorpay = () => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: total * 100, // Razorpay expects paise
            currency: "INR",
            name: "EatEase",
            description: `Order - ${cartItems.length} item(s)`,
            handler: function () {
                // Payment successful — place the order
                handlePlaceOrder()
            },
            prefill: {
                name: "Test User",
                email: "test@eatease.com",
                contact: "9999999999",
            },
            theme: {
                color: "#EF4444",
            },
            modal: {
                ondismiss: function () {
                    setProcessing(false)
                },
            },
        }

        const rzp = new window.Razorpay(options)
        rzp.on("payment.failed", function (response) {
            setError(response.error.description || "Payment failed")
            setProcessing(false)
        })
        rzp.open()
    }

    const handlePay = () => {
        if (!import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY_ID === "rzp_test_REPLACE_WITH_YOUR_KEY") {
            setError("Razorpay key not configured. Please set VITE_RAZORPAY_KEY_ID in .env")
            return
        }
        setProcessing(true)
        setError("")
        openRazorpay()
    }

    if (cartItems.length === 0 && !success) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">No items to pay for</h2>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600"
                    >
                        Browse Restaurants
                    </button>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Payment Successful! 🎉
                    </h2>
                    <p className="text-gray-500 mb-1">
                        ₹{total} paid successfully
                    </p>
                    <p className="text-gray-400 text-sm">
                        Redirecting to your dashboard...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                {/* Payment Summary Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-200 text-sm">Pay to</p>
                                <h2 className="text-white text-lg font-semibold">EatEase</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-200 text-sm">Total Amount</p>
                                <p className="text-white text-2xl font-bold">₹{total}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="px-6 py-5">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Order Summary
                        </h3>
                        <div className="space-y-2 text-sm">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between text-gray-700">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                            <hr className="my-2" />
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Delivery Fee</span>
                                <span>₹{deliveryFee}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Taxes</span>
                                <span>₹{tax}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between font-bold text-gray-900">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mx-6 mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Pay Button */}
                    <div className="px-6 pb-6">
                        <button
                            onClick={handlePay}
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3.5 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                `Pay ₹${total} with Razorpay`
                            )}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secured by Razorpay (Test Mode)
                        </div>
                    </div>
                </div>

                {/* Back Link */}
                <button
                    onClick={() => navigate("/checkout")}
                    disabled={processing}
                    className="mt-4 w-full text-center text-gray-500 text-sm hover:text-gray-700 disabled:opacity-50"
                >
                    ← Back to checkout
                </button>
            </div>
        </div>
    )
}

export default Payment
