// All interactive functions must be global so onclick="" attributes can call them

var currentSlide = 0;
var totalSlides = 4;

function updateSlider() {
  var slider = document.getElementById('projectSlider');
  var dots = document.querySelectorAll('.slider-dot');
  var progress = document.getElementById('slideProgress');
  if (!slider) return;
  slider.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
  slider.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
  dots.forEach(function(d, i) { d.classList.toggle('active', i === currentSlide); });
  if (progress) progress.textContent = (currentSlide + 1) + ' / ' + totalSlides;
}

function slideProject(dir) {
  currentSlide = (currentSlide + dir + totalSlides) % totalSlides;
  updateSlider();
}

function goToSlide(n) {
  currentSlide = n;
  updateSlider();
}

function openModal(id) {
  var el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  var el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

function closeModalOutside(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}

window.addEventListener('load', function() {

  // Force slider to position 0 on load
  var slider = document.getElementById('projectSlider');
  if (slider) {
    slider.style.transition = 'none';
    slider.style.transform = 'translateX(0)';
  }

  // Comparison slider
  var compWrapper = document.getElementById('compSlider');
  var afterPane = document.getElementById('afterPane');
  var handle = document.getElementById('sliderHandle');
  if (compWrapper && afterPane && handle) {
    var dragging = false;
    function setPos(x) {
      var rect = compWrapper.getBoundingClientRect();
      var pct = Math.min(Math.max((x - rect.left) / rect.width, 0.02), 0.98);
      afterPane.style.width = (pct * 100) + '%';
      handle.style.left = (pct * 100) + '%';
    }
    compWrapper.addEventListener('mousedown', function(e) { dragging = true; setPos(e.clientX); e.preventDefault(); });
    window.addEventListener('mousemove', function(e) { if (dragging) setPos(e.clientX); });
    window.addEventListener('mouseup', function() { dragging = false; });
    compWrapper.addEventListener('touchstart', function(e) { dragging = true; setPos(e.touches[0].clientX); }, {passive:true});
    window.addEventListener('touchmove', function(e) { if (dragging) setPos(e.touches[0].clientX); }, {passive:true});
    window.addEventListener('touchend', function() { dragging = false; });
  }

  // Count-up animation
  var strip = document.getElementById('impactStrip');
  if (strip) {
    var countItems = strip.querySelectorAll('.count-up');
    var counted = false;
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function animateCount(el) {
      var target = el.getAttribute('data-target');
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      if (!target || isNaN(target)) return;
      var end = parseInt(target);
      var dur = 1800;
      var t0 = performance.now();
      function tick(now) {
        var p = Math.min((now - t0) / dur, 1);
        var v = Math.round(easeOut(p) * end);
        if (end >= 1000) {
          el.textContent = v >= 1000 ? '1K+' : v + suffix;
        } else {
          el.textContent = prefix + v + suffix;
        }
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        countItems.forEach(function(el) { animateCount(el); });
      }
    }, { threshold: 0.3 }).observe(strip);
  }

  // Photo slideshow
  var ss = document.getElementById('photoSlideshow');
  if (ss) {
    var dotsEl = document.getElementById('slideshowDots');
    var ssIdx = 0;
    setTimeout(function() {
      var validImgs = Array.prototype.filter.call(
        ss.querySelectorAll('img'),
        function(img) { return img.style.display !== 'none'; }
      );
      if (!validImgs.length) return;
      var ph = ss.querySelector('.slideshow-placeholder');
      if (ph) ph.style.display = 'none';
      if (dotsEl) {
        dotsEl.innerHTML = '';
        validImgs.forEach(function(_, i) {
          var d = document.createElement('button');
          d.className = 'slideshow-dot' + (i === 0 ? ' active' : '');
          dotsEl.appendChild(d);
        });
      }
      function showPhoto(n) {
        validImgs.forEach(function(img, i) { img.classList.toggle('active', i === n); });
        if (dotsEl) {
          dotsEl.querySelectorAll('.slideshow-dot').forEach(function(d, i) {
            d.classList.toggle('active', i === n);
          });
        }
        ssIdx = n;
      }
      showPhoto(0);
      setInterval(function() { showPhoto((ssIdx + 1) % validImgs.length); }, 3500);
    }, 400);
  }

  // Back to top
  var btn = document.getElementById('backToTop');
  if (btn) {
    window.addEventListener('scroll', function() {
      btn.classList.toggle('visible', window.scrollY > 600);
    });
  }

});
