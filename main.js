const menuCard = document.getElementById("menu-card");

// WhatsApp config (substitua pelo número oficial, apenas dígitos, com DDI/DDD, ex: 5599999999999)
const WHATSAPP_NUMBER = "5571996475834";

// =========================
// ATIVAR/DESATIVAR MODO PROMOÇÃO
// =========================
//
// Altere esta constante para controlar qual modo de promoção está ativo.
// Use: null para nenhum modo (preços originais)
//      "natal", "finalDeSemana", "halloween", "pascoa", "freak" para ativar modos configurados abaixo.
//
const ACTIVE_PROMO_MODE = "freak";
// Exemplo para desativar todas promoções:
// const ACTIVE_PROMO_MODE = null;

// =========================
// CONFIGURAÇÃO DE MODOS DE PROMOÇÃO
// =========================
//
// Aqui você adiciona/edita modos de promoção.
// Cada chave do objeto PROMO_MODES representa um modo diferente.
// Basta incluir um novo modo e usar essa chave em ACTIVE_PROMO_MODE para ativá-lo por código.
//
const PROMO_MODES = {
  natal: {
    label: "Modo Natal",
    bannerMessage: "Modo promoção de Natal ativado (Válido apenas em dezembro)",
    icon: "🎄",
    themeClass: "promo-theme-natal"
  },
  finalDeSemana: {
    label: "Modo Final de Semana",
    bannerMessage: "Modo Final de Semana ativado - descontos especiais!",
    icon: "🎌",
    themeClass: "promo-theme-finalDeSemana"
  },
  halloween: {
    label: "Modo Halloween",
    bannerMessage: "Modo Halloween ativado - noite sombria, preços assustadores!",
    icon: "🎃",
    themeClass: "promo-theme-halloween"
  },
  pascoa: {
    label: "Modo Páscoa",
    bannerMessage: "Modo Páscoa ativado - promoções de outro ovo!",
    icon: "🐣",
    themeClass: "promo-theme-pascoa"
  },
  freak: {
    label: "Modo Freak",
    bannerMessage: "Modo Freak ativado - cardápio insano, preços malucos!",
    icon: "👾",
    themeClass: "promo-theme-freak"
  }
};

// =========================
// TABELA DE PREÇOS POR ITEM
// =========================
//
// Para facilitar manutenção, todos os preços ficam aqui.
// - original: preço normal
// - natal, finalDeSemana, halloween, pascoa, freak: preços quando o modo está ativo
//
// Para criar uma promoção diferente por modo, basta alterar os valores
// correspondentes ao modo desejado.
//
const MENU_PRICES = {
  // Burgers
  "burger-goku": {
    original: 26.9,
    natal: 18.5,
    finalDeSemana: 19.9,
    halloween: 17.9,
    pascoa: 20.9,
    freak: 15.9
  },
  "burger-vegeta": {
    original: 26.9,
    natal: 18.5,
    finalDeSemana: 19.9,
    halloween: 17.9,
    pascoa: 20.9,
    freak: 15.9
  },
  "burger-naruto": {
    original: 19.9,
    natal: 14.5,
    finalDeSemana: 15.9,
    halloween: 13.9,
    pascoa: 16.9,
    freak: 12.5
  },
  "burger-sasuke": {
    original: 19.9,
    natal: 14.5,
    finalDeSemana: 15.9,
    halloween: 13.9,
    pascoa: 16.9,
    freak: 12.5
  },
  "burger-goku-ssj2": {
    original: 33.9,
    natal: 24.9,
    finalDeSemana: 26.9,
    halloween: 23.5,
    pascoa: 27.9,
    freak: 21.0
  },
  "burger-vegeta-ssj2": {
    original: 33.9,
    natal: 24.9,
    finalDeSemana: 26.9,
    halloween: 23.5,
    pascoa: 27.9,
    freak: 21.0
  },

  // Acompanhamentos
  "batata-sayajins": {
    original: 12.9,
    natal: 8.9,
    finalDeSemana: 9.9,
    halloween: 7.5,
    pascoa: 10.5,
    freak: 6.9
  },
  "chips-poder": {
    original: 12.9,
    natal: 8.9,
    finalDeSemana: 9.9,
    halloween: 7.5,
    pascoa: 10.5,
    freak: 6.9
  },

  // Bebidas
  "coca-lata": {
    original: 7.9,
    natal: 5.5,
    finalDeSemana: 6.5,
    halloween: 5.0,
    pascoa: 6.9,
    freak: 4.5
  },
  "guarana-lata": {
    original: 7.9,
    natal: 5.5,
    finalDeSemana: 6.5,
    halloween: 5.0,
    pascoa: 6.9,
    freak: 4.5
  },

  // Combos
  "combo-goku": {
    original: 44.7,
    natal: 29.9,
    finalDeSemana: 32.7,
    halloween: 28.5,
    pascoa: 35.0,
    freak: 25.0
  },
  "combo-vegeta": {
    original: 44.7,
    natal: 29.9,
    finalDeSemana: 32.7,
    halloween: 28.5,
    pascoa: 35.0,
    freak: 25.0
  },
  "combo-casal": {
    original: 89.4,
    natal: 55.0,
    finalDeSemana: 65.0,
    halloween: 59.9,
    pascoa: 69.9,
    freak: 49.9
  },

  // Sobremesas
  "mousse-maracuja": {
    original: 15.9,
    natal: 9.9,
    finalDeSemana: 11.5,
    halloween: 8.9,
    pascoa: 12.5,
    freak: 7.9
  },
  "mousse-chocolate": {
    original: 15.9,
    natal: 9.9,
    finalDeSemana: 11.5,
    halloween: 8.9,
    pascoa: 7.9, // Ovo de páscoa vibe
    freak: 7.9
  },
  "mousse-marido-gelado": {
    original: 15.9,
    natal: 9.9,
    finalDeSemana: 11.5,
    halloween: 8.9,
    pascoa: 12.5,
    freak: 7.9
  }
};

// Aplica o modo de promoção aos preços do cardápio e ao banner
function applyPricingMode(modeKey) {
  const isPromoActive = !!(modeKey && PROMO_MODES[modeKey]);
  const promoBannerEl = document.getElementById("promo-banner");

  // Controla banner de promoção
  if (promoBannerEl) {
    // limpa classes de tema antigos (qualquer classe que começa com "promo-theme-")
    const classesToRemove = [];
    promoBannerEl.classList.forEach((cls) => {
      if (cls.startsWith("promo-theme-")) {
        classesToRemove.push(cls);
      }
    });
    classesToRemove.forEach((cls) => promoBannerEl.classList.remove(cls));

    if (isPromoActive) {
      const modeConfig = PROMO_MODES[modeKey];
      // conteúdo do banner muda junto com o modo
      promoBannerEl.innerHTML = `
        <span class="promo-icon">${modeConfig.icon || "⭐"}</span>
        <strong>${modeConfig.bannerMessage || modeConfig.label}</strong>
      `;
      if (modeConfig.themeClass) {
        promoBannerEl.classList.add(modeConfig.themeClass);
      }
      promoBannerEl.classList.remove("hidden");
    } else {
      promoBannerEl.classList.add("hidden");
    }
  }

  // Marca no body se a promoção está ativa e qual o tema
  if (document.body) {
    // limpa temas anteriores
    Object.keys(PROMO_MODES).forEach(key => {
      document.body.classList.remove(`theme-${key}`);
    });

    if (isPromoActive) {
      document.body.classList.add("promo-active");
      document.body.classList.add(`theme-${modeKey}`);
    } else {
      document.body.classList.remove("promo-active");
    }
  }

  const items = document.querySelectorAll(".menu-item[data-item-id]");

  items.forEach((itemEl) => {
    const itemId = itemEl.getAttribute("data-item-id");
    if (!itemId || !MENU_PRICES[itemId]) return;

    const config = MENU_PRICES[itemId];

    // preço base é sempre o original
    const originalPrice = config.original;

    // preço atual depende do modo de promoção
    let activePrice = originalPrice;
    if (isPromoActive && typeof config[modeKey] === "number") {
      activePrice = config[modeKey];
    }

    // Atualiza atributo de preço usado para adicionar ao carrinho
    itemEl.setAttribute("data-item-price", activePrice.toString().replace(".", ","));

    // Atualiza textos de preço exibidos
    const originalSpan = itemEl.querySelector(".item-price-original");
    const promoSpan = itemEl.querySelector(".item-price-promo");

    if (originalSpan) {
      originalSpan.textContent = formatCurrency(originalPrice);
    }
    if (promoSpan) {
      promoSpan.textContent = formatCurrency(activePrice);
    }
  });
}

// CARRINHO

const cartPanelContainer = document.getElementById("cart-panel-container");
const cartFloatingToggle = document.getElementById("cart-floating-toggle");
const cartFloatingCountEl = document.getElementById("cart-floating-count");
const headerCartToggle = document.getElementById("header-cart-toggle");
const headerCartCountEl = document.getElementById("header-cart-count");
const cartCloseBtn = document.getElementById("cart-close-mobile-btn"); // Close button for the modal

const cartPanel = document.getElementById("cart-panel");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart-btn");
const checkoutBtn = document.getElementById("checkout-btn");

let cart = [];

// helper para descrever customização de forma clara para cozinha
function describeCustomization(item) {
  if (!item.customization) return "";
  const c = item.customization;
  const parts = [];

  if (c.burger) parts.push(`Burger: ${c.burger}`);
  if (c.batata) parts.push(`Batata: ${c.batata}`);
  if (c.refri) parts.push(`Refri: ${c.refri}`);

  if (Array.isArray(c.burgers) && c.burgers.length) {
    parts.push(`Burgers: ${c.burgers.join(" + ")}`);
  }
  if (Array.isArray(c.batatas) && c.batatas.length) {
    parts.push(`Batatas: ${c.batatas.join(" + ")}`);
  }
  const refris = [c.refri1, c.refri2].filter(Boolean);
  if (refris.length) {
    parts.push(`Refris: ${refris.join(" + ")}`);
  }

  if (!parts.length) return "";
  return parts.map((p) => `   • ${p}`).join("\n");
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// aplica preços de acordo com o modo selecionado ANTES de qualquer interação
applyPricingMode(ACTIVE_PROMO_MODE);

function addToCart(itemId, name, price, customization = null) {
  const existing = cart.find((i) => i.id === itemId && JSON.stringify(i.customization) === JSON.stringify(customization));
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: itemId, name, price, qty: 1, customization });
  }
  renderCart();
}

function removeFromCart(itemId) {
  cart = cart.filter((i) => i.id !== itemId);
  renderCart();
}

function removeFromCartByIndex(index) {
  cart.splice(index, 1);
  renderCart();
}

function changeQty(itemId, delta) {
  const item = cart.find((i) => i.id === itemId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(itemId);
  } else {
    renderCart();
  }
}

function changeQtyByIndex(index, delta) {
  if (index < 0 || index >= cart.length) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    removeFromCartByIndex(index);
  } else {
    renderCart();
  }
}

function clearCart() {
  cart = [];
  renderCart();
  closeCartPanel(); // Close cart sheet if open after clearing
  // Ensure floating toggle hides immediately if it was visible
  if (cartFloatingToggle) {
    cartFloatingToggle.classList.add('hidden');
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}


function renderCart() {
  cartItemsContainer.innerHTML = "";

  const itemCount = getCartItemCount();
  const total = getCartTotal();

  // Update Floating count
  if (cartFloatingCountEl) cartFloatingCountEl.textContent = itemCount;

  // Update Header count
  if (headerCartCountEl) headerCartCountEl.textContent = itemCount;

  // Manage Floating Toggle visibility
  if (cartFloatingToggle) {
    if (itemCount > 0) {
      cartFloatingToggle.classList.remove('hidden');
      cartFloatingToggle.style.opacity = '';
      cartFloatingToggle.style.pointerEvents = '';
    } else {
      cartFloatingToggle.classList.add('hidden');
    }
  }


  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="cart-empty">Seu carrinho está vazio. Adicione itens do cardápio.</p>';
  } else {
    cart.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "cart-item-row";
      let customizationText = "";
      if (item.customization) {
        const parts = [];
        if (item.customization.burger) parts.push(`Burger: ${item.customization.burger}`);
        if (item.customization.batata) parts.push(`Batata: ${item.customization.batata}`);
        if (item.customization.refri) parts.push(`Refri: ${item.customization.refri}`);
        if (item.customization.burgers) parts.push(`Burgers: ${item.customization.burgers.join(" + ")}`);
        if (item.customization.batatas) parts.push(`Batatas: ${item.customization.batatas.join(" + ")}`);
        if (item.customization.refri1 || item.customization.refri2) {
          const refris = [item.customization.refri1, item.customization.refri2].filter(Boolean);
          if (refris.length) parts.push(`Refris: ${refris.join(" + ")}`);
        }
        if (parts.length > 0) customizationText = `<div class="cart-item-custom">${parts.join(", ")}</div>`;
      }
      row.innerHTML = `
        <div class="cart-item-main">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-line-price">${formatCurrency(
        item.price * item.qty
      )}</span>
        </div>
        ${customizationText}
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="dec" data-id="${item.id}" data-index="${index}">-</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}" data-index="${index}">+</button>
          <button class="remove-btn" data-action="remove" data-id="${item.id}" data-index="${index}">&times;</button>
        </div>
      `;
      cartItemsContainer.appendChild(row);
    });
  }

  cartTotalEl.textContent = formatCurrency(total);
  checkoutBtn.disabled = cart.length === 0;
}

function setupCartEvents() {
  const addButtons = document.querySelectorAll(".add-to-cart-btn");
  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const li = btn.closest(".menu-item");
      if (!li) return;
      const id = li.getAttribute("data-item-id");
      const name = li.getAttribute("data-item-name");
      const priceStr = li.getAttribute("data-item-price");
      const price = parseFloat(priceStr.replace(",", "."));
      if (!id || !name || isNaN(price)) return;

      if (id === "combo-goku" || id === "combo-vegeta" || id === "combo-casal") {
        openComboCustomizationModal(id, name, price);
      } else {
        addToCart(id, name, price);
      }
    });
  });

  cartItemsContainer.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.getAttribute("data-action");
    const id = target.getAttribute("data-id");
    const index = target.getAttribute("data-index");
    if (!action || !id) return;

    if (action === "inc") {
      changeQtyByIndex(parseInt(index), 1);
    } else if (action === "dec") {
      changeQtyByIndex(parseInt(index), -1);
    } else if (action === "remove") {
      removeFromCartByIndex(parseInt(index));
    }
  });

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (cart.length === 0) return;
      clearCart();
    });
  }

  // Floating Cart Toggle Handler
  if (cartFloatingToggle) {
    cartFloatingToggle.addEventListener('click', openCartPanel);
  }

  // Header Cart Toggle Handler (Fixed Top Right)
  if (headerCartToggle) {
    headerCartToggle.addEventListener('click', openCartPanel);
  }

  // Close cart panel when clicking on the dark backdrop (outside the cart)
  if (cartPanelContainer) {
    cartPanelContainer.addEventListener('click', (e) => {
      if (e.target === cartPanelContainer) {
        closeCartPanel();
      }
    });
  }
}

// Cart Panel Modal Visibility Control (Generalized)
function openCartPanel() {
  if (cart.length === 0) return; // Prevent opening if empty

  if (cartPanelContainer) {
    cartPanelContainer.classList.add('open');
    // Temporarily hide the floating button while the cart modal is open
    if (cartFloatingToggle) {
      cartFloatingToggle.style.opacity = '0';
      cartFloatingToggle.style.pointerEvents = 'none';
    }
  }
}

function closeCartPanel() {
  if (cartPanelContainer) {
    cartPanelContainer.classList.remove('open');
    // Restore floating button visibility
    if (cartFloatingToggle) {
      // Restore visibility via CSS class/opacity, not display, for smooth transition
      if (getCartItemCount() > 0) {
        cartFloatingToggle.style.opacity = '1';
        cartFloatingToggle.style.pointerEvents = 'auto';
      }
    }
  }
}


// CHECKOUT / WHATSAPP

const checkoutModal = document.getElementById("checkout-modal");
const checkoutCloseBtn = document.getElementById("checkout-close-btn");
const checkoutForm = document.getElementById("checkout-form");
const orderSummaryEl = document.getElementById("order-summary");
const deliveryAddressGroup = document.getElementById("delivery-address-group");
const pickupInfo = document.getElementById("pickup-info");

function openCheckoutModal() {
  if (!checkoutModal) return;
  closeCartPanel(); // Close the cart panel when opening checkout form
  const checkoutErrorEl = document.getElementById("checkout-error");
  if (checkoutErrorEl) checkoutErrorEl.textContent = "";

  // limpa estados de erro sempre que abrir o modal
  const errorFields = checkoutModal.querySelectorAll(".field-error");
  errorFields.forEach((el) => el.classList.remove("field-error"));

  updateOrderSummary();
  checkoutModal.classList.add("open");
}

function closeCheckoutModal() {
  if (!checkoutModal) return;
  checkoutModal.classList.remove("open");
}

function updateOrderSummary() {
  if (!orderSummaryEl) return;
  if (cart.length === 0) {
    orderSummaryEl.innerHTML = "<p>Seu carrinho está vazio.</p>";
    return;
  }

  const lines = cart
    .map((item) => {
      const priceHtml = `<span class="order-item-price">${formatCurrency(item.price)}</span>`;
      const base = `${item.qty}x ${item.name} (${priceHtml} un)`;
      const custom = describeCustomization(item);
      if (!custom) return base;
      // converte as quebras de linha em <br> para exibir no resumo
      const customHtml = custom.split("\n").join("<br>");
      return `${base}<br>${customHtml}`;
    })
    .join("<br><br>");

  const totalPromo = getCartTotal();

  // calcula total original (sem promo) com base na tabela MENU_PRICES
  let totalOriginal = 0;
  cart.forEach((item) => {
    const priceConfig = MENU_PRICES[item.id];
    if (priceConfig && typeof priceConfig.original === "number") {
      totalOriginal += priceConfig.original * item.qty;
    } else {
      // fallback: se não tiver config, usa o próprio preço do carrinho
      totalOriginal += item.price * item.qty;
    }
  });

  const savings = Math.max(0, totalOriginal - totalPromo);

  orderSummaryEl.innerHTML = `
    <h3>Resumo do pedido</h3>
    <p>${lines}</p>
    <div class="order-summary-totals">
      <div class="order-total-original">
        <span>Subtotal sem promoção:</span>
        <strong>${formatCurrency(totalOriginal)}</strong>
      </div>
      <div class="order-total-pay">
        <span>Você vai pagar:</span>
        <strong>${formatCurrency(totalPromo)}</strong>
      </div>
      <div class="order-total-savings">
        <span>Você economizou:</span>
        <strong>${formatCurrency(savings)}</strong>
      </div>
    </div>
  `;
}

function setupCheckoutEvents() {
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) return;
      openCheckoutModal();
    });
  }

  if (checkoutCloseBtn) {
    checkoutCloseBtn.addEventListener("click", closeCheckoutModal);
  }

  if (checkoutModal) {
    checkoutModal.addEventListener("click", (e) => {
      if (e.target === checkoutModal) {
        closeCheckoutModal();
      }
    });
  }

  // Cart Close Event (Using the renamed variable)
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', closeCartPanel);
  }


  const orderTypeInputs = document.querySelectorAll(
    'input[name="orderType"]'
  );
  orderTypeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const value = input.value;
      if (value === "entrega") {
        deliveryAddressGroup?.classList.add("visible");
        pickupInfo?.classList.remove("visible");
      } else {
        deliveryAddressGroup?.classList.remove("visible");
        pickupInfo?.classList.add("visible");
      }
    });
  });

  if (pickupInfo) {
    pickupInfo.classList.add("visible");
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (cart.length === 0) return;

      const checkoutErrorEl = document.getElementById("checkout-error");
      if (checkoutErrorEl) checkoutErrorEl.textContent = "";

      // limpa erros visuais anteriores
      const errorFields = checkoutForm.querySelectorAll(".field-error");
      errorFields.forEach((el) => el.classList.remove("field-error"));

      const formData = new FormData(checkoutForm);
      const orderType = formData.get("orderType") || "retirada";
      const name = (formData.get("customerName") || "").toString().trim();
      const address = (formData.get("customerAddress") || "")
        .toString()
        .trim();
      const payment = (formData.get("paymentType") || "")
        .toString()
        .trim();

      const nameInput = document.getElementById("customer-name");
      const addressTextarea = document.getElementById("customer-address");
      const paymentSelect = document.getElementById("payment-type");

      let hasError = false;

      if (!name) {
        hasError = true;
        if (nameInput) {
          nameInput.classList.add("field-error");
          nameInput.closest(".form-group")?.classList.add("field-error");
        }
      }

      if (!payment) {
        hasError = true;
        if (paymentSelect) {
          paymentSelect.classList.add("field-error");
          paymentSelect.closest(".form-group")?.classList.add("field-error");
        }
      }

      if (orderType === "entrega" && !address) {
        hasError = true;
        if (addressTextarea) {
          addressTextarea.classList.add("field-error");
          addressTextarea.closest(".form-group")?.classList.add("field-error");
        }
      }

      if (hasError) {
        if (checkoutErrorEl) {
          checkoutErrorEl.textContent =
            orderType === "entrega"
              ? "Preencha os campos em vermelho (nome, endereço e forma de pagamento) para continuar."
              : "Preencha os campos em vermelho (nome e forma de pagamento) para continuar.";
        }
        return;
      }

      const itemsText = cart
        .map((item) => {
          const base = `- ${item.qty}x ${item.name} (${formatCurrency(item.price)} un)`;
          const custom = describeCustomization(item);
          return custom ? `${base}\n${custom}` : base;
        })
        .join("\n\n");

      const totalText = formatCurrency(getCartTotal());

      let message = `*Novo pedido - Burger e Otakus*\n\n`;
      message += `*ITENS DO PEDIDO (COZINHA)*\n`;
      message += `${itemsText}\n\n`;
      message += `*TOTAL A COBRAR:* ${totalText}\n\n`;
      message += `*Tipo de pedido:* ${orderType === "entrega" ? "Entrega" : "Retirada"
        }\n`;
      message += `*Nome:* ${name}\n`;
      if (orderType === "entrega") {
        message += `*Endereço:* ${address}\n`;
      } else {
        message += `*Retirada na loja*\n`;
      }
      message += `*Pagamento:* ${payment}\n`;

      const encoded = encodeURIComponent(message);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

      window.open(url, "_blank");

      closeCheckoutModal();
    });
  }
}

// COMBO CUSTOMIZATION MODAL

const comboModal = document.getElementById("combo-customization-modal");
const comboModalClose = document.getElementById("combo-modal-close");

function openComboCustomizationModal(comboId, comboName, comboPrice) {
  if (!comboModal) return;

  const modalContent = document.getElementById("combo-modal-content");
  if (!modalContent) return;

  let html = "";

  if (comboId === "combo-goku") {
    html = `
      <h3>Personalizar ${comboName}</h3>
      <div id="combo-error" class="error-message"></div>
      <div class="combo-form">
        <div class="form-group">
          <label>Escolha o tipo de batata:</label>
          <select id="combo-batata-select" required>
            <option value="">Selecione...</option>
            <option value="Batata Sayajins">Batata Sayajins</option>
            <option value="Chips do Poder">Chips do Poder</option>
          </select>
        </div>
        <div class="form-group">
          <label>Escolha o refri:</label>
          <select id="combo-refri-select" required>
            <option value="">Selecione...</option>
            <option value="Coca-Cola">Coca-Cola</option>
            <option value="Guaraná">Guaraná</option>
          </select>
        </div>
        <button class="combo-confirm-btn" data-combo-id="${comboId}" data-combo-name="${comboName}" data-combo-price="${comboPrice}">Adicionar ao Carrinho</button>
      </div>
    `;
  } else if (comboId === "combo-vegeta") {
    html = `
      <h3>Personalizar ${comboName}</h3>
      <div id="combo-error" class="error-message"></div>
      <div class="combo-form">
        <div class="form-group">
          <label>Escolha o tipo de batata:</label>
          <select id="combo-batata-select" required>
            <option value="">Selecione...</option>
            <option value="Batata Sayajins">Batata Sayajins</option>
            <option value="Chips do Poder">Chips do Poder</option>
          </select>
        </div>
        <div class="form-group">
          <label>Escolha o refri:</label>
          <select id="combo-refri-select" required>
            <option value="">Selecione...</option>
            <option value="Coca-Cola">Coca-Cola</option>
            <option value="Guaraná">Guaraná</option>
          </select>
        </div>
        <button class="combo-confirm-btn" data-combo-id="${comboId}" data-combo-name="${comboName}" data-combo-price="${comboPrice}">Adicionar ao Carrinho</button>
      </div>
    `;
  } else if (comboId === "combo-casal") {
    html = `
      <h3>Personalizar ${comboName}</h3>
      <div id="combo-error" class="error-message"></div>
      <div class="combo-form">
        <div class="form-group">
          <label>Escolha 2 burgers:</label>
          <div class="burger-select-group">
            <select id="combo-burger1-select" required>
              <option value="">Selecione o 1º burger...</option>
              <option value="Burger do Goku">Burger do Goku</option>
              <option value="Burger do Vegeta">Burger do Vegeta</option>
            </select>
            <select id="combo-burger2-select" required>
              <option value="">Selecione o 2º burger...</option>
              <option value="Burger do Goku">Burger do Goku</option>
              <option value="Burger do Vegeta">Burger do Vegeta</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Escolha 2 batatas:</label>
          <div class="burger-select-group">
            <select id="combo-batata1-select" required>
              <option value="">Selecione a 1ª batata...</option>
              <option value="Batata Sayajins">Batata Sayajins</option>
              <option value="Chips do Poder">Chips do Poder</option>
            </select>
            <select id="combo-batata2-select" required>
              <option value="">Selecione a 2ª batata...</option>
              <option value="Batata Sayajins">Batata Sayajins</option>
              <option value="Chips do Poder">Chips do Poder</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Escolha 2 refris:</label>
          <div class="burger-select-group">
            <select id="combo-refri1-select" required>
              <option value="">Selecione o 1º refri...</option>
              <option value="Coca-Cola">Coca-Cola</option>
              <option value="Guaraná">Guaraná</option>
            </select>
            <select id="combo-refri2-select" required>
              <option value="">Selecione o 2º refri...</option>
              <option value="Coca-Cola">Coca-Cola</option>
              <option value="Guaraná">Guaraná</option>
            </select>
          </div>
        </div>
        <button class="combo-confirm-btn" data-combo-id="${comboId}" data-combo-name="${comboName}" data-combo-price="${comboPrice}">Adicionar ao Carrinho</button>
      </div>
    `;
  }

  modalContent.innerHTML = html;
  comboModal.classList.add("open");

  const confirmBtn = document.querySelector(".combo-confirm-btn");
  confirmBtn.addEventListener("click", () => {
    const comboErrorEl = document.getElementById("combo-error");
    if (comboErrorEl) comboErrorEl.textContent = "";

    // limpa erros visuais anteriores
    const comboForm = document.querySelector("#combo-modal-content .combo-form");
    if (comboForm) {
      const errorFields = comboForm.querySelectorAll(".field-error");
      errorFields.forEach((el) => el.classList.remove("field-error"));
    }

    let customization = null;

    if (comboId === "combo-goku" || comboId === "combo-vegeta") {
      const batataSelect = document.getElementById("combo-batata-select");
      const refriSelect = document.getElementById("combo-refri-select");
      const batata = batataSelect?.value || "";
      const refri = refriSelect?.value || "";

      let hasError = false;

      if (!batata && batataSelect) {
        hasError = true;
        batataSelect.classList.add("field-error");
        batataSelect.closest(".form-group")?.classList.add("field-error");
      }
      if (!refri && refriSelect) {
        hasError = true;
        refriSelect.classList.add("field-error");
        refriSelect.closest(".form-group")?.classList.add("field-error");
      }

      if (hasError) {
        if (comboErrorEl) {
          comboErrorEl.textContent =
            "Preencha os campos em vermelho para montar o combo.";
        }
        return;
      }

      customization = { batata, refri };
    } else if (comboId === "combo-casal") {
      const burger1Select = document.getElementById("combo-burger1-select");
      const burger2Select = document.getElementById("combo-burger2-select");
      const batata1Select = document.getElementById("combo-batata1-select");
      const batata2Select = document.getElementById("combo-batata2-select");
      const refri1Select = document.getElementById("combo-refri1-select");
      const refri2Select = document.getElementById("combo-refri2-select");

      const burger1 = burger1Select?.value || "";
      const burger2 = burger2Select?.value || "";
      const batata1 = batata1Select?.value || "";
      const batata2 = batata2Select?.value || "";
      const refri1 = refri1Select?.value || "";
      const refri2 = refri2Select?.value || "";

      let hasError = false;

      const markIfEmpty = (selectEl) => {
        if (!selectEl) return false;
        if (!selectEl.value) {
          selectEl.classList.add("field-error");
          selectEl.closest(".form-group")?.classList.add("field-error");
          return true;
        }
        return false;
      };

      hasError =
        markIfEmpty(burger1Select) ||
        markIfEmpty(burger2Select) ||
        markIfEmpty(batata1Select) ||
        markIfEmpty(batata2Select) ||
        markIfEmpty(refri1Select) ||
        markIfEmpty(refri2Select);

      if (hasError) {
        if (comboErrorEl) {
          comboErrorEl.textContent =
            "Preencha todas as escolhas em vermelho: 2 burgers, 2 batatas e 2 refrigerantes.";
        }
        return;
      }

      customization = {
        burgers: [burger1, burger2],
        batatas: [batata1, batata2],
        refri1,
        refri2
      };
    }

    addToCart(comboId, comboName, comboPrice, customization);
    closeComboCustomizationModal();
  });
}

function closeComboCustomizationModal() {
  if (comboModal) {
    comboModal.classList.remove("open");
  }
}

// Inicialização
setupCartEvents();
setupCheckoutEvents();
renderCart();

if (comboModalClose) {
  comboModalClose.addEventListener("click", closeComboCustomizationModal);
}

if (comboModal) {
  comboModal.addEventListener("click", (e) => {
    if (e.target === comboModal) {
      closeComboCustomizationModal();
    }
  });
}

/* ==== INICIALIZAÇÃO DO EFEITO NATALINO ==== */

function initChristmasEffects() {
  createSnowEffect();
  createSnowmanHelper();
}

function createSnowEffect() {
  const snowContainer = document.createElement("div");
  snowContainer.className = "snow-container";

  const flakesCount = 40;
  for (let i = 0; i < flakesCount; i++) {
    const flake = document.createElement("span");
    flake.className = "snowflake";
    flake.textContent = "❄";
    flake.style.left = Math.random() * 100 + "%";
    const delay = Math.random() * 8;
    const duration = 6 + Math.random() * 8;
    flake.style.animationDuration = `${duration}s`;
    flake.style.animationDelay = `${delay}s`;
    const size = 0.7 + Math.random() * 0.9;
    flake.style.fontSize = `${size}rem`;
    snowContainer.appendChild(flake);
  }

  document.body.appendChild(snowContainer);
}

function createSnowmanHelper() {
  const helper = document.createElement("div");
  helper.className = "snowman-helper";
  helper.innerHTML = `
    <span class="snowman-helper-icon">⛄</span>
    <div class="snowman-helper-text">
      Modo Natal ativo!<br/>
      Aproveite os descontos lendários de fim de ano.
    </div>
  `;

  document.body.appendChild(helper);

  // permanece alguns segundos, depois some suavemente
  setTimeout(() => {
    helper.style.animation = "snowman-exit 0.5s ease-in forwards";
    setTimeout(() => {
      if (helper.parentNode) {
        helper.parentNode.removeChild(helper);
      }
    }, 550);
  }, 6500);
}

// dispara efeitos natalinos após tudo estar pronto
initChristmasEffects();
