import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'YOUR_STRIPE_PRICE_ID',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://coverquick.app/success',
      cancel_url: 'https://coverquick.app/',
    });

    res.status(303).json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: "Stripe checkout session failed" });
  }
}
