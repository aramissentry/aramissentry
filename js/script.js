document.addEventListener('DOMContentLoaded', function () {

  /*
  ============================================================
  ARAMIS SENTRY CONTACT FORM CONFIGURATION

  Email destination:
  Aramissentry@gmail.com

  Form service:
  Formspree

  IMPORTANT:
  The endpoint below is the configured Aramis Sentry Formspree endpoint.
  Enable and customize the autoresponder in the Formspree dashboard.

  Do NOT put email passwords, SMTP credentials or private
  API keys in this file.
  ============================================================
  */
  var FORM_ENDPOINT = 'https://formspree.io/f/mjybnrvg';

  /* ---------- Sticky header scroll state ---------- */
  var header = document.querySelector('.header');
  var onScroll = function () {
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Stat count-up ---------- */
  var statEls = document.querySelectorAll('.stat__number[data-count-to]');
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;

    var step = function (timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    };
    window.requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && statEls.length) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statEls.forEach(function (el) { statObserver.observe(el); });
  }

  /* ---------- Security request form ---------- */
  var requestForm = document.getElementById('security-request-form');
  if (requestForm) {
    var formStatus = requestForm.querySelector('.form__status');
    var submitButton = requestForm.querySelector('.form__submit');
    var submitLabel = submitButton.querySelector('span');
    var requiredFields = [
      { id: 'name', message: 'Please enter your full name.' },
      { id: 'email', message: 'Please provide a valid email address.' },
      { id: 'phone', message: 'Please enter your phone number.' },
      { id: 'service', message: 'Please select the security service you require.' },
      { id: 'message', message: 'Please tell us about your security requirement.' }
    ];

    var setFormStatus = function (message, type) {
      formStatus.textContent = message;
      formStatus.className = 'form__status is-' + type;
      formStatus.focus();
    };

    var validateRequestForm = function () {
      var firstInvalid = null;
      for (var i = 0; i < requiredFields.length; i += 1) {
        var field = document.getElementById(requiredFields[i].id);
        var isInvalid = !field.value.trim() || (field.type === 'email' && !field.validity.valid);
        field.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
        if (isInvalid && !firstInvalid) {
          firstInvalid = field;
          setFormStatus(requiredFields[i].message, 'error');
        }
      }
      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    };

    requestForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (submitButton.disabled || !validateRequestForm()) return;

      requestForm.querySelector('[name="_replyto"]').value = document.getElementById('email').value.trim();
      requestForm.querySelector('[name="_subject"]').value = 'NEW SECURITY SERVICE REQUEST - ' + document.getElementById('service').value;
      submitButton.disabled = true;
      submitLabel.textContent = 'Submitting Request...';
      setFormStatus('Submitting your security request...', 'pending');

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: new FormData(requestForm),
        headers: { Accept: 'application/json' }
      }).then(function (response) {
        if (!response.ok) throw new Error('Form submission failed');
        requestForm.reset();
        requestForm.querySelectorAll('[aria-invalid]').forEach(function (field) { field.removeAttribute('aria-invalid'); });
        setFormStatus('Request Received. Thank you for contacting Aramis Sentry. Your security request has been received successfully. A member of our team will review your enquiry and contact you shortly.', 'success');
      }).catch(function () {
        setFormStatus("We couldn't submit your request at this time. Please try again or contact Aramis Sentry directly.", 'error');
      }).finally(function () {
        submitButton.disabled = false;
        submitLabel.textContent = 'Submit Security Request';
      });
    });
  }

  /* ---------- Featured event video ---------- */
  var eventVideo = document.querySelector('.event-video__player');
  var videoToggle = document.querySelector('[data-video-toggle]');
  var videoMute = document.querySelector('[data-video-mute]');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (eventVideo) {
    var updateVideoControls = function () {
      var isPaused = eventVideo.paused;
      videoToggle.setAttribute('aria-label', isPaused ? 'Play video' : 'Pause video');
      videoToggle.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
      videoToggle.classList.toggle('is-paused', isPaused);
      videoMute.setAttribute('aria-label', eventVideo.muted ? 'Unmute video' : 'Mute video');
      videoMute.setAttribute('aria-pressed', eventVideo.muted ? 'false' : 'true');
      videoMute.classList.toggle('is-muted', eventVideo.muted);
    };

    var playEventVideo = function () {
      if (!prefersReducedMotion) {
        var playPromise = eventVideo.play();
        if (playPromise) playPromise.catch(function () {});
      }
      updateVideoControls();
    };

    eventVideo.muted = true;
    videoToggle.addEventListener('click', function () {
      if (eventVideo.paused) {
        playEventVideo();
      } else {
        eventVideo.pause();
        updateVideoControls();
      }
    });

    videoMute.addEventListener('click', function () {
      eventVideo.muted = !eventVideo.muted;
      if (!eventVideo.muted && eventVideo.paused && !prefersReducedMotion) playEventVideo();
      updateVideoControls();
    });

    eventVideo.addEventListener('play', updateVideoControls);
    eventVideo.addEventListener('pause', updateVideoControls);
    eventVideo.addEventListener('volumechange', updateVideoControls);
    updateVideoControls();

    if ('IntersectionObserver' in window) {
      var videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            playEventVideo();
          } else if (!eventVideo.paused) {
            eventVideo.pause();
            updateVideoControls();
          }
        });
      }, { threshold: 0.25 });
      videoObserver.observe(eventVideo);
    } else {
      playEventVideo();
    }
  }

  /* ---------- Event gallery filters and lightbox ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('[data-gallery-item]'));
  var galleryFilters = document.querySelectorAll('[data-gallery-filter]');
  var lightbox = document.querySelector('[data-gallery-lightbox]');
  var lightboxImage = document.querySelector('[data-lightbox-image]');
  var lightboxCaption = document.querySelector('[data-lightbox-caption]');
  var activeGalleryItems = galleryItems;
  var activeGalleryIndex = 0;
  var previousFocus = null;

  if (galleryItems.length && lightbox) {
    galleryFilters.forEach(function (filter) {
      filter.addEventListener('click', function () {
        var category = filter.getAttribute('data-gallery-filter');
        galleryFilters.forEach(function (item) {
          var isActive = item === filter;
          item.classList.toggle('is-active', isActive);
          item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        galleryItems.forEach(function (item) {
          item.hidden = category !== 'all' && item.getAttribute('data-category') !== category;
        });
        activeGalleryItems = galleryItems.filter(function (item) { return !item.hidden; });
      });
    });

    var showGalleryItem = function (index) {
      activeGalleryIndex = (index + activeGalleryItems.length) % activeGalleryItems.length;
      var item = activeGalleryItems[activeGalleryIndex];
      lightboxImage.src = item.getAttribute('data-full');
      lightboxImage.alt = item.querySelector('img').alt;
      lightboxCaption.textContent = item.getAttribute('data-caption');
    };
    var closeLightbox = function () {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (previousFocus) previousFocus.focus();
    };

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        previousFocus = item;
        activeGalleryItems = galleryItems.filter(function (galleryItem) { return !galleryItem.hidden; });
        showGalleryItem(activeGalleryItems.indexOf(item));
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lightbox.querySelector('[data-lightbox-close]').focus();
      });
    });
    lightbox.querySelector('[data-lightbox-close]').addEventListener('click', closeLightbox);
    lightbox.querySelector('[data-lightbox-prev]').addEventListener('click', function () { showGalleryItem(activeGalleryIndex - 1); });
    lightbox.querySelector('[data-lightbox-next]').addEventListener('click', function () { showGalleryItem(activeGalleryIndex + 1); });
    lightbox.addEventListener('click', function (event) { if (event.target === lightbox) closeLightbox(); });

    var touchStartX = 0;
    lightbox.addEventListener('touchstart', function (event) { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
    lightbox.addEventListener('touchend', function (event) {
      var distance = event.changedTouches[0].screenX - touchStartX;
      if (Math.abs(distance) > 50) showGalleryItem(activeGalleryIndex + (distance < 0 ? 1 : -1));
    }, { passive: true });
    document.addEventListener('keydown', function (event) {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showGalleryItem(activeGalleryIndex - 1);
      if (event.key === 'ArrowRight') showGalleryItem(activeGalleryIndex + 1);
    });
  }

  /* ---------- Smooth-scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        var targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

});
