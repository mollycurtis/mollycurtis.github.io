// Global functions — must be global for onclick= attributes
var cur = 0, total = 4;

function slideProject(dir) { cur = (cur + dir + total) % total; _move(); }
function goToSlide(n) { cur = n; _move(); }

function _move() {
  var t = document.getElementById('track');
  if (t) { t.style.transform = 'translateX(-' + (cur * 100) + '%)'; }
  document.querySelectorAll('.sd').forEach(function(d,i){ d.classList.toggle('active', i===cur); });
  var p = document.getElementById('sp');
  if (p) p.textContent = (cur+1) + ' / ' + total;
}

function openModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'flex';
  setTimeout(function(){ el.classList.add('open'); }, 10);
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  setTimeout(function(){ el.style.display = 'none'; }, 280);
  document.body.style.overflow = '';
}
function closeModalOutside(e, id) { if (e.target.id === id) closeModal(id); }

window.onload = function() {

  // Init slider
  var t = document.getElementById('track');
  if (t) { t.style.transition = 'none'; t.style.transform = 'translateX(0)'; setTimeout(function(){ t.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)'; }, 50); }

  // Hide modal
  var m = document.getElementById('m1');
  if (m) m.style.display = 'none';

  // Comparison slider
  var cw = document.getElementById('compSlider');
  var ap = document.getElementById('afterPane');
  var ch = document.getElementById('compHandle');
  if (cw && ap && ch) {
    var drag = false;
    function sp(x) {
      var r = cw.getBoundingClientRect();
      var p = Math.min(Math.max((x - r.left) / r.width, 0.02), 0.98);
      ap.style.width = (p*100)+'%'; ch.style.left = (p*100)+'%';
    }
    cw.addEventListener('mousedown', function(e){ drag=true; sp(e.clientX); e.preventDefault(); });
    window.addEventListener('mousemove', function(e){ if(drag) sp(e.clientX); });
    window.addEventListener('mouseup', function(){ drag=false; });
    cw.addEventListener('touchstart', function(e){ drag=true; sp(e.touches[0].clientX); },{passive:true});
    window.addEventListener('touchmove', function(e){ if(drag) sp(e.touches[0].clientX); },{passive:true});
    window.addEventListener('touchend', function(){ drag=false; });
  }

  // Count-up on scroll
  var strip = document.getElementById('impactStrip');
  if (strip) {
    var done = false;
    function easeOut(t) { return 1 - Math.pow(1-t, 3); }
    function run(el) {
      var tgt = parseInt(el.getAttribute('data-t'));
      var s = el.getAttribute('data-s')||'';
      var pr = el.getAttribute('data-p')||'';
      if (isNaN(tgt)) return;
      var t0 = performance.now();
      function tick(now) {
        var p = Math.min((now-t0)/1800, 1);
        var v = Math.round(easeOut(p)*tgt);
        el.textContent = tgt>=1000 ? (v>=1000?'1K+':v+s) : pr+v+s;
        if (p<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    function check() {
      if (done) return;
      var r = strip.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.88) {
        done = true;
        strip.querySelectorAll('.cu').forEach(run);
        window.removeEventListener('scroll', check);
      }
    }
    window.addEventListener('scroll', check, {passive:true});
    check();
  }

  // Photo slideshow
  var ss = document.getElementById('photoSS');
  if (ss) {
    var dotsEl = document.getElementById('ssDots');
    var idx = 0;
    setTimeout(function(){
      var imgs = Array.prototype.filter.call(ss.querySelectorAll('img'), function(i){ return i.style.display!=='none' && i.naturalWidth>0; });
      if (!imgs.length) return;
      var ph = ss.querySelector('.ss-ph');
      if (ph) ph.style.display = 'none';
      // First image is relative (drives height), rest are absolute overlays
      imgs.forEach(function(img, i) {
        if (i === 0) {
          img.style.position = 'relative';
        } else {
          img.style.position = 'absolute';
          img.style.top = '0';
          img.style.left = '0';
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
        }
      });
      if (dotsEl) {
        dotsEl.innerHTML='';
        imgs.forEach(function(_,i){
          var d=document.createElement('button');
          d.className='ss-dot'+(i===0?' active':'');
          dotsEl.appendChild(d);
        });
      }
      function show(n){
        imgs.forEach(function(img,i){ img.classList.toggle('active',i===n); });
        if(dotsEl) dotsEl.querySelectorAll('.ss-dot').forEach(function(d,i){ d.classList.toggle('active',i===n); });
        idx=n;
      }
      show(0);
      setInterval(function(){ show((idx+1)%imgs.length); }, 3500);
    }, 400);
  }

  // Back to top
  var btn = document.getElementById('btt');
  if (btn) window.addEventListener('scroll', function(){ btn.classList.toggle('vis', window.scrollY>600); }, {passive:true});
};
