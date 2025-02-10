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
    this.clearCartButton?.addEventListener('click', () => {
      this.orderManager.clearCart();
    });

    this.checkoutButton?.addEventListener('click', () => {
      this.orderManager.generateWhatsAppMessage();
    });
  }

  updateCart(cart) {
    if (!this.inlineCartItems) {
      console.error('Inline cart items element not found');
      return;
    }

    this.inlineCartItems.innerHTML = '';
    let total = 0;

    try {
      cart.forEach((item, index) => {
        const priceValue = this.parsePrice(item.price);
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
        removeButton?.addEventListener('click', () => {
          this.orderManager.removeFromCart(index);
        });

        this.inlineCartItems.appendChild(cartItemEl);
      });

      if (this.inlineCartCount) this.inlineCartCount.textContent = `${cart.length} itens`;
      if (this.inlineCartTotal) this.inlineCartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

      if (this.inlineCart) {
        this.inlineCart.classList.toggle('active', cart.length > 0);
      }
    } catch (error) {
      console.error('Error updating inline cart:', error);
    }
  }

  parsePrice(priceString) {
    try {
      return parseFloat(priceString.replace('R$ ', '').replace(',', '.')) || 0;
    } catch (error) {
      console.error('Invalid price format:', priceString);
      return 0;
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
        availableDays: [1], 
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
        availableDays: [2], 
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
        availableDays: [3], 
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
        availableDays: [4], 
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
        availableDays: [5, 6], 
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
        availableDays: [0], 
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
    promoGrid.innerHTML = ''; 
    
    const currentDate = this.getCurrentDate();
    
    this.combos.forEach(combo => {
      if (this.isComboAvailable(combo, currentDate)) {
        const { originalTotal, savings } = this.calculateSavings(combo);
        
        const comboCard = document.createElement('div');
        comboCard.classList.add('promo-card');
        
        const originalPricesHtml = combo.originalPrices.map(item => 
          `<span class="original-price">${item.item}: R$ ${item.price.toFixed(2)}</span>`
        ).join('');
        
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
    const MAX_TIME_DEVIATION = 60000; 
    
    return (
      timeDiff > MAX_TIME_DEVIATION || 
      date.getFullYear() < 2023 || 
      date.getFullYear() > 2025
    );
  }

  isComboAvailable(combo, currentDate) {
    try {
      if (!combo || !currentDate) {
        console.warn('Invalid combo or date');
        return false;
      }

      const currentDay = currentDate.getDay();
      return combo.availableDays.includes(currentDay);
    } catch (error) {
      console.error('Error checking combo availability:', error);
      return false;
    }
  }
}

class InventoryManager {
  constructor() {
    this.unavailableItems = [
      // ADICIONE OS ITENS INDISPONIVEIS
      // 'Dogão de Carne'
      'Coca Cola Lata Zero',
      'Guarana Lata'
    ];

    this.initializeUnavailableItems();
  }

  initializeUnavailableItems() {
    this.unavailableItems.forEach(itemName => {
      this.markItemUnavailable(itemName);
    });
  }

  markItemUnavailable(itemName) {
    const items = [
      ...document.querySelectorAll('.menu-item'),
      ...document.querySelectorAll('.drink-item')
    ];

    const item = items.find(el => 
      el.querySelector('h3, span')?.textContent.trim() === itemName.trim()
    );

    if (item) {
      item.classList.add('unavailable');
      const addToCartButton = item.querySelector('.add-to-cart');
      if (addToCartButton) {
        addToCartButton.disabled = true;
        addToCartButton.textContent = 'Indisponível';
      }
    }
  }

  markItemAvailable(itemName) {
    const items = [
      ...document.querySelectorAll('.menu-item'),
      ...document.querySelectorAll('.drink-item')
    ];

    const item = items.find(el => 
      el.querySelector('h3, span')?.textContent.trim() === itemName.trim()
    );

    if (item) {
      item.classList.remove('unavailable');
      const addToCartButton = item.querySelector('.add-to-cart');
      if (addToCartButton) {
        addToCartButton.disabled = false;
        addToCartButton.textContent = 'Adicionar';
      }
    }
  }
}

class OrderManager {
  constructor() {
    try {
      this.cart = [];
      this.initializeAddToCartButtons();
      this.setupScrollHandlers();
      this.setupFloatAnimation();
      this.setupCartModal();
      this.setupCustomizationHandlers();
      
      window.orderManager = this;
      this.inlineCartManager = new InlineCartManager(this);
      this.promoManager = new PromoManager();
      this.inventoryManager = new InventoryManager();
      
      window.markItemUnavailable = (itemName) => {
        this.inventoryManager.markItemUnavailable(itemName);
      };
      
      window.markItemAvailable = (itemName) => {
        this.inventoryManager.markItemAvailable(itemName);
      };
    } catch (error) {
      console.error('Initialization error:', error);
      this.showInitializationError();
    }
  }

  initializeAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.menu-item, .drink-item');
        const name = menuItem.querySelector('h3, span').textContent;
        const price = menuItem.querySelector('.price').textContent;
        this.addToCart({ 
          name, 
          price,
          element: menuItem 
        });
      });
    });
  }

  setupCustomizationHandlers() {
    document.querySelectorAll('.menu-item, .drink-item').forEach(item => {
      const checkboxes = item.querySelectorAll('input[type="checkbox"]');
      const quantityInputs = item.querySelectorAll('.qty-input');

      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          this.updateCustomizationState(item);
        });
      });

      quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
          this.updateCustomizationState(item);
        });
      });
    });
  }

  updateCustomizationState(item) {
    const customizations = {
      molhos: [],
      adicionais: []
    };

    item.querySelectorAll('input[name="molhos"]:checked').forEach(molho => {
      customizations.molhos.push(molho.value);
    });

    item.querySelectorAll('.adicional-item').forEach(adicional => {
      const nome = adicional.querySelector('span').textContent;
      const quantidade = parseInt(adicional.querySelector('.qty-input').value);
      if (quantidade > 0) {
        customizations.adicionais.push({
          nome,
          quantidade
        });
      }
    });

    item.customizations = customizations;
  }

  addToCart(item) {
    try {
      if (!item.name || !item.price) {
        throw new Error('Invalid cart item');
      }

      if (item.element) {
        this.updateCustomizationState(item.element);
        item.customizations = item.element.customizations;
      }

      this.cart.push(item);
      this.updateCartDisplay();
      this.inlineCartManager.updateCart(this.cart);
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Could not add item to cart. Please try again.');
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

  setupFormHandler() {
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Pedido enviado com sucesso! Entraremos em contato para confirmação.');
      this.reset();
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

  generateWhatsAppMessage() {
    try {
      if (this.cart.length === 0) {
        throw new Error('Carrinho vazio');
      }

      const customerDetailsModal = document.getElementById('customer-details-modal');
      const closeModal = customerDetailsModal.querySelector('.close-modal');
      const fillPreviousButton = document.getElementById('fill-previous-data');
      customerDetailsModal.style.display = 'block';

      const savedData = localStorage.getItem('customerData');
      fillPreviousButton.style.display = savedData ? 'block' : 'none';

      const closeCustomerDetailsModal = () => {
        customerDetailsModal.style.display = 'none';
      };

      closeModal.addEventListener('click', closeCustomerDetailsModal);

      customerDetailsModal.addEventListener('click', (e) => {
        if (e.target === customerDetailsModal) {
          closeCustomerDetailsModal();
        }
      });

      fillPreviousButton.addEventListener('click', () => {
        const savedData = localStorage.getItem('customerData');
        if (savedData) {
          const customerData = JSON.parse(savedData);
          document.getElementById('customer-name').value = customerData.name;
          document.getElementById('customer-phone').value = customerData.phone;
          document.getElementById('customer-address').value = customerData.address;
        }
      });

      const customerForm = document.getElementById('customer-details-form');
      customerForm.onsubmit = (e) => {
        e.preventDefault();

        const customerData = {
          name: document.getElementById('customer-name').value,
          phone: document.getElementById('customer-phone').value,
          address: document.getElementById('customer-address').value
        };

        localStorage.setItem('customerData', JSON.stringify(customerData));

        let message = "*Pedido do Dogão do Canela Fina*\n\n";
        message += `*Nome:* ${customerData.name}\n`;
        message += `*Telefone:* ${customerData.phone}\n`;
        message += `*Endereço:* ${customerData.address}\n\n`;
        message += "*Itens do Pedido:*\n";

        let total = 0;
        let itemCount = {};

        this.cart.forEach((item) => {
          message += `\n${item.name}\n`;
      
          if (item.customizations) {
            if (item.customizations.molhos.length > 0) {
              message += `Molhos: ${item.customizations.molhos.join(', ')}\n`;
            }
        
            if (item.customizations.adicionais.length > 0) {
              message += "Adicionais:\n";
              item.customizations.adicionais.forEach(adicional => {
                message += `- ${adicional.quantidade}x ${adicional.nome}\n`;
              });
            }
          }

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

        window.location.reload();
      };
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert(error.message || 'Não foi possível finalizar o pedido.');
    }
  }
}

class RestaurantStatusManager {
  constructor() {
    this.SITE_STATUS = 'auto'; 
    this.statusModal = document.getElementById('restaurant-status-modal');
    this.viewMenuBtn = document.getElementById('view-menu-btn');
    this.closedOverlay = this.createClosedOverlay();

    this.businessHours = {
      friday: { open: '18:00', close: '00:00' },
      weekendDays: { open: '16:00', close: '00:00' }
    };

    this.initializeStatusCheck();
    this.setupEventListeners();
  }

  createClosedOverlay() {
    const overlay = document.createElement('div');
    overlay.classList.add('closed-overlay');
    
    const content = document.createElement('div');
    content.classList.add('closed-overlay-content');
    content.innerHTML = `
      <h3>Estamos Fechados no Momento</h3>
      <p>Você pode visualizar o cardápio, mas não é possível fazer pedidos fora do nosso horário de funcionamento.</p>
      <p>Horário de funcionamento:</p>
      <p>Sexta-feira: 18:00 - 00:00</p>
      <p>Sábado e Domingo: 16:00 - 00:00</p>
    `;
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    return overlay;
  }

  initializeStatusCheck() {
    this.checkRestaurantStatus();
  }

  setupEventListeners() {
    this.viewMenuBtn?.addEventListener('click', () => {
      this.statusModal.style.display = 'none';
      document.body.classList.remove('closed-site');
    });
  }

  checkRestaurantStatus() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = this.formatTime(now);

    let isOpen = false;

    if (this.SITE_STATUS === 'open') {
      isOpen = true;
    } else if (this.SITE_STATUS === 'closed') {
      isOpen = false;
    } else {
      if (currentDay === 5) { 
        isOpen = this.isTimeInRange(currentTime, this.businessHours.friday.open, this.businessHours.friday.close);
      } else if (currentDay === 6 || currentDay === 0) { 
        isOpen = this.isTimeInRange(currentTime, this.businessHours.weekendDays.open, this.businessHours.weekendDays.close);
      }
    }

    this.updateSiteStatus(isOpen);
  }

  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  isTimeInRange(currentTime, openTime, closeTime) {
    const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
    const [openHours, openMinutes] = openTime.split(':').map(Number);
    const [closeHours, closeMinutes] = closeTime.split(':').map(Number);

    const currentTotalMinutes = currentHours * 60 + currentMinutes;
    const openTotalMinutes = openHours * 60 + openMinutes;
    const closeTotalMinutes = closeHours * 60 + closeMinutes;

    if (closeTotalMinutes < openTotalMinutes) {
      return currentTotalMinutes >= openTotalMinutes || currentTotalMinutes <= closeTotalMinutes;
    }

    return currentTotalMinutes >= openTotalMinutes && currentTotalMinutes <= closeTotalMinutes;
  }

  updateSiteStatus(isOpen) {
    if (!isOpen) {
      document.body.classList.add('closed-site');
      this.statusModal.style.display = 'flex';
      
      // Disable all add to cart buttons
      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.disabled = true;
        button.textContent = 'Indisponível';
      });
    } else {
      document.body.classList.remove('closed-site');
      this.statusModal.style.display = 'none';
      
      // Re-enable all add to cart buttons
      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.disabled = false;
        button.textContent = 'Adicionar';
      });
    }
  }

  manualStatusOverride(status) {
    this.SITE_STATUS = status;
    this.checkRestaurantStatus();
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

    if (hamburgerMenu && nav) {
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
    }

    new OrderManager();
  } catch (error) {
    console.error('System initialization failed:', error);
    alert('Could not load the ordering system. Please reload the page.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  window.restaurantStatusManager = new RestaurantStatusManager();
});

document.querySelectorAll('.quantity-control').forEach(control => {
  const input = control.querySelector('.qty-input');
  const minusBtn = control.querySelector('.minus');
  const plusBtn = control.querySelector('.plus');

  minusBtn.addEventListener('click', () => {
    const currentValue = parseInt(input.value);
    if (currentValue > 0) {
      input.value = currentValue - 1;
    }
  });

  plusBtn.addEventListener('click', () => {
    const currentValue = parseInt(input.value);
    if (currentValue < 2) {
      input.value = currentValue + 1;
    }
  });
});
