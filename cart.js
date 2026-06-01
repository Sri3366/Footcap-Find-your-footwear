const cartItemsContainer = document.getElementById("cart-items");
const totalContainer = document.getElementById("cart-total");
const subtotalContainer = document.getElementById("summary-subtotal");
const checkoutBtn = document.getElementById("checkout-btn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ==========================================================================
   DOM CORE RENDER LOGIC
   ========================================================================== */
function displayCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    //  FIX: Synchronize the empty array to storage immediately
    localStorage.setItem("cart", JSON.stringify([]));

    cartItemsContainer.innerHTML = `
      <div class="empty-cart-state">
        <h2>Your bag is currently empty.</h2>
      </div>
    `;
    totalContainer.innerText = "0.00";
    subtotalContainer.innerText = "0.00";
    return;
  }

  cart.forEach((item, index) => {
    if (!item.quantity) {
      item.quantity = 1;
    }

    const itemSubtotal = Number(item.price) * item.quantity;
    total += itemSubtotal;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-img">
        
        <div class="cart-details">
          <div class="item-meta">
            <h2>${item.name}</h2>
            <div class="item-unit-price">$${Number(item.price).toFixed(2)}</div>
          </div>

          <div class="qty-control-wrapper">
            <button onclick="decreaseQty(${index})" aria-label="Decrease quantity">-</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQty(${index})" aria-label="Increase quantity">+</button>
          </div>

          <div class="item-subtotal-price">
            $${itemSubtotal.toFixed(2)}
          </div>
        </div>

        <button class="remove-action-btn" onclick="removeItem(${index})">
          Remove
        </button>
      </div>
    `;
  });

  // Synchronize memory cache for non-empty carts
  localStorage.setItem("cart", JSON.stringify(cart));
  
  // Set accurate display metrics
  const structuredTotal = total.toFixed(2);
  totalContainer.innerText = structuredTotal;
  subtotalContainer.innerText = structuredTotal;
}

/* ==========================================================================
   MUTATION TRANSACTIONS HANDLERS
   ========================================================================== */
function increaseQty(index) {
  cart[index].quantity++;
  displayCart();
}

function decreaseQty(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  displayCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  displayCart();
}

/* ==========================================================================
   APPLICATION ENTRY CHECKOUT RUNTIME
   ========================================================================== */
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    window.location.href = "checkout.html";
  });
}

// Initial Runtime Command Execution loop
displayCart();