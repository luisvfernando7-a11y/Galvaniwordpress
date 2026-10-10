'use strict';
(() => {
  const key = 'rg-portfolio-cart-v1';
  const initial = () => ({ items: {}, fulfilment: 'retirada' });
  let state = initial();
  let storageAvailable = true;
  let products = [];
  const money = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
  const element = (tag, text, attrs = {}) => {
    const node = document.createElement(tag);
    if (text !== null) node.textContent = text;
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };
  const quantity = value => Math.max(1, Math.min(99, Math.trunc(Number(value) || 1)));
  function load() {
    state = initial();
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      if (!saved || typeof saved !== 'object') return;
      if (saved.fulfilment === 'entrega') state.fulfilment = 'entrega';
      for (const product of products) {
        const count = saved.items?.[product.slug];
        if (Number.isInteger(count) && count > 0) state.items[product.slug] = quantity(count);
      }
    } catch { storageAvailable = false; }
  }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(state)); }
    catch { storageAvailable = false; }
    document.querySelector('#storage-notice')?.toggleAttribute('hidden', storageAvailable);
  }
  function renderCart(focusSlug) {
    const container = document.querySelector('#cart-content');
    if (!container) return;
    container.replaceChildren();
    const selected = products.filter(p => state.items[p.slug]);
    if (!selected.length) {
      container.append(element('p', 'Sua seleção demonstrativa está vazia.'));
      container.append(element('a', 'Explorar a enoteca', { href: '/enoteca/', class: 'button' }));
    } else {
      const list = element('div', null, { class: 'cart-list' });
      let total = 0;
      for (const product of selected) {
        const count = state.items[product.slug];
        const row = element('article', null, { class: 'cart-row' });
        row.append(element('img', null, { src: product.image, alt: product.name + ' — fotografia ilustrativa' }));
        const copy = element('div', null);
        copy.append(element('a', product.name, { href: `/produto/${product.slug}/` }));
        copy.append(element('p', `${money(product.price)} · valor ilustrativo`));
        row.append(copy);
        const label = element('label', 'Quantidade');
        const input = element('input', null, { type: 'number', min: '1', max: '99', step: '1', value: String(count), 'data-quantity': product.slug, 'aria-label': 'Quantidade de ' + product.name });
        label.append(input);
        row.append(label);
        const remove = element('button', 'Remover', { type: 'button', 'data-remove': product.slug, 'aria-label': 'Remover ' + product.name });
        row.append(remove);
        list.append(row);
        total += product.price * count;
      }
      container.append(list, element('p', `Total ilustrativo: ${money(total)}`, { class: 'cart-total' }));
    }
    document.querySelectorAll('input[name=fulfilment]').forEach(input => { input.checked = input.value === state.fulfilment; });
    document.querySelector('#storage-notice')?.toggleAttribute('hidden', storageAvailable);
    if (focusSlug) [...container.querySelectorAll('[data-quantity]')].find(input=>input.dataset.quantity===focusSlug)?.focus();
  }
  const ready = fetch('/data/catalog.json').then(response => {
    if (!response.ok) throw new Error('Catálogo indisponível');
    return response.json();
  }).then(data => { products = data.catalog; load(); renderCart(); });
  ready.catch(() => {
    const node = document.querySelector('#cart-content') || document.querySelector('#site-status');
    if (node) node.textContent = 'Não foi possível carregar a seleção. Recarregue a página para tentar novamente.';
  });
  document.addEventListener('click', async event => {
    const add = event.target.closest('[data-add]');
    const remove = event.target.closest('[data-remove]');
    if (!add && !remove) return;
    try { await ready; } catch { return; }
    if (add) {
      const slug = add.dataset.add;
      if (!products.some(p=>p.slug===slug)) return;
      state.items[slug] = quantity((state.items[slug] || 0) + 1);
      save();
      if (storageAvailable) location.assign('/carrinho/');
      else {
        let notice = add.parentElement.querySelector('.storage-warning');
        if (!notice) { notice = element('p', '', { class: 'storage-warning', role: 'status' }); add.after(notice); }
        notice.textContent = 'Produto selecionado nesta página. Seu navegador bloqueou o armazenamento; habilite-o para manter a seleção ao abrir o carrinho.';
      }
    } else {
      delete state.items[remove.dataset.remove]; save(); renderCart();
      document.querySelector('#cart-status').textContent = 'Produto removido da seleção demonstrativa.';
      (document.querySelector('[data-remove]') || document.querySelector('#clear-cart'))?.focus();
    }
  });
  document.addEventListener('change', event => {
    const input = event.target.closest('[data-quantity]');
    if (!input || !products.some(p=>p.slug===input.dataset.quantity)) return;
    state.items[input.dataset.quantity] = quantity(input.value);
    save(); renderCart(input.dataset.quantity);
    document.querySelector('#cart-status').textContent = 'Quantidade atualizada. Valores apenas ilustrativos.';
  });
  document.querySelector('#fulfilment-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('fulfilment');
    try { await ready; } catch { return; }
    state.fulfilment = value === 'entrega' ? 'entrega' : 'retirada';
    save();
    document.querySelector('#cart-status').textContent = `Simulação de ${state.fulfilment} registrada ${storageAvailable ? 'neste navegador' : 'nesta página'}. Nenhum pedido foi criado e nenhuma compra será realizada.`;
  });
  document.querySelector('#clear-cart')?.addEventListener('click', () => {
    state = initial();
    try { localStorage.removeItem(key); } catch { storageAvailable = false; }
    renderCart();
    document.querySelector('#cart-status').textContent = 'Seleção e preferência locais apagadas.';
  });
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) { load(); renderCart(); } });
  const preview = document.querySelector('#account-preview');
  preview?.addEventListener('click', () => {
    const open = preview.getAttribute('aria-expanded') !== 'true';
    preview.setAttribute('aria-expanded', String(open));
    document.querySelector('#account-panel').hidden = !open;
  });
})();
