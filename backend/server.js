import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const products = [
  { id: 1, name: "Everyday Backpack", category: "Accessories", price: 1299, emoji: "🎒", description: "A roomy backpack for classes and daily travel." },
  { id: 2, name: "Wireless Headphones", category: "Electronics", price: 2499, emoji: "🎧", description: "Comfortable headphones for music and calls." },
  { id: 3, name: "Classic Sneakers", category: "Fashion", price: 1899, emoji: "👟", description: "Versatile sneakers made for everyday wear." },
  { id: 4, name: "Smart Watch", category: "Electronics", price: 3299, emoji: "⌚", description: "Track your activity and stay connected." },
  { id: 5, name: "Insulated Bottle", category: "Lifestyle", price: 599, emoji: "🥤", description: "A reusable bottle for your daily hydration." },
  { id: 6, name: "Desk Lamp", category: "Home", price: 899, emoji: "💡", description: "A simple lamp for your study or work desk." }
];

app.get("/", (_req, res) => res.json({ message: "Basic E-commerce API is running" }));
app.get("/api/products", (_req, res) => res.json(products));

app.post("/api/checkout", (req, res) => {
  const { items } = req.body ?? {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Your cart is empty." });
  }

  const orderItems = [];
  for (const item of items) {
    const product = products.find((p) => p.id === Number(item.id));
    const quantity = Math.floor(Number(item.quantity));
    if (!product || !Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
      return res.status(400).json({ message: "Invalid cart item." });
    }
    orderItems.push({ id: product.id, name: product.name, price: product.price, quantity });
  }

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.status(201).json({
    message: "Demo checkout successful!",
    order: { orderId: `DEMO-${Date.now()}`, items: orderItems, total }
  });
});

app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
