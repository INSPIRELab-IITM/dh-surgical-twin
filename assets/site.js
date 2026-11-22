(function(){
  var r=document.documentElement,b=document.getElementById('theme');
  try{var t=localStorage.getItem('dh-theme');if(t)r.setAttribute('data-theme',t);}catch(e){}
  function dark(){var t=r.getAttribute('data-theme');return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;}
  function label(){if(b)b.textContent=dark()?'Light':'Dark';}
  label();
  if(b)b.addEventListener('click',function(){var t=dark()?'light':'dark';r.setAttribute('data-theme',t);try{localStorage.setItem('dh-theme',t);}catch(e){}label();});
  var cur=document.querySelector('nav.tabs a[aria-current]');if(cur&&cur.scrollIntoView)cur.scrollIntoView({block:'nearest',inline:'center'});
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){});}else v.pause();});},{threshold:.2});
    document.querySelectorAll('video[autoplay]').forEach(function(v){io.observe(v);});}
})();
