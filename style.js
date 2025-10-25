document.addEventListener('DOMContentLoaded', () => {
  const cartBtn = document.getElementById('cartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const closeCart = document.getElementById('closeCart');
  const cartItemsEl = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const addToCartBtns = document.querySelectorAll('.add-to-cart');
  const productGrid = document.getElementById('productGrid');
  const toTop = document.getElementById('toTop');
  const searchInput = document.getElementById('searchInput');

  let cart = {};

  function updateCartUI(){
    cartItemsEl.innerHTML = '';
    let total = 0;
    const items = Object.values(cart);
    if(items.length === 0){
      cartItemsEl.innerHTML = '<p style="color:var(--muted)">هیچ کالایی در سبد نیست.</p>';
    } else {
      items.forEach(it => {
        total += it.price * it.qty;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <img src="${it.img || 'https://source.unsplash.com/80x80/?product'}" alt="">
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <strong>${it.name}</strong>
              <span>${it.price}€</span>
            </div>
            <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
              <button class="icon-btn dec" data-id="${it.id}">−</button>
              <span>${it.qty}</span>
              <button class="icon-btn inc" data-id="${it.id}">+</button>
            </div>
          </div>
        `;
        cartItemsEl.appendChild(div);
      });
    }
    cartCount.textContent = items.reduce((s,i)=>s+i.qty,0);
    cartTotal.textContent = total + '€';
    cartItemsEl.querySelectorAll('.inc').forEach(b => b.addEventListener('click', e=>{
      const id = e.target.dataset.id;
      cart[id].qty++;
      updateCartUI();
    }));
    cartItemsEl.querySelectorAll('.dec').forEach(b => b.addEventListener('click', e=>{
      const id = e.target.dataset.id;
      cart[id].qty--;
      if(cart[id].qty<=0) delete cart[id];
      updateCartUI();
    }));
  }

  function handleAddToCart(e){
    const btn = e.currentTarget;
    const id = btn.dataset.id;
    const name = btn.dataset.name || btn.getAttribute('data-name') || 'محصول';
    const price = Number(btn.dataset.price || 0);
    if(!cart[id]) cart[id] = { id, name, price, qty: 0, img: '' };
    cart[id].qty++;
    updateCartUI();
    cartSidebar.classList.add('open');
  }
  addToCartBtns.forEach(b => b.addEventListener('click', handleAddToCart));

  cartBtn.addEventListener('click', ()=> cartSidebar.classList.add('open'));
  closeCart.addEventListener('click', ()=> cartSidebar.classList.remove('open'));

  const track = document.querySelector('.carousel-track');
  const items = Array.from(document.querySelectorAll('.carousel-item'));
  const prev = document.querySelector('.carousel-control.prev');
  const next = document.querySelector('.carousel-control.next');
  const dotsWrap = document.getElementById('carouselDots');
  let index = 0;
  let autoSlideInterval;

  function goToSlide(i){
    index = (i + items.length) % items.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  }
  function createDots(){
    dotsWrap.innerHTML = '';
    items.forEach((_,i)=>{
      const b = document.createElement('button');
      b.addEventListener('click', ()=> { goToSlide(i); resetAuto(); });
      dotsWrap.appendChild(b);
    });
    updateDots();
  }
  function updateDots(){
    Array.from(dotsWrap.children).forEach((b, i) => {
      b.classList.toggle('active', i === index);
    });
  }
  prev.addEventListener('click', ()=> { goToSlide(index-1); resetAuto(); });
  next.addEventListener('click', ()=> { goToSlide(index+1); resetAuto(); });

  function autoSlide(){
    autoSlideInterval = setInterval(()=> goToSlide(index+1), 5000);
  }
  function resetAuto(){
    clearInterval(autoSlideInterval);
    autoSlide();
  }
  createDots();
  goToSlide(0);
  autoSlide();

  const modal = document.getElementById('productModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalDescription = document.getElementById('modalDescription');
  const modalAdd = document.getElementById('modalAdd');
  const modalImages = document.getElementById('modalImages');

  function openProductModal(data){
    modalTitle.textContent = data.name;
    modalPrice.textContent = data.price + '€';
    modalDescription.textContent = data.description || 'توضیحات محصول موجود نیست.';
    modalAdd.dataset.id = data.id;
    modalAdd.dataset.name = data.name;
    modalAdd.dataset.price = data.price;
    modalImages.innerHTML = `<img src="${data.img || 'https://source.unsplash.com/800x800/?product'}" alt="">`;
    modal.setAttribute('aria-hidden','false');
    modal.classList.add('show');
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    modal.classList.remove('show');
  }

  document.querySelectorAll('.view-detail').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const card = e.target.closest('.product-card');
      const data = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: card.dataset.price,
        description: 'این یک توضیح نمونه برای محصول است. شما می‌توانید این متن را با توضیحات واقعی جایگزین کنید.',
        img: card.querySelector('img')?.src
      };
      openProductModal(data);
    });
  });
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=> { if(e.target === modal) closeModal(); });
  modalAdd.addEventListener('click', handleAddToCart);

  searchInput.addEventListener('input', (e)=>{
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('.product-card').forEach(card=>{
      const name = card.dataset.name.toLowerCase();
      card.style.display = name.includes(q) ? '' : 'none';
    });
  });

  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 300) toTop.style.display = 'block';
    else toTop.style.display = 'none';
  });
  toTop.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  hamburger.addEventListener('click', ()=> {
    if(mainNav.style.display === 'flex') mainNav.style.display = 'none';
    else mainNav.style.display = 'flex';
  });

  const checkoutBtn = document.getElementById('checkoutBtn');
  checkoutBtn.addEventListener('click', ()=>{
    if(Object.keys(cart).length === 0) {
      alert('سبد خرید خالی است!');
      return;
    }
    alert('پرداخت شبیه‌سازی شد — موفق باشید!');
    cart = {};
    updateCartUI();
    cartSidebar.classList.remove('open');
  });

  updateCartUI();

  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape'){
      cartSidebar.classList.remove('open');
      closeModal();
    }
  });
});
