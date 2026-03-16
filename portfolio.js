// Global functions called by onclick attributes in HTML

var currentSlide = 0;
var totalSlides = 4;

function slideProject(dir) {
  currentSlide = (currentSlide + dir + totalSlides) % totalSlides;
  _moveSlider();
}

function goToSlide(n) {
  currentSlide = n;
  _moveSlider();
}

function _moveSlider() {
  var slider = document.getElementById('projectSlider');
  if (!slider) return;
  slider.style.transition = 'transform 0.5s ease';
  slider.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

  var dots = document.querySelectorAll('.slider-dot');
  dots.forEach(function(d, i) { d.classList.toggle('active', i === currentSlide); });

  var prog = document.getElementById('slideProgress');
  if (prog) prog.textContent = (currentSlide + 1) + ' / ' + totalSlides;
}

function openModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'flex';
  setTimeout(function() { el.classList.add('open'); }, 10);
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  setTimeout(function() { el.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
}

function closeModalOutside(e, id) {
  if (e.target.id === id) closeModal(id);
}

// Everything else on window load
window.onload = function() {

  // Reset slider to start
  var slider = document.getElementById('projectSlider');
  if (slider) {
    slider.style.transition = 'none';
    slider.style.transform = 'translateX(0)';
  }

  // Hide modal initially
  var modal = document.getElementById('modalSub');
  if (modal) modal.style.display = 'none';

  // Comparison slider inside modal
  var compWrap = document.getElementById('compSlider');
  var afterPane = document.getElementById('afterPane');
  var handle = document.getElementById('sliderHandle');
  if (compWrap && afterPane && handle) {
    var dragging = false;
    function setPos(x) {
      var r = compWrap.getBoundingClientRect();
      var pct = Math.min(Math.max((x - r.left) / r.width, 0.02), 0.98);
      afterPane.style.width = (pct * 100) + '%';
      handle.style.left = (pct * 100) + '%';
    }
    compWrap.addEventListener('mousedown', function(e) { dragging = true; setPos(e.clientX); e.preventDefault(); });
    window.addEventListener('mousemove', function(e) { if (dragging) setPos(e.clientX); });
    window.addEventListener('mouseup', function() { dragging = false; });
    compWrap.addEventListener('touchstart', function(e) { dragging = true; setPos(e.touches[0].clientX); }, {passive:true});
    window.addEventListener('touchmove', function(e) { if (dragging) setPos(e.touches[0].clientX); }, {passive:true});
    window.addEventListener('touchend', function() { dragging = false; });
  }

  // Count-up on scroll
  var strip = document.getElementById('impactStrip');
  if (strip) {
    var done = false;
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function runCount(el) {
      var target = parseInt(el.getAttribute('data-target'));
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      if (isNaN(target)) return;
      var start = performance.now();
      var dur = 1800;
      function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var v = Math.round(easeOut(p) * target);
        if (target >= 1000) {
          el.textContent = v >= 1000 ? '1K+' : v + suffix;
        } else {
          el.textContent = prefix + v + suffix;
        }
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    function checkStrip() {
      if (done) return;
      var r = strip.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85) {
        done = true;
        strip.querySelectorAll('.count-up').forEach(function(el) { runCount(el); });
        window.removeEventListener('scroll', checkStrip);
      }
    }
    window.addEventListener('scroll', checkStrip);
    checkStrip(); // run once immediately in case already visible
  }

  // Photo slideshow
  var ss = document.getElementById('photoSlideshow');
  if (ss) {
    var dotsEl = document.getElementById('slideshowDots');
    var idx = 0;
    var imgs = [];
    // Only use images that loaded successfully
    var allImgs = ss.querySelectorAll('img');
    var loaded = 0;
    allImgs.forEach(function(img) {
      if (img.complete && img.naturalWidth > 0) {
        imgs.push(img);
      }
    });
    if (imgs.length > 0) {
      var ph = ss.querySelector('.slideshow-placeholder');
      if (ph) ph.style.display = 'none';
      if (dotsEl) {
        dotsEl.innerHTML = '';
        imgs.forEach(function(_, i) {
          var d = document.createElement('button');
          d.className = 'slideshow-dot' + (i === 0 ? ' active' : '');
          dotsEl.appendChild(d);
        });
      }
      function showImg(n) {
        imgs.forEach(function(img, i) { img.classList.toggle('active', i === n); });
        if (dotsEl) {
          dotsEl.querySelectorAll('.slideshow-dot').forEach(function(d, i) { d.classList.toggle('active', i === n); });
        }
        idx = n;
      }
      showImg(0);
      setInterval(function() { showImg((idx + 1) % imgs.length); }, 3500);
    }
  }

  // Back to top button
  var topBtn = document.getElementById('backToTop');
  if (topBtn) {
    window.addEventListener('scroll', function() {
      topBtn.classList.toggle('visible', window.scrollY > 600);
    });
  }

};
