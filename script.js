console.log('script.js loaded');

// ===== Mobile Navigation Toggle =====
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ===== Sticky Navigation on Scroll =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== Scroll Animation for Elements =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in-scroll class
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in-scroll');
    fadeElements.forEach(el => observer.observe(el));
});

// ===== Form Validation (for contact page) =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const inquiry = document.getElementById('inquiry').value;
        const message = document.getElementById('message').value.trim();
        
        // Validation
        let isValid = true;
        let errorMessage = '';
        
        if (name === '') {
            errorMessage += 'Please enter your name.\n';
            isValid = false;
        }
        
        if (email === '' || !isValidEmail(email)) {
            errorMessage += 'Please enter a valid email address.\n';
            isValid = false;
        }
        
        if (phone === '' || !isValidPhone(phone)) {
            errorMessage += 'Please enter a valid phone number.\n';
            isValid = false;
        }
        
        if (inquiry === '') {
            errorMessage += 'Please select what you need help with.\n';
            isValid = false;
        }
        
        // Message is now optional, so we don't validate it
        
        if (!isValid) {
            showNotification(errorMessage, 'error');
            return;
        }
        
        // If validation passes, show success message
        const inquiryText = document.getElementById('inquiry').options[document.getElementById('inquiry').selectedIndex].text;
        showNotification(`Thank you, ${name}! We received your inquiry about "${inquiryText}". Our team will contact you soon at ${email}.`, 'success');
        contactForm.reset();
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (basic)
function isValidPhone(phone) {
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    return phoneRegex.test(phone);
}

// Notification function
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 20px 25px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        white-space: pre-line;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations to document
if (!document.querySelector('#notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== Active Navigation Link Based on Current Page =====
const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();
    link.classList.remove('active');
    if (linkPath === currentLocation) {
        link.classList.add('active');
    }
});

// ===== Product Filter (for products page) =====
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== Counter Animation for Stats =====
function animateCounter(element, start, end, duration) {
    let startTime = null;
    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.dataset.suffix || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Observe stat numbers
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            const suffix = text.replace(/[0-9]/g, '');
            entry.target.dataset.suffix = suffix;
            animateCounter(entry.target, 0, number, 2000);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ===== Back to Top Button =====
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '↑';
backToTopButton.className = 'back-to-top';
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--primary-color, #1a4d8f);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

backToTopButton.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
});

backToTopButton.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// ===== Image Lazy Loading Fallback =====
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});


// const form = document.getElementById('contactForm');
// const statusEl = document.getElementById('formStatus');

// const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyVfHEfmMwZmMaEPjA6BlpcdY-s4MdRtEZVbAglydp2XAcRAwQuQ6aCXyFlvbNzuB30kw/exec';

// let isSubmitting = false;



// form.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   console.log('JS submit handler triggered');
//   if (isSubmitting) return;

//   isSubmitting = true;
//   statusEl.textContent = '';

//   const payload = {
//     name: form.name.value.trim(),
//     email: form.email.value.trim(),
//     phone: form.phone.value.trim(),
//     company: form.company.value.trim(),
//     inquiry: form.inquiry.value,
//     message: form.message.value.trim()
//   };

//   try {
//     const res = await fetch(GOOGLE_SCRIPT_URL, {
//         method: 'POST',          // ✅ FORCE POST (THIS IS FIX 1)
//         body: JSON.stringify(payload),
//         redirect: 'follow'
//         })


//     const data = await res.json();

//     if (data.success) {
//       statusEl.style.color = 'green';
//       statusEl.textContent = '✅ Thank you! Your message has been sent.';
//       form.reset();
//     } else {
//       throw new Error(data.message);
//     }
//   } catch (err) {
//     statusEl.style.color = 'red';
//     statusEl.textContent = '❌ Something went wrong. Please try again.';
//   } finally {
//     isSubmitting = false;
//   }
// });

// const GOOGLE_SCRIPT_URL =
//   'https://script.google.com/macros/s/AKfycbyVfHEfmMwZmMaEPjA6BlpcdY-s4MdRtEZVbAglydp2XAcRAwQuQ6aCXyFlvbNzuB30kw/exec';

// document.getElementById('submitBtn').addEventListener('click', () => {
//   console.log('Button clicked — forcing POST');

//   const payload = {
//     name: document.getElementById('name').value,
//     email: document.getElementById('email').value,
//     phone: document.getElementById('phone').value,
//     message: document.getElementById('message').value.trim()
//   };

//   fetch(GOOGLE_SCRIPT_URL, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(payload)
//   })
//   .then(res => res.text())
//   .then(data => {
//     console.log('Response:', data);
//     alert('Enquiry submitted successfully');
//   })
//   .catch(err => {
//     console.error('Error:', err);
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  if (!slides.length) {
    console.error("No slides found");
    return;
  }

  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 4000); // change every 4 seconds
});
