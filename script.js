class InlineCartManager{constructor(e){this.orderManager=e,this.inlineCart=document.getElementById("inline-cart"),this.inlineCartItems=document.getElementById("inline-cart-items"),this.inlineCartCount=document.getElementById("inline-cart-count"),this.inlineCartTotal=document.getElementById("inline-cart-total"),this.clearCartButton=document.getElementById("inline-cart-clear"),this.checkoutButton=document.getElementById("inline-cart-checkout"),this.setupEventListeners()}setupEventListeners(){this.clearCartButton?.addEventListener("click",()=>{this.orderManager.clearCart()}),this.checkoutButton?.addEventListener("click",()=>{this.orderManager.generateWhatsAppMessage()})}updateCart(e){if(!this.inlineCartItems){console.error("Inline cart items element not found");return}this.inlineCartItems.innerHTML="";let t=0;try{e.forEach((e,a)=>{let r=this.parsePrice(e.price);t+=r;let i=document.createElement("div");i.classList.add("inline-cart-item"),i.innerHTML=`
          <span>${e.name}</span>
          <div class="inline-cart-item-actions">
            <span>${e.price}</span>
            <button class="remove-inline-cart-item" data-index="${a}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;let n=i.querySelector(".remove-inline-cart-item");n?.addEventListener("click",()=>{this.orderManager.removeFromCart(a)}),this.inlineCartItems.appendChild(i)}),this.inlineCartCount&&(this.inlineCartCount.textContent=`${e.length} itens`),this.inlineCartTotal&&(this.inlineCartTotal.textContent=`R$ ${t.toFixed(2).replace(".",",")}`),this.inlineCart&&this.inlineCart.classList.toggle("active",e.length>0)}catch(a){console.error("Error updating inline cart:",a)}}parsePrice(e){try{return parseFloat(e.replace("R$ ","").replace(",","."))||0}catch(t){return console.error("Invalid price format:",e),0}}}class PromoManager{constructor(){this.combos=[{id:"segunda-combo",name:"Combo Segunda-Feira",description:"Hot-Dog Cl\xe1ssico + Batata + Refrigerante com desconto",originalPrices:[{item:"Hot-Dog Cl\xe1ssico",price:4.9},{item:"Batata Suprema",price:11.9},{item:"Coca-Cola",price:8}],comboPrice:29.9,availableDays:[1],items:["Hot-Dog Cl\xe1ssico","Batata Suprema","Coca-Cola 600ml"]},{id:"terca-combo",name:"Combo Ter\xe7a Mega",description:"Dog\xe3o Especial + Batata + Cerveja",originalPrices:[{item:"Dog\xe3o Especial",price:15},{item:"Batata Suprema",price:18.9},{item:"Heineken Long Neck",price:10}],comboPrice:39.9,availableDays:[2],items:["Dog\xe3o Especial","Batata Suprema","Heineken Long Neck"]},{id:"quarta-combo",name:"Combo Quarta no Balde",description:"2 Hot-Dogs + 2 Batatas + 2 Refrigerantes",originalPrices:[{item:"2x Hot-Dog Cl\xe1ssico",price:25.8},{item:"2x Batata Suprema",price:37.8},{item:"2x Coca-Cola 600ml",price:16}],comboPrice:49.9,availableDays:[3],items:["2x Hot-Dog Cl\xe1ssico","2x Batata Suprema","2x Coca-Cola 600ml"]},{id:"quinta-combo",name:"Combo Quinta Especial",description:"Hot-Dog Especial + Cerveja + Batata",originalPrices:[{item:"Hot-Dog Especial",price:13.9},{item:"Heineken Long Neck",price:10},{item:"Batata Suprema",price:18.9}],comboPrice:44.9,availableDays:[4],items:["Hot-Dog Especial","Heineken Long Neck","Batata Suprema"]},{id:"canela-fina",name:"Combo Canela Fina",description:"Hot-Dog Especial + Batata + Refrigerante",originalPrices:[{item:"Hot-Dog Especial",price:13.9},{item:"Batata Suprema",price:18.9},{item:"Coca-Cola 600ml",price:8}],comboPrice:34.9,availableDays:[5,6],items:["Hot-Dog Especial","Batata Suprema","Coca-Cola 600ml"]},{id:"domingo-combo",name:"Combo Domingo Fam\xedlia",description:"3 Hot-Dogs + 2 Batatas + 2 Refrigerantes",originalPrices:[{item:"3x Hot-Dog Cl\xe1ssico",price:38.7},{item:"2x Batata Suprema",price:37.8},{item:"2x Coca-Cola 600ml",price:16}],comboPrice:59.9,availableDays:[0],items:["3x Hot-Dog Cl\xe1ssico","2x Batata Suprema","2x Coca-Cola 600ml"]}],this.renderCombos()}calculateSavings(e){let t=e.originalPrices.reduce((e,t)=>e+t.price,0),a=t-e.comboPrice;return{originalTotal:t.toFixed(2),savings:a.toFixed(2)}}renderCombos(){let e=document.getElementById("promo-grid");e.innerHTML="";let t=this.getCurrentDate();if(this.combos.forEach(a=>{if(this.isComboAvailable(a,t)){let{originalTotal:r,savings:i}=this.calculateSavings(a),n=document.createElement("div");n.classList.add("promo-card");let o=a.originalPrices.map(e=>`<span class="original-price">${e.item}: R$ ${e.price.toFixed(2)}</span>`).join(""),s=(i/parseFloat(r)*100).toFixed(0);n.innerHTML=`
          <h3>${a.name}</h3>
          <p>${a.description}</p>
          
          <div class="original-prices">
            ${o}
          </div>
          
          <div class="promo-savings">
            Economize: R$ ${i}
          </div>
          
          <span class="promo-price">Combo por: R$ ${a.comboPrice.toFixed(2)}</span>
          
          ${s>0?`<span class="promo-discount">${s}% OFF</span>`:""}
        `;let l=document.createElement("button");l.textContent="Adicionar Combo",l.classList.add("add-promo-to-cart","add-to-cart"),l.addEventListener("click",()=>{let e=window.orderManager;e?e.addToCart({name:a.name,price:`R$ ${a.comboPrice.toFixed(2)}`,isPromo:!0,items:a.items,originalTotal:`R$ ${r}`}):(console.error("Order Manager not initialized"),this.showInitializationError())}),n.appendChild(l),e.appendChild(n)}}),0===e.children.length){let a=document.createElement("p");a.textContent="Nenhuma promo\xe7\xe3o dispon\xedvel hoje.",a.style.textAlign="center",a.style.width="100%",e.appendChild(a)}}showInitializationError(){let e=document.createElement("div");e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.width="100%",e.style.height="100%",e.style.backgroundColor="rgba(0,0,0,0.7)",e.style.display="flex",e.style.justifyContent="center",e.style.alignItems="center",e.style.zIndex="1000";let t=document.createElement("div");t.style.backgroundColor="white",t.style.padding="2rem",t.style.borderRadius="10px",t.innerHTML=`
      <h2>Erro de Inicializa\xe7\xe3o</h2>
      <p>Ocorreu um erro ao carregar o sistema de pedidos.</p>
      <button onclick="window.location.reload()">Recarregar P\xe1gina</button>
    `,e.appendChild(t),document.body.appendChild(e)}getCurrentDate(){try{let e=new Date;if(this.isDateManipulated(e))throw Error("Data inv\xe1lida detectada");return e}catch(t){return console.error("Erro ao obter data:",t),alert("N\xe3o foi poss\xedvel verificar a data das promo\xe7\xf5es."),null}}isDateManipulated(e){let t=Date.now(),a=e.getTime();return Math.abs(t-a)>6e4||2023>e.getFullYear()||e.getFullYear()>2025}isComboAvailable(e,t){try{if(!e||!t)return console.warn("Invalid combo or date"),!1;let a=t.getDay();return e.availableDays.includes(a)}catch(r){return console.error("Error checking combo availability:",r),!1}}}class InventoryManager{constructor(){this.unavailableItems=["Coca Cola Lata Zero","Guarana Lata"],this.initializeUnavailableItems()}initializeUnavailableItems(){this.unavailableItems.forEach(e=>{this.markItemUnavailable(e)})}markItemUnavailable(e){let t=[...document.querySelectorAll(".menu-item"),...document.querySelectorAll(".drink-item")],a=t.find(t=>t.querySelector("h3, span")?.textContent.trim()===e.trim());if(a){a.classList.add("unavailable");let r=a.querySelector(".add-to-cart");r&&(r.disabled=!0,r.textContent="Indispon\xedvel")}}markItemAvailable(e){let t=[...document.querySelectorAll(".menu-item"),...document.querySelectorAll(".drink-item")],a=t.find(t=>t.querySelector("h3, span")?.textContent.trim()===e.trim());if(a){a.classList.remove("unavailable");let r=a.querySelector(".add-to-cart");r&&(r.disabled=!1,r.textContent="Adicionar")}}}class OrderManager{constructor(){try{this.cart=[],this.initializeAddToCartButtons(),this.setupScrollHandlers(),this.setupFloatAnimation(),this.setupCartModal(),window.orderManager=this,this.inlineCartManager=new InlineCartManager(this),this.promoManager=new PromoManager,this.inventoryManager=new InventoryManager,window.markItemUnavailable=e=>{this.inventoryManager.markItemUnavailable(e)},window.markItemAvailable=e=>{this.inventoryManager.markItemAvailable(e)}}catch(e){console.error("Initialization error:",e),this.showInitializationError()}}initializeAddToCartButtons(){let e=document.querySelectorAll(".add-to-cart");e.forEach(e=>{e.addEventListener("click",e=>{let t=e.target.closest(".menu-item, .drink-item"),a=t.querySelector("h3, span").textContent,r=t.querySelector(".price").textContent;this.addToCart({name:a,price:r,element:t})})})}addToCart(e){try{if(!e.name||!e.price)throw Error("Invalid cart item");this.cart.push(e),this.updateCartDisplay(),this.inlineCartManager.updateCart(this.cart)}catch(t){console.error("Add to cart error:",t),alert("Could not add item to cart. Please try again.")}}clearCart(){this.cart=[],this.updateCartDisplay(),this.inlineCartManager.updateCart(this.cart),document.getElementById("cart-count").textContent="0"}removeFromCart(e){this.cart.splice(e,1),this.updateCartDisplay(),this.inlineCartManager.updateCart(this.cart)}updateCartDisplay(){let e=document.getElementById("cart-count"),t=document.getElementById("cart-items"),a=document.getElementById("cart-total");if(!e||!t||!a){console.error("Elementos do carrinho n\xe3o encontrados"),this.showInitializationError();return}e.textContent=this.cart.length,t.innerHTML="";let r=0;this.cart.forEach((e,a)=>{let i=parseFloat(e.price.replace("R$ ","").replace(",","."));r+=i;let n=document.createElement("div");n.classList.add("cart-item"),e.isPromo?(n.classList.add("promo-cart-item"),n.innerHTML=`
          <span>${e.name}</span>
          <div>
            <span style="text-decoration: line-through; color: #888; margin-right: 10px;">${e.originalTotal}</span>
            <span style="color: var(--red); font-weight: bold;">${e.price}</span>
          </div>
          <button class="remove-item" data-index="${a}">Remover</button>
        `):n.innerHTML=`
          <span>${e.name}</span>
          <span>${e.price}</span>
          <button class="remove-item" data-index="${a}">Remover</button>
        `,t.appendChild(n)}),a.textContent=`R$ ${r.toFixed(2).replace(".",",")}`;let i=t.querySelectorAll(".remove-item");i.forEach(e=>{e.addEventListener("click",e=>{let t=e.target.getAttribute("data-index");this.cart.splice(t,1),this.updateCartDisplay(),this.inlineCartManager.updateCart(this.cart)})})}setupScrollHandlers(){document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",function(e){e.preventDefault();try{let t=this.getAttribute("href");if(t&&t.startsWith("#")){let a=document.querySelector(t);a?a.scrollIntoView({behavior:"smooth"}):console.warn(`Target element ${t} not found`)}}catch(r){console.error("Error in scroll handler:",r)}})})}setupFormHandler(){let e=document.querySelector(".contact-form");e.addEventListener("submit",function(e){e.preventDefault(),alert("Pedido enviado com sucesso! Entraremos em contato para confirma\xe7\xe3o."),this.reset()})}setupFloatAnimation(){let e=document.querySelectorAll(".menu-item, .drink-item");e.forEach(e=>{e.style.transition="transform 0.3s ease",e.addEventListener("mouseover",()=>{e.style.transform="translateY(-5px)"}),e.addEventListener("mouseout",()=>{e.style.transform="translateY(0)"})})}setupCartModal(){let e=document.getElementById("cart-link"),t=document.getElementById("cart-modal"),a=document.querySelector(".close-modal"),r=document.getElementById("checkout-btn");e.addEventListener("click",e=>{e.preventDefault(),t.style.display="block"}),a.addEventListener("click",()=>{t.style.display="none"}),r.addEventListener("click",()=>{this.generateWhatsAppMessage()}),window.addEventListener("click",e=>{e.target===t&&(t.style.display="none")})}showInitializationError(){let e=document.createElement("div");e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.width="100%",e.style.height="100%",e.style.backgroundColor="rgba(0,0,0,0.7)",e.style.display="flex",e.style.justifyContent="center",e.style.alignItems="center",e.style.zIndex="1000";let t=document.createElement("div");t.style.backgroundColor="white",t.style.padding="2rem",t.style.borderRadius="10px",t.innerHTML=`
      <h2>Erro de Inicializa\xe7\xe3o</h2>
      <p>Ocorreu um erro ao carregar o sistema de pedidos.</p>
      <button onclick="window.location.reload()">Recarregar P\xe1gina</button>
    `,e.appendChild(t),document.body.appendChild(e)}generateWhatsAppMessage(){try{if(0===this.cart.length)throw Error("Carrinho vazio");let e=document.getElementById("customer-details-modal"),t=e.querySelector(".close-modal"),a=document.getElementById("fill-previous-data");e.style.display="block";let r=localStorage.getItem("customerData");a.style.display=r?"block":"none";let i=()=>{e.style.display="none"};t.addEventListener("click",i),e.addEventListener("click",t=>{t.target===e&&i()}),a.addEventListener("click",()=>{let e=localStorage.getItem("customerData");if(e){let t=JSON.parse(e);document.getElementById("customer-name").value=t.name,document.getElementById("customer-phone").value=t.phone,document.getElementById("customer-address").value=t.address}});let n=document.getElementById("customer-details-form");n.onsubmit=e=>{e.preventDefault();let t={name:document.getElementById("customer-name").value,phone:document.getElementById("customer-phone").value,address:document.getElementById("customer-address").value};localStorage.setItem("customerData",JSON.stringify(t));let a="*Pedido do Dog\xe3o do Canela Fina*\n\n";a+=`*Nome:* ${t.name}
`,a+=`*Telefone:* ${t.phone}
`,a+=`*Endere\xe7o:* ${t.address}

`,a+="*Itens do Pedido:*\n";let r=0,i={};this.cart.forEach(e=>{a+=`
${e.name}
`;let t=parseFloat(e.price.replace("R$ ","").replace(",","."));i[e.name]=(i[e.name]||0)+1,r+=t}),Object.entries(i).forEach(([e,t])=>{a+=`${t}x ${e}
`}),a+="\n*Observa\xe7\xe3o:* Taxa de entrega ser\xe1 calculada conforme endere\xe7o.\n",a+=`*Total:* R$ ${r.toFixed(2).replace(".",",")}`;let n=encodeURIComponent(a),o=`https://wa.me/5571996447078?text=${n}`;window.open(o,"_blank"),window.location.reload()}}catch(o){console.error("Erro no checkout:",o),alert(o.message||"N\xe3o foi poss\xedvel finalizar o pedido.")}}}class RestaurantStatusManager{constructor(){this.SITE_STATUS="auto",this.statusModal=document.getElementById("restaurant-status-modal"),this.viewMenuBtn=document.getElementById("view-menu-btn"),this.closedOverlay=this.createClosedOverlay(),this.businessHours={friday:{open:"18:00",close:"00:00"},weekendDays:{open:"16:00",close:"00:00"}},this.initializeStatusCheck(),this.setupEventListeners()}createClosedOverlay(){let e=document.createElement("div");e.classList.add("closed-overlay");let t=document.createElement("div");return t.classList.add("closed-overlay-content"),t.innerHTML=`
      <h3>Estamos Fechados no Momento</h3>
      <p>Voc\xea pode visualizar o card\xe1pio, mas n\xe3o \xe9 poss\xedvel fazer pedidos fora do nosso hor\xe1rio de funcionamento.</p>
      <p>Hor\xe1rio de funcionamento:</p>
      <p>Sexta-feira: 18:00 - 00:00</p>
      <p>S\xe1bado e Domingo: 16:00 - 00:00</p>
    `,e.appendChild(t),document.body.appendChild(e),e}initializeStatusCheck(){this.checkRestaurantStatus()}setupEventListeners(){this.viewMenuBtn?.addEventListener("click",()=>{this.statusModal.style.display="none",document.body.classList.remove("closed-site")})}checkRestaurantStatus(){let e=new Date,t=e.getDay(),a=this.formatTime(e),r=!1;"open"===this.SITE_STATUS?r=!0:"closed"===this.SITE_STATUS?r=!1:5===t?r=this.isTimeInRange(a,this.businessHours.friday.open,this.businessHours.friday.close):(6===t||0===t)&&(r=this.isTimeInRange(a,this.businessHours.weekendDays.open,this.businessHours.weekendDays.close)),this.updateSiteStatus(r)}formatTime(e){let t=e.getHours().toString().padStart(2,"0"),a=e.getMinutes().toString().padStart(2,"0");return`${t}:${a}`}isTimeInRange(e,t,a){let[r,i]=e.split(":").map(Number),[n,o]=t.split(":").map(Number),[s,l]=a.split(":").map(Number),c=60*r+i,d=60*n+o,m=60*s+l;return m<d?c>=d||c<=m:c>=d&&c<=m}updateSiteStatus(e){e?(document.body.classList.remove("closed-site"),this.statusModal.style.display="none",document.querySelectorAll(".add-to-cart").forEach(e=>{e.disabled=!1,e.textContent="Adicionar"})):(document.body.classList.add("closed-site"),this.statusModal.style.display="flex",document.querySelectorAll(".add-to-cart").forEach(e=>{e.disabled=!0,e.textContent="Indispon\xedvel"}))}manualStatusOverride(e){this.SITE_STATUS=e,this.checkRestaurantStatus()}}window.addEventListener("error",e=>{console.error("Unhandled error:",e.error),alert("Ocorreu um erro inesperado. Por favor, recarregue a p\xe1gina.")}),document.addEventListener("DOMContentLoaded",()=>{try{let e=document.querySelector(".hamburger-menu"),t=document.querySelector("nav");e&&t&&(e.addEventListener("click",()=>{e.classList.toggle("active"),t.classList.toggle("active")}),t.querySelectorAll("a").forEach(a=>{a.addEventListener("click",()=>{e.classList.remove("active"),t.classList.remove("active")})})),new OrderManager}catch(a){console.error("System initialization failed:",a),alert("Could not load the ordering system. Please reload the page.")}}),document.addEventListener("DOMContentLoaded",()=>{window.restaurantStatusManager=new RestaurantStatusManager}),document.querySelectorAll(".quantity-control").forEach(e=>{let t=e.querySelector(".qty-input"),a=e.querySelector(".minus"),r=e.querySelector(".plus");a.addEventListener("click",()=>{let e=parseInt(t.value);e>0&&(t.value=e-1)}),r.addEventListener("click",()=>{let e=parseInt(t.value);e<2&&(t.value=e+1)})});
