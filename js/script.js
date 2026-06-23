(function() {
  /* ── INCLUDE HEADER / FOOTER ── */
  function loadIncludes() {
    var includes = document.querySelectorAll('[data-include]');
    var remaining = includes.length;
    function done() {
      setActiveNav();
      initHero();
      initScrollReveal();
    }
    if (remaining === 0) { done(); return; }
    includes.forEach(function(el) {
      var url = el.getAttribute('data-include');
      fetch(url)
        .then(function(r) { return r.text(); })
        .then(function(html) {
          el.outerHTML = html;
          remaining--;
          if (remaining === 0) done();
        })
        .catch(function() {
          el.outerHTML = '';
          remaining--;
          if (remaining === 0) done();
        });
    });
  }

  /* ── SET ACTIVE NAV ── */
  function setActiveNav() {
    var page = document.body.getAttribute('data-page');
    if (!page) return;
    var nav = document.getElementById('mainNav');
    if (!nav) return;
    nav.querySelectorAll('[data-page]').forEach(function(a) {
      if (a.getAttribute('data-page') === page) a.classList.add('active');
    });
  }

  /* ── HERO SLIDER ── */
  var hCur = 0;
  var heroTimer;

  function autoAdvance() {
    heroGo((hCur + 1) % 3);
  }

  function heroGo(n) {
    hCur = n;
    var slides = document.querySelectorAll('.o-hero-slide');
    var dots = document.querySelectorAll('.o-hero-dot');
    slides.forEach(function(s, i) {
      s.classList.toggle('active', i === n);
    });
    dots.forEach(function(d, i) {
      d.classList.toggle('on', i === n);
    });
    clearInterval(heroTimer);
    heroTimer = setInterval(autoAdvance, 5000);
  }

  function initHero() {
    if (!document.querySelector('.o-hero-slider')) return;
    heroTimer = setInterval(autoAdvance, 5000);
    window.heroGo = heroGo;
  }

  /* ── SCROLL REVEAL ── */
  function initScrollReveal() {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('in');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.r, .o-section, .o-prod-grid').forEach(function(el) { obs.observe(el); });
  }

  /* ── FORM HANDLERS ── */
  function setupForms() {
    var subBtn = document.getElementById('subBtn');
    if (subBtn) {
      var form = subBtn.closest('form');
      if (form) {
        form.onsubmit = function(e) { return handleSub(e, subBtn); };
      }
    }
    var boBtn = document.getElementById('boSubBtn');
    if (boBtn) {
      var boForm = boBtn.closest('form');
      if (boForm) {
        boForm.onsubmit = function(e) { return handleBoSub(e, boBtn); };
      }
    }
  }

  async function handleSub(e, btn) {
    e.preventDefault();
    var form = e.target;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    try {
      var formData = new FormData(form);
      var name = formData.get('name') || '';
      var phone = formData.get('phone') || '';
      var email = formData.get('email') || '';
      var location = formData.get('location') || '';
      var interest = formData.get('interest') || '';
      var message = formData.get('message') || '';

      var interestLabels = {
        'buying': 'Buying Products',
        'skincare': 'Skincare',
        'fragrance': 'Fragrance & Perfume',
        'makeup': 'Makeup',
        'haircare': 'Haircare',
        'wellness': 'Wellness & Nutrition',
        'mens': "Men's Products",
        'gifts': 'Gift Sets',
        'join': 'Joining as a Distributor',
        'enquiry': 'General Enquiry'
      };

      var msg = '🛍️ *New Order / Enquiry*\n\n';
      msg += '*Name:* ' + name + '\n';
      msg += '*Phone:* ' + phone + '\n';
      if (email) msg += '*Email:* ' + email + '\n';
      if (location) msg += '*Location:* ' + location + '\n';
      if (interest) msg += '*Interest:* ' + (interestLabels[interest] || interest) + '\n';
      if (message) msg += '*Details:* ' + message + '\n';
      msg += '\n_Sent from Oghenekaro Betty Oriflame website_';

      var encodedMsg = encodeURIComponent(msg);
      var whatsappUrl = 'https://wa.me/2348063018798?text=' + encodedMsg;
      window.open(whatsappUrl, '_blank', 'noopener');

      btn.textContent = '✓ Sent!';
      btn.style.background = '#27ae60';
      setTimeout(function() {
        btn.textContent = 'Send Order Request';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    } catch (err) {
      btn.textContent = '✗ Failed — try again';
      btn.style.background = '#c0392b';
      setTimeout(function() {
        btn.textContent = 'Send Order Request';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  }

  async function handleBoSub(e, btn) {
    e.preventDefault();
    var form = e.target;
    btn.textContent = 'Submitting…';
    btn.disabled = true;
    try {
      var formData = new FormData(form);
      sendToWhatsApp(formData);
      btn.textContent = '✓ Registered! I will contact you soon.';
      btn.style.background = '#27ae60';
      setTimeout(function() {
        btn.textContent = "Register Now — It's Free";
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 4000);
    } catch (err) {
      btn.textContent = '✗ Failed — try again';
      btn.style.background = '#c0392b';
      setTimeout(function() {
        btn.textContent = "Register Now — It's Free";
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  }

  function sendToWhatsApp(formData) {
    var firstName = formData.get('first_name') || '';
    var lastName = formData.get('last_name') || '';
    var phone = formData.get('phone') || '';
    var email = formData.get('email') || '';
    var state = formData.get('state') || '';
    var goal = formData.get('goal') || '';
    var questions = formData.get('questions') || '';

    var goalLabels = {
      'part-time': 'Earning extra income part-time',
      'full-time': 'Building a full-time business',
      'saving': 'Saving money on products I already love',
      'travel': 'Travel rewards & lifestyle perks',
      'all': 'All of the above!'
    };

    var message = '🌸 *New Business Sign-Up Request*\n\n';
    message += '*Name:* ' + firstName + ' ' + lastName + '\n';
    message += '*Phone/WhatsApp:* ' + phone + '\n';
    if (email) message += '*Email:* ' + email + '\n';
    if (state) message += '*State/City:* ' + state + '\n';
    if (goal) message += '*Interest:* ' + (goalLabels[goal] || goal) + '\n';
    if (questions) message += '*Questions:* ' + questions + '\n';
    message += '\n_Sent from Oghenekaro Betty Oriflame website_';

    var encodedMsg = encodeURIComponent(message);
    var whatsappUrl = 'https://wa.me/2348063018798?text=' + encodedMsg;
    window.open(whatsappUrl, '_blank', 'noopener');
  }

  /* ── SEARCH ── */
  function setupSearch() {
    var input = document.querySelector('.o-hdr-search input');
    if (!input) return;
    input.addEventListener('keydown', function(e) {
      if (e.key !== 'Enter') return;
      var q = input.value.trim();
      if (!q) return;
      var isProducts = document.body.getAttribute('data-page') === 'products';
      if (isProducts) {
        filterProducts(q);
      } else {
        window.location.href = 'products.html?q=' + encodeURIComponent(q);
      }
    });
  }

  /* ── PRODUCT SEARCH FILTER ── */
  function filterProducts(q) {
    q = q.toLowerCase();
    var cards = document.querySelectorAll('.o-card');
    var anyVisible = false;
    cards.forEach(function(c) {
      var name = (c.querySelector('.o-card-name') || {}).textContent || '';
      var brand = (c.querySelector('.o-card-brand') || {}).textContent || '';
      var match = name.toLowerCase().indexOf(q) !== -1 || brand.toLowerCase().indexOf(q) !== -1;
      c.style.display = match ? '' : 'none';
      if (match) anyVisible = true;
    });
    var sections = document.querySelectorAll('.o-section[id]');
    sections.forEach(function(s) {
      var hasVisible = Array.from(s.querySelectorAll('.o-card')).some(function(c) { return c.style.display !== 'none'; });
      s.style.display = hasVisible ? '' : 'none';
    });
    var noResults = document.getElementById('search-no-results');
    if (!anyVisible) {
      if (!noResults) {
        noResults = document.createElement('div');
        noResults.id = 'search-no-results';
        noResults.style.cssText = 'text-align:center;padding:4rem 2rem;color:var(--o-muted);font-size:16px';
        noResults.textContent = 'No products found for "' + q + '". Try a different search or contact Betty on WhatsApp for help.';
        var container = document.querySelector('.o-section') || document.body;
        container.parentNode.insertBefore(noResults, container.nextSibling);
      }
      noResults.style.display = '';
    } else if (noResults) {
      noResults.style.display = 'none';
    }
  }

  /* ── READ URL SEARCH PARAM ── */
  function applyUrlSearch() {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      var input = document.querySelector('.o-hdr-search input');
      if (input) input.value = q;
      filterProducts(q);
    }
  }

  /* ── BOOT ── */
  document.addEventListener('DOMContentLoaded', function() {
    applyUrlSearch();
    setupForms();
    loadIncludes();
    var pollTimer = setInterval(function() {
      if (document.querySelector('.o-hdr-search input')) {
        clearInterval(pollTimer);
        setupSearch();
      }
    }, 100);
  });

})();
