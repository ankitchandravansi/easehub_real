import api from '../utils/api';

export const createPaymentOrder = async (amount, bookingId) => {
    const response = await api.post('/payments/create-order', {
        amount,
        bookingId,
    });
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
};

export const getMyPayments = async () => {
    const response = await api.get('/payments/my-payments');
    return response.data;
};

export const initiateRazorpayPayment = (orderData, onSuccess, onFailure) => {
    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'EaseHub',
        description: 'Payment for booking',
        order_id: orderData.orderId,
        handler: async function (response) {
            try {
                const verifyData = {
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                    paymentId: orderData.paymentId,
                };

                const result = await verifyPayment(verifyData);
                onSuccess(result);
            } catch (error) {
                onFailure(error);
            }
        },
        prefill: {
            name: orderData.userName || '',
            email: orderData.userEmail || '',
        },
        theme: {
            color: '#4F46E5',
        },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
        onFailure(response.error);
    });
    rzp.open();
};
