class InlineCartManager {
  constructor(orderManager) {
    this.orderManager = orderManager;
    this.inlineCart = document.getElementById('inline-cart');
    this.inlineCartItems = document.getElementById('inline-cart-items');
    this.inlineCartCount = document.getElementById('inline-cart-count');
    this.inlineCartTotal = document.getElementById('inline-cart-total');
    this.clearCartButton = document.getElementById('inline-cart-clear');
    this.checkoutButton = document.getElementById('inline-cart-checkout');

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.clearCartButton.addEventListener('click', () => {
      this.orderManager.clearCart();
    });

    this.checkoutButton.addEventListener('click', () => {
      this.orderManager.generateWhatsAppMessage();
    });
  }

  updateCart(cart) {
    this.inlineCartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      const priceValue = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
      total += priceValue;

      const cartItemEl = document.createElement('div');
      cartItemEl.classList.add('inline-cart-item');
      cartItemEl.innerHTML = `
        <span>${item.name}</span>
        <div class="inline-cart-item-actions">
          <span>${item.price}</span>
          <button class="remove-inline-cart-item" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      const removeButton = cartItemEl.querySelector('.remove-inline-cart-item');
      removeButton.addEventListener('click', () => {
        this.orderManager.removeFromCart(index);
      });

      this.inlineCartItems.appendChild(cartItemEl);
    });

    this.inlineCartCount.textContent = `${cart.length} itens`;
    this.inlineCartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    if (cart.length > 0) {
      this.inlineCart.classList.add('active');
    } else {
      this.inlineCart.classList.remove('active');
    }
  }
}

class PromoManager {
  constructor() {
    this.combos = [
      {
        id: 'segunda-combo',
        name: 'Combo Segunda-Feira',
        description: 'Hot-Dog Clássico + Batata + Refrigerante com desconto',
        originalPrices: [
          { item: 'Hot-Dog Clássico', price: 4.90 },
          { item: 'Batata Suprema', price: 11.90 },
          { item: 'Coca-Cola', price: 8.00 }
        ],
        comboPrice: 29.90,
        availableDays: [1], // Monday
        items: ['Hot-Dog Clássico', 'Batata Suprema', 'Coca-Cola 600ml']
      },
      {
        id: 'terca-combo',
        name: 'Combo Terça Mega',
        description: 'Dogão Especial + Batata + Cerveja',
        originalPrices: [
          { item: 'Dogão Especial', price: 15.00 },
          { item: 'Batata Suprema', price: 18.90 },
          { item: 'Heineken Long Neck', price: 10.00 }
        ],
        comboPrice: 39.90,
        availableDays: [2], // Tuesday
        items: ['Dogão Especial', 'Batata Suprema', 'Heineken Long Neck']
      },
      {
        id: 'quarta-combo',
        name: 'Combo Quarta no Balde',
        description: '2 Hot-Dogs + 2 Batatas + 2 Refrigerantes',
        originalPrices: [
          { item: '2x Hot-Dog Clássico', price: 2 * 12.90 },
          { item: '2x Batata Suprema', price: 2 * 18.90 },
          { item: '2x Coca-Cola 600ml', price: 2 * 8.00 }
        ],
        comboPrice: 49.90,
        availableDays: [3], // Wednesday
        items: ['2x Hot-Dog Clássico', '2x Batata Suprema', '2x Coca-Cola 600ml']
      },
      {
        id: 'quinta-combo',
        name: 'Combo Quinta Especial',
        description: 'Hot-Dog Especial + Cerveja + Batata',
        originalPrices: [
          { item: 'Hot-Dog Especial', price: 13.90 },
          { item: 'Heineken Long Neck', price: 10.00 },
          { item: 'Batata Suprema', price: 18.90 }
        ],
        comboPrice: 44.90,
        availableDays: [4], // Thursday
        items: ['Hot-Dog Especial', 'Heineken Long Neck', 'Batata Suprema']
      },
      {
        id: 'canela-fina',
        name: 'Combo Canela Fina',
        description: 'Hot-Dog Especial + Batata + Refrigerante',
        originalPrices: [
          { item: 'Hot-Dog Especial', price: 13.90 },
          { item: 'Batata Suprema', price: 18.90 },
          { item: 'Coca-Cola 600ml', price: 8.00 }
        ],
        comboPrice: 34.90,
        availableDays: [5, 6], // Friday and Saturday
        items: ['Hot-Dog Especial', 'Batata Suprema', 'Coca-Cola 600ml']
      },
      {
        id: 'domingo-combo',
        name: 'Combo Domingo Família',
        description: '3 Hot-Dogs + 2 Batatas + 2 Refrigerantes',
        originalPrices: [
          { item: '3x Hot-Dog Clássico', price: 3 * 12.90 },
          { item: '2x Batata Suprema', price: 2 * 18.90 },
          { item: '2x Coca-Cola 600ml', price: 2 * 8.00 }
        ],
        comboPrice: 59.90,
        availableDays: [0], // Sunday
        items: ['3x Hot-Dog Clássico', '2x Batata Suprema', '2x Coca-Cola 600ml']
      }
    ];

    this.renderCombos();
  }

  calculateSavings(combo) {
    const originalTotal = combo.originalPrices.reduce((sum, item) => sum + item.price, 0);
    const savings = originalTotal - combo.comboPrice;
    return {
      originalTotal: originalTotal.toFixed(2),
      savings: savings.toFixed(2)
    };
  }

  renderCombos() {
    const promoGrid = document.getElementById('promo-grid');
    promoGrid.innerHTML = ''; // Clear existing combos

    const currentDate = this.getCurrentDate();
    
    this.combos.forEach(combo => {
      if (this.isComboAvailable(combo, currentDate)) {
        const { originalTotal, savings } = this.calculateSavings(combo);
        
        const comboCard = document.createElement('div');
        comboCard.classList.add('promo-card');
        
        const originalPricesHtml = combo.originalPrices.map(item => 
          `<span class="original-price">${item.item}: R$ ${item.price.toFixed(2)}</span>`
        ).join('');
        
        // Calculate discount percentage
        const discountPercentage = ((savings / parseFloat(originalTotal)) * 100).toFixed(0);
        
        comboCard.innerHTML = `
          <h3>${combo.name}</h3>
          <p>${combo.description}</p>
          
          <div class="original-prices">
            ${originalPricesHtml}
          </div>
          
          <div class="promo-savings">
            Economize: R$ ${savings}
          </div>
          
          <span class="promo-price">Combo por: R$ ${combo.comboPrice.toFixed(2)}</span>
          
          ${discountPercentage > 0 ? 
            `<span class="promo-discount">${discountPercentage}% OFF</span>` : 
            ''
          }
        `;

        const addPromoButton = document.createElement('button');
        addPromoButton.textContent = 'Adicionar Combo';
        addPromoButton.classList.add('add-promo-to-cart', 'add-to-cart');
        
        addPromoButton.addEventListener('click', () => {
          const orderManager = window.orderManager;
          if (orderManager) {
            orderManager.addToCart({ 
              name: combo.name, 
              price: `R$ ${combo.comboPrice.toFixed(2)}`,
              isPromo: true,
              items: combo.items,
              originalTotal: `R$ ${originalTotal}`
            });
          } else {
            console.error('Order Manager not initialized');
            this.showInitializationError();
          }
        });

        comboCard.appendChild(addPromoButton);
        promoGrid.appendChild(comboCard);
      }
    });

    if (promoGrid.children.length === 0) {
      const noComboMessage = document.createElement('p');
      noComboMessage.textContent = 'Nenhuma promoção disponível hoje.';
      noComboMessage.style.textAlign = 'center';
      noComboMessage.style.width = '100%';
      promoGrid.appendChild(noComboMessage);
    }
  }

  showInitializationError() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const errorContent = document.createElement('div');
    errorContent.style.backgroundColor = 'white';
    errorContent.style.padding = '2rem';
    errorContent.style.borderRadius = '10px';
    errorContent.innerHTML = `
      <h2>Erro de Inicialização</h2>
      <p>Ocorreu um erro ao carregar o sistema de pedidos.</p>
      <button onclick="window.location.reload()">Recarregar Página</button>
    `;

    modal.appendChild(errorContent);
    document.body.appendChild(modal);
  }

  getCurrentDate() {
    try {
      const now = new Date();
      
      if (this.isDateManipulated(now)) {
        throw new Error('Data inválida detectada');
      }
      
      return now;
    } catch (error) {
      console.error('Erro ao obter data:', error);
      alert('Não foi possível verificar a data das promoções.');
      return null;
    }
  }

  isDateManipulated(date) {
    const systemTime = Date.now();
    const providedTime = date.getTime();
    
    const timeDiff = Math.abs(systemTime - providedTime);
    const MAX_TIME_DEVIATION = 60000; // 1 minute allowance
    
    return (
      timeDiff > MAX_TIME_DEVIATION || 
      date.getFullYear() < 2023 || 
      date.getFullYear() > 2025
    );
  }

  isComboAvailable(combo, currentDate) {
    try {
      if (!combo || !currentDate) {
        return false;
      }

      const currentDay = currentDate.getDay();
      const isAvailable = combo.availableDays.includes(currentDay);

      return isAvailable;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade do combo:', error);
      return false;
    }
  }
}

class OrderManager {
  constructor() {
    this.initializeWithSafety();
    this.inlineCartManager = new InlineCartManager(this);
  }

  initializeWithSafety() {
    try {
      this.cart = [];
      this.initializeAddToCartButtons();
      this.setupScrollHandlers();
      this.setupFloatAnimation();
      this.setupCartModal();
      window.orderManager = this;
      this.promoManager = new PromoManager();
    } catch (error) {
      console.error('Falha na inicialização:', error);
      this.showInitializationError();
    }
  }

  generateWhatsAppMessage() {
    try {
      if (this.cart.length === 0) {
        throw new Error('Carrinho vazio');
      }

      const customerDetailsModal = document.getElementById('customer-details-modal');
      const closeModal = customerDetailsModal.querySelector('.close-modal');
      const customerForm = document.getElementById('customer-details-form');
      const fillPreviousButton = document.getElementById('fill-previous-data');

      const previousData = this.getPreviousCustomerData();

      if (previousData) {
        fillPreviousButton.style.display = 'block';
        fillPreviousButton.addEventListener('click', () => {
          document.getElementById('customer-name').value = previousData.name;
          document.getElementById('customer-phone').value = previousData.phone;
          document.getElementById('customer-address').value = previousData.address;
        });
      } else {
        fillPreviousButton.style.display = 'none';
      }

      customerDetailsModal.style.display = 'block';

      const closeCustomerDetailsModal = () => {
        customerDetailsModal.style.display = 'none';
      };

      closeModal.addEventListener('click', closeCustomerDetailsModal);

      customerDetailsModal.addEventListener('click', (e) => {
        if (e.target === customerDetailsModal) {
          closeCustomerDetailsModal();
        }
      });

      customerForm.onsubmit = (e) => {
        e.preventDefault();

        const customerName = document.getElementById('customer-name').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const customerAddress = document.getElementById('customer-address').value;

        this.saveCustomerData(customerName, customerPhone, customerAddress);

        let message = "*Pedido do Dogão do Canela Fina*\n\n";
        message += `*Nome:* ${customerName}\n`;
        message += `*Telefone:* ${customerPhone}\n`;
        message += `*Endereço:* ${customerAddress}\n\n`;
        message += "*Itens do Pedido:*\n";

        let total = 0;
        let itemCount = {};

        this.cart.forEach((item) => {
          const priceValue = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
          
          itemCount[item.name] = (itemCount[item.name] || 0) + 1;
          
          total += priceValue;
        });

        Object.entries(itemCount).forEach(([name, count]) => {
          message += `${count}x ${name}\n`;
        });

        message += "\n*Observação:* Taxa de entrega será calculada conforme endereço.\n";
        message += `*Total:* R$ ${total.toFixed(2).replace('.', ',')}`;

        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = '5571996447078'; 
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');

        this.cart = [];
        this.updateCartDisplay();
        document.getElementById('cart-modal').style.display = 'none';
        customerDetailsModal.style.display = 'none';
        customerForm.reset();
        
        // Refresh the page to clear the cart
        window.location.reload();
      };
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert(error.message || 'Não foi possível finalizar o pedido.');
    }
  }

  saveCustomerData(name, phone, address) {
    const customerData = {
      name: name,
      phone: phone,
      address: address
    };
    localStorage.setItem('customerData', JSON.stringify(customerData));
  }

  getPreviousCustomerData() {
    const storedData = localStorage.getItem('customerData');
    return storedData ? JSON.parse(storedData) : null;
  }

  initializeAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const item = e.target.closest('.menu-item, .drink-item');
        const name = item.querySelector('h3, span').textContent;
        let priceElement = item.querySelector('.price');
        const price = priceElement.textContent;
        this.addToCart({ name, price });
      });
    });
  }

  addToCart(item) {
    try {
      if (!item.name || !item.price) {
        throw new Error('Item inválido');
      }

      if (this.cart.length >= 10) {
        alert('Limite máximo do carrinho atingido.');
        return;
      }

      console.log('Adding to cart:', item);

      this.cart.push(item);
      this.updateCartDisplay();
      this.inlineCartManager.updateCart(this.cart);
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      alert('Não foi possível adicionar o item ao carrinho. Tente novamente.');
    }
  }

  clearCart() {
    this.cart = [];
    this.updateCartDisplay();
    this.inlineCartManager.updateCart(this.cart);
    
    document.getElementById('cart-count').textContent = '0';
  }

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.updateCartDisplay();
    this.inlineCartManager.updateCart(this.cart);
  }

  updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (!cartCount || !cartItems || !cartTotal) {
      console.error('Elementos do carrinho não encontrados');
      this.showInitializationError();
      return;
    }

    cartCount.textContent = this.cart.length;
    
    cartItems.innerHTML = '';

    let total = 0;
    this.cart.forEach((item, index) => {
      const priceValue = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
      total += priceValue;

      const cartItemEl = document.createElement('div');
      cartItemEl.classList.add('cart-item');
      
      if (item.isPromo) {
        cartItemEl.classList.add('promo-cart-item');
        cartItemEl.innerHTML = `
          <span>${item.name}</span>
          <div>
            <span style="text-decoration: line-through; color: #888; margin-right: 10px;">${item.originalTotal}</span>
            <span style="color: var(--red); font-weight: bold;">${item.price}</span>
          </div>
          <button class="remove-item" data-index="${index}">Remover</button>
        `;
      } else {
        cartItemEl.innerHTML = `
          <span>${item.name}</span>
          <span>${item.price}</span>
          <button class="remove-item" data-index="${index}">Remover</button>
        `;
      }
      
      cartItems.appendChild(cartItemEl);
    });

    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    const removeButtons = cartItems.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        this.cart.splice(index, 1);
        this.updateCartDisplay();
        this.inlineCartManager.updateCart(this.cart);
      });
    });
  }

  setupScrollHandlers() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        try {
          const targetSelector = this.getAttribute('href');
          
          if (targetSelector && targetSelector.startsWith('#')) {
            const targetElement = document.querySelector(targetSelector);
            
            if (targetElement) {
              targetElement.scrollIntoView({
                behavior: 'smooth'
              });
            } else {
              console.warn(`Target element ${targetSelector} not found`);
            }
          }
        } catch (error) {
          console.error('Error in scroll handler:', error);
        }
      });
    });
  }

  setupFloatAnimation() {
    const floatItems = document.querySelectorAll('.menu-item, .drink-item');
    floatItems.forEach(item => {
      item.style.transition = 'transform 0.3s ease';
      item.addEventListener('mouseover', () => {
        item.style.transform = 'translateY(-5px)';
      });
      item.addEventListener('mouseout', () => {
        item.style.transform = 'translateY(0)';
      });
    });
  }

  setupCartModal() {
    const cartLink = document.getElementById('cart-link');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.querySelector('.close-modal');
    const checkoutBtn = document.getElementById('checkout-btn');

    cartLink.addEventListener('click', (e) => {
      e.preventDefault();
      cartModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
      cartModal.style.display = 'none';
    });

    checkoutBtn.addEventListener('click', () => {
      this.generateWhatsAppMessage();
    });

    window.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        cartModal.style.display = 'none';
      }
    });
  }

  showInitializationError() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const errorContent = document.createElement('div');
    errorContent.style.backgroundColor = 'white';
    errorContent.style.padding = '2rem';
    errorContent.style.borderRadius = '10px';
    errorContent.innerHTML = `
      <h2>Erro de Inicialização</h2>
      <p>Ocorreu um erro ao carregar o sistema de pedidos.</p>
      <button onclick="window.location.reload()">Recarregar Página</button>
    `;

    modal.appendChild(errorContent);
    document.body.appendChild(modal);
  }
}

window.addEventListener('error', (event) => {
  console.error('Unhandled error:', event.error);
  alert('Ocorreu um erro inesperado. Por favor, recarregue a página.');
});

document.addEventListener('DOMContentLoaded', () => {
  try {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('nav');
    const operatingHoursModal = document.getElementById('operating-hours-modal');
    const operatingHoursClose = document.querySelector('.operating-hours-close');

    hamburgerMenu.addEventListener('click', () => {
      hamburgerMenu.classList.toggle('active');
      nav.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('active');
        nav.classList.remove('active');
      });
    });

    // Sample usage:  (You'd likely fetch this data from a server or local storage)
    const menuItemsData = [
      { name: "Hot-Dog Clássico", onSale: true, promotionalPrice: "R$ 4,90" },
      { name: "Dogão Tradicional", onSale: true, promotionalPrice: "R$ 11,90" },
      { name: "Dogão de Bovino", onSale: true, promotionalPrice: "R$ 16,90" },
      { name: "Dogão de Frango", onSale: true, promotionalPrice: "R$ 16,90" },
      { name: "Batata Suprema", onSale: true, promotionalPrice: "R$ 8,90" },
    //  { name: "Batata Chips", onSale: false, promotionalPrice: "R$ 8,90" },
      { name: "Coca Cola Lata", onSale: true, promotionalPrice: "R$ 5,90" },
    // { name: "Coca Cola Lata Zero", onSale: false, promotionalPrice: "R$ 5,90" },
      { name: "Guarana Lata", onSale: true, promotionalPrice: "R$ 5,90" },
     // { name: "Pepsi Lata", onSale: false, promotionalPrice: "R$ 5,90" },
    ];

    // Function to apply sale prices to items
    function applySalePrices(itemsData) {
      const menuGrid = document.querySelector('.menu-grid'); // or drinks-grid as needed
      const menuItems = menuGrid ? menuGrid.querySelectorAll('.menu-item') : []; // Adjust selector if needed

      const menuGrid1 = document.querySelector('.menu-grid-1'); // or drinks-grid as needed
      const menuItems1 = menuGrid1 ? menuGrid1.querySelectorAll('.menu-item') : []; // Adjust selector if needed


      const drinksGrid = document.querySelector('.drinks-grid');
      const drinkItems = drinksGrid ? drinksGrid.querySelectorAll('.drink-item') : [];

      const allItems = [...menuItems, ...menuItems1, ...drinkItems];

      allItems.forEach(item => {
        const itemName = item.querySelector('h3, span').textContent;
        const itemData = itemsData.find(data => data.name === itemName);

        if (itemData && itemData.onSale) {
          item.classList.add('on-sale');

          // Create a span for the original price
          const originalPriceSpan = document.createElement('span');
          originalPriceSpan.classList.add('original-price');
          const priceElement = item.querySelector('.price');
          originalPriceSpan.textContent = priceElement.textContent;
          item.insertBefore(originalPriceSpan, priceElement); // Inserts before the current price

          // Update the item price with the promotional price
          item.querySelector('.price').textContent = itemData.promotionalPrice;
        }
      });
    }

    // Call the function to apply sale prices
    applySalePrices(menuItemsData);

    new OrderManager();
    
    // Show operating hours modal on initial load
    operatingHoursModal.style.display = 'flex';

    operatingHoursClose.addEventListener('click', () => {
      operatingHoursModal.style.display = 'none';
    });

    // Close the operating hours modal if the user clicks outside of it
    window.addEventListener('click', (event) => {
      if (event.target == operatingHoursModal) {
        operatingHoursModal.style.display = 'none';
      }
    });

  } catch (error) {
    console.error('Falha ao inicializar o sistema de pedidos:', error);
    alert('Não foi possível carregar o sistema de pedidos. Tente recarregar a página.');
  }

});

