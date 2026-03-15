// ── PROJECT SLIDER ──
var currentSlide = 0;
var totalSlides = 4;

function updateSlider() {
  var slides = document.querySelectorAll('.project-slide');
  var dots = document.querySelectorAll('.slider-dot');
  var progress = document.getElementById('slideProgress');
  if (!slides.length) return;
  slides.forEach(function(slide, i) {
    slide.style.transform = 'translateX(' + ((i - currentSlide) * 100) + '%)';
    slide.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
  });
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

// ── DOM READY ──
document.addEventListener('DOMContentLoaded', function() {

  // Init slider — position all slides absolutely side by side
  var slides = document.querySelectorAll('.project-slide');
  var wrap = document.getElementById('projectSlider');
  if (slides.length && wrap) {
    // Make the slider a position:relative container
    wrap.style.position = 'relative';
    wrap.style.overflow = 'hidden';
    // Set each slide to absolute, full width, stacked
    slides.forEach(function(slide, i) {
      slide.style.position = 'absolute';
      slide.style.top = '0';
      slide.style.left = '0';
      slide.style.width = '100%';
      slide.style.transform = 'translateX(' + (i * 100) + '%)';
      slide.style.transition = 'none';
    });
    // Set wrap height to match first slide
    function syncHeight() {
      wrap.style.height = slides[currentSlide].offsetHeight + 'px';
    }
    syncHeight();
    window.addEventListener('resize', syncHeight);

    // Re-sync height after slide transition
    wrap.addEventListener('transitionend', syncHeight);
  }

  // Comparison slider
  var wrapper = document.getElementById('compSlider');
  var afterPane = document.getElementById('afterPane');
  var handle = document.getElementById('sliderHandle');
  if (wrapper && afterPane && handle) {
    var compDragging = false;
    function setPos(x) {
      var rect = wrapper.getBoundingClientRect();
      var pct = Math.min(Math.max((x - rect.left) / rect.width, 0.02), 0.98);
      afterPane.style.width = (pct * 100) + '%';
      handle.style.left = (pct * 100) + '%';
    }
    wrapper.addEventListener('mousedown', function(e) { compDragging = true; setPos(e.clientX); e.preventDefault(); });
    window.addEventListener('mousemove', function(e) { if (compDragging) setPos(e.clientX); });
    window.addEventListener('mouseup', function() { compDragging = false; });
    wrapper.addEventListener('touchstart', function(e) { compDragging = true; setPos(e.touches[0].clientX); }, {passive:true});
    window.addEventListener('touchmove', function(e) { if (compDragging) setPos(e.touches[0].clientX); }, {passive:true});
    window.addEventListener('touchend', function() { compDragging = false; });
  }

  // Count-up
  var strip = document.getElementById('impactStrip');
  if (strip) {
    var countItems = strip.querySelectorAll('.count-up');
    var counted = false;
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function animateCount(el) {
      var target = el.getAttribute('data-target');
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      if (isNaN(target) || target === '') return;
      var end = parseInt(target);
      var dur = 1800;
      var t0 = performance.now();
      function tick(now) {
        var p = Math.min((now - t0) / dur, 1);
        var v = Math.round(easeOut(p) * end);
        el.textContent = end >= 1000 ? (v >= 1000 ? '1K+' : v + suffix) : prefix + v + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        countItems.forEach(function(el) { animateCount(el); });
      }
    }, { threshold: 0.3 });
    obs.observe(strip);
  }

  // Photo slideshow
  var ss = document.getElementById('photoSlideshow');
  if (ss) {
    var dotsEl = document.getElementById('slideshowDots');
    var ssIdx = 0;
    setTimeout(function() {
      var validImgs = Array.prototype.filter.call(ss.querySelectorAll('img'), function(img) {
        return img.style.display !== 'none';
      });
      if (validImgs.length === 0) return;
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
          var dd = dotsEl.querySelectorAll('.slideshow-dot');
          dd.forEach(function(d, i) { d.classList.toggle('active', i === n); });
        }
        ssIdx = n;
      }
      showPhoto(0);
      setInterval(function() { showPhoto((ssIdx + 1) % validImgs.length); }, 3500);
    }, 300);
  }

});
