//// Número do WhatsApp no formato internacional, ex: 55 + DDD + número
const WHATSAPP_NUMBER = '5588999999999';
// URL do mapa da loja (Google Maps ou similar)
const STORE_MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Dog%C3%A3o+do+Canela+Fina';

const cart = {};
let cartTotal = 0;

function formatCurrencyBRL(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Abre / fecha drawer do carrinho
function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.remove('hidden');
        drawer.classList.add('open');
        renderCartDetails();
    }
}
function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.remove('open');
        drawer.classList.add('hidden');
    }
}

// Renderiza os detalhes do carrinho no drawer
function renderCartDetails() {
    const itemsContainer = document.getElementById('cart-items');
    const drawerCountEl = document.getElementById('cart-drawer-count');
    const drawerTotalEl = document.getElementById('cart-drawer-total');
    const drawerWhatsappBtn = document.getElementById('cart-drawer-whatsapp');

    if (!itemsContainer) return;

    const items = Object.entries(cart).filter(([_, item]) => item.qty > 0);
    itemsContainer.innerHTML = '';

    let totalItems = 0;
    let totalValue = 0;

    items.forEach(([id, item]) => {
        totalItems += item.qty;
        totalValue += item.qty * item.price;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.dataset.productId = id;

        row.innerHTML = `
          <div class="cart-item-main">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price-unit">${formatCurrencyBRL(item.price)} un.</span>
          </div>
          <div class="cart-item-side">
            <div class="cart-item-qty">
              <button type="button" class="qty-btn minus">-</button>
              <span class="qty-value">${item.qty}</span>
              <button type="button" class="qty-btn plus">+</button>
            </div>
            <div class="cart-item-total">
              ${formatCurrencyBRL(item.qty * item.price)}
            </div>
            <button type="button" class="cart-item-remove">Remover</button>
          </div>
        `;

        itemsContainer.appendChild(row);
    });

    if (items.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'cart-empty';
        empty.textContent = 'Seu carrinho está vazio.';
        itemsContainer.appendChild(empty);
    }

    if (drawerCountEl) {
        drawerCountEl.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
    }
    if (drawerTotalEl) {
        drawerTotalEl.textContent = formatCurrencyBRL(totalValue || 0);
    }
    if (drawerWhatsappBtn) {
        drawerWhatsappBtn.disabled = totalItems === 0;
    }
}

function updateCartSummary() {
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    const whatsappBtn = document.getElementById('whatsapp-button');
    const topCartCountEl = document.getElementById('top-cart-count');
    const floatingCart = document.getElementById('floating-cart');
    const floatingCartCountEl = document.getElementById('floating-cart-count');

    let totalItems = 0;
    cartTotal = 0;

    Object.values(cart).forEach(item => {
        totalItems += item.qty;
        cartTotal += item.qty * item.price;
    });

    if (countEl) {
        countEl.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
    }
    if (totalEl) {
        totalEl.textContent = `Total: ${formatCurrencyBRL(cartTotal || 0)}`;
    }
    if (whatsappBtn) {
        whatsappBtn.disabled = totalItems === 0;
    }

    if (topCartCountEl) {
        topCartCountEl.textContent = totalItems;
    }

    // Atualiza o carrinho flutuante (apenas ícone + quantidade)
    if (floatingCart && floatingCartCountEl) {
        floatingCartCountEl.textContent = totalItems;
        if (totalItems > 0) {
            floatingCart.classList.remove('hidden');
        } else {
            floatingCart.classList.add('hidden');
        }
    }

    // Atualiza o drawer se estiver aberto
    const drawer = document.getElementById('cart-drawer');
    if (drawer && drawer.classList.contains('open')) {
        renderCartDetails();
    }
}

function addItemToCart(id, name, price) {
    if (!id || !name || !price) return;
    if (!cart[id]) {
        cart[id] = { name, price, qty: 0 };
    }
    cart[id].qty += 1;
    updateCartSummary();
}

function decreaseItemInCart(id) {
    if (!cart[id]) return;
    cart[id].qty -= 1;
    if (cart[id].qty <= 0) {
        delete cart[id];
    }
    updateCartSummary();
}

function removeItemFromCart(id) {
    if (!cart[id]) return;
    delete cart[id];
    updateCartSummary();
}

function clearCart() {
    Object.keys(cart).forEach(id => delete cart[id]);
    updateCartSummary();
}

function buildWhatsappMessage(details) {
    const items = Object.values(cart).filter(item => item.qty > 0);
    if (!items.length) return null;

    const lines = [];
    lines.push('*Pedido Dogão do Canela Fina*');
    lines.push('');
    items.forEach(item => {
        lines.push(`${item.qty}x ${item.name} - ${formatCurrencyBRL(item.price)} cada`);
    });
    lines.push('');
    lines.push(`Total: ${formatCurrencyBRL(cartTotal)}`);
    lines.push('');

    if (details && details.type === 'entrega') {
        lines.push('*Tipo:* Entrega');
        lines.push(`*Nome:* ${details.name || '-'}`);
        lines.push(`*Endereço:* ${details.address || '-'}`);
        lines.push('');
    } else if (details && details.type === 'retirada') {
        lines.push('*Tipo:* Retirada no balcão');
        lines.push(`*Nome:* ${details.name || '-'}`);
        lines.push('');
    }

    if (details && details.payment) {
        lines.push(`*Pagamento:* ${details.payment}`);
        lines.push('');
    }

    lines.push('Observações:');

    return encodeURIComponent(lines.join('\n'));
}

document.addEventListener('DOMContentLoaded', () => {
    // === MODO NATAL (ATIVADO) ===
    // Para DESATIVAR o modo Natal, basta comentar ou remover a linha abaixo:
    // document.body.classList.add('natal-mode');
    document.body.classList.add('natal-mode');

    // Clique nos botões de adicionar dos cards dos lanches
    document.querySelectorAll('.card[data-product-id]').forEach(card => {
        const id = card.getAttribute('data-product-id');
        const name = card.getAttribute('data-name');
        const price = parseFloat(card.getAttribute('data-price') || '0');
        const addBtn = card.querySelector('.add-btn');

        if (addBtn) {
            addBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                addItemToCart(id, name, price);
            });
        }
    });

    // Clique nos botões de adicionar das linhas de bebidas e acompanhamentos
    document.querySelectorAll('.row[data-product-id]').forEach(row => {
        const id = row.getAttribute('data-product-id');
        const name = row.getAttribute('data-name');
        const price = parseFloat(row.getAttribute('data-price') || '0');
        const addBtn = row.querySelector('.add-btn');

        if (addBtn) {
            addBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                addItemToCart(id, name, price);
            });
        }
    });

    // Botão de envio para WhatsApp (barra inferior) abre o drawer para finalizar
    const whatsappBtn = document.getElementById('whatsapp-button');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            openCartDrawer();
        });
    }

    // Botão de envio para WhatsApp dentro do drawer
    const drawerWhatsappBtn = document.getElementById('cart-drawer-whatsapp');
    if (drawerWhatsappBtn) {
        drawerWhatsappBtn.addEventListener('click', () => {
            const deliveryTypeEl = document.querySelector('input[name="deliveryType"]:checked');
            if (!deliveryTypeEl) {
                alert('Selecione se o pedido é para entrega ou retirada.');
                return;
            }

            const paymentTypeEl = document.querySelector('input[name="paymentType"]:checked');
            if (!paymentTypeEl) {
                alert('Selecione a forma de pagamento.');
                return;
            }

            const type = deliveryTypeEl.value;
            let details = { type, payment: paymentTypeEl.value };

            if (type === 'entrega') {
                const nameInput = document.getElementById('delivery-name-entrega');
                const addressInput = document.getElementById('delivery-address');
                const name = nameInput ? nameInput.value.trim() : '';
                const address = addressInput ? addressInput.value.trim() : '';

                if (!name || !address) {
                    alert('Preencha seu nome e o endereço completo para entrega.');
                    return;
                }
                details.name = name;
                details.address = address;
            } else if (type === 'retirada') {
                const nameInput = document.getElementById('delivery-name-retirada');
                const name = nameInput ? nameInput.value.trim() : '';
                if (!name) {
                    alert('Informe seu nome para retirada.');
                    return;
                }
                details.name = name;
            }

            const encoded = buildWhatsappMessage(details);
            if (!encoded) return;
            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
            window.open(url, '_blank');
        });
    }

    // Botões de carrinho (topo e flutuante) abrem o drawer
    const topCartButton = document.getElementById('top-cart-button');
    const floatingCart = document.getElementById('floating-cart');

    if (topCartButton) {
        topCartButton.addEventListener('click', openCartDrawer);
    }
    if (floatingCart) {
        floatingCart.addEventListener('click', openCartDrawer);
    }

    // Controles do drawer
    const closeCartButton = document.getElementById('close-cart-button');
    const clearCartButton = document.getElementById('clear-cart-button');
    const drawerBackdrop = document.getElementById('cart-drawer-backdrop');

    if (closeCartButton) {
        closeCartButton.addEventListener('click', closeCartDrawer);
    }
    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', closeCartDrawer);
    }
    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            clearCart();
        });
    }

    // Alterna campos conforme tipo de entrega/retirada
    const deliveryTypeInputs = document.querySelectorAll('input[name="deliveryType"]');
    const entregaFields = document.getElementById('delivery-entrega-fields');
    const retiradaFields = document.getElementById('delivery-retirada-fields');

    deliveryTypeInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.value === 'entrega') {
                if (entregaFields) entregaFields.classList.add('active');
                if (retiradaFields) retiradaFields.classList.remove('active');
            } else if (input.value === 'retirada') {
                if (retiradaFields) retiradaFields.classList.add('active');
                if (entregaFields) entregaFields.classList.remove('active');
            }
        });
    });

    // Botão para abrir o mapa da loja
    const openMapButton = document.getElementById('open-map-button');
    if (openMapButton) {
        openMapButton.addEventListener('click', () => {
            window.open(STORE_MAP_URL, '_blank');
        });
    }

    // Delegação de eventos para alterar itens dentro do drawer
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            const target = event.target;
            const row = target.closest('.cart-item-row');
            if (!row) return;
            const id = row.dataset.productId;
            if (!id) return;

            if (target.classList.contains('qty-btn')) {
                if (target.classList.contains('plus')) {
                    const item = cart[id];
                    if (item) {
                        addItemToCart(id, item.name, item.price);
                    }
                } else if (target.classList.contains('minus')) {
                    decreaseItemInCart(id);
                }
            } else if (target.classList.contains('cart-item-remove')) {
                removeItemFromCart(id);
            }
        });
    }
});

