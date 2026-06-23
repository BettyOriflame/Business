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

  /* ── HERO SLIDES ── */
  var heroSlides = [
    {eye:'Divine', title:'Glam Feminine scent to<br><em>own the night&#8230;</em>', bg:'#D4E8D8', tc:'#1A3A2A', ec:'#2D7A4F', img:'https://media-cdn.oriflame.com/productImage?externalMediaId=product-management-media%2fProducts%2f46801%2f46801_1.png&MediaId=20242671&Version=1&q=90'},
    {eye:'Glacier', title:'Unlock Your <em>Spark&#8230;</em>', bg:'#D8E8F0', tc:'#1A2A3A', ec:'#1A5A7A', img:'https://media-cdn.oriflame.com/productImage?externalMediaId=product-management-media%2fProducts%2f40667%2f40667_1.png&MediaId=19083902&Version=2&q=90'},
    {eye:'Giordani Gold', title:'Deodorants that smell<br><em>SO good!</em>', bg:'#F0EBD8', tc:'#3A2A1A', ec:'#8B6533', img:'https://media-cdn.oriflame.com/productImage?externalMediaId=product-management-media%2fProducts%2f47759%2f47759_1.png&MediaId=20378989&Version=1&q=90'}
  ];
  var hCur = 0;
  var heroTimer;

  function autoAdvance() {
    heroGo((hCur + 1) % heroSlides.length);
  }

  function heroGo(n) {
    hCur = n;
    var s = heroSlides[n];
    var eyeEl = document.getElementById('hSlideEye');
    var titleEl = document.getElementById('hSlideTitle');
    var areaEl = document.getElementById('heroSlideArea');
    var imgEl = document.getElementById('heroImg');
    if (!eyeEl || !titleEl || !areaEl) return;
    eyeEl.textContent = s.eye;
    titleEl.innerHTML = s.title;
    areaEl.style.background = s.bg;
    titleEl.style.color = s.tc;
    document.querySelector('.hero-eyebrow').style.color = s.ec;
    if (imgEl) imgEl.src = s.img;
    document.querySelectorAll('.hero-dot').forEach(function(d, i) {
      d.classList.toggle('on', i === n);
    });
    clearInterval(heroTimer);
    heroTimer = setInterval(autoAdvance, 4500);
  }

  function initHero() {
    if (!document.getElementById('heroSlideArea')) return;
    heroTimer = setInterval(autoAdvance, 4500);
    window.heroGo = heroGo;
  }

  /* ── SCROLL REVEAL ── */
  function initScrollReveal() {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('in');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.r').forEach(function(el) { obs.observe(el); });
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
      var res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btn.textContent = '✓ Sent!';
        btn.style.background = '#27ae60';
        setTimeout(function() {
          btn.textContent = 'Send Order Request';
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 3500);
      } else {
        throw new Error('Send failed');
      }
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
      var res = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btn.textContent = '✓ Registered! I will contact you soon.';
        btn.style.background = '#27ae60';
        sendToWhatsApp(formData);
        setTimeout(function() {
          btn.textContent = "Register Now — It's Free";
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 4000);
      } else {
        throw new Error('Submit failed');
      }
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

  /* ── BOOT ── */
  document.addEventListener('DOMContentLoaded', function() {
    loadIncludes();
    setupForms();
  });

})();
