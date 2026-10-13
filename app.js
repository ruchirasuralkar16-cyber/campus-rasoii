const dishes = [
  { id: 1, name: "Vada Pav", price: 20, category: "Snacks", image: "vada-pav.jpeg", emoji: "🍔", desc: "Mumbai's favourite spicy potato snack." },
  { id: 2, name: "Pav Bhaji", price: 70, category: "Snacks", image: "pav-bhaji.jpeg", emoji: "🍲", desc: "Buttery pav with rich vegetable bhaji." },
  { id: 3, name: "Masala Dosa", price: 60, category: "Breakfast", image: "masala-dosa.jpeg", emoji: "🥞", desc: "Crispy dosa stuffed with potato masala." },
  { id: 4, name: "Idli Sambar", price: 40, category: "Breakfast", image: "idli-sambar.jpeg", emoji: "🥣", desc: "Soft idlis served with sambar." },
  { id: 5, name: "Veg Biryani", price: 90, category: "Meals", image: "veg-biryani.jpeg", emoji: "🍛", desc: "Fragrant rice with vegetables and spices." },
  { id: 6, name: "Aloo Paratha", price: 45, category: "Breakfast", image: "aloo-paratha.jpeg", emoji: "🫓", desc: "Stuffed paratha with a side of curd." },
  { id: 7, name: "Chole Kulche", price: 60, category: "Meals", image: "chole-kulche.jpeg", emoji: "🫘", desc: "Spiced chickpeas with soft kulche." },
  { id: 8, name: "Samosa", price: 15, category: "Snacks", image: "samosa.jpeg", emoji: "🥟", desc: "Crispy pastry with potato filling." },
  { id: 9, name: "Veg Sandwich", price: 40, category: "Snacks", image: "veg-sandwich.jpeg", emoji: "🥪", desc: "Fresh vegetables between toasted bread." },
  { id: 10, name: "Masala Chai", price: 15, category: "Drinks", image: "masala-chai.jpeg", emoji: "☕", desc: "Warm tea brewed with Indian spices." },
  { id: 11, name: "Cold Coffee", price: 50, category: "Drinks", image: "cold-coffee.jpeg", emoji: "🥤", desc: "Chilled, creamy coffee for a study break." },
  { id: 12, name: "Cutting Chai", price: 10, category: "Drinks", image: "cutting-chai.jpeg", emoji: "🫖", desc: "A small cup of classic Mumbai chai." },
  { id: 13, name: "Poha", price: 30, category: "Breakfast", image: "poha.jpeg", emoji: "🍋", desc: "Light flattened rice with peanuts and spices." },
  { id: 14, name: "Medu Vada", price: 35, category: "Breakfast", image: "medu-vada.jpeg", emoji: "🍩", desc: "Crispy lentil fritters with chutney." },
  { id: 15, name: "Misal Pav", price: 55, category: "Meals", image: "misal-pav.jpeg", emoji: "🌶️", desc: "Maharashtrian sprout curry with pav." },
  { id: 16, name: "Veg Fried Rice", price: 75, category: "Meals", image: "veg-fried-rice.jpeg", emoji: "🍚", desc: "Fried rice tossed with vegetables." },
  { id: 17, name: "Cheese Toast", price: 45, category: "Snacks", image: "cheese-toast.jpeg", emoji: "🧀", desc: "Golden toast topped with melted cheese." },
  { id: 18, name: "Gulab Jamun", price: 25, category: "Sweets", image: "gulab-jamun.jpeg", emoji: "🍡", desc: "Soft milk-solid sweets in sugar syrup." },
  { id: 19, name: "Sabudana Khichdi", price: 45, category: "Breakfast", image: "sabudana-khichdi.jpeg", emoji: "🥜", desc: "Tapioca pearls with peanuts and potatoes." },
  { id: 20, name: "Shrikhand", price: 35, category: "Sweets", image: "shrikhand.jpeg", emoji: "🍨", desc: "Creamy, sweetened strained yoghurt." },
  { id: 21, name: "Thalipeeth", price: 40, category: "Breakfast", image: "thalipeeth.jpeg", emoji: "🫓", desc: "Traditional Maharashtrian savoury flatbread." },
  { id: 22, name: "Uttapam", price: 50, category: "Breakfast", image: "uttapam.jpeg", emoji: "🥞", desc: "Soft rice pancake topped with vegetables." },
  { id: 23, name: "Puranpoli", price: 40, category: "Sweets", image: "puranpoli.jpeg", emoji: "🫓", desc: "Sweet flatbread with a lentil-jaggery filling." },
  { id: 24, name: "Nimbu Pani", price: 20, category: "Drinks", image: "nimbu-pani.jpeg", emoji: "🍋", desc: "Refreshing Indian lemon drink." }
];

const CART_KEY = "campusRasoiCartV1";
const ORDERS_KEY = "campusRasoiOrdersV1";

let cart = readStorage(CART_KEY, {});
let activeCategory = "All";

const menuGrid = document.getElementById("menuGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const categoryChips = document.getElementById("categoryChips");
const emptyMessage = document.getElementById("emptyMessage");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const checkoutModal = document.getElementById("checkoutModal");
const toast = document.getElementById("toast");

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    showToast("Unable to save cart in this browser.");
  }
}

function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function renderMenu() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = dishes.filter(dish => {
    const matchesCategory =
      activeCategory === "All" || dish.category === activeCategory;

    const matchesSearch =
      dish.name.toLowerCase().includes(query) ||
      dish.category.toLowerCase().includes(query) ||
      dish.desc.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  menuGrid.innerHTML = filtered.map(dish => `
    <article class="food-card">
      <div class="food-image">
        <div class="food-emoji" aria-hidden="true">${dish.emoji}</div>
        <img
          src="${dish.image}"
          alt="${dish.name}"
          loading="lazy"
          onerror="this.style.display='none'"
        >
        <span class="food-category">${dish.category}</span>
      </div>
      <div class="food-info">
        <h3>${dish.name}</h3>
        <p>${dish.desc}</p>
        <div class="food-bottom">
          <span class="food-price">${formatPrice(dish.price)}</span>
          <button class="add-button" data-add="${dish.id}">+ Add</button>
        </div>
      </div>
    </article>
  `).join("");

  emptyMessage.hidden = filtered.length !== 0;
}

function cartQuantity() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartTotal() {
  return dishes.reduce(
    (sum, dish) => sum + dish.price * (cart[dish.id] || 0),
    0
  );
}

function renderCart() {
  document.getElementById("cartCount").textContent = cartQuantity();
  document.getElementById("cartTotal").textContent =
    formatPrice(cartTotal());

  const cartItems = document.getElementById("cartItems");
  const selected = dishes.filter(dish => (cart[dish.id] || 0) > 0);

  if (selected.length === 0) {
    cartItems.innerHTML =
      '<div class="cart-empty"><div style="font-size:48px">🛒</div><p>Your cart is waiting for something tasty!</p></div>';
    document.getElementById("checkoutButton").disabled = true;
    return;
  }

  document.getElementById("checkoutButton").disabled = false;

  cartItems.innerHTML = selected.map(dish => `
    <div class="cart-item">
      <div>
        <strong>${dish.emoji} ${dish.name}</strong>
        <small>${formatPrice(dish.price)} each</small>
        <div class="quantity-controls">
          <button data-change="${dish.id}" data-delta="-1" aria-label="Remove one">−</button>
          <span>${cart[dish.id]}</span>
          <button data-change="${dish.id}" data-delta="1" aria-label="Add one">+</button>
        </div>
      </div>
      <strong>${formatPrice(dish.price * cart[dish.id])}</strong>
    </div>
  `).join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();

  const dish = dishes.find(item => item.id === id);
  showToast(`${dish.name} added to cart!`);
}

function changeQuantity(id, delta) {
  cart[id] = (cart[id] || 0) + delta;

  if (cart[id] <= 0) {
    delete cart[id];
  }

  saveCart();
  renderCart();
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");

  if (checkoutModal.hidden) {
    overlay.hidden = true;
    document.body.style.overflow = "";
  }
}

function openCheckout() {
  if (cartQuantity() === 0) {
    showToast("Add a dish before placing your order.");
    return;
  }

  closeCart();
  overlay.hidden = false;
  checkoutModal.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("studentName").focus();
}

function closeCheckout() {
  checkoutModal.hidden = true;
  overlay.hidden = true;
  document.body.style.overflow = "";
}

function renderOrders() {
  const orders = readStorage(ORDERS_KEY, []);
  const ordersList = document.getElementById("ordersList");

  if (orders.length === 0) {
    ordersList.innerHTML =
      '<p class="no-orders">No orders yet. Your first canteen order will appear here!</p>';
    return;
  }

  ordersList.innerHTML = orders.map(order => `
    <article class="order-card">
      <div class="order-header">
        <strong>Order ${order.id}</strong>
        <span class="order-status">Demo order placed</span>
      </div>
      <p>
        ${order.date}<br>
        Student: ${escapeHTML(order.student)}<br>
        Pickup: ${escapeHTML(order.pickup)}<br>
        Items: ${order.items.map(item =>
          `${escapeHTML(item.name)} × ${item.qty}`
        ).join(", ")}
      </p>
      <p class="order-total">Total: ${formatPrice(order.total)}</p>
      <small>Payment option: ${escapeHTML(order.payment)}</small>
    </article>
  `).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

menuGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

document.getElementById("cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-change]");
  if (button) {
    changeQuantity(Number(button.dataset.change), Number(button.dataset.delta));
  }
});

searchInput.addEventListener("input", renderMenu);

categoryFilter.addEventListener("change", () => {
  activeCategory = categoryFilter.value;
  syncChips();
  renderMenu();
});

categoryChips.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;
  categoryFilter.value = activeCategory;
  syncChips();
  renderMenu();
});

function syncChips() {
  categoryChips.querySelectorAll("[data-category]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === activeCategory
    );
  });
}

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCartButton").addEventListener("click", closeCart);
document.getElementById("checkoutButton").addEventListener("click", openCheckout);
document.getElementById("closeModalButton").addEventListener("click", closeCheckout);

overlay.addEventListener("click", () => {
  closeCart();
  closeCheckout();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeCheckout();
  }
});

document.getElementById("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();

  if (cartQuantity() === 0) {
    closeCheckout();
    showToast("Your cart is empty.");
    return;
  }

  const student = document.getElementById("studentName").value.trim();
  const pickup = document.getElementById("pickupLocation").value;
  const payment = document.getElementById("paymentMethod").value;

  if (!student || !pickup || !payment) {
    showToast("Please complete all fields.");
    return;
  }

  const orders = readStorage(ORDERS_KEY, []);
  const order = {
    id: "CR" + Date.now().toString().slice(-7),
    date: new Date().toLocaleString("en-IN"),
    student,
    pickup,
    payment,
    total: cartTotal(),
    items: dishes
      .filter(dish => (cart[dish.id] || 0) > 0)
      .map(dish => ({
        name: dish.name,
        qty: cart[dish.id]
      }))
  };

  orders.unshift(order);

  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, 30)));
    cart = {};
    saveCart();
  } catch {
    showToast("Could not save the order. Please try again.");
    return;
  }

  renderCart();
  renderOrders();
  closeCheckout();
  document.getElementById("checkoutForm").reset();
  showToast("Demo order placed successfully! 🎉");
  document.getElementById("orders").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("clearOrdersButton").addEventListener("click", () => {
  if (!confirm("Clear all saved demo orders from this browser?")) return;

  localStorage.removeItem(ORDERS_KEY);
  renderOrders();
  showToast("Order history cleared.");
});

renderMenu();
renderCart();
renderOrders();
