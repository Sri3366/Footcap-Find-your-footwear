'use strict';

const wishlistItemsContainer =
  document.getElementById("wishlist-items");

let wishlist =
  JSON.parse(localStorage.getItem("wishlist")) || [];

/* =========================
   DISPLAY WISHLIST
========================= */

function displayWishlist() {

  if (!wishlistItemsContainer) return;

  // EMPTY WISHLIST

  if (wishlist.length === 0) {

    wishlistItemsContainer.innerHTML = `
      <div class="empty-wishlist">
        <h2>Your Wishlist is Empty</h2>
        <p style="margin-top:10px;">
          Save products you love here.
        </p>

        <a
          href="index.html"
          style="
            display:inline-block;
            margin-top:20px;
            padding:12px 25px;
            background:#111;
            color:#fff;
            border-radius:10px;
          "
        >
          Continue Shopping
        </a>
      </div>
    `;

    updateWishlistCount();

    return;
  }

  let html = "";

  wishlist.forEach((item, index) => {

    html += `
      <div class="wishlist-item">

        <img
          src="${item.image}"
          alt="${item.name}"
          class="wishlist-img"
        >

        <div class="wishlist-details">

          <h2>${item.name}</h2>

          <p>
            ₹${Number(item.price).toLocaleString("en-IN")}
          </p>

        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap;">

          <button
            class="move-cart-btn"
            data-index="${index}"
            style="
              background:#28a745;
              color:white;
              border:none;
              padding:14px 20px;
              border-radius:12px;
              cursor:pointer;
            "
          >
            Move To Cart
          </button>

          <button
            class="remove-btn"
            data-index="${index}"
          >
            Remove
          </button>

        </div>

      </div>
    `;
  });

  wishlistItemsContainer.innerHTML = html;

  updateWishlistCount();
}

/* =========================
   UPDATE COUNT
========================= */

function updateWishlistCount() {

  const title =
    document.querySelector(".wishlist-title");

  if (!title) return;

  title.innerHTML =
    `My Wishlist (${wishlist.length})`;
}

/* =========================
   REMOVE ITEM
========================= */

function removeWishlistItem(index) {

  wishlist.splice(index, 1);

  localStorage.setItem(
    "wishlist",
    JSON.stringify(wishlist)
  );

  displayWishlist();
}

/* =========================
   MOVE TO CART
========================= */

function moveToCart(index) {

  const item = wishlist[index];

  let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = cart.find(
    product => product.name === item.name
  );

  if (existingProduct) {

    existingProduct.quantity =
      (existingProduct.quantity || 1) + 1;

  } else {

    cart.push({
      ...item,
      quantity: 1
    });
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  wishlist.splice(index, 1);

  localStorage.setItem(
    "wishlist",
    JSON.stringify(wishlist)
  );

  displayWishlist();

  showMessage("Moved to Cart");
}

/* =========================
   CLICK EVENTS
========================= */

wishlistItemsContainer?.addEventListener(
  "click",
  (e) => {

    const index =
      Number(e.target.dataset.index);

    if (
      e.target.classList.contains("remove-btn")
    ) {

      removeWishlistItem(index);
    }

    if (
      e.target.classList.contains("move-cart-btn")
    ) {

      moveToCart(index);
    }
  }
);

/* =========================
   STORAGE SYNC
========================= */

window.addEventListener("storage", () => {

  wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

  displayWishlist();
});

/* =========================
   SIMPLE MESSAGE
========================= */

function showMessage(message) {

  const msg = document.createElement("div");

  msg.innerText = message;

  msg.style.position = "fixed";
  msg.style.top = "20px";
  msg.style.right = "20px";
  msg.style.background = "#111";
  msg.style.color = "#fff";
  msg.style.padding = "15px 25px";
  msg.style.borderRadius = "10px";
  msg.style.zIndex = "9999";

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 2500);
}

/* =========================
   INITIAL LOAD
========================= */

displayWishlist();