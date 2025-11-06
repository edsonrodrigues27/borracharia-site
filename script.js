// Menu hamburger accessible
(function(){
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('nav-links');

  if(!btn || !nav) return;

  function toggleMenu(){
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    if(!open){
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '68px';
      nav.style.right = '1rem';
      nav.style.background = 'linear-gradient(180deg, rgba(11,11,11,0.98), rgba(11,11,11,0.96))';
      nav.style.padding = '0.8rem';
      nav.style.borderRadius = '12px';
      nav.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)';
    } else {
      nav.style.display = '';
      nav.style.position = '';
      nav.style.top = '';
      nav.style.right = '';
      nav.style.padding = '';
      nav.style.background = '';
      nav.style.borderRadius = '';
      nav.style.boxShadow = '';
    }
  }

  btn.addEventListener('click', toggleMenu);

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if(window.innerWidth < 768){
        btn.setAttribute('aria-expanded', 'false');
        nav.style.display = '';
      }
    });
  });

  window.addEventListener('resize', () => {
    if(window.innerWidth >= 768){
      nav.style.display = '';
      btn.setAttribute('aria-expanded','false');
    }
  });
})();

// Fade-in on scroll
(function(){
  const els = document.querySelectorAll('.fade-in');
  function reveal(){
    els.forEach(el=>{
      const r = el.getBoundingClientRect();
      if(r.top < window.innerHeight - 80){
        el.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', reveal);
  window.addEventListener('load', reveal);
  reveal();
})();

// Form -> WhatsApp
(function(){
  const form = document.getElementById('form-agendamento');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const nome = document.getElementById('nome').value || '';
    const telefone = document.getElementById('telefone').value || '';
    const servico = document.getElementById('servico').value || '';
    const data = document.getElementById('data').value || '';
    const hora = document.getElementById('hora').value || '';

    let mensagem = `Olá! Gostaria de agendar um serviço.%0A*Nome:* ${nome}%0A*Telefone:* ${telefone}%0A*Serviço:* ${servico}%0A*Data:* ${data}%0A*Horário:* ${hora}`;

    const numero = '5581984948307';
    const url = `https://wa.me/${numero}?text=${mensagem}`;
    window.open(url, '_blank');
  });
})();