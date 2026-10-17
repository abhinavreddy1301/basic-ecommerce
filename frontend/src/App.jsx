import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, Search, Plus, Minus, Trash2, ArrowRight, CheckCircle2, PackageCheck } from "lucide-react";

const API = "http://localhost:5000";

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then((res) => { if (!res.ok) throw new Error("Could not load products"); return res.json(); })
      .then(setProducts)
      .catch(() => setError("Couldn't connect to the backend. Start the backend server on port 5000 and refresh."))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filtered = useMemo(() => products.filter((p) =>
    (category === "All" || p.category === category) &&
    `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())
  ), [products, category, search]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function addToCart(product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      return found
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
    });
    setNotice(`${product.name} added to your bag`);
    window.setTimeout(() => setNotice(""), 2200);
  }

  function changeQuantity(id, delta) {
    setCart((current) => current
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  }

  async function checkout() {
    try {
      const response = await fetch(`${API}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.map(({ id, quantity }) => ({ id, quantity })) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Checkout failed");
      setNotice(`Order placed! ${data.order.orderId} · ${money(data.order.total)}`);
      setCart([]);
      setCartOpen(false);
    } catch (e) {
      setNotice(e.message || "Checkout failed. Check the backend connection.");
    }
    window.setTimeout(() => setNotice(""), 4000);
  }

  return (
    <div className="app-shell">
      <div className="announcement">A little something for your everyday <span>✳</span> Free shipping on orders over ₹2,000</div>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Marketly home"><span className="brand-mark">m.</span> marketly</a>
        <nav className="main-nav"><a href="#shop">Shop all</a><a href="#shop">New arrivals</a><a href="#about">Our story</a></nav>
        <div className="header-actions">
          <label className="search-box"><Search size={17}/><input aria-label="Search products" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products"/></label>
          <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Open bag, ${cartCount} items`}><ShoppingBag size={19}/><span>Bag</span><b>{cartCount}</b></button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot"/> THE EVERYDAY EDIT</div>
            <h1>Good things.<br/><em>Good days.</em></h1>
            <p>Thoughtfully picked essentials for wherever your day takes you. Simple finds, everyday favorites.</p>
            <a className="primary-button" href="#shop">Explore the collection <ArrowRight size={17}/></a>
            <div className="hero-footnote"><span>✳</span> Small upgrades. Big everyday energy.</div>
          </div>
          <div className="hero-art" aria-label="Illustration of everyday shopping essentials">
            <div className="art-sun"/><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
            <div className="art-tag">MADE FOR<br/>YOUR EVERYDAY</div>
            <div className="art-platform"/>
            <div className="art-bag"><div className="bag-handle"/><div className="bag-face">m.</div><div className="bag-side"/></div>
            <div className="art-cup"><div className="cup-lid"/><div className="cup-logo">take<br/>it easy</div></div>
            <div className="art-flower">✳</div><div className="art-spark spark-one">✦</div><div className="art-spark spark-two">✳</div>
          </div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading"><div><div className="eyebrow">THE GOOD STUFF</div><h2>Find your <em>everyday.</em></h2></div><p>Useful things. Lovely details.<br/>A little joy in every order.</p></div>
          <div className="shop-toolbar">
            <div className="category-list">{categories.map((item) => <button key={item} className={category === item ? "category active" : "category"} onClick={() => setCategory(item)}>{item}</button>)}</div>
            <span className="product-count">{filtered.length} products</span>
          </div>
          {error && <div className="error-banner">{error}</div>}
          {loading ? <div className="empty-state">Getting the good stuff ready…</div> : (
            <div className="product-grid">
              {filtered.map((product, index) => (
                <article className="product-card" key={product.id}>
                  <div className={`product-visual visual-${index % 6}`}>
                    <span className="product-category">{product.category}</span>
                    <span className="product-emoji" role="img" aria-label={product.name}>{product.emoji}</span>
                    <button className="quick-add" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to bag`}><Plus size={20}/></button>
                  </div>
                  <div className="product-info"><div><h3>{product.name}</h3><p>{product.description}</p></div><strong>{money(product.price)}</strong></div>
                </article>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && <div className="empty-state">No products found. Try another search.</div>}
        </section>

        <section className="promise-strip" id="about"><div><span>✳</span><p><b>Picked with purpose</b><br/>Everyday essentials, no fuss.</p></div><div><PackageCheck size={25}/><p><b>Easy on the way</b><br/>Free shipping over ₹2,000.</p></div><div><CheckCircle2 size={25}/><p><b>Good things guaranteed</b><br/>Here to make your day better.</p></div></section>
      </main>
      <footer><a className="brand" href="#"><span className="brand-mark">m.</span> marketly</a><span>Everyday essentials, thoughtfully found.</span><span>© 2026 Marketly</span></footer>

      {notice && <div className="toast" role="status"><CheckCircle2 size={18}/>{notice}</div>}
      {cartOpen && <div className="drawer-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setCartOpen(false); }}>
        <aside className="cart-drawer" aria-label="Shopping bag">
          <div className="drawer-header"><div><div className="eyebrow">YOUR GOOD FINDS</div><h2>Your bag <span>({cartCount})</span></h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close bag">×</button></div>
          {cart.length === 0 ? <div className="cart-empty"><div className="empty-bag">🛍️</div><h3>Your bag is taking a break.</h3><p>Find something lovely for your everyday.</p><button className="primary-button" onClick={() => setCartOpen(false)}>Keep exploring <ArrowRight size={16}/></button></div> : <>
            <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><div className="cart-item-emoji">{item.emoji}</div><div className="cart-item-info"><h3>{item.name}</h3><strong>{money(item.price)}</strong><div className="quantity-control"><button onClick={() => changeQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus size={13}/></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label="Increase quantity"><Plus size={13}/></button></div></div><button className="remove-button" onClick={() => setCart((current) => current.filter((x) => x.id !== item.id))} aria-label={`Remove ${item.name}`}><Trash2 size={17}/></button></div>)}</div>
            <div className="cart-summary"><div className="subtotal"><span>Subtotal</span><strong>{money(total)}</strong></div><p>Shipping and taxes calculated at checkout.</p><button className="checkout-button" onClick={checkout}>Place demo order <ArrowRight size={17}/></button><small>Demo checkout only — no payment is collected.</small></div>
          </>}
        </aside>
      </div>}
    </div>
  );
}
