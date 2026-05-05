// Dynamic Products: Filter, Search, Render - Very Interactive

let allProducts = [];

async function loadProducts() {
  try {
    const response = await fetch('../data/products.json');
    allProducts = await response.json();
    renderProducts(allProducts);
  } catch (error) {
    console.error('Failed to load products:', error);
    document.querySelector('.products-grid').innerHTML = '<p>Products loading error. Please refresh.</p>';
  }
}

function renderProducts(products, container = document.querySelector('.products-grid')) {
  if (!container) return;

  container.innerHTML = products.map((product, index) => `
    <div class="product-card" data-category="${product.category.toLowerCase()}" data-price="${product.price}">
      <div class="product-image">
        <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description.substring(0, 100)}...</p>
        <div class="product-price">$${product.price}</div>
        <button class="btn" onclick="viewProduct(${product.id})">View Details</button>
        <br><button class="btn btn-secondary" style="margin-top: 0.5rem; padding: 0.5rem 1rem;" 
                    onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.images[0]}')">
          Add to Cart
        </button>
      </div>
    </div>
  `).join('');

  // Animate cards
  document.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.1}s`;
  });
}

function filterProducts() {
  const category = document.getElementById('category-filter')?.value || '';
  const maxPrice = parseInt(document.getElementById('price-filter')?.value) || 2000;
  const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';

  let filtered = allProducts;

  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  filtered = filtered.filter(p => p.price <= maxPrice);

  if (searchTerm) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.description.toLowerCase().includes(searchTerm)
    );
  }

  renderProducts(filtered);
}

// Search on input
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }

  const filters = document.querySelectorAll('.filter-group select, .filter-group input[type="range"]');
  filters.forEach(filter => filter.addEventListener('change', filterProducts));

  // Featured products on home
  if (document.querySelector('.featured-grid')) {
    const featured = allProducts.slice(0, 6);
    renderProducts(featured, document.querySelector('.featured-grid'));
  }
});

function viewProduct(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

// Expose globals for onclicks
window.addToCart = window.addToCart || addToCart;
window.viewProduct = viewProduct;

