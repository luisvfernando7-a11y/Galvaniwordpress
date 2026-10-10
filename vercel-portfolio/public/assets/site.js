'use strict';
(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      menu.setAttribute('aria-expanded', 'false');
      nav?.classList.remove('open');
      menu.focus();
    }
  });
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduce.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.06 });
    document.documentElement.classList.add('motion-ready');
    document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
  }
  document.querySelectorAll('.catalog').forEach(catalog => {
    const track = catalog.querySelector('.product-track');
    const cards = [...catalog.querySelectorAll('.product-card')];
    const filters = catalog.querySelector('.filters');
    const count = catalog.querySelector('.result-count');
    const empty = catalog.querySelector('.empty-results');
    const apply = () => {
      const chosen = filters ? [...filters.querySelectorAll('select')] : [];
      let visible = 0;
      cards.forEach(card => {
        const terms = JSON.parse(card.dataset.terms);
        const match = chosen.every(select => !select.value || terms[select.name]?.includes(select.value));
        card.hidden = !match;
        if (match) visible += 1;
      });
      count.textContent = `${visible} ${visible === 1 ? 'produto' : 'produtos'}`;
      empty.hidden = visible > 0;
      track.scrollLeft = 0;
    };
    filters?.addEventListener('change', apply);
    filters?.addEventListener('submit', event => event.preventDefault());
    filters?.addEventListener('reset', () => setTimeout(apply, 0));
    const move = direction => track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: reduce.matches ? 'instant' : 'smooth' });
    catalog.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => move(Number(button.dataset.direction))));
    track.addEventListener('keydown', event => {
      if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    });
  });
  document.querySelectorAll('.product-detail').forEach(link => {
    const dialog = document.getElementById(link.dataset.dialog);
    if (!dialog || typeof dialog.showModal !== 'function') return;
    link.addEventListener('click', event => {
      event.preventDefault();
      dialog.showModal();
      dialog.querySelector('.close-dialog').focus();
    });
    dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => link.focus());
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
  });
})();
