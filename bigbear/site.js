'use strict';
// Shared by every page: the menu, and keeping the chosen look (?look=) as you move between pages.
(()=>{
 const q=new URLSearchParams(location.search),keep=['look','palette','draft'].filter(k=>q.get(k));
 // Draft link for Nikk (?draft=1): a slim bar to flip between the four looks on any page
 if(q.get('draft')){const cur=document.documentElement.dataset.look||'peak',bar=document.createElement('div');bar.className='draft-bar';bar.innerHTML='<span>Draft · pick a look</span>'+[['peak','Peak'],['range','Range'],['night','Night'],['lines','Lines']].map(([k,n],i)=>`<a href="#" data-l="${k}"${k===cur?' aria-current="true"':''}>${i+1} ${n}</a>`).join('');document.body.prepend(bar);document.documentElement.classList.add('has-draft');bar.querySelectorAll('[data-l]').forEach(a=>a.onclick=e=>{e.preventDefault();const u=new URL(location.href);u.searchParams.set('look',a.dataset.l);location.href=u})}
 if(keep.length)document.querySelectorAll('a[href]').forEach(a=>{const h=a.getAttribute('href');if(!/^(index|about|picks|resources|game)\.html/.test(h))return;const u=new URL(h,location.href);keep.forEach(k=>u.searchParams.set(k,q.get(k)));a.setAttribute('href',u.pathname.split('/').pop()+u.search+u.hash)});
 const menu=document.getElementById('mainMenu'),toggle=document.getElementById('menuToggle');if(!menu||!toggle)return;
 const close=()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation menu')};
 toggle.onclick=()=>{const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu')};
 menu.addEventListener('click',e=>{if(e.target.closest('a'))close()});
 document.addEventListener('click',e=>{if(!e.target.closest('#mainMenu,#menuToggle'))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){close();toggle.focus()}});
 // the current page is marked in the menu
 const here=location.pathname.split('/').pop()||'index.html';menu.querySelectorAll('a').forEach(a=>{if(a.getAttribute('href').split('?')[0]===here)a.setAttribute('aria-current','page')});
})();

// Snow outlook for the sledding guide (Open-Meteo model data, refreshed every 15 minutes)
(()=>{const box=document.getElementById('snowOutlook');if(!box)return;
 const day=(s,i)=>i===0?'Today':new Intl.DateTimeFormat('en-US',{weekday:'short'}).format(new Date(s+'T12:00:00'));
 async function load(){try{const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude=34.2439&longitude=-116.9114&timezone=America%2FLos_Angeles&temperature_unit=fahrenheit&precipitation_unit=inch&daily=temperature_2m_max,temperature_2m_min,snowfall_sum,snow_depth_max&forecast_days=3',{signal:AbortSignal.timeout(12000)});const d=(await r.json()).daily;
  const total=d.snowfall_sum.reduce((a,b)=>a+(b||0),0);
  box.innerHTML=`<p class="so-head">${total>0?`<b>${Number(total.toFixed(1))}" of new snow</b> in the next 3 days`:'<b>No new snow</b> in the next 3 days'}</p><div class="so-days">${d.time.map((t,i)=>`<span class="${d.snowfall_sum[i]>0?'snowy':''}"><b>${day(t,i)}</b>${Math.round(d.temperature_2m_max[i])}°<em>/${Math.round(d.temperature_2m_min[i])}°</em><i>${d.snowfall_sum[i]>0?Number(d.snowfall_sum[i].toFixed(1))+'" snow':'No snow'}</i></span>`).join('')}</div><p class="so-src">Forecast model data from Open-Meteo. Check Nikk's latest video before you drive up.</p>`}
 catch{box.innerHTML='<p class="so-head">Forecast unavailable right now. <a href="https://forecast.weather.gov/MapClick.php?lat=34.2439&lon=-116.9114" target="_blank" rel="noopener">National Weather Service ↗</a></p>'}}
 load();setInterval(load,900000)})();
