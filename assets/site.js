(function(){
  var r=document.documentElement,b=document.getElementById('theme');
  try{var t=localStorage.getItem('dh-theme');if(t)r.setAttribute('data-theme',t);}catch(e){}
  function dark(){var t=r.getAttribute('data-theme');return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;}
  function label(){if(b)b.textContent=dark()?'Light':'Dark';}
  label();
  if(b)b.addEventListener('click',function(){var t=dark()?'light':'dark';r.setAttribute('data-theme',t);try{localStorage.setItem('dh-theme',t);}catch(e){}label();});
  // phones and narrow windows: the sections behind a burger menu (wide screens: the side panel, site.css)
  var nav=document.querySelector('nav.tabs');
  if(nav&&b){var m=document.createElement('button');m.className='burger';m.type='button';m.setAttribute('aria-label','Sections');
    m.setAttribute('aria-expanded','false');m.innerHTML='<span></span><span></span><span></span>';
    b.parentNode.insertBefore(m,b);
    function setOpen(o){document.body.classList.toggle('nav-open',o);m.setAttribute('aria-expanded',o?'true':'false');}
    m.addEventListener('click',function(e){e.stopPropagation();setOpen(!document.body.classList.contains('nav-open'));});
    document.addEventListener('click',function(e){if(!nav.contains(e.target))setOpen(false);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')setOpen(false);});}
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){});}else v.pause();});},{threshold:.2});
    document.querySelectorAll('video[autoplay]').forEach(function(v){io.observe(v);});}
})();
