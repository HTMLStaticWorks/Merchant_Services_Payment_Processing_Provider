document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const html = document.documentElement;
  
  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });

  function updateThemeIcons(theme) {
    document.querySelectorAll('.theme-icon-light').forEach(icon => {
      icon.style.display = theme === 'dark' ? 'none' : 'block';
    });
    document.querySelectorAll('.theme-icon-dark').forEach(icon => {
      icon.style.display = theme === 'dark' ? 'block' : 'none';
    });
  }

  // 2. RTL Toggle
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  const savedRtl = localStorage.getItem('rtl') === 'true';
  if (savedRtl) {
    html.setAttribute('dir', 'rtl');
  }

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isRtl = html.getAttribute('dir') === 'rtl';
      if (isRtl) {
        html.removeAttribute('dir');
        localStorage.setItem('rtl', 'false');
      } else {
        html.setAttribute('dir', 'rtl');
        localStorage.setItem('rtl', 'true');
      }
    });
  });

  // 3. Mobile Drawer
  const hamburger = document.querySelector('.hamburger');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  
  function toggleDrawer() {
    document.body.classList.toggle('drawer-open');
    if (document.body.classList.contains('drawer-open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  if (hamburger) hamburger.addEventListener('click', toggleDrawer);
  if (drawerClose) drawerClose.addEventListener('click', toggleDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', toggleDrawer);

  // 4. Sticky Header
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 5. Form Validation
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          showError(input, 'This field is required');
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          isValid = false;
          showError(input, 'Invalid email address');
        } else if (input.type === 'password' && input.value.length < 8) {
          isValid = false;
          showError(input, 'Password must be at least 8 characters');
        } else if (input.id === 'confirmPassword') {
          const pass = form.querySelector('#password');
          if (pass && pass.value !== input.value) {
            isValid = false;
            showError(input, 'Passwords do not match');
          }
        } else {
          removeError(input);
        }
      });

      const termsCheck = form.querySelector('input[type="checkbox"][required]');
      if (termsCheck && !termsCheck.checked) {
        isValid = false;
        showError(termsCheck, 'You must accept the terms');
      }

      if (isValid) {
        // Show success state (mock)
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-check-circle"></i> Success';
        btn.style.backgroundColor = 'var(--success-color)';
        setTimeout(() => {
          form.reset();
          btn.innerHTML = originalText;
          btn.style.backgroundColor = '';
        }, 3000);
      }
    });

    // Clear error on input
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => removeError(input));
    });
  });

  function showError(input, message) {
    input.classList.add('error');
    let msgEl = input.nextElementSibling;
    if (!msgEl || !msgEl.classList.contains('error-msg')) {
      msgEl = document.createElement('span');
      msgEl.className = 'error-msg';
      input.parentNode.insertBefore(msgEl, input.nextSibling);
    }
    msgEl.textContent = message;
  }

  function removeError(input) {
    input.classList.remove('error');
    const msgEl = input.nextElementSibling;
    if (msgEl && msgEl.classList.contains('error-msg')) {
      msgEl.remove();
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // 6. Scroll Animations (IntersectionObserver)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scrolled');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.animate-fade-up').forEach(el => {
    observer.observe(el);
  });

  // 7. Savings Calculator Logic (index.html)
  const calcVolume = document.getElementById('calc-volume');
  const calcTicket = document.getElementById('calc-ticket');
  const volDisplay = document.getElementById('vol-display');
  const ticketDisplay = document.getElementById('ticket-display');
  const calcSavings = document.getElementById('calc-savings');
  const compFeeDisplay = document.getElementById('comp-fee');
  const nexaFeeDisplay = document.getElementById('nexa-fee');

  if (calcVolume && calcTicket) {
    function updateCalculator() {
      const vol = parseInt(calcVolume.value);
      const ticket = parseInt(calcTicket.value);
      
      // Formatting
      volDisplay.textContent = '$' + vol.toLocaleString();
      ticketDisplay.textContent = '$' + ticket.toLocaleString();
      
      // Competitor math (e.g. 2.9% + 30¢)
      const transactions = vol / ticket;
      const compFee = (vol * 0.029) + (transactions * 0.30);
      
      // PayNexa math (e.g. 2.4% + 10¢) - simplistic interchange plus representation
      const nexaFee = (vol * 0.024) + (transactions * 0.10);
      
      const savings = compFee - nexaFee;
      
      compFeeDisplay.textContent = '$' + compFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
      nexaFeeDisplay.textContent = '$' + nexaFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
      calcSavings.textContent = '$' + savings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    
    calcVolume.addEventListener('input', updateCalculator);
    calcTicket.addEventListener('input', updateCalculator);
    updateCalculator(); // init
  }

  // 8. API Code Explorer Logic (home2.html)
  const codeTabs = document.querySelectorAll('.code-tab');
  const codeDisplay = document.getElementById('api-code-display');
  const copyBtn = document.getElementById('copy-api-code');
  
  if (codeTabs.length > 0 && codeDisplay) {
    const snippets = {
      node: `const paynexa = require('paynexa')('sk_test_12345');

const charge = await paynexa.charges.create({
  amount: 2000,
  currency: 'usd',
  source: 'tok_visa',
  description: 'Order #1024',
});

console.log(charge.status); // "succeeded"`,
      python: `import paynexa
paynexa.api_key = "sk_test_12345"

charge = paynexa.Charge.create(
    amount=2000,
    currency="usd",
    source="tok_visa",
    description="Order #1024",
)

print(charge.status) # "succeeded"`,
      curl: `curl https://api.paynexa.com/v1/charges \\
  -u sk_test_12345: \\
  -d amount=2000 \\
  -d currency=usd \\
  -d source=tok_visa \\
  -d description="Order #1024"`
    };

    codeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        codeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const lang = tab.getAttribute('data-lang');
        codeDisplay.textContent = snippets[lang];
      });
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(codeDisplay.textContent).then(() => {
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = '<i class="ph ph-check"></i> Copied';
          setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
          }, 2000);
        });
      });
    }
  }
});
