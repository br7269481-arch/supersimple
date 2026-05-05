// Interactive Cart with Email to livestockgreenfarmin@gmail.com
// User-friendly: Qty controls, totals, send order modal

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function addToCart(productId, name, price, image, quantity = 1) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, name, price, image, quantity });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  window.GreenPastures.updateCartBadge();
  showNotification('Added to cart!');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  window.GreenPastures.updateCartBadge();
  renderCart();
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(1, item.quantity + change);
    if (item.quantity === 0) removeFromCart(productId);
    else {
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function renderCart() {
  const cartEl = document.getElementById('cart-items');
  if (!cartEl) return;

  if (cart.length === 0) {
    cartEl.innerHTML = '<p>Your cart is empty. <a href="products.html">Shop now!</a></p>';
    document.querySelector('.cart-total').style.display = 'none';
    return;
  }

  cartEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price} x <span class="qty-display">${item.quantity}</span></p>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
        <span class="qty-display">${item.quantity}</span>
        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
      </div>
      <button class="btn btn-secondary" onclick="removeFromCart(${item.id})" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Remove</button>
    </div>
  `).join('');

  document.querySelector('.cart-total span').textContent = `$${getCartTotal().toFixed(2)}`;
  document.querySelector('.cart-total').style.display = 'block';
}

function showNotification(message) {
  // Simple toast
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: var(--green); color: white;
    padding: 1rem 2rem; border-radius: 10px; z-index: 3000; transform: translateX(400px);
    transition: transform 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.style.transform = 'translateX(0)', 100);
  setTimeout(() => {
    toast.style.transform = 'translateX(400px)';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

function openCart() {
  renderCart();
  window.GreenPastures.openModal('cart-modal');
}

function sendOrder() {
  const form = document.getElementById('order-form');
  const formData = new FormData(form);
  const name = formData.get('name');
  const phone = formData.get('phone');
  const location = formData.get('location');

  if (!name || !phone || !location) {
    alert('Please fill all fields');
    return;
  }

  const orderSummary = cart.map(item => `${item.name} x${item.quantity} ($${item.price * item.quantity})`).join('\n');
  const total = getCartTotal();

  // EmailJS template params
  const templateParams = {
    to_email: 'livestockgreenfarmin@gmail.com',
    from_name: name,
    from_phone: phone,
    from_location: location,
    order_items: orderSummary,
    total_amount: `$${total.toFixed(2)}`,
    message: `Order from ${name}. Cart: ${orderSummary}. Total: $${total.toFixed(2)}`
  };

  // Show loading
  const sendBtn = document.getElementById('send-order-btn');
  const originalText = sendBtn.textContent;
  sendBtn.innerHTML = '<span class="loading"></span> Sending...';
  sendBtn.disabled = true;

  emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams) // Replace with your EmailJS service/template IDs
    .then(() => {
      alert('Order sent successfully to seller! Thank you.');
      cart = [];
      localStorage.removeItem('cart');
      window.GreenPastures.updateCartBadge();
      window.GreenPastures.closeModal('order-modal');
    })
    .catch((error) => {
      console.error('EmailJS error:', error);
      alert('Failed to send. Please contact directly.');
    })
    .finally(() => {
      sendBtn.textContent = originalText;
      sendBtn.disabled = false;
    });
}

// Open order modal from cart
document.addEventListener('DOMContentLoaded', () => {
  const orderBtn = document.getElementById('open-order');
  if (orderBtn) {
    orderBtn.addEventListener('click', () => {
      window.GreenPastures.closeModal('cart-modal');
      window.GreenPastures.openModal('order-modal');
    });
  }
  window.GreenPastures.updateCartBadge();
  renderCart();
});

