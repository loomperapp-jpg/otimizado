/**
 * =========================================================
 * LOOMPER OPTIMIZED JAVASCRIPT - VERSÃO CORRIGIDA
 * Tracking completo, validação, integrações preparadas
 * FIX: Netlify Forms agora funciona corretamente
 * =========================================================
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURAÇÕES
  // ============================================
  const CONFIG = {
    WA_NUMBER: '5511965858142',
    PIX_KEY: 'contato@loomper.com.br',
    WA_GROUP: 'https://chat.whatsapp.com/GRUPO_ID', // Atualizar com ID real do grupo
    CREDITS_MOTORISTA: 100,
    CREDITS_TRANSPORTADORA: 500,
    CREDITS_CHAPA: 0 // Sempre gratuito
  };

  // ============================================
  // UTILIDADES
  // ============================================
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function generateUserId() {
    try {
      if (crypto.randomUUID) {
        return 'LMP-' + crypto.randomUUID().split('-')[0].toUpperCase();
      }
    } catch (e) {}
    return 'LMP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  function getUserId() {
    let id = localStorage.getItem('loomper_user_id');
    if (!id) {
      id = generateUserId();
      localStorage.setItem('loomper_user_id', id);
    }
    return id;
  }

  function getReferrerId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ref') || 'direct';
  }

  function formatWhatsApp(phone) {
    return phone.replace(/\D/g, '');
  }

  // ============================================
  // TRACKING (Jornada do usuário)
  // ============================================
  const Tracking = {
    journey: [],

    init() {
      const saved = localStorage.getItem('loomper_journey');
      if (saved) {
        try {
          this.journey = JSON.parse(saved);
        } catch (e) {
          this.journey = [];
        }
      }
    },

    track(action, data = {}) {
      const event = {
        action,
        data,
        timestamp: new Date().toISOString(),
        user_id: getUserId()
      };
      this.journey.push(event);
      localStorage.setItem('loomper_journey', JSON.stringify(this.journey));
    },

    getSummary() {
      return {
        user_id: getUserId(),
        referrer: getReferrerId(),
        total_events: this.journey.length,
        first_visit: this.journey[0]?.timestamp,
        last_visit: this.journey[this.journey.length - 1]?.timestamp,
        actions: [...new Set(this.journey.map(j => j.action))]
      };
    }
  };

  // ============================================
  // HEADER SCROLL
  // ============================================
  function initHeader() {
    const header = $('#header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  function initMobileMenu() {
    const toggle = $('#menuToggle');
    const menu = $('#mobileMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
      Tracking.track('mobile_menu_toggle');
    });

    // Fechar ao clicar em link
    $$('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = $(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          Tracking.track('scroll_to_section', { section: href });
        }
      });
    });
  }

  // ============================================
  // PERFIL SELEÇÃO (Hero CTAs)
  // ============================================
  function initProfileSelection() {
    $$('[data-profile]').forEach(btn => {
      btn.addEventListener('click', () => {
        const profile = btn.dataset.profile;
        localStorage.setItem('loomper_selected_profile', profile);
        Tracking.track('profile_selected', { profile });
      });
    });

    // Preencher select do formulário
    const profileSelect = $('#user_type');
    if (profileSelect) {
      const savedProfile = localStorage.getItem('loomper_selected_profile');
      if (savedProfile) {
        const profileMap = {
          'motorista': 'Motorista',
          'chapa': 'Chapa / Ajudante',
          'transportadora': 'Transportadora',
          'investidor': 'Investidor'
        };
        if (profileMap[savedProfile]) {
          profileSelect.value = profileMap[savedProfile];
        }
      }
    }
  }

  // ============================================
  // SIMULADORES
  // ============================================
  function initSimulators() {
    const tabs = $$('.sim-tab');
    const panels = $$('.sim-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        
        // Atualizar tabs
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Atualizar painéis
        panels.forEach(p => p.classList.remove('active'));
        const targetPanel = $('#sim-' + targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
        
        Tracking.track('simulator_view', { type: targetId });
      });
    });

    // Botões "Ver Simulação"
    $$('[data-simulate]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.simulate;
        
        // Ativar tab correspondente
        tabs.forEach(tab => {
          if (tab.dataset.tab === type) {
            tab.click();
          }
        });
        
        // Scroll para simulador
        const simulatorSection = $('#como-funciona');
        if (simulatorSection) {
          simulatorSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        Tracking.track('simulate_button_click', { type });
      });
    });
  }

  // ============================================
  // FORMULÁRIO (VALIDAÇÃO & SUBMIT) - CORRIGIDO!
  // ============================================
  function initForm() {
    const form = $('#waitlistForm');
    if (!form) return;

    // Preencher campos hidden ANTES do submit
    function updateHiddenFields() {
      const userTypeSelect = $('#user_type');
      const userType = userTypeSelect ? userTypeSelect.value : '';
      
      // User ID
      if ($('#user_id')) {
        $('#user_id').value = getUserId();
      }
      
      // Referrer ID
      if ($('#referrer_id')) {
        $('#referrer_id').value = getReferrerId();
      }
      
      // Créditos iniciais
      if ($('#credits_initial')) {
        let credits = 0;
        if (userType === 'Motorista') {
          credits = CONFIG.CREDITS_MOTORISTA;
        } else if (userType === 'Transportadora') {
          credits = CONFIG.CREDITS_TRANSPORTADORA;
        } else if (userType === 'Chapa / Ajudante') {
          credits = CONFIG.CREDITS_CHAPA;
        }
        $('#credits_initial').value = credits;
      }
      
      // Timestamp aceite de termos
      if ($('#terms_accepted_at')) {
        $('#terms_accepted_at').value = new Date().toISOString();
      }
      
      // Journey summary
      if ($('#user_journey')) {
        $('#user_journey').value = JSON.stringify(Tracking.getSummary());
      }
    }

    // Validação em tempo real
    const whatsappInput = $('#whatsapp');
    const inviteInput = $('#invite_phone');

    [whatsappInput, inviteInput].forEach(input => {
      if (!input) return;
      input.addEventListener('input', (e) => {
        // Permitir apenas números
        e.target.value = e.target.value.replace(/\D/g, '');
      });
    });

    // Submit - VERSÃO CORRIGIDA
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validações
      const userType = $('#user_type').value;
      const name = $('#name').value.trim();
      const whatsapp = $('#whatsapp').value.trim();
      const email = $('#email').value.trim();
      const uf = $('#uf').value;
      const city = $('#city').value.trim();
      const terms = $('#terms').checked;

      if (!userType || !name || !whatsapp || !email || !uf || !city || !terms) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      // Validar WhatsApp (10 ou 11 dígitos)
      if (whatsapp.length < 10 || whatsapp.length > 11) {
        alert('WhatsApp inválido. Digite DDD + número (10 ou 11 dígitos).');
        $('#whatsapp').focus();
        return;
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('E-mail inválido.');
        $('#email').focus();
        return;
      }

      // Atualizar campos hidden
      updateHiddenFields();

      // Tracking
      Tracking.track('form_submit_attempt', {
        user_type: userType,
        uf,
        city
      });

      // Desabilitar botão
      const submitBtn = $('#submitBtn');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      
      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline';

      // FIX: Submit nativo do Netlify Forms
      // Criar FormData com todos os campos
      const formData = new FormData(form);
      
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(response => {
        if (response.ok) {
          Tracking.track('form_submit_success', { user_type: userType });
          
          // Mostrar modal de sucesso
          showSuccessModal();
          
          // Reset form
          form.reset();
        } else {
          throw new Error('Erro no envio');
        }
      })
      .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
        Tracking.track('form_submit_error', { error: error.message });
      })
      .finally(() => {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
      });
    });
  }

  // ============================================
  // MODAL SUCESSO
  // ============================================
  function showSuccessModal() {
    const modal = $('#successModal');
    const userId = getUserId();
    
    if (!modal) return;

    // Preencher user ID
    const userIdSpan = $('#modalUserId');
    if (userIdSpan) {
      userIdSpan.textContent = userId;
    }

    modal.classList.add('active');

    // Botão fechar
    const closeBtn = $('#modalClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    // Overlay fechar
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    // Botão WhatsApp grupo
    const joinWhatsappBtn = $('#joinWhatsappBtn');
    if (joinWhatsappBtn) {
      joinWhatsappBtn.addEventListener('click', () => {
        window.open(CONFIG.WA_GROUP, '_blank');
        Tracking.track('join_whatsapp_group');
      });
    }

    // Botão convidar amigos
    const inviteFriendsBtn = $('#inviteFriendsBtn');
    if (inviteFriendsBtn) {
      inviteFriendsBtn.addEventListener('click', () => {
        const shareUrl = `${window.location.origin}?ref=${userId}`;
        const shareText = `Estou no Beta do LOOMPER! 🚀\n\nCadastre-se também: ${shareUrl}`;
        
        if (navigator.share) {
          navigator.share({
            title: 'LOOMPER Beta',
            text: shareText
          }).catch(() => {});
        } else {
          // Copiar para clipboard
          navigator.clipboard.writeText(shareText).then(() => {
            alert('Link copiado! Compartilhe com seus amigos.');
          });
        }
        
        Tracking.track('share_invite_link', { user_id: userId });
      });
    }
  }

  // ============================================
  // PIX
  // ============================================
  function initPix() {
    const copyBtn = $('#copyPixBtn');
    const showQrBtn = $('#showQrBtn');
    const pixQr = $('#pixQr');

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(CONFIG.PIX_KEY).then(() => {
          copyBtn.textContent = '✅ Copiado!';
          setTimeout(() => {
            copyBtn.textContent = '📋 Copiar Chave PIX';
          }, 2000);
          Tracking.track('pix_copy');
        });
      });
    }

    if (showQrBtn && pixQr) {
      showQrBtn.addEventListener('click', () => {
        if (pixQr.style.display === 'none' || pixQr.style.display === '') {
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(CONFIG.PIX_KEY)}`;
          pixQr.innerHTML = `<img src="${qrUrl}" alt="QR Code PIX">`;
          pixQr.style.display = 'block';
          showQrBtn.textContent = '❌ Fechar QR Code';
          Tracking.track('pix_qr_show');
        } else {
          pixQr.style.display = 'none';
          showQrBtn.textContent = '📱 Ver QR Code';
        }
      });
    }
  }

  // ============================================
  // WHATSAPP FAB
  // ============================================
  function initWhatsAppFab() {
    const fab = $('#whatsappFab');
    if (!fab) return;

    fab.addEventListener('click', (e) => {
      e.preventDefault();
      const userId = getUserId();
      const message = `Olá! Me cadastrei no Beta LOOMPER.\n\nMeu ID: ${userId}`;
      const url = `https://wa.me/${CONFIG.WA_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      Tracking.track('whatsapp_fab_click');
    });
  }

  // ============================================
  // REFERRER TRACKING
  // ============================================
  function trackReferrer() {
    const referrer = getReferrerId();
    if (referrer !== 'direct') {
      Tracking.track('referrer_visit', { referrer_id: referrer });
    }
  }

  // ============================================
  // INIT
  // ============================================
  function init() {
    Tracking.init();
    trackReferrer();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initProfileSelection();
    initSimulators();
    initForm();
    initPix();
    initWhatsAppFab();

    // Track page view
    Tracking.track('page_view', {
      url: window.location.href,
      referrer: document.referrer
    });

    console.log('%c✅ LOOMPER Optimized JS Ativo', 'color: #ff7a2d; font-weight: bold; font-size: 14px;');
    console.log('%cUser ID:', 'color: #cfa34a; font-weight: bold;', getUserId());
  }

  // ============================================
  // EXECUTAR QUANDO DOM ESTIVER PRONTO
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
