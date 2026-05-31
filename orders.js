 document.addEventListener("DOMContentLoaded", () => {
      const ordersContainer = document.getElementById("orders-container");
      const orders = JSON.parse(localStorage.getItem("orders")) || [];

      if (orders.length === 0) {
        ordersContainer.innerHTML = `
          <div class="zero-orders-notice">
            <h2>No Orders Found</h2>
            <p style="color: var(--text-muted); font-size: 14px;">You haven't purchased any items yet.</p>
          </div>
        `;
      } else {
        ordersContainer.innerHTML = ""; // Empty container completely

        // Loop execution matches premium modular aesthetic layout panels
        orders.reverse().forEach(order => {
          let productsHTML = "";

          order.items.forEach(item => {
            const quantityText = item.quantity ? `× ${item.quantity}` : '';
            productsHTML += `
              <li class="product-item">
                <span class="product-title">${item.name} <span style="color: var(--text-muted); font-size: 13px; font-weight: 500; margin-left: 4px;">${quantityText}</span></span>
                <span class="product-cost">$${(parseFloat(item.price) * (parseInt(item.quantity) || 1)).toFixed(2)}</span>
              </li>
            `;
          });

          ordersContainer.innerHTML += `
            <div class="order-card">
              
              <div class="order-header">
                <div>
                  <h2 class="customer-name">${order.customer}</h2>
                  <p class="order-date">${order.date}</p>
                </div>
                <div class="meta-right">
                  <span class="status-badge">Processing</span>
                  <p class="payment-method">${order.payment}</p>
                </div>
              </div>

              <div class="delivery-destination">
                <strong>Ship To:</strong>
                <span>${order.address}</span>
              </div>

              <ul class="product-list-wrapper">
                ${productsHTML}
              </ul>

            </div>
          `;
        });
      }
    });