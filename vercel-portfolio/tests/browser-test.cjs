const {chromium} = require(process.env.RG_PLAYWRIGHT_PATH || 'playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '../public');
const config = require('../vercel.json');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server = http.createServer((request,response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname); } catch { response.writeHead(400).end(); return; }
  let file = path.resolve(root,'.'+pathname);
  if (!file.startsWith(root+path.sep) && file!==root) { response.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
  let status = 200;
  if (!fs.existsSync(file)) { status=404; file=path.join(root,'404.html'); }
  const headers = Object.fromEntries(config.headers[0].headers.map(h=>[h.key,h.value]));
  response.writeHead(status,{'Content-Type':mime[path.extname(file)]||'application/octet-stream',...headers});
  response.end(fs.readFileSync(file));
});
const paths=[];
function walk(dir) { for(const entry of fs.readdirSync(dir,{withFileTypes:true})) { const file=path.join(dir,entry.name); if(entry.isDirectory())walk(file); else if(entry.name==='index.html')paths.push('/'+path.relative(root,path.dirname(file)).replaceAll(path.sep,'/')+(path.dirname(file)===root?'':'/')); } }
walk(root);
(async()=>{
 if (!process.env.RG_PORTFOLIO_URL) await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=(process.env.RG_PORTFOLIO_URL || 'http://127.0.0.1:'+server.address().port).replace(/\/$/,'');
 let browser;
 try {
  browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
  const errors=[], external=[], bad=[], mutations=[];
  const observe = async context => {
   await context.route('**/*',route=> { const url=route.request().url(); if(!url.startsWith(base+'/')) { external.push(url); return route.abort(); } if(!['GET','HEAD'].includes(route.request().method()))mutations.push(route.request().method()); return route.continue(); });
   context.on('page',page=>{ page.on('pageerror',error=>errors.push(error.message)); page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());}); page.on('response',r=>{if(r.status()>=400)bad.push(r.url());}); });
  };
  const desktop=await browser.newContext({viewport:{width:1440,height:1000}}); await observe(desktop);
  const page=await desktop.newPage();
  const visit=async(page,url)=> { const r=await page.goto(base+url,{waitUntil:'networkidle'});assert.equal(r.status(),200,url);await page.waitForFunction(()=>document.querySelector('#cart-content')?.childElementCount || !document.querySelector('#cart-content')); assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' overflow'); };
  const links=new Set();
  for(const url of paths) {
   await visit(page,url);
   assert.equal(await page.locator('h1').count(),1,url);
   assert.equal(await page.locator('meta[name=description]').count(),1,url);
   assert((await page.locator('footer').textContent()).includes('Projeto fictício'));
   await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(img=>{img.loading='eager';return img.decode().catch(()=>{});}));});
   assert.deepEqual(await page.locator('img').evaluateAll(imgs=>imgs.filter(img=>!img.naturalWidth).map(img=>img.src)),[],url+' images');
   for(const href of await page.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')))) {assert(href.startsWith('/')||href.startsWith('#'),url+' link '+href);if(href.startsWith('/'))links.add(href);}
   assert.equal(await page.locator('input[type=password], input[type=email]').count(),0);
  }
  for(const url of links) assert.equal((await desktop.request.get(base+url)).status(),200,url);
  await visit(page,'/');
  await page.keyboard.press('Tab'); assert(await page.locator('.skip').evaluate(el=>document.activeElement===el));
  assert.notEqual(await page.locator('.skip').evaluate(el=>getComputedStyle(el).outlineStyle),'none');
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,100));}scrollTo({top:0,behavior:'instant'});});
  await page.waitForTimeout(600);
  await page.screenshot({path:'/tmp/rg-portfolio-desktop.png',fullPage:true});
  await visit(page,'/gastronomia/');assert.equal(await page.locator('.product-card').count(),4);
  await visit(page,'/enoteca/');assert.equal(await page.locator('.product-card:visible').count(),9);
  await page.selectOption('[name=cultivo]','organico');assert.equal(await page.locator('.product-card:visible').count(),4);
  await page.selectOption('[name=cor]','laranja');assert.equal(await page.locator('.product-card:visible').count(),1);
  await page.selectOption('[name=cultivo]','natural');assert.equal(await page.locator('.product-card:visible').count(),1);
  await page.selectOption('[name=efervescencia]','espumante');assert.equal(await page.locator('.product-card:visible').count(),0);assert(await page.locator('.empty-results').isVisible());
  await page.click('.reset-filters');await page.waitForFunction(()=>[...document.querySelectorAll('.product-card')].filter(el=>!el.hidden).length===9);
  const track=page.locator('.product-track');await track.focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(500);assert(await track.evaluate(el=>el.scrollLeft)>0);
  const before=await track.evaluate(el=>el.scrollLeft);await page.click('[data-direction="-1"]');await page.waitForTimeout(600);assert(await track.evaluate(el=>el.scrollLeft)<before);
  const detail=page.locator('.product-detail').first();await detail.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('dialog[open]').count(),1);assert((await page.locator('dialog[open]').textContent()).includes('Ano de engarrafamento'));await page.keyboard.press('Escape');assert(await detail.evaluate(el=>document.activeElement===el));
  await detail.click();await page.locator('dialog[open] [data-add]').click();await page.waitForURL('**/carrinho/');await page.waitForSelector('.cart-row');assert.equal(await page.locator('.cart-row').count(),1);
  await page.locator('[data-quantity]').fill('2');await page.locator('[data-quantity]').press('Tab');assert.equal(await page.locator('[data-quantity]').inputValue(),'2');
  await page.check('[value=entrega]');await page.getByRole('button',{name:'Simular escolha',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#cart-status').textContent.includes('Nenhum pedido'));await page.reload({waitUntil:'networkidle'});await page.waitForSelector('.cart-row');assert(await page.locator('[value=entrega]').isChecked());assert.equal(await page.locator('[data-quantity]').inputValue(),'2');
  await page.check('[value=retirada]');await page.getByRole('button',{name:'Simular escolha',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#cart-status').textContent.includes('retirada'));
  await page.locator('[data-remove]').click();assert.equal(await page.locator('.cart-row').count(),0);
  await page.click('#clear-cart');assert.equal(await page.evaluate(()=>localStorage.getItem('rg-portfolio-cart-v1')),null);
  await page.evaluate(()=>localStorage.setItem('rg-portfolio-cart-v1',JSON.stringify({items:{unknown:3},fulfilment:'malicious'})));await page.reload({waitUntil:'networkidle'});await page.waitForTimeout(300);assert.equal(await page.locator('.cart-row').count(),0);assert(await page.locator('[value=retirada]').isChecked());
  await visit(page,'/conta/');assert.equal(await page.locator('input').count(),0);await page.click('#account-preview');assert(await page.locator('#account-panel').isVisible());assert.equal(await page.locator('#account-preview').getAttribute('aria-expanded'),'true');
  const blockedStorage=await browser.newContext();await observe(blockedStorage);await blockedStorage.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}}));
  const privatePage=await blockedStorage.newPage();await visit(privatePage,'/carrinho/');assert(await privatePage.locator('#storage-notice').isVisible());await privatePage.check('[value=entrega]');await privatePage.getByRole('button',{name:'Simular escolha',exact:true}).click();await privatePage.waitForFunction(()=>document.querySelector('#cart-status').textContent.includes('nesta página'));
  await visit(privatePage,'/enoteca/');await privatePage.locator('.product-detail').first().click();await privatePage.locator('dialog[open] [data-add]').click();await privatePage.waitForSelector('.storage-warning');assert(privatePage.url().endsWith('/enoteca/'));
  assert.equal((await desktop.request.get(base+'/nao-existe/')).status(),404);
  const noJS=await browser.newContext({javaScriptEnabled:false});await observe(noJS);const fallback=await noJS.newPage();await fallback.goto(base+'/enoteca/');await fallback.locator('.product-detail').first().click();assert(fallback.url().includes('/produto/'));assert(await fallback.locator('.wine-facts').isVisible());
  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});await observe(mobile);const phone=await mobile.newPage();
  for(const url of paths) await visit(phone,url);
  await visit(phone,'/');await phone.getByRole('button',{name:/Menu/}).tap();assert.equal(await phone.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await phone.getByRole('navigation',{name:'Principal'}).getByRole('link',{name:'Enoteca',exact:true}).tap();await phone.waitForLoadState('networkidle');assert.equal(await phone.locator('.motion-ready').count(),0);
  await phone.locator('.product-detail').first().tap();assert.equal(await phone.locator('dialog[open]').count(),1);await phone.locator('dialog[open] .close-dialog').tap();await phone.screenshot({path:'/tmp/rg-portfolio-mobile.png',fullPage:true});
  await phone.locator('.product-detail').first().tap();await phone.locator('dialog[open] [data-add]').tap();await phone.waitForURL('**/carrinho/');await phone.waitForSelector('.cart-row');assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  assert.deepEqual(await desktop.cookies(),[]);assert.deepEqual(await mobile.cookies(),[]);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(bad,[]);assert.deepEqual(mutations,[]);
  console.log(`PASS: ${paths.length} pages desktop/mobile, ${links.size} internal links, images, keyboard/focus, filters/carousels/dialogs, local cart/persistence/removal/fulfilment, blocked storage fallback, account preview, no-JS product fallback, 404, reduced motion, zero external requests/cookies/POSTs/JS errors.`);
 } finally {if(browser)await browser.close();if(server.listening)await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
