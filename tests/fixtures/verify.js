(()=>{
const q=s=>document.querySelector(s),qa=s=>Array.from(document.querySelectorAll(s)),checks=[];
const check=(name,pass)=>{checks.push({name,pass:Boolean(pass)});if(!pass)throw Error(name);};
const click=s=>(typeof s==='string'?q(s):s).click();
const set=(s,value,event='change')=>{const e=typeof s==='string'?q(s):s;e.value=value;e.dispatchEvent(new Event(event,{bubbles:true}));};
const nav=name=>click(qa('[data-nav]').find(b=>b.dataset.nav===name));
const shut=()=>q('dialog').close();
const state=()=>window.designState();
try{
check('Five open opportunities, distinct from won/lost',state().visible.length===5);
check('One visible opportunity explicitly missing product',qa('.deal .tag.amber').length===1);
click('[data-filters]');click('#add-rule');set(qa('[data-rule-field]')[1],'rx');click('#add-rule');set(qa('[data-rule-field]')[2],'meeting');set(qa('[data-rule-value]')[2],'Não');click('#apply-filter');
check('AND status + custom Raio X + no meeting gives two',state().visible.join(',')==='d1,d3');
click('[data-save-insights]');set('#dashboard-name','Raio X · sem reunião','input');set('#dashboard-group','center');q('#dashboard-form').requestSubmit();
check('Filter saved with dashboard',state().dashboards.length===2&&state().dashboards[1].rules.length===3);
check('Missing product shown in unclassified center',q('#content').textContent.includes('Não classificado'));
click('[data-edit-dashboard]');set('#dashboard-metric','count');set('#dashboard-name','Raio X · acompanhamento','input');q('#dashboard-form').requestSubmit();
check('Saved dashboard can be edited',state().dashboards[1].metric==='count'&&state().dashboards[1].name==='Raio X · acompanhamento');
click('[data-dashboard-funnel]');click(qa('[data-open]').find(b=>b.dataset.open==='d1'));
check('Opportunity includes contact, source, missing product and activity',q('dialog').textContent.includes('marina@example.com')&&q('dialog').textContent.includes('Produto ausente')&&q('dialog').textContent.includes('Retomar contato'));
click('#move-deal');set('#move-stage','Reunião');set('#move-note','Conversa inicial concluída','input');click('#confirm-move');
check('Move updates stage while keeping product gap',state().deals[0].stage==='Reunião'&&!state().deals[0].product);
click('#schedule');set('#meeting-scenario','error');q('#meeting-form').requestSubmit();
check('Simulated calendar failure does not mark meeting',!state().deals[0].meeting&&q('dialog').textContent.includes('Nenhum convite foi criado'));
click('#confirm-meeting');check('Recovery returns to review without sending',!state().deals[0].meeting&&q('dialog').textContent.includes('Revise antes'));
click('#confirm-meeting');
check('Local meeting includes individual member and lead email',state().deals[0].meeting&&state().tasks.at(-1).owner==='Gustavo Costa'&&q('dialog').textContent.includes('marina@example.com'));
check('Scheduled lead leaves eligible segment',!state().eligible.includes('d1')&&state().eligible.includes('d3'));
shut();nav('atividades');set('#task-owner','Gustavo Costa');set('#task-due','Atrasadas');
check('Tasks combine owner and overdue',state().taskFiltered.length===1&&state().taskFiltered[0]==='DEMO-101');
set('#task-date','2026-11-23');check('Exact date combines with other task filters',state().taskFiltered.length===0);
click('[data-clear-tasks]');set('#task-search','DEMO-101','input');check('Task searchable by linked ClickUp example ID',state().taskFiltered.length===1);
click('[data-task]');check('Task detail preserves opportunity context',q('dialog').textContent.includes('Aurora Alimentos')&&q('dialog').textContent.includes('ClickUp'));
click('#task-complete');check('Task local completion works',state().tasks[0].status==='Concluída');
nav('catalogo');click('[data-create-product]');set('#new-product-name','Novo produto fictício','input');set('#new-product-code','DEMO-001','input');q('#product-form').requestSubmit();check('Duplicate catalog code rejected',q('#product-error').textContent.includes('Já existe'));
set('#new-product-code','DEMO-004','input');q('#product-form').requestSubmit();check('Product has code category and center',state().products.length===4&&state().products.at(-1).category&&state().products.at(-1).center);
nav('sdr');check('Both SDR contexts visible',q('#content').textContent.includes('SDR CorpLaw')&&q('#content').textContent.includes('SDR Vale'));
click('[data-conversation]');check('SDR conversation is clearly fictitious',q('dialog').textContent.includes('inteiramente fictícia'));shut();
set('#profile','reader');check('Proposed reader cannot see behavior edit',qa('[data-behavior]').every(b=>getComputedStyle(b).display==='none'));set('#profile','manager');
nav('segmentos');check('Eligible segment excludes already met and blocked records',state().eligible.join(',')==='d3');
check('No send action in segment',!qa('#content button').some(b=>/disparar|enviar campanha/i.test(b.textContent)));
nav('ajustes');click('[data-new-funnel]');set('#funnel-name','Parcerias · exemplo','input');q('#funnel-form').requestSubmit();check('New funnel has own empty board',state().pipeline==='Parcerias · exemplo'&&state().visible.length===0);
check('Only local resources loaded',performance.getEntriesByType('resource').filter(r=>r.name.startsWith('http')).every(r=>new URL(r.name).origin===location.origin));
check('No production integrations',state().integrations===false);
return {passed:true,checks,total:checks.length};
}catch(e){return {passed:false,error:String(e),checks,state:state()};}
})()
