import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_veloceops_key', {
  apiVersion: '2024-10-28.acacia' as any,
  appInfo: {
    name: 'VeloceOps',
    version: '1.0.0',
  },
});
