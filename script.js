// Menu data
const menuData = {
    burgers: [
        {
            id: 1,
            name: "Burger do Goku",
            price: 19.90,
            description: "1 Carne de burger bovino artesanal, Mussarela, Cebola Crisp e Molho Super."
        },
        {
            id: 2,
            name: "Burger do Vegeta",
            price: 19.90,
            description: "1 Carne de burger bovino artesanal, Cheddar, Cebola Crisp e Molho Fumaça."
        },
        {
            id: 3,
            name: "Burger do Naruto",
            price: 16.90,
            description: "1 Carne de burger bovino artesanal, Cheddar e Molho Super."
        },
        {
            id: 4,
            name: "Burger do Sasuke",
            price: 16.90,
            description: "1 Carne de burger bovino artesanal, Mussarela e Molho Fumaça."
        },
        {
            id: 5,
            name: "Burger do Goku SSJ 2",
            price: 26.90,
            description: "2 Carnes de burger bovino artesanal, Mussarela, Cebola Crisp e Molho Super."
        },
        {
            id: 6,
            name: "Burger do Vegeta SSJ 2",
            price: 26.90,
            description: "2 Carnes de burger bovino artesanal, Cheddar, Cebola Crisp e Molho Fumaça."
        },
        {
            id: 7,
            name: "Burger do Naruto Sábio",
            price: 21.90,
            description: "2 Carnes de burger bovino artesanal, Cheddar e Molho Super."
        },
        {
            id: 8,
            name: "Burger do Sasuke Susanoo",
            price: 21.90,
            description: "2 Carnes de burger bovino artesanal, Mussarela e Molho Fumaça."
        }
    ],
    sides: [
        {
            id: 9,
            name: "Batata Sayajins",
            price: 8.90,
            description: "Batata palito fritas e crocantes"
        },
        {
            id: 10,
            name: "Chips do Poder",
            price: 8.90,
            description: "Batata chips crocantes e deliciosas"
        }
    ],
    drinks: [
        {
            id: 11,
            name: "Coca Cola Lata",
            price: 5.90,
            description: "Refrigerante gelado 350ml"
        },
        {
            id: 12,
            name: "Guaraná Lata",
            price: 5.90,
            description: "Refrigerante gelado 350ml"
        },
        {
            id: 13,
            name: "Água C/Gás",
            price: 3.90,
            description: "Água mineral com gás 500ml"
        }
    ]
};

// Cart state
let cart = [];
let isCartOpen = false;
let isAIOpen = false;

// Predefined combos
const combos = {
    sayajin: [
        { id: 5, name: "Burger do Goku SSJ 2", price: 26.90 },
        { id: 9, name: "Batata Sayajins", price: 8.90 },
        { id: 11, name: "Coca Cola Lata", price: 5.90 }
    ],
    ninja: [
        { id: 7, name: "Burger do Naruto Sábio", price: 21.90 },
        { id: 10, name: "Chips do Poder", price: 8.90 },
        { id: 12, name: "Guaraná Lata", price: 5.90 }
    ],
    principe: [
        { id: 2, name: "Burger do Vegeta", price: 19.90 },
        { id: 9, name: "Batata Sayajins", price: 8.90 },
        { id: 13, name: "Água C/Gás", price: 3.90 }
    ]
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderMenu();
    setupEventListeners();
    initializeAI();
});

// AI initialization with welcome message
function initializeAI() {
    setTimeout(() => {
        addMessageToChat('🐉 Olá! Sou Shenron, seu assistente virtual do Burger e Otakus!\n\nPosso te ajudar a:\n🍔 Escolher o burger perfeito\n🎯 Sugerir combos personalizados\n🛒 Adicionar itens ao carrinho\n📋 Finalizar seu pedido\n\nO que você gostaria de fazer?', 'ai', ['Ver Menu Completo', 'Sugestões Populares', 'Montar Combo']);
    }, 1000);
}

// Render menu items
function renderMenu() {
    renderMenuSection('burgers', menuData.burgers);
    renderMenuSection('sides', menuData.sides);
    renderMenuSection('drinks', menuData.drinks);
}

function renderMenuSection(sectionId, items) {
    const container = document.getElementById(sectionId);
    container.innerHTML = items.map(item => `
        <div class="menu-item" data-item-id="${item.id}">
            <div class="item-header">
                <h4 class="item-name">${item.name}</h4>
                <span class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
            </div>
            <p class="item-description">${item.description}</p>
            <button class="add-to-cart" onclick="addToCart(${item.id})">
                <i class="fas fa-plus"></i> Adicionar ao Carrinho
            </button>
        </div>
    `).join('');
}

// Cart functions
function addToCart(itemId) {
    const item = findItemById(itemId);
    if (!item) return;

    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCartUI();
    animateCartIcon();
    
    // Notify AI if it's open
    if (isAIOpen) {
        addMessageToChat(`✅ ${item.name} adicionado ao carrinho! Seu pedido está crescendo! 🛒`, 'ai', ['Ver Carrinho', 'Continuar Comprando', 'Finalizar Pedido']);
    }
}

function removeFromCart(itemId) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    cart = cart.filter(cartItem => cartItem.id !== itemId);
    updateCartUI();
    
    // Notify AI if it's open
    if (isAIOpen && item) {
        addMessageToChat(`❌ ${item.name} removido do carrinho.`, 'ai');
    }
}

function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        updateCartUI();
    }
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2).replace('.', ',');
    
    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
        `).join('');
    }
}

function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    isCartOpen = !isCartOpen;
    
    if (isCartOpen) {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

// Toggle AI modal
function toggleAI() {
    const aiModal = document.getElementById('aiModal');
    const aiOverlay = document.getElementById('aiOverlay');
    
    isAIOpen = !isAIOpen;
    
    if (isAIOpen) {
        aiModal.classList.add('open');
        aiOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        aiModal.classList.remove('open');
        aiOverlay.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

// Toggle change field visibility
function toggleChangeField() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const changeSection = document.getElementById('changeSection');
    
    if (paymentMethod === 'cash') {
        changeSection.style.display = 'block';
    } else {
        changeSection.style.display = 'none';
        document.getElementById('changeFor').value = '';
    }
}

// Enhanced AI processing system
function processAIMessage(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Menu requests
    if (message.includes('menu') || message.includes('cardápio')) {
        return {
            text: "📋 **MENU COMPLETO DO BURGER E OTAKUS:**\n\n🍔 **BURGERS SIMPLES:**\n• Burger do Naruto - R$ 16,90\n• Burger do Sasuke - R$ 16,90\n• Burger do Goku - R$ 19,90\n• Burger do Vegeta - R$ 19,90\n\n🍔 **BURGERS DUPLOS:**\n• Burger do Naruto Sábio - R$ 21,90\n• Burger do Sasuke Susanoo - R$ 21,90\n• Burger do Goku SSJ 2 - R$ 26,90\n• Burger do Vegeta Duplo - R$ 26,90\n\n🍟 **ACOMPANHAMENTOS:**\n• Batata Sayajins - R$ 8,90\n• Chips do Poder - R$ 8,90\n\n🥤 **BEBIDAS:**\n• Água C/Gás - R$ 3,90\n• Coca Cola Lata - R$ 5,90\n• Guaraná Lata - R$ 5,90",
            actions: ['Adicionar Burger', 'Ver Combos', 'Sugestões Populares']
        };
    }
    
    // Character-specific requests
    if (message.includes('goku')) {
        return {
            text: "⚡ **BURGERS DO GOKU:**\n\n🥇 Burger do Goku - R$ 19,90\n1 carne, mussarela, cebola crisp e molho super\n\n🔥 Burger do Goku SSJ 2 - R$ 26,90\n2 carnes, mussarela, cebola crisp e molho super\n\nO Goku sempre escolhe o mais poderoso! Qual versão você quer?",
            actions: ['Adicionar Goku Simples', 'Adicionar Goku SSJ 2', 'Sugerir Combo Goku']
        };
    }
    
    if (message.includes('vegeta')) {
        return {
            text: "👑 **BURGERS DO VEGETA:**\n\n🥇 Burger do Vegeta - R$ 19,90\n1 carne, cheddar, cebola crisp e molho fumaça\n\n🔥 Burger do Vegeta Duplo - R$ 26,90\n2 carnes, cheddar, cebola crisp e molho fumaça\n\nO príncipe dos Sayajins merece o melhor! Qual você escolhe?",
            actions: ['Adicionar Vegeta Simples', 'Adicionar Vegeta Duplo', 'Sugerir Combo Vegeta']
        };
    }
    
    if (message.includes('naruto')) {
        return {
            text: "🍜 **BURGERS DO NARUTO:**\n\n🥇 Burger do Naruto - R$ 16,90\n1 carne, cheddar e molho super\n\n🦊 Burger do Naruto Sábio - R$ 21,90\n2 carnes, cheddar e molho super\n\nDattebayo! Qual versão do ninja você quer?",
            actions: ['Adicionar Naruto Simples', 'Adicionar Naruto Sábio', 'Sugerir Combo Naruto']
        };
    }
    
    if (message.includes('sasuke')) {
        return {
            text: "⚡ **BURGERS DO SASUKE:**\n\n🥇 Burger do Sasuke - R$ 16,90\n1 carne, mussarela e molho fumaça\n\n👁️ Burger do Sasuke Susanoo - R$ 21,90\n2 carnes, mussarela e molho fumaça\n\nO poder do Sharingan em forma de burger! Qual você prefere?",
            actions: ['Adicionar Sasuke Simples', 'Adicionar Sasuke Susanoo', 'Sugerir Combo Sasuke']
        };
    }
    
    // Combo requests
    if (message.includes('combo') || message.includes('sugest') || message.includes('popular')) {
        return {
            text: "🎯 **COMBOS ÉPICOS:**\n\n🥇 **COMBO SAYAJIN** - R$ 41,70\nGoku SSJ 2 + Batata Sayajins + Coca Cola\n\n🥈 **COMBO NINJA** - R$ 36,70\nNaruto Sábio + Chips do Poder + Guaraná\n\n🥉 **COMBO PRÍNCIPE** - R$ 32,70\nVegeta + Batata Sayajins + Água C/Gás\n\nTodos os combos têm desconto especial!",
            actions: ['Adicionar Combo Sayajin', 'Adicionar Combo Ninja', 'Adicionar Combo Príncipe', 'Montar Combo Personalizado']
        };
    }
    
    // Cart management
    if (message.includes('carrinho') || message.includes('pedido')) {
        if (cart.length === 0) {
            return {
                text: "🛒 Seu carrinho está vazio! Vamos adicionar alguns itens deliciosos?",
                actions: ['Ver Menu', 'Sugestões Populares', 'Combos']
            };
        } else {
            const cartSummary = cart.map(item => `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`).join('\n');
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return {
                text: `🛒 **SEU PEDIDO ATUAL:**\n\n${cartSummary}\n\n💰 **Total: R$ ${total.toFixed(2).replace('.', ',')}**\n\nO que você gostaria de fazer?`,
                actions: ['Adicionar Mais Itens', 'Remover Item', 'Finalizar Pedido', 'Limpar Carrinho']
            };
        }
    }
    
    // Payment method queries
    if (message.includes('pagamento') || message.includes('pagar') || message.includes('forma')) {
        return {
            text: "💳 **FORMAS DE PAGAMENTO ACEITAS:**\n\n💳 **Pix** - Instantâneo e seguro\n💳 **Cartão** - Débito ou crédito\n💵 **Dinheiro** - Com opção de troco\n\nQual forma você prefere?",
            actions: ['Pagar com Pix', 'Pagar com Cartão', 'Pagar com Dinheiro', 'Finalizar Pedido']
        };
    }
    
    // Finalization
    if (message.includes('finalizar') || message.includes('terminar') || message.includes('whatsapp')) {
        if (cart.length === 0) {
            return {
                text: "❌ Não é possível finalizar um pedido vazio! Adicione alguns itens primeiro.",
                actions: ['Ver Menu', 'Sugestões Rápidas']
            };
        } else {
            return {
                text: "🎉 **VAMOS FINALIZAR SEU PEDIDO!**\n\nPara enviar pelo WhatsApp, você precisa:\n1️⃣ Revisar seu pedido\n2️⃣ Preencher nome, telefone e endereço\n3️⃣ Escolher forma de pagamento\n4️⃣ Clicar em 'Enviar pelo WhatsApp'\n\nVou te levar para o carrinho agora!",
                actions: ['Ir para Carrinho', 'Revisar Pedido', 'Ver Formas de Pagamento']
            };
        }
    }
    
    // Help requests
    if (message.includes('ajuda') || message.includes('help')) {
        return {
            text: "🤖 **COMO POSSO AJUDAR:**\n\n✅ Ver menu completo\n✅ Sugerir combos\n✅ Adicionar itens ao carrinho\n✅ Gerenciar seu pedido\n✅ Finalizar pelo WhatsApp\n✅ Explicar qualquer prato\n\nMe diga o que você precisa!",
            actions: ['Ver Menu', 'Sugerir Combos', 'Ver Meu Pedido']
        };
    }
    
    // Greetings
    if (message.match(/(oi|olá|hey|konnichiwa)/)) {
        return {
            text: "🐉 Konnichiwa! Bem-vindo ao Burger e Otakus! Sou Shenron e estou aqui para te ajudar a fazer o pedido perfeito! ⚡\n\nO que você gostaria de fazer?",
            actions: ['Ver Menu', 'Sugestões Populares', 'Montar Combo']
        };
    }
    
    // Default response
    return {
        text: "🤔 Desculpe, não entendi completamente. Posso te ajudar com:\n\n• Ver o menu completo\n• Sugerir combos\n• Adicionar itens ao carrinho\n• Finalizar seu pedido\n\nO que você gostaria de fazer?",
        actions: ['Ver Menu', 'Sugestões', 'Ver Carrinho', 'Ajuda']
    };
}

// Send AI message
function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessageToChat(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process and respond
    setTimeout(() => {
        hideTypingIndicator();
        const response = processAIMessage(message);
        addMessageToChat(response.text, 'ai', response.actions);
    }, 1500);
}

// Add message to chat
function addMessageToChat(message, sender, actions = null) {
    const chat = document.getElementById('aiChat');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
    
    let messageHTML = `<p>${message.replace(/\n/g, '<br>')}</p>`;
    
    if (actions && actions.length > 0) {
        messageHTML += `
            <div class="ai-action-buttons">
                ${actions.map(action => `
                    <button class="ai-action-btn" onclick="handleAIAction('${action}')">${action}</button>
                `).join('')}
            </div>
        `;
    }
    
    messageDiv.innerHTML = messageHTML;
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
}

// Show/hide typing indicator
function showTypingIndicator() {
    const chat = document.getElementById('aiChat');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        🤖 Shenron está pensando
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chat.appendChild(typingDiv);
    chat.scrollTop = chat.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// Handle AI actions
function handleAIAction(action) {
    // Add user action as message
    addMessageToChat(action, 'user');
    
    // Show typing
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        
        switch(action) {
            case 'Ver Menu Completo':
            case 'Ver Menu':
                const menuResponse = processAIMessage('menu');
                addMessageToChat(menuResponse.text, 'ai', menuResponse.actions);
                break;
                
            case 'Sugestões Populares':
            case 'Sugestões':
                const popularResponse = processAIMessage('combo');
                addMessageToChat(popularResponse.text, 'ai', popularResponse.actions);
                break;
                
            case 'Montar Combo':
            case 'Montar Combo Personalizado':
                addMessageToChat('🎯 Vamos montar seu combo perfeito!\n\nEscolha uma categoria para começar:', 'ai', ['Burgers Simples', 'Burgers Duplos', 'Acompanhamentos', 'Bebidas']);
                break;
                
            case 'Adicionar Goku Simples':
                addToCart(1);
                addMessageToChat('✅ Burger do Goku adicionado! Kamehameha de sabor! ⚡', 'ai', ['Continuar Comprando', 'Finalizar Pedido']);
                break;
                
            case 'Adicionar Goku SSJ 2':
                addToCart(5);
                addMessageToChat('✅ Burger do Goku SSJ 2 adicionado! Poder máximo! 🔥', 'ai', ['Continuar Comprando', 'Finalizar Pedido']);
                break;
                
            case 'Adicionar Vegeta Simples':
                addToCart(2);
                addMessageToChat('✅ Burger do Vegeta adicionado! Orgulho Sayajin! 👑', 'ai', ['Continuar Comprando', 'Finalizar Pedido']);
                break;
                
            case 'Adicionar Vegeta Duplo':
                addToCart(6);
                addMessageToChat('✅ Burger do Vegeta Duplo adicionado! Poder do príncipe! 🔥', 'ai', ['Continuar Comprando', 'Finalizar Pedido']);
                break;
                
            case 'Adicionar Naruto Simples':
                addToCart(3);
                addMessageToChat('✅ Burger do Naruto adicionado! Dattebayo! 🍜', 'ai', ['Continuar Comprando', 'Finalizar Pedido']);
                break;
                
            case 'Adicionar Naruto Sábio':
                addToCart(7);
                addMessageToChat('✅ Burger do Naruto Sábio adicionado! Modo Sábio ativado! 🦊', 'ai', ['Continuar Comprando', 'Finalizar Pedido']);
                break;
                
            case 'Adicionar Sasuke Simples':
                addToCart(4);
                addMessageToChat('✅ Burger do Sasuke adicionado! Sharingan ativado! ⚡', 'ai', ['Continuar Comprando', 'Finalizar Pedido']);
                break;
                
            case 'Adicionar Sasuke Susanoo':
                addToCart(8);
                addMessageToChat('✅ Burger do Sasuke Susanoo adicionado! Poder supremo! 👁️', 'ai', ['Continuar Comprando', 'Finalizar Pedido']);
                break;
                
            case 'Adicionar Combo Sayajin':
                combos.sayajin.forEach(item => addToCart(item.id));
                addMessageToChat('✅ Combo Sayajin completo adicionado! O mais poderoso! ⚡🍔🍟🥤', 'ai', ['Ver Carrinho', 'Continuar Comprando', 'Finalizar Pedido']);
                break;
                
            case 'Adicionar Combo Ninja':
                combos.ninja.forEach(item => addToCart(item.id));
                addMessageToChat('✅ Combo Ninja completo adicionado! Técnica secreta! 🥷🍔🍟🥤', 'ai', ['Ver Carrinho', 'Continuar Comprando', 'Finalizar Pedido']);
                break;
                
            case 'Adicionar Combo Príncipe':
                combos.principe.forEach(item => addToCart(item.id));
                addMessageToChat('✅ Combo Príncipe completo adicionado! Digno da realeza! 👑🍔🍟🥤', 'ai', ['Ver Carrinho', 'Continuar Comprando', 'Finalizar Pedido']);
                break;
                
            case 'Ver Carrinho':
            case 'Ver Meu Pedido':
            case 'Revisar Pedido':
                const cartResponse = processAIMessage('carrinho');
                addMessageToChat(cartResponse.text, 'ai', cartResponse.actions);
                break;
                
            case 'Ir para Carrinho':
                toggleAI();
                toggleCart();
                break;
                
            case 'Finalizar Pedido':
                if (cart.length > 0) {
                    toggleAI();
                    toggleCart();
                    addMessageToChat('🎉 Redirecionado para finalização! Preencha seus dados (nome, telefone e endereço) e envie pelo WhatsApp! 🚀', 'ai');
                } else {
                    addMessageToChat('❌ Carrinho vazio! Adicione itens primeiro.', 'ai', ['Ver Menu', 'Sugestões']);
                }
                break;
                
            case 'Limpar Carrinho':
                cart = [];
                updateCartUI();
                addMessageToChat('🗑️ Carrinho limpo! Vamos começar um novo pedido?', 'ai', ['Ver Menu', 'Sugestões']);
                break;
                
            case 'Remover Item':
                if (cart.length > 0) {
                    const itemList = cart.map((item, index) => `${index + 1}. ${item.name} (${item.quantity}x)`).join('\n');
                    addMessageToChat(`🗑️ **ITENS NO CARRINHO:**\n\n${itemList}\n\nClique no item que deseja remover:`, 'ai', 
                        cart.map((item, index) => `Remover ${item.name}`)
                    );
                } else {
                    addMessageToChat('❌ Carrinho vazio! Não há itens para remover.', 'ai', ['Ver Menu']);
                }
                break;
                
            case 'Ver Formas de Pagamento':
                const paymentResponse = processAIMessage('pagamento');
                addMessageToChat(paymentResponse.text, 'ai', paymentResponse.actions);
                break;
                
            case 'Pagar com Pix':
                addMessageToChat('💳 Pix selecionado! Rápido e seguro. No carrinho você pode finalizar seu pedido com esta forma de pagamento.', 'ai', ['Ir para Carrinho', 'Continuar Comprando']);
                break;
                
            case 'Pagar com Cartão':
                addMessageToChat('💳 Cartão selecionado! Débito ou crédito aceito. No carrinho você pode finalizar seu pedido.', 'ai', ['Ir para Carrinho', 'Continuar Comprando']);
                break;
                
            case 'Pagar com Dinheiro':
                addMessageToChat('💵 Dinheiro selecionado! Você pode informar o valor para troco no carrinho, se necessário.', 'ai', ['Ir para Carrinho', 'Continuar Comprando']);
                break;
                
            default:
                // Handle remove specific item
                if (action.startsWith('Remover ')) {
                    const itemName = action.replace('Remover ', '');
                    const itemToRemove = cart.find(item => item.name === itemName);
                    if (itemToRemove) {
                        removeFromCart(itemToRemove.id);
                        addMessageToChat(`✅ ${itemName} removido do carrinho!`, 'ai', ['Ver Carrinho', 'Continuar Comprando']);
                    }
                } else {
                    addMessageToChat('🤔 Ação não reconhecida. Como posso ajudar?', 'ai', ['Ver Menu', 'Ver Carrinho', 'Ajuda']);
                }
                break;
        }
    }, 1000);
}

// WhatsApp integration - UPDATED
function sendToWhatsApp() {
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const customerAddress = document.getElementById('customerAddress').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;
    const changeFor = document.getElementById('changeFor').value;
    
    if (!customerName || !customerPhone || !customerAddress || !paymentMethod) {
        alert('Por favor, preencha todos os campos obrigatórios (nome, telefone, endereço e forma de pagamento).');
        return;
    }
    
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Payment method display
    let paymentDisplay = '';
    switch(paymentMethod) {
        case 'pix':
            paymentDisplay = '💳 Pix';
            break;
        case 'card':
            paymentDisplay = '💳 Cartão';
            break;
        case 'cash':
            paymentDisplay = '💵 Dinheiro';
            if (changeFor && parseFloat(changeFor) > total) {
                paymentDisplay += ` (Troco para R$ ${parseFloat(changeFor).toFixed(2).replace('.', ',')})`;
            }
            break;
    }
    
    let message = `🍔 *PEDIDO - BURGER E OTAKUS* 🍔\n\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📱 *Telefone:* ${customerPhone}\n`;
    message += `📍 *Endereço:* ${customerAddress}\n`;
    message += `💰 *Pagamento:* ${paymentDisplay}\n\n`;
    message += `📋 *ITENS DO PEDIDO:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    cart.forEach(item => {
        message += `• ${item.name}\n`;
        message += `  Quantidade: ${item.quantity}x\n`;
        message += `  Valor: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
    
    if (paymentMethod === 'cash' && changeFor && parseFloat(changeFor) > total) {
        const change = parseFloat(changeFor) - total;
        message += `💵 *Troco: R$ ${change.toFixed(2).replace('.', ',')}*\n\n`;
    }
    
    message += `🚚 Aguardando confirmação para entrega!\n`;
    message += `⚡ Pedido feito via Cardápio Digital`;
    
    // Replace with actual WhatsApp number
    const whatsappNumber = '5571996447078';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Clear form and cart after sending
    cart = [];
    updateCartUI();
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('paymentMethod').value = '';
    document.getElementById('changeFor').value = '';
    toggleChangeField();
    toggleCart();
    
    // Show success message
    alert('Pedido enviado pelo WhatsApp! Obrigado! 🎉');
    
    window.open(whatsappURL, '_blank');
}

// Utility functions
function findItemById(id) {
    const allItems = [...menuData.burgers, ...menuData.sides, ...menuData.drinks];
    return allItems.find(item => item.id === id);
}

// Enhanced setup function
function setupEventListeners() {
    // AI input enter key
    document.getElementById('aiInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAIMessage();
        }
    });
    
    // Close modals with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (isCartOpen) toggleCart();
            if (isAIOpen) toggleAI();
        }
    });
    
    // Prevent body scroll when modals are open
    document.addEventListener('touchmove', function(e) {
        if (isCartOpen || isAIOpen) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Initialize cart display
updateCartUI();
