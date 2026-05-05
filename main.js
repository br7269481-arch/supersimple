// GREEN PASTURES LIVESTOCK FARM - Main Interactive Scripts
// User-friendly: Smooth nav, modals, loading, EmailJS setup

// EmailJS config - User: Get free key at emailjs.com, replace below
emailjs.init('YOUR_PUBLIC_KEY'); // TODO: Replace with your EmailJS public key

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const cartBadge = document.getElementById('cart-badge') || document.querySelector('.cart-badge');
const cartBtn = document.querySelector('.cart-btn');

// Mobile menu toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// Cart badge update
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'inline' : 'none';
  }
}

// Modal handlers
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Close modals on outside click
document.querySelectorAll('.cart-modal, .order-modal, .contact-modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal.id);
  });
});

// Product animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = '0.1s';
      entry.target.classList.add('animate');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  document.querySelectorAll('.product-card').forEach(card => observer.observe(card));

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});

// Export for other scripts
window.GreenPastures = {
  updateCartBadge,
  openModal,
  closeModal
};

