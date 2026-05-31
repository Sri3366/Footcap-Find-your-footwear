'use strict';

/* =========================
   LOCAL STORAGE & STATE
========================= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let currentQuickProduct = null;

// Initial state load
document.addEventListener("DOMContentLoaded", () => {
  updateCounts();
});

window.addEventListener("storage", () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  updateCounts();
});

/* =========================
   NAVBAR TOGGLE
========================= */
const navbar = document.querySelector("[data-navbar]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const overlay = document.querySelector("[data-overlay]");

function openNavbar() {
  navbar?.classList.add("active");
  overlay?.classList.add("active");
  document.body.classList.add("active");
}

function closeNavbar() {
  navbar?.classList.remove("active");
  overlay?.classList.remove("active");
  document.body.classList.remove("active");
}

navOpenBtn?.addEventListener("click", openNavbar);
navCloseBtn?.addEventListener("click", closeNavbar);
overlay?.addEventListener("click", closeNavbar);

/* =========================
   HEADER ACTIVE ON SCROLL
========================= */
const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", () => {
  if (window.scrollY >= 80) {
    header?.classList.add("active");
    goTopBtn?.classList.add("active");
  } else {
    header?.classList.remove("active");
    goTopBtn?.classList.remove("active");
  }
});

/* =========================
   PRODUCT FILTER
========================= */
const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");

    const filterValue = btn.innerText.toLowerCase();
    const products = document.querySelectorAll(".product-item");

    products.forEach((productItem) => {
      const productCard = productItem.querySelector(".product-card");
      const brand = productCard?.dataset.brand?.toLowerCase();

      if (filterValue === "all" || filterValue === "reset" || brand === filterValue) {
        productItem.style.display = "block";
      } else {
        productItem.style.display = "none";
      }
    });
  });
});

/* =========================
   UPDATE COUNTS
========================= */
function updateCounts() {
  const cartCount = document.querySelectorAll(".cart-count");
  const totalCartQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  cartCount.forEach((item) => item.innerText = totalCartQty);

  const wishlistCount = document.querySelectorAll(".wishlist-count");
  wishlistCount.forEach((item) => item.innerText = wishlist.length);
}

/* =========================
   ADD TO CART
========================= */
const cartButtons = document.querySelectorAll(".add-cart");

cartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const productCard = button.closest(".product-card");
    if (!productCard) return;

    const product = {
      name: productCard.dataset.name,
      price: Number(productCard.dataset.price),
      image: productCard.dataset.image,
      quantity: 1
    };

    executeAddToCart(product);
  });
});

function executeAddToCart(product) {
  const existingProduct = cart.find((item) => item.name === product.name);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCounts();
  showToast("Added to Cart");
}

/* =========================
   ADD TO WISHLIST
========================= */
const wishlistButtons = document.querySelectorAll(".add-wishlist");

wishlistButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const productCard = button.closest(".product-card");
    if (!productCard) return;

    const product = {
      name: productCard.dataset.name,
      price: productCard.dataset.price,
      image: productCard.dataset.image,
      quantity: 1
    };

    const exists = wishlist.find(item => item.name === product.name);

    if (!exists) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      updateCounts();
      showToast("Added to Wishlist");
    } else {
      showToast("Already in Wishlist");
    }
  });
});

/* =========================
   NAVIGATION BUTTONS
========================= */
document.getElementById("cart-btn")?.addEventListener("click", () => {
  window.location.href = "cart.html";
});

document.getElementById("wishlist-btn")?.addEventListener("click", () => {
  window.location.href = "wishlist.html";
});

/* =========================
   QUICK VIEW MODAL
========================= */
const modal = document.getElementById("quick-view-modal");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalPrice = document.getElementById("modal-price");
const modalCartBtn = document.getElementById("modal-cart-btn");

document.querySelectorAll('.card-action-btn ion-icon[name="eye-outline"]').forEach(icon => {
  icon.parentElement.addEventListener("click", () => {
    const card = icon.closest(".product-card");
    if (!card) return;

    // Save contextual state so inner modal actions can target this item
    currentQuickProduct = {
      name: card.dataset.name,
      price: Number(card.dataset.price),
      image: card.dataset.image,
      quantity: 1
    };

    if (modalImage) modalImage.src = card.dataset.image || "";
    if (modalName) modalName.innerText = card.dataset.name || "";
    if (modalPrice) modalPrice.innerText = "$" + card.dataset.price;

    if (modal) modal.style.display = "flex";
  });
});

// Structural action button bound inside the Quick view popup
modalCartBtn?.addEventListener("click", () => {
  if (currentQuickProduct) {
    executeAddToCart(currentQuickProduct);
    if (modal) modal.style.display = "none";
  }
});

document.querySelector(".close-modal")?.addEventListener("click", () => {
  if (modal) modal.style.display = "none";
});

/* =========================
   REVIEW MODAL
========================= */
const reviewModal = document.getElementById("review-modal");
const reviewProductName = document.getElementById("review-product-name");
const reviewTextarea = document.getElementById("review-text");

document.querySelectorAll(".review-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = btn.closest(".product-card");
    if (product && reviewProductName) {
      reviewProductName.innerText = product.dataset.name || "";
    }
    if (reviewTextarea) reviewTextarea.value = ""; 
    if (reviewModal) reviewModal.style.display = "flex";
  });
});

document.getElementById("close-review")?.addEventListener("click", () => {
  if (reviewModal) reviewModal.style.display = "none";
});

document.getElementById("submit-review")?.addEventListener("click", () => {
  if (!reviewTextarea) return;

  const review = reviewTextarea.value.trim();

  if (review === "") {
    alert("Write a review first");
    return;
  }

  alert("Review Submitted");
  if (reviewModal) reviewModal.style.display = "none";
});

// Unified Background Close click handlers
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
  if (e.target === reviewModal) reviewModal.style.display = "none";
});

/* =========================
   COMPARE PRODUCTS
========================= */
const compareButtons = document.querySelectorAll('.card-action-btn ion-icon[name="repeat-outline"]');

compareButtons.forEach((icon) => {
  icon.parentElement.addEventListener("click", () => {
    const productCard = icon.closest(".product-card");
    const productName = productCard?.querySelector(".card-title a")?.innerText || "Product";
    alert(`${productName} added for comparison`);
  });
});

/* =========================
   NEWSLETTER FORM
========================= */
const newsletterForm = document.querySelector(".newsletter-form");

newsletterForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const emailInput = newsletterForm.querySelector(".newsletter-input");

  if (!emailInput || emailInput.value.trim() === "") {
    alert("Please enter your email");
    return;
  }

  showToast("Subscribed Successfully!");
  emailInput.value = "";
});

/* =========================
   SMOOTH SCROLL
========================= */
const links = document.querySelectorAll('a[href^="#"]');

links.forEach((link) => {
  link.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");

    if (targetId.length > 1) {
      e.preventDefault();
      const target = document.querySelector(targetId);
      target?.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* =========================
   PRODUCT SEARCH Engine Logic
========================= */
const searchInput = document.getElementById("search-input");
// Target the button inside the search box wrapper dynamically
const searchBtn = document.querySelector(".search-box .nav-action-btn");

const executeSearch = () => {
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.toLowerCase().trim();
  const productItems = document.querySelectorAll(".product-item");

  productItems.forEach(item => {
    const productCard = item.querySelector(".product-card");
    if (!productCard) return;

    // Read the metadata directly from the data attributes
    const productName = productCard.dataset.name ? productCard.dataset.name.toLowerCase() : "";
    const brandName = productCard.dataset.brand ? productCard.dataset.brand.toLowerCase() : "";

    // If matches search term, show the product item, otherwise hide it
    if (productName.includes(searchTerm) || brandName.includes(searchTerm)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
};

// Fire search on every keystroke
if (searchInput) searchInput.addEventListener("keyup", executeSearch);
// Fire search when clicking the magnifying glass button
if (searchBtn) searchBtn.addEventListener("click", executeSearch);

/* =========================
   RESET PRODUCTS
========================= */
const resetBtn = document.getElementById("reset-products");

resetBtn?.addEventListener("click", () => {
  document.querySelectorAll(".product-item").forEach((item) => {
    item.style.display = "block";
  });
  showToast("Products Reset");
});

/* =========================
   DARK MODE THEME
========================= */
const darkBtn = document.getElementById("dark-mode-btn");

if (darkBtn) {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    darkBtn.innerHTML = "☀️";
  }

  darkBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      darkBtn.innerHTML = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      darkBtn.innerHTML = "🌙";
    }
  });
}

/* =========================
   TOAST NOTIFICATION SYSTEM
========================= */
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}