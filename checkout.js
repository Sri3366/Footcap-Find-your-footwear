 // Real-time Fluid Aesthetic Theme Switch Handler
  function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('themeBtn');
    body.classList.toggle('dark-mode');
    
    if(body.classList.contains('dark-mode')) {
      btn.innerText = "Light Display";
    } else {
      btn.innerText = "Dark Display";
    }
  }

  // ==========================================================================
  // NEW WORKER LOGIC: DYNAMIC CART RENDER ENGINE
  // ==========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    const itemsListContainer = document.getElementById("checkout-items-list");
    const subtotalText = document.getElementById("subtotal-val");
    const surchargeText = document.getElementById("surcharge-val");
    const totalText = document.getElementById("total-val");

    // Fetch live local storage arrays
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (cartItems.length === 0) {
      itemsListContainer.innerHTML = `<div class="empty-checkout-notice">Your shopping cart is empty.</div>`;
      subtotalText.innerText = "0.00";
      surchargeText.innerText = "0.00";
      totalText.innerText = "0.00";
      return;
    }

    let calculatedSubtotal = 0;
    itemsListContainer.innerHTML = ""; // Wipe existing hardcoded template item

    // Generate elements dynamically matching image_4a2fbe.png clean visual frames
    cartItems.forEach(item => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 1;
      const itemRowPrice = itemPrice * itemQuantity;
      calculatedSubtotal += itemRowPrice;

      const itemCard = document.createElement("div");
      itemCard.className = "item-preview";
      itemCard.innerHTML = `
        <img class="item-image" src="${item.image || 'https://via.placeholder.com/70'}" alt="${item.name || 'Sneaker'}">
        <div class="item-details">
          <div class="item-name">${item.name || 'Footcap Footwear'}</div>
          <div class="item-meta">Qty: ${itemQuantity} ${item.size ? '| Size: ' + item.size : ''}</div>
        </div>
        <div class="item-price">$${itemRowPrice.toFixed(2)}</div>
      `;
      itemsListContainer.appendChild(itemCard);
    });

    // Handle premium math calculations
    const flatTaxSurcharge = calculatedSubtotal > 0 ? 12.50 : 0.00;
    const finalGrandTotal = calculatedSubtotal + flatTaxSurcharge;

    // Apply values inside DOM elements
    subtotalText.innerText = calculatedSubtotal.toFixed(2);
    surchargeText.innerText = flatTaxSurcharge.toFixed(2);
    totalText.innerText = finalGrandTotal.toFixed(2);
  });

  // ==========================================================================
  // TRANSACTION SUBMISSION CONTROLLER
  // ==========================================================================
  const form = document.getElementById("checkout-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const order = {
      customer: document.getElementById("fullname").value,
      address: document.getElementById("address").value,
      phone: document.getElementById("phone").value,
      payment: document.getElementById("payment").value,
      items: JSON.parse(localStorage.getItem("cart")) || [],
      date: new Date().toLocaleString()
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart");
    alert("Order Placed Successfully!");
    window.location.href = "order-success.html";
  });