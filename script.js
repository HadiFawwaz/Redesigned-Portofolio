// =======================
// Helpers
// =======================

// copy link ke clipboard
function copyLink(u) {
  navigator.clipboard?.writeText(u)
    .then(() => alert('Link copied to clipboard'));
}

// handle submit form contact
function handleSubmit(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  alert(
    'Thanks ' + (f.get('name') || 'there') +
    " — message sent (demo).\nI'll contact you at " +
    (f.get('email') || 'your email')
  );
  e.target.reset();
}

// ganti warna tema / accent
function setAccent(cls) {
  document.body.classList.remove('accent-violet','accent-sunset','accent-teal');
  document.body.classList.add(cls);
  localStorage.setItem('accent', cls);
}


// =======================
// Modal (popup project)
// =======================
document.addEventListener('DOMContentLoaded', function() {

  // restore accent
  const savedAccent = localStorage.getItem('accent') || 'accent-violet';
  document.body.classList.add(savedAccent);

  // ambil elemen modal
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTags = document.getElementById('modalTags');
  const modalUrl = document.getElementById('modalUrl');
  let currentProjectEl = null;

  // buka modal ketika project diklik
  document.querySelectorAll('.project').forEach(p=>{
    p.addEventListener('click', (ev)=>{
      if(ev.target.closest('button') || ev.target.closest('a')) return; // biar tombol/ link gak ikut buka modal
      openModalFromProject(p);
    });
  });

  window.openModalFromProject = function(p){
    currentProjectEl = p;
    modalImg.src = p.dataset.image || '';
    modalTitle.textContent = p.dataset.title || '';
    modalDesc.textContent = p.dataset.desc || '';
    modalTags.textContent = (p.dataset.tags || '').split(',').join(' • ');
    modalUrl.href = p.dataset.url || '#';
    modalBackdrop.classList.add('show');
    modalBackdrop.setAttribute('aria-hidden', 'false');
  };

  window.closeModal = function(){
    modalBackdrop.classList.remove('show');
    modalBackdrop.setAttribute('aria-hidden','true');
  };

  // klik backdrop nutup modal
  modalBackdrop.addEventListener('click', (e)=>{
    if(e.target === modalBackdrop) closeModal();
  });

  // share project
  window.shareProject = function(){
    if(!modalUrl.href || modalUrl.href === '#') return alert('No URL');
    navigator.clipboard.writeText(modalUrl.href)
      .then(()=>alert('Project URL copied'));
  };

  // =======================
  // Featured project
  // =======================
  function applyFeatured(){
    const active = localStorage.getItem('featured');
    document.querySelectorAll('.project').forEach(p=>{
      // hapus badge lama
      p.querySelectorAll('.featured-badge').forEach(b=>b.remove());
      const id = p.dataset.title || p.querySelector('h3')?.innerText;
      if(id === active){
        const b = document.createElement('div');
        b.className = 'featured-badge';
        b.innerHTML = '<span class="featured">Featured</span>';
        p.querySelector('.meta').appendChild(b);
      }
    });
  }

  window.setFeatured = function(btn){
    const project = btn.closest('.project');
    if(!project) return;
    const id = project.dataset.title || project.querySelector('h3').innerText;
    localStorage.setItem('featured', id);
    applyFeatured();
    alert('"'+id+'" set as active');
  };

  window.toggleFeaturedFromModal = function(){
    if(!currentProjectEl) return;
    const id = currentProjectEl.dataset.title;
    localStorage.setItem('featured', id);
    applyFeatured();
    alert('"'+id+'" set as active');
  };

  applyFeatured();


  // =======================
  // Scrollspy (navbar aktif)
  // =======================
  const sections = document.querySelectorAll('main[id], section[id]');
  const navLinks = document.querySelectorAll('#navLinks a');

  function setActive() {
    let index = sections.length - 1;

    // cek dari atas ke bawah
    for(let i = 0; i < sections.length; i++) {
      if(window.scrollY + window.innerHeight / 2 >= sections[i].offsetTop) {
        index = i;
      }
    }

    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector('#navLinks a[href="#' + sections[index].id + '"]');
    if(activeLink) activeLink.classList.add('active');
  }

  setActive();
  window.addEventListener('scroll', setActive);

  const tItems = document.querySelectorAll('.t-item');

const tObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.3 });

tItems.forEach(item => tObserver.observe(item));


  // =======================
  // Smooth scroll anchor
  // =======================
  document.querySelectorAll('a[href^="#"]').forEach(a=>
    a.addEventListener('click',function(e){
      const id=this.getAttribute('href');
      if(!id || id==="#") return;
      e.preventDefault();
      const el=document.querySelector(id);
      if(!el) return;
      const offset=16;
      window.scrollTo({
        top:el.getBoundingClientRect().top + window.scrollY - offset,
        behavior:'smooth'
      });
    })
  );


  // =======================
  // Animasi load (stagger + bar)
  // =======================
  window.addEventListener('load', ()=>{
    // animasi stagger
    document.querySelectorAll('.stagger').forEach(el=>{
      Array.from(el.children).forEach((c,i)=>
        setTimeout(()=>c.style.opacity=1, 120*i)
      );
    });

    // progress bar
    document.querySelectorAll('.bar > i').forEach((el, idx)=>{
      setTimeout(()=>{
        const st = el.getAttribute('style') || '';
        let width = '60%';
        if(st.indexOf('width:') > -1){
          try{
            const after = st.split('width:')[1];
            const num = after.split('%')[0].trim();
            if(num) width = num + '%';
          }catch(e){}
        }
        el.style.width = el.style.width || width;
      }, 200 + idx*220);
    });
  });

  // Esc untuk nutup modal
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeModal();
  });

}); // DOMContentLoaded


// =======================
// Expose helpers global
// =======================
window.copyLink = copyLink;
window.handleSubmit = handleSubmit;
window.setAccent = setAccent;
window.setFeatured = window.setFeatured || function(){};
window.toggleFeaturedFromModal = window.toggleFeaturedFromModal || function(){};
window.shareProject = window.shareProject || function(){};
window.closeModal = window.closeModal || function(){};
