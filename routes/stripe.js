import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const router = express.Router();
// Replace with your Stripe Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: item.price * 100, // amount in cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: "http://localhost:5173/orderconfirmation",
      cancel_url: "http://localhost:5173/home",
    });

    res.json({ url: session.url });

    console.log("Received request to create checkout session:", req.body);
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
