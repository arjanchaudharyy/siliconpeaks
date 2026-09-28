// Ambient motion follows the operating system's accessibility preference.
document.documentElement.classList.add('js');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=reducedMotion.matches;
function syncMotion(){motionPaused=reducedMotion.matches;document.documentElement.classList.toggle('motion-paused',motionPaused);document.dispatchEvent(new Event('motionchange'));}
reducedMotion.addEventListener('change',syncMotion);syncMotion();
// One theme. Legacy stored theme and pause choices do not affect the page.
document.body.classList.add('light');document.body.dataset.theme='snow';
(function(){
 const video=document.getElementById('hero-video');if(!video)return;
 let visible=true,loaded=false,failed=false;
 const savingData=navigator.connection?.saveData===true;
 function syncVideo(){
  if(motionPaused||savingData||document.hidden||!visible||failed){video.pause();return;}
  if(!loaded){loaded=true;video.muted=true;video.src='/assets/media/silicon-peaks-story.mp4';video.load();}
  video.play().catch(()=>{});
 }
 video.addEventListener('error',()=>{failed=true;video.removeAttribute('src');video.load();});
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;syncVideo();}).observe(video);
 document.addEventListener('motionchange',syncVideo);document.addEventListener('visibilitychange',syncVideo);syncVideo();
})();

// Scroll reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.07});
document.querySelectorAll('.rev').forEach(el=>io.observe(el));

// Active nav
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const href=a.getAttribute('href');
    const t=href.length>1?document.getElementById(href.slice(1)):null;
    if(t) t.scrollIntoView({behavior:motionPaused?'instant':'smooth'});
  });
});

// ===== GLOBAL CONNECTIONS =====
(function(){
 const canvas=document.getElementById('globe-canvas');
 if(!canvas)return;
 const ctx=canvas.getContext('2d');
 const base=document.createElement('canvas'),land=base.getContext('2d');
 const wrap=canvas.parentElement,select=document.getElementById('route-select');
 const origin={lat:27.72,lon:85.32};
 const cities=[
  {id:'san-francisco',name:'San Francisco',lat:37.77,lon:-122.42,tz:'America/Los_Angeles'},
  {id:'new-york',name:'New York',lat:40.71,lon:-74.01,tz:'America/New_York'},
  {id:'london',name:'London',lat:51.51,lon:-.13,tz:'Europe/London'},
  {id:'dubai',name:'Dubai',lat:25.25,lon:55.37,tz:'Asia/Dubai'},
  {id:'bangalore',name:'Bangalore',lat:12.97,lon:77.59,tz:'Asia/Kolkata'},
  {id:'singapore',name:'Singapore',lat:1.35,lon:103.82,tz:'Asia/Singapore'},
  {id:'shanghai',name:'Shanghai',lat:31.23,lon:121.47,tz:'Asia/Shanghai'},
  {id:'tokyo',name:'Tokyo',lat:35.78,lon:140.39,tz:'Asia/Tokyo'},
  {id:'sydney',name:'Sydney',lat:-33.87,lon:151.21,tz:'Australia/Sydney'}
 ];
 // Preserve the original regional connection data as context behind the active route.
 const regional=[
  {lat:28.56,lon:77.10,city:'🇮🇳 Delhi',tier:1,ly:-8,co:'India',fl:'\ud83c\uddee\ud83c\uddf3'},
  {lat:19.09,lon:72.87,city:'🇮🇳 Mumbai',tier:1,ly:8,co:'India',fl:'\ud83c\uddee\ud83c\uddf3'},
  {lat:12.97,lon:77.59,city:'🇮🇳 Bangalore',tier:1,co:'India',fl:'\ud83c\uddee\ud83c\uddf3'},
  {lat:22.57,lon:88.36,city:'🇮🇳 Kolkata',tier:1,ly:10,co:'India',fl:'\ud83c\uddee\ud83c\uddf3'},
  {lat:25.29,lon:51.53,city:'🇶🇦 Doha',tier:1,ly:-14,co:'Qatar',fl:'\ud83c\uddf6\ud83c\udde6'},
  {lat:25.25,lon:55.37,city:'🇦🇪 Dubai',tier:1,ly:12,co:'UAE',fl:'\ud83c\udde6\ud83c\uddea'},
  {lat:24.45,lon:54.38,city:'🇦🇪 Abu Dhabi',co:'UAE',fl:'\ud83c\udde6\ud83c\uddea'},
  {lat:3.14,lon:101.69,city:'🇲🇾 Kuala Lumpur',tier:1,co:'Malaysia',fl:'\ud83c\uddf2\ud83c\uddfe'},
  {lat:13.69,lon:100.75,city:'🇹🇭 Bangkok',tier:1,co:'Thailand',fl:'\ud83c\uddf9\ud83c\udded'},
  {lat:1.35,lon:103.82,city:'🇸🇬 Singapore',tier:1,ly:10,co:'Singapore',fl:'\ud83c\uddf8\ud83c\uddec'},
  {lat:22.32,lon:114.17,city:'🇭🇰 Hong Kong',tier:1,co:'China',fl:'\ud83c\udded\ud83c\uddf0'},
  {lat:23.39,lon:113.30,city:'🇨🇳 Guangzhou',co:'China',fl:'\ud83c\udde8\ud83c\uddf3'},
  {lat:30.57,lon:104.07,city:'🇨🇳 Chengdu',co:'China',fl:'\ud83c\udde8\ud83c\uddf3'},
  {lat:37.46,lon:126.44,city:'🇰🇷 Seoul',tier:1,co:'S. Korea',fl:'\ud83c\uddf0\ud83c\uddf7'},
  {lat:41.01,lon:28.98,city:'🇹🇷 Istanbul',tier:1,co:'Turkey',fl:'\ud83c\uddf9\ud83c\uddf7'},
  {lat:23.59,lon:58.38,city:'🇴🇲 Muscat',co:'Oman',fl:'\ud83c\uddf4\ud83c\uddf2'},
  {lat:24.71,lon:46.68,city:'🇸🇦 Riyadh',tier:1,ly:-6,co:'Saudi Arabia',fl:'\ud83c\uddf8\ud83c\udde6'},
  {lat:39.90,lon:116.41,city:'🇨🇳 Beijing',tier:1,co:'China',fl:'\ud83c\udde8\ud83c\uddf3'},
  {lat:31.23,lon:121.47,city:'🇨🇳 Shanghai',tier:1,co:'China',fl:'\ud83c\udde8\ud83c\uddf3'},
  {lat:35.78,lon:140.39,city:'🇯🇵 Tokyo',tier:1,co:'Japan',fl:'\ud83c\uddef\ud83c\uddf5'},
  {lat:29.65,lon:91.10,city:'🇨🇳 Lhasa',co:'China',fl:'\ud83c\udde8\ud83c\uddf3'},
  {lat:25.01,lon:102.68,city:'🇨🇳 Kunming',co:'China',fl:'\ud83c\udde8\ud83c\uddf3'},
  {lat:26.07,lon:50.56,city:'Bahrain',co:'Bahrain',fl:'\ud83c\udde7\ud83c\udded'},
  {lat:29.38,lon:47.99,city:'Kuwait',co:'Kuwait',fl:'\ud83c\uddf0\ud83c\uddfc'},
  {lat:25.08,lon:83.01,city:'🇮🇳 Varanasi',co:'India',fl:'\ud83c\uddee\ud83c\uddf3'},
  {lat:26.85,lon:80.95,city:'🇮🇳 Lucknow',co:'India',fl:'\ud83c\uddee\ud83c\uddf3'},
  {lat:17.38,lon:78.49,city:'Hyderabad',co:'India',fl:'\ud83c\uddee\ud83c\uddf3'},
  {lat:11.56,lon:104.92,city:'Phnom Penh',co:'Cambodia',fl:'\ud83c\uddf0\ud83c\udded'},
  {lat:21.19,lon:72.83,city:'Surat',co:'India',fl:'\ud83c\uddee\ud83c\uddf3'},
  {lat:27.18,lon:78.02,city:'Agra',co:'India',fl:'\ud83c\uddee\ud83c\uddf3'},
];
 let width=1,height=1,dpr=1,features=[],visible=false,loaded=false,dirty=true,elapsed=0;
 let selected=cities[0];
 const pins=cities.map(city=>{
  const button=document.createElement('button');button.type='button';button.className='map-city';
  button.dataset.route=city.id;button.setAttribute('aria-label','Explore Kathmandu to '+city.name);
  const label=document.createElement('span');label.textContent=city.name;button.append(label);
  button.addEventListener('click',()=>choose(city.id));wrap.append(button);return button;
 });
 const originLabel=document.createElement('div');originLabel.className='map-home';originLabel.textContent='Kathmandu';wrap.append(originLabel);
 function project(lat,lon){
  const scale=Math.min((width-40)/360,(height-36)/145);
  return [width/2+lon*scale,height/2+(18-lat)*scale];
 }
 function route(city){
  const from=project(origin.lat,origin.lon),to=project(city.lat,city.lon);
  const distance=Math.hypot(to[0]-from[0],to[1]-from[1]);
  return {from,to,control:[(from[0]+to[0])/2,Math.max(20,Math.min(from[1],to[1])-distance*.22)]};
 }
 function point(r,t){const u=1-t;return [u*u*r.from[0]+2*u*t*r.control[0]+t*t*r.to[0],u*u*r.from[1]+2*u*t*r.control[1]+t*t*r.to[1]];}
 function curve(c,r,color,lineWidth){c.beginPath();c.moveTo(...r.from);c.quadraticCurveTo(...r.control,...r.to);c.strokeStyle=color;c.lineWidth=lineWidth;c.stroke();}
 function paintBase(){
  land.setTransform(dpr,0,0,dpr,0,0);land.clearRect(0,0,width,height);
  land.fillStyle='#f7fafe';land.fillRect(0,0,width,height);
  land.strokeStyle='#e5edf5';land.lineWidth=.6;
  for(let lon=-150;lon<180;lon+=30){land.beginPath();land.moveTo(...project(-60,lon));land.lineTo(...project(83,lon));land.stroke();}
  for(let lat=-30;lat<90;lat+=30){land.beginPath();land.moveTo(...project(lat,-180));land.lineTo(...project(lat,180));land.stroke();}
  land.fillStyle='#e8eff6';land.strokeStyle='#c8d7e5';land.lineWidth=.65;
  for(const feature of features){
   const geo=feature.geometry;if(!geo)continue;
   const polygons=geo.type==='Polygon'?[geo.coordinates]:geo.type==='MultiPolygon'?geo.coordinates:[];
   for(const polygon of polygons){
    land.beginPath();
    for(const ring of polygon){let previous=null;for(const [lon,lat] of ring){const p=project(lat,lon);if(!previous||Math.abs(p[0]-previous[0])>width/2)land.moveTo(...p);else land.lineTo(...p);previous=p;}land.closePath();}
    land.fill();land.stroke();
   }
  }
  for(const city of regional)curve(land,route(city),'#9cb7d52b',.65);
  for(const city of cities)curve(land,route(city),'#779bc05e',.85);
 }
 function resize(){
  width=canvas.clientWidth;height=canvas.clientHeight;dpr=Math.min(devicePixelRatio||1,1.5);
  canvas.width=base.width=Math.round(width*dpr);canvas.height=base.height=Math.round(height*dpr);
  pins.forEach((pin,i)=>{const p=project(cities[i].lat,cities[i].lon);pin.style.left=p[0]+'px';pin.style.top=p[1]+'px';});
  const home=project(origin.lat,origin.lon);originLabel.style.left=home[0]+'px';originLabel.style.top=home[1]+'px';
  paintBase();dirty=true;
 }
 function draw(){
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);ctx.drawImage(base,0,0,width,height);
  const r=route(selected);curve(ctx,r,'#2f67b9',1.5);
  if(!motionPaused){
   const progress=(elapsed/7)%1,tail=Math.max(0,progress-.2);
   for(let i=0;i<24;i++){
    const a=tail+(progress-tail)*i/24,b=tail+(progress-tail)*(i+1)/24;
    ctx.beginPath();ctx.moveTo(...point(r,a));ctx.lineTo(...point(r,b));ctx.strokeStyle=`rgba(35,100,202,${(i+1)/24})`;ctx.lineWidth=2.7;ctx.lineCap='round';ctx.stroke();
   }
   const p=point(r,progress),behind=point(r,Math.max(0,progress-.006));
   ctx.save();ctx.translate(...p);ctx.rotate(Math.atan2(p[1]-behind[1],p[0]-behind[0]));ctx.beginPath();ctx.moveTo(-5,-3);ctx.lineTo(2,0);ctx.lineTo(-5,3);ctx.strokeStyle='#245cb4';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
  }
  const p=project(origin.lat,origin.lon);ctx.beginPath();ctx.arc(...p,5,0,Math.PI*2);ctx.fillStyle='#b84055';ctx.fill();ctx.beginPath();ctx.arc(...p,9,0,Math.PI*2);ctx.strokeStyle='#b8405538';ctx.lineWidth=1;ctx.stroke();
 }
 function choose(id){selected=cities.find(c=>c.id===id)||cities[0];select.value=selected.id;select.dispatchEvent(new Event('routechange'));elapsed=0;dirty=true;pins.forEach((p,i)=>p.setAttribute('aria-pressed',String(cities[i]===selected)));canvas.setAttribute('aria-label','Illustrative global connections. Selected: Kathmandu to '+selected.name+'. This is not a direct-flight schedule.');updateClocks();}
 function formatTime(zone){return new Intl.DateTimeFormat('en-US',{timeZone:zone,hour:'numeric',minute:'2-digit',hour12:true}).format(new Date());}
 function updateClocks(){
  const zones={sf:'America/Los_Angeles',ny:'America/New_York',lon:'Europe/London',dxb:'Asia/Dubai',ktm:'Asia/Kathmandu',sg:'Asia/Singapore',sh:'Asia/Shanghai',tyo:'Asia/Tokyo',syd:'Australia/Sydney'};
  for(const [id,zone] of Object.entries(zones)){const el=document.getElementById('tz-'+id);if(el)el.textContent=formatTime(zone);}
  document.getElementById('route-time').textContent=formatTime(selected.tz);
  document.getElementById('route-offset').textContent=new Intl.DateTimeFormat('en',{timeZone:selected.tz,timeZoneName:'shortOffset'}).formatToParts(new Date()).find(p=>p.type==='timeZoneName').value;
 }
 select.addEventListener('change',()=>choose(select.value));
 async function loadMap(){
  const script=document.createElement('script');script.src='/assets/topojson-client.min.js';
  script.onload=async()=>{try{const response=await fetch('/assets/countries-110m.json');const data=await response.json();features=topojson.feature(data,data.objects.countries).features;paintBase();dirty=true;}catch{}};
  document.head.append(script);
 }
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;dirty=true;if(visible&&!loaded){loaded=true;loadMap();}},{rootMargin:'100px'}).observe(wrap);
 new ResizeObserver(resize).observe(wrap);
 document.addEventListener('motionchange',()=>{dirty=true});document.addEventListener('visibilitychange',()=>{dirty=true});
 setInterval(()=>{if(!visible||document.hidden)return;if(!motionPaused||dirty){if(!motionPaused)elapsed+=1/30;draw();dirty=false;}},1000/30);
 setInterval(updateClocks,30000);resize();choose(selected.id);
})();

// Timezone modal

// === DESIGN GLOW-UP JS ===

const tzDB={
  'new york':{o:-5,f:'🇺🇸'},'san francisco':{o:-8,f:'🇺🇸'},'los angeles':{o:-8,f:'🇺🇸'},
  'chicago':{o:-6,f:'🇺🇸'},'london':{o:0,f:'🇬🇧'},'dubai':{o:4,f:'🇦🇪'},
  'singapore':{o:8,f:'🇸🇬'},'tokyo':{o:9,f:'🇯🇵'},'sydney':{o:11,f:'🇦🇺'},
  'shanghai':{o:8,f:'🇨🇳'},'hong kong':{o:8,f:'🇭🇰'},'seoul':{o:9,f:'🇰🇷'},
  'delhi':{o:5.5,f:'🇮🇳'},'mumbai':{o:5.5,f:'🇮🇳'},'berlin':{o:1,f:'🇩🇪'},
  'paris':{o:1,f:'🇫🇷'},'amsterdam':{o:1,f:'🇳🇱'},'toronto':{o:-5,f:'🇨🇦'},
  'vancouver':{o:-8,f:'🇨🇦'},'bangkok':{o:7,f:'🇹🇭'},'istanbul':{o:3,f:'🇹🇷'},
  'kuala lumpur':{o:8,f:'🇲🇾'},'doha':{o:3,f:'🇶🇦'},'riyadh':{o:3,f:'🇸🇦'},
  'melbourne':{o:11,f:'🇦🇺'},'auckland':{o:13,f:'🇳🇿'},'lisbon':{o:0,f:'🇵🇹'},
  'zurich':{o:1,f:'🇨🇭'},'denver':{o:-7,f:'🇺🇸'},'boston':{o:-5,f:'🇺🇸'},
  'seattle':{o:-8,f:'🇺🇸'},'austin':{o:-6,f:'🇺🇸'},'atlanta':{o:-5,f:'🇺🇸'},
};
const cityZones={
 'new york':'America/New_York','san francisco':'America/Los_Angeles','los angeles':'America/Los_Angeles','chicago':'America/Chicago','london':'Europe/London','dubai':'Asia/Dubai','singapore':'Asia/Singapore','tokyo':'Asia/Tokyo','sydney':'Australia/Sydney','shanghai':'Asia/Shanghai','hong kong':'Asia/Hong_Kong','seoul':'Asia/Seoul','delhi':'Asia/Kolkata','mumbai':'Asia/Kolkata','berlin':'Europe/Berlin','paris':'Europe/Paris','amsterdam':'Europe/Amsterdam','toronto':'America/Toronto','vancouver':'America/Vancouver','bangkok':'Asia/Bangkok','istanbul':'Europe/Istanbul','kuala lumpur':'Asia/Kuala_Lumpur','doha':'Asia/Qatar','riyadh':'Asia/Riyadh','melbourne':'Australia/Melbourne','auckland':'Pacific/Auckland','lisbon':'Europe/Lisbon','zurich':'Europe/Zurich','denver':'America/Denver','boston':'America/New_York','seattle':'America/Los_Angeles','austin':'America/Chicago','atlanta':'America/New_York'
};
function utcOffset(zone,date=new Date()){
 const name=new Intl.DateTimeFormat('en-US',{timeZone:zone,timeZoneName:'longOffset'}).formatToParts(date).find(p=>p.type==='timeZoneName').value;
 if(name==='GMT')return 0;
 const [,sign,h,m]=name.match(/GMT([+-])(\d{2}):(\d{2})/);
 return (Number(h)+Number(m)/60)*(sign==='-'?-1:1);
}
function escapeHTML(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const ktmOff=5.75;
const tzCities=[];
function renderTZBar(off,isKTM){
  let html='';
  for(let h=0;h<24;h++){
    const localH=(h+off-ktmOff+48)%24;
    const isWork=localH>=9&&localH<18;
    const ktmH=h;
    const ktmWork=ktmH>=9&&ktmH<18;
    let cls='tz-hr tz-hr-sleep';
    if(isKTM){cls=ktmWork?'tz-hr tz-hr-work':'tz-hr tz-hr-sleep';}
    else if(isWork&&ktmWork){cls='tz-hr tz-hr-overlap';}
    else if(isWork){cls='tz-hr tz-hr-work';}
    html+=`<div class="${cls}" title="${h}:00 KTM = ${Math.floor(localH)}:${String(Math.round((localH%1)*60)).padStart(2,"0")} local"></div>`;
  }
  return html;
}
function renderModal(){
  const grid=document.getElementById('tz-grid');
  if(!grid)return;
  const ktmBar=document.getElementById('tz-ktm-bar');
  if(ktmBar)ktmBar.innerHTML=renderTZBar(ktmOff,true);
  const existing=grid.querySelectorAll('.tz-added-row');
  existing.forEach(r=>r.remove());
  const ktmRow=document.getElementById('tz-ktm-row-bar');
  tzCities.forEach(c=>{
    const row=document.createElement('div');
    row.className='tz-modal-row tz-added-row';
    row.innerHTML=`<div class="tz-modal-city-col">${c.f} ${escapeHTML(c.name)}</div><div class="tz-modal-hours">${renderTZBar(c.o,false)}</div>`;
    grid.appendChild(row);
  });
  const chips=document.getElementById('tz-chips');
  if(chips)chips.innerHTML=tzCities.map((c,i)=>`<span class="tz-chip-item">${c.f} ${escapeHTML(c.name)} <button type="button" class="tz-chip-x" data-i="${i}" aria-label="Remove ${escapeHTML(c.name)}">&times;</button></span>`).join('');
}
document.getElementById('tz-open')?.addEventListener('click',()=>{
  document.getElementById('tz-modal')?.classList.add('open');
  renderModal();
});
document.getElementById('tz-close')?.addEventListener('click',()=>{
  document.getElementById('tz-modal')?.classList.remove('open');
});
document.getElementById('tz-modal')?.addEventListener('click',(e)=>{
  if(e.target.id==='tz-modal')e.target.classList.remove('open');
});
function addCity(){
  const input=document.getElementById('tz-input');
  if(!input)return;
  const val=input.value.trim().toLowerCase();
  if(!val)return;
  const match=tzDB[val];
  if(match){
    if(tzCities.some(c=>c.key===val))return;
    tzCities.push({key:val,name:val.replace(/\b\w/g,c=>c.toUpperCase()),o:utcOffset(cityZones[val]),f:match.f});
    input.value='';document.getElementById('tz-feedback').textContent='';
    renderModal();
  } else {
    document.getElementById('tz-feedback').textContent='Choose a city from the suggestions.';input.style.borderColor='rgba(232,80,80,.5)';
    setTimeout(()=>input.style.borderColor='',1000);
  }
}
document.getElementById('tz-add-btn')?.addEventListener('click',addCity);
document.getElementById('tz-input')?.addEventListener('keydown',(e)=>{if(e.key==='Enter')addCity();});
document.getElementById('tz-chips')?.addEventListener('click',(e)=>{
  const x=e.target.closest('.tz-chip-x');
  if(x){tzCities.splice(parseInt(x.dataset.i),1);renderModal();}
});

// Contribute modal
const contribOverlay=document.getElementById('contrib-modal');
const contribClose=document.getElementById('contrib-close');
const contribCopy=document.getElementById('contrib-copy');
const contribTitle=document.getElementById('contrib-title');
const contribDesc=document.getElementById('contrib-desc');
const contribList=document.getElementById('contrib-checklist');
const contribMailto=document.getElementById('contrib-mailto');
const modalContent={
  listing:{
    title:'Request to be listed',
    desc:"Tell us about your organization and its connection to Nepal. Include these details in your email.",
    items:['Company, organization, or university name','Website URL','Logo or favicon (any format)','Brief description or category','Your name and email'],
    mailto:'mailto:contribute@siliconpeaks.com?subject=Request%20to%20be%20Listed%20on%20Silicon%20Peaks&body=Hi%20Silicon%20Peaks%20team%2C%0A%0AI%27d%20like%20to%20request%20a%20listing.%0A%0AName%3A%20%0AOrganization%3A%20%0AWebsite%3A%20%0ACategory%3A%20%0A%0AThank%20you!'
  },
  press:{
    title:'Share press coverage',
    desc:"Send us an article or milestone about the Silicon Peaks ecosystem. Include these details in your email.",
    items:['Article or publication title','Link to the article','Publication name and date','Brief summary of the coverage','Your name and email (optional)'],
    mailto:'mailto:contribute@siliconpeaks.com?subject=Press%20Coverage%20for%20Silicon%20Peaks&body=Hi%20Silicon%20Peaks%20team%2C%0A%0AI%27d%20like%20to%20contribute%20press%20coverage.%0A%0AArticle%20Title%3A%20%0ALink%3A%20%0APublication%3A%20%0ADate%3A%20%0A%0AThank%20you!'
  }
};
document.querySelectorAll('.contrib-trigger').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const type=btn.dataset.type||'listing';
    const m=modalContent[type];
    if(m&&contribTitle){
      contribTitle.textContent=m.title;
      contribDesc.textContent=m.desc;
      contribList.innerHTML=m.items.map(i=>'<li>'+i+'</li>').join('');
      contribMailto.href=m.mailto;
    }
    contribOverlay.classList.add('active');
  });
});
if(contribClose)contribClose.addEventListener('click',()=>{contribOverlay.classList.remove('active')});
if(contribOverlay)contribOverlay.addEventListener('click',e=>{if(e.target===contribOverlay)contribOverlay.classList.remove('active')});
if(contribCopy)contribCopy.addEventListener('click',()=>{
  navigator.clipboard.writeText('contribute@siliconpeaks.com').then(()=>{
    contribCopy.textContent='Copied!';contribCopy.classList.add('copied');
    setTimeout(()=>{contribCopy.textContent='Copy';contribCopy.classList.remove('copied')},2000);
  }).catch(()=>{contribCopy.textContent='Select email';getSelection().selectAllChildren(document.querySelector('.contrib-email'))});
});

// Discoverable city options, accessible dialogs and keyboard focus management.
const cityList=document.createElement('datalist');cityList.id='timezone-cities';
cityList.innerHTML=Object.keys(tzDB).map(c=>`<option value="${c.replace(/\b\w/g,x=>x.toUpperCase())}"></option>`).join('');
document.body.append(cityList);document.getElementById('tz-input')?.setAttribute('list','timezone-cities');
const feedback=document.createElement('p');feedback.id='tz-feedback';feedback.setAttribute('role','status');
document.querySelector('.tz-modal-input-row')?.after(feedback);
const tzSub=document.querySelector('.tz-modal-sub');if(tzSub)tzSub.textContent='Compare 9am–6pm working hours with Kathmandu. Offsets include daylight saving time today. Green marks shared working hours.';
for(const [id,openClass] of [['tz-modal','open'],['contrib-modal','active']]){
 const dialog=document.getElementById(id);if(!dialog)continue;
 let returnFocus=null;
 new MutationObserver(()=>{
  const opened=dialog.classList.contains(openClass);
  if(opened){returnFocus=id==='tz-modal'?document.getElementById('tz-open'):document.activeElement;dialog.querySelector('input,button,a')?.focus();document.body.style.overflow='hidden'}
  else{document.body.style.overflow='';returnFocus?.focus()}
 }).observe(dialog,{attributes:true,attributeFilter:['class']});
 dialog.addEventListener('keydown',e=>{
  if(e.key==='Escape'){dialog.classList.remove(openClass);return}
  if(e.key!=='Tab')return;
  const focusable=[...dialog.querySelectorAll('button,a[href],input')].filter(e=>e.offsetParent!==null&&!e.disabled);
  const first=focusable[0],last=focusable.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
 });
}

const navLinks=[...document.querySelectorAll('.nav-a')];
const navObserver=new IntersectionObserver(entries=>{const entry=entries.find(e=>e.isIntersecting);if(!entry)return;for(const link of navLinks){if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}},{rootMargin:'-15% 0px -65% 0px'});
navLinks.forEach(link=>{const target=document.querySelector(link.hash);if(target)navObserver.observe(target);});

// Snow-styled select-only combobox, backed by the original native select.
(function(){
 const select=document.getElementById('route-select');if(!select)return;
 const wrapper=document.createElement('div');wrapper.className='route-picker';select.before(wrapper);wrapper.append(select);
 const trigger=document.createElement('button');trigger.type='button';trigger.className='route-trigger';trigger.id='route-trigger';
 trigger.setAttribute('role','combobox');trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-controls','route-options');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label','Destination city');
 const label=document.createElement('span');trigger.append(label);
 const caret=document.createElement('span');caret.className='route-caret';caret.ariaHidden='true';caret.textContent='⌄';trigger.append(caret);
 const list=document.createElement('div');list.id='route-options';list.className='route-options';list.setAttribute('role','listbox');list.setAttribute('aria-label','Destination cities');list.hidden=true;
 const options=[...select.options].map((option,index)=>{const el=document.createElement('div');el.className='route-option';el.id='route-option-'+index;el.setAttribute('role','option');el.dataset.value=option.value;el.textContent=option.text;el.addEventListener('pointerdown',e=>e.preventDefault());el.addEventListener('click',()=>choose(index));list.append(el);return el;});
 wrapper.append(trigger,list);select.hidden=true;
 let active=select.selectedIndex,search='',searchTimer;
 function sync(){label.textContent=select.options[select.selectedIndex].text;options.forEach((o,i)=>o.setAttribute('aria-selected',String(i===select.selectedIndex)));if(list.hidden)active=select.selectedIndex;}
 function focusOption(index){active=(index+options.length)%options.length;options.forEach((o,i)=>o.classList.toggle('is-active',i===active));trigger.setAttribute('aria-activedescendant',options[active].id);const option=options[active];if(option.offsetTop<list.scrollTop)list.scrollTop=option.offsetTop;else if(option.offsetTop+option.offsetHeight>list.scrollTop+list.clientHeight)list.scrollTop=option.offsetTop+option.offsetHeight-list.clientHeight;}
 function open(){list.hidden=false;trigger.setAttribute('aria-expanded','true');focusOption(select.selectedIndex);}
 function close(){list.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.removeAttribute('aria-activedescendant');}
 function choose(index){select.selectedIndex=index;select.dispatchEvent(new Event('change',{bubbles:true}));sync();close();trigger.focus({preventScroll:true});}
 trigger.addEventListener('click',()=>list.hidden?open():close());
 trigger.addEventListener('keydown',e=>{
  if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();if(list.hidden){open();if(e.key==='Home')focusOption(0);if(e.key==='End')focusOption(options.length-1);}else focusOption(e.key==='Home'?0:e.key==='End'?options.length-1:active+(e.key==='ArrowDown'?1:-1));}
  else if(e.key==='Enter'||e.key===' '){e.preventDefault();if(list.hidden)open();else choose(active);}
  else if(e.key==='Escape'){if(!list.hidden)e.preventDefault();close();}
  else if(e.key==='Tab')close();
  else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey){clearTimeout(searchTimer);search+=e.key.toLowerCase();const match=options.findIndex(o=>o.textContent.toLowerCase().startsWith(search));if(match>=0){if(list.hidden)open();focusOption(match);}searchTimer=setTimeout(()=>search='',650);}
 });
 document.addEventListener('pointerdown',e=>{if(!wrapper.contains(e.target))close();});
 select.addEventListener('change',sync);select.addEventListener('routechange',sync);sync();
})();

// Keep the three-part essay's reading guide in step with the reader.
(function(){
 const nav=document.querySelector('.story-nav');if(!nav)return;
 const links=[...nav.querySelectorAll('a')];
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting){
   const index=links.findIndex(a=>a.hash==='#'+entry.target.id);
   links.forEach((a,i)=>i===index?a.setAttribute('aria-current','step'):a.removeAttribute('aria-current'));
   nav.style.setProperty('--story-progress',index/(links.length-1));
  }
 },{rootMargin:'-25% 0px -65% 0px'});
 document.querySelectorAll('.story-chapter').forEach(chapter=>observer.observe(chapter));
})();

// Scroll through the eight profiles using the page's native vertical scroll.
(function(){
 const rail=document.querySelector('.peaks-grid'),section=document.querySelector('.peaks-section'),stage=document.querySelector('.peaks-sticky');
 if(!rail||!stage)return;
 const slides=[...rail.children],buttons=[...document.querySelectorAll('[data-peak-direction]')],counter=document.querySelector('.peak-position');
 let linked=false,travel=0,start=0,inset=0,max=0,frame=0,index=0;
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function sync(){
  index=clamp(Math.round(rail.scrollLeft/(rail.clientWidth+20)),0,slides.length-1);
  counter.textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  buttons.forEach(b=>b.disabled=Number(b.dataset.peakDirection)<0?index===0:index===slides.length-1);
  slides.slice(index,index+2).forEach(s=>{s.querySelector('img').loading='eager';});
 }
 function render(){frame=0;if(linked){start=section.getBoundingClientRect().top+scrollY+inset;const progress=clamp((scrollY-start)/travel,0,1)*(slides.length-1),whole=Math.floor(progress),phase=clamp((progress-whole-.25)/.65,0,1);rail.scrollLeft=(whole+phase*phase*(3-2*phase))*max/(slides.length-1);}sync();}
 function queue(){if(!frame)frame=requestAnimationFrame(render);}
 function measure(){
  const top=(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--chrome-h'))||84)+16;
  linked=!motionPaused&&stage.offsetHeight<innerHeight-top-24;
  section.classList.toggle('has-scroll-story',linked);
  const style=getComputedStyle(section),padding=parseFloat(style.paddingTop)+parseFloat(style.paddingBottom);
  travel=(slides.length-1)*clamp(innerHeight*1.05,650,1100);
  section.style.height=linked?(stage.offsetHeight+padding+travel)+'px':'';
  inset=parseFloat(style.paddingTop)-top;start=section.getBoundingClientRect().top+scrollY+inset;
  max=rail.scrollWidth-rail.clientWidth;queue();
 }
 function go(target){
  target=clamp(target,0,slides.length-1);
  if(linked)scrollTo({top:start+travel*target/(slides.length-1),behavior:'smooth'});
  else rail.scrollTo({left:target*(rail.clientWidth+20),behavior:motionPaused?'instant':'smooth'});
 }
 buttons.forEach(button=>button.addEventListener('click',()=>{
  go(index+Number(button.dataset.peakDirection));
 }));
 rail.addEventListener('scroll',sync,{passive:true});
 rail.addEventListener('keydown',e=>{if(e.target!==rail)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(index+(e.key==='ArrowRight'?1:-1));}});
 rail.addEventListener('focusin',e=>{const slide=e.target.closest('.peak-slide');if(linked&&slide&&slides.indexOf(slide)!==index)go(slides.indexOf(slide));});
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',measure);
 new ResizeObserver(measure).observe(stage);document.addEventListener('motionchange',measure);
 document.fonts?.ready.then(measure);measure();
})();
