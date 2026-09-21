(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* Scroll progress bar */
  var fill = document.getElementById('progress-fill');
  function updateProgress(){
    if (!fill) return;
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (scrolled / max) * 100 : 0;
    fill.style.width = pct + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* Custom cursor */
  if (!reduced && !coarse) {
    var dot = document.getElementById('cursor-dot');
    if (dot) {
      var x = 0, y = 0, cx = 0, cy = 0;
      window.addEventListener('mousemove', function(e){ x = e.clientX; y = e.clientY; });
      function loop(){
        cx += (x - cx) * 0.18;
        cy += (y - cy) * 0.18;
        dot.style.left = cx + 'px';
        dot.style.top = cy + 'px';
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);

      document.querySelectorAll('a, button, .work-row').forEach(function(el){
        el.addEventListener('mouseenter', function(){ dot.classList.add('big'); });
        el.addEventListener('mouseleave', function(){ dot.classList.remove('big'); });
      });
    }
  }

  /* Hero letter stagger (index page only) */
  var heroH1 = document.querySelector('.hero h1');
  if (heroH1 && !heroH1.dataset.split) {
    heroH1.dataset.split = '1';
    var text = heroH1.textContent;
    heroH1.innerHTML = '';
    text.split('').forEach(function(ch, i){
      var span = document.createElement('span');
      span.className = 'ch';
      span.style.animationDelay = (i * 0.05) + 's';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      heroH1.appendChild(span);
    });
  }
  /* Sticker photo tilt toward cursor */
  if (!reduced && !coarse) {
    document.querySelectorAll('.sticker').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'rotate(' + (px * 6) + 'deg) rotateX(' + (py * -6) + 'deg)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });
  }

  /* Paper background parallax */
  var paperBg = document.querySelector('.paper-bg');
  if (paperBg && !reduced) {
    document.addEventListener('scroll', function(){
      var y = window.scrollY * 0.04;
      paperBg.style.transform = 'translateY(' + y + 'px)';
    }, { passive: true });
  }
})();
