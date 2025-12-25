/**
 * LOOMPER V2 — JavaScript BLINDADO (PRODUÇÃO)
 * Tracking • Simulador • Netlify Forms • WhatsApp
 */

(function () {
  'use strict';

  /* ===============================
     HELPERS
     =============================== */
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ===============================
     USER ID — GARANTIA ABSOLUTA
     =============================== */
  function generateUserId() {
    if (window.crypto && crypto.randomUUID) {
      return 'LMP-' + crypto.randomUUID().split('-')[0].toUpperCase();
    }
    return 'LMP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  function getOrCreateUserId() {
    let id = localStorage.getItem('loomper_user_id');
    if (!id) {
      id = generateUserId();
      localStorage.setItem('loomper_user_id', id);
    }
    return id;
  }

  const USER_ID = getOrCreateUserId();

  /* ===============================
     REFERRER
     =============================== */
  function getReferrer() {
    try {
      return new URLSearchParams(window.location.search).get('ref') || 'direct';
    } catch {
      return 'direct';
    }
  }

  /* ===============================
     TRACKING
     =============================== */
  const Tracking = {
    journey: [],

    load() {
      try {
        const saved = localStorage.getItem('loomper_journey');
        if (saved) this.journey = JSON.parse(saved);
      } catch {
        this.journey = [];
      }
    },

    track(action, data = {}) {
      this.journey.push({
        action,
        data,
        at: new Date().toISOString()
      });
      localStorage.setItem('loomper_journey', JSON.stringify(this.journey));
    },

    summary() {
      const profiles = this.journey.map(j => j.data.profile).filter(Boolean);
      return {
        profile: profiles.at(-1) || 'não identificado',
        total_interactions: this.journey.length,
        actions: [...new Set(this.journey.map(j => j.action))]
      };
    }
  };

  /* ===============================
     HEADER / MENU MOBILE
     =============================== */
  function initHeader() {
    const header = $('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  function initMobileMenu() {
    const toggle = $('menuToggle');
    const nav = $('navMobile');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      nav.classList.toggle('active');
    });
  }

  /* ===============================
     PERFIL SELECIONADO
     =============================== */
  function initProfileSelection() {
    $$('[data-profile]').forEach(btn => {
      btn.addEventListener('click', () => {
        const profile = btn.dataset.profile;
        if (!profile) return;
        localStorage.setItem('loomper_profile', profile);
        Tracking.track('profile-selected', { profile });
      });
    });
  }

  function applyProfileToForm() {
    const select = $('waitlist-profile');
    if (!select) return;

    const map = {
      motorista: 'Motorista',
      chapa: 'Chapa / Ajudante',
      transportadora: 'Transportadora',
      investidor: 'Investidor / Parceiro'
    };

    const saved = localStorage.getItem('loomper_profile');
    if (map[saved]) select.value = map[saved];
  }

  /* ===============================
     FORM NETLIFY
     =============================== */
  function initForm() {
    const form = $('waitlistForm');
    if (!form) return;

    form.addEventListener('submit', () => {
      const idUser = $('user_id');
      const ref = $('referrer_id');
      const journey = $('user_journey');
      const termsAt = $('terms_accepted_at');

      if (idUser) idUser.value = USER_ID;
      if (ref) ref.value = getReferrer();
      if (journey) journey.value = JSON.stringify(Tracking.summary());
      if (termsAt) termsAt.value = new Date().toISOString();

      Tracking.track('form-submit');
    });
  }

  /* ===============================
     SIMULADOR
     =============================== */
  function initSimulator() {
    const modal = $('simulatorModal');
    if (!modal) return;

    const title = $('simulatorTitle');
    const closeBtn = $('simulatorClose');

    const panels = {
      motorista: $('simMotorista'),
      chapa: $('simChapa'),
      transportadora: $('simTransportadora')
    };

    function open(profile) {
      if (!panels[profile]) return;

      modal.setAttribute('aria-hidden', 'false');
      Object.values(panels).forEach(p => p && (p.style.display = 'none'));
      panels[profile].style.display = 'block';

      if (title) title.textContent = `Simulador — ${profile}`;

      Tracking.track('simulator-open', { profile });
    }

    $$('[data-action="simulate"]').forEach(btn => {
      btn.addEventListener('click', () => open(btn.dataset.profile));
    });

    closeBtn?.addEventListener('click', () => {
      modal.setAttribute('aria-hidden', 'true');
    });
  }

  /* ===============================
     WHATSAPP FAB
     =============================== */
  function initWhatsApp() {
    const btn = $('whatsappFab');
    if (!btn) return;

    btn.addEventListener('click', e => {
      e.preventDefault();
      const summary = Tracking.summary();
      const msg =
        `Olá! Sou ${summary.profile} e me cadastrei no Beta LOOMPER.` +
        ` Meu ID é ${USER_ID}.`;
      window.open(
        `https://wa.me/5511965858142?text=${encodeURIComponent(msg)}`,
        '_blank'
      );
    });
  }

  /* ===============================
     INIT
     =============================== */
  document.addEventListener('DOMContentLoaded', () => {
    Tracking.load();
    initHeader();
    initMobileMenu();
    initProfileSelection();
    applyProfileToForm();
    initForm();
    initSimulator();
    initWhatsApp();

    console.log('%cLOOMPER JS carregado com sucesso.', 'color:#d4a847;font-weight:bold');
  });

})();
