// Fixed navigation reserves its own anchor offset; no announcement banner.
function setChromeHeight(){
 const nav=document.getElementById('nav');
 if(nav)document.documentElement.style.setProperty('--chrome-h',(nav.offsetHeight+16)+'px');
}
setChromeHeight();
window.addEventListener('resize',setChromeHeight);
if(document.fonts?.ready)document.fonts.ready.then(setChromeHeight);

// Mobile / tablet nav — real collapse, keep menu state accessible.
(function(){
  const nav=document.getElementById('nav');
  const toggle=document.getElementById('nav-toggle');
  const panel=document.getElementById('nav-panel');
  if(!nav||!toggle||!panel)return;
  function setOpen(open){
    nav.classList.toggle('nav-open',open);
    toggle.setAttribute('aria-expanded',open?'true':'false');
    toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
    if(typeof setChromeHeight==='function')setChromeHeight();
  }
  toggle.addEventListener('click',()=>setOpen(!nav.classList.contains('nav-open')));
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
  window.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
})();
if(window.ResizeObserver){
  const nav=document.getElementById('nav');
  if(nav)new ResizeObserver(setChromeHeight).observe(nav);
}



// Reveal the navigation when scrolling up, at the top, or during keyboard use.
(function(){
 const nav=document.getElementById('nav');let previous=scrollY,distance=0,frame=0;
 function reveal(){nav.classList.remove('nav-hidden');}
 nav.addEventListener('focusin',reveal);
 nav.addEventListener('click',()=>{if(nav.classList.contains('nav-open'))reveal();});
 addEventListener('scroll',()=>{
  if(frame)return;
  frame=requestAnimationFrame(()=>{
   frame=0;const y=Math.max(0,scrollY),delta=y-previous;previous=y;
   if(y<100||nav.classList.contains('nav-open')||nav.querySelector(':focus-visible')){distance=0;reveal();return;}
   if(Math.sign(delta)!==Math.sign(distance))distance=0;
   distance+=delta;
   if(Math.abs(distance)>12){nav.classList.toggle('nav-hidden',distance>0);distance=0;}
  });
 },{passive:true});
})();
