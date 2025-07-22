import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import useAuth from '@/hooks/UseAuth';
import useAxiosSecure from '@/hooks/UseAxiosSecure';

const CheckoutForm = ({ amount, campaignId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      // 1. Create payment intent
      const res = await axiosSecure.post('/create-payment-intent', { amount });
      const clientSecret = res.data.clientSecret;

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.displayName || 'Anonymous',
            email: user?.email || 'unknown@example.com',
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        const paymentIntent = result.paymentIntent;

        // 3. Save donation to database
        const donationData = {
          campaignId,
          donorName: user?.displayName,
          donorEmail: user?.email,
          amount,
          transactionId: paymentIntent.id,
          status: paymentIntent.status,
          date: new Date(),
        };

        await axiosSecure.post('/donations', donationData);

        setSuccess('Payment successful! Thank you for your donation.');
        setError('');
        setProcessing(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="border p-4 rounded-lg" />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="bg-green-600 text-center text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Donate $${amount}`}
      </button>
      {success && <p className="text-center text-green-600 text-sm">{success}</p>}
      {error && <p className="text-center text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default CheckoutForm;
