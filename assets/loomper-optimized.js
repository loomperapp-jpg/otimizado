/*
 * ========================================
 * LOOMPER — LANDING PAGE OPTIMIZED JS
 * v2.0 — Netlify Forms Compatible
 * ========================================
 */

// ========================================
// CONFIG
// ========================================
const CONFIG = {
  WHATSAPP_NUMBER: '5511965858142',
  PIX_KEY: 'contato@loomper.com.br',
  CONTACT_EMAIL: 'contato@loomper.com.br',
  DOMAIN: window.location.origin,
  CREDITS_MOTORISTA: 100,
  CREDITS_CHAPA: 0,
  CREDITS_TRANSPORTADORA: 500
};

// ========================================
// UTILITIES
// ========================================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const Utils = {
  generateID: () => {
    const prefix = 'LMP';
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}-${random}`;
  },
  
  getOrCreateUserID: () => {
    let userId = localStorage.getItem('loomper_user_id');
    if (!userId) {
      userId = Utils.generateID();
      localStorage.setItem('loomper_user_id', userId);
    }
    return userId;
  },
  
  getReferrerID: () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      localStorage.setItem('loomper_referrer', ref);
      return ref;
    }
    return localStorage.getItem('loomper_referrer') || '';
  },
  
  formatWhatsAppLink: (number, text) => {
    const cleanNumber = number.replace(/\D/g, '');
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${cleanNumber}?text=${encodedText}`;
  }
};

// ========================================
// TRACKING
// ========================================
const Tracking = {
  events: [],
  
  track: (eventName, data = {}) => {
    const event = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...data
    };
    Tracking.events.push(event);
    console.log('📊 Track:', eventName, data);
  },
  
  getSummary: () => {
    return {
      total_events: Tracking.events.length,
      first_visit: Tracking.events[0]?.timestamp,
      last_event: Tracking.events[Tracking.events.length - 1]?.timestamp,
      events: Tracking.events
    };
  }
};

// ========================================
// HEADER
// ========================================
function initHeader() {
  const header = $('#header');
  if (!header) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
  const menuToggle = $('#menuToggle');
  const navMobile = $('#navMobile');
  const body = document.body;
  
  if (!menuToggle || !navMobile) return;
  
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMobile.classList.toggle('active');
    body.classList.toggle('menu-open');
    
    Tracking.track('mobile_menu_toggle', {
      action: navMobile.classList.contains('active') ? 'open' : 'close'
    });
  });
  
  // Fechar ao clicar em link

  $$('.nav-link-mobile').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMobile.classList.remove('active');
      body.classList.remove('menu-open');
    });
  });
}

// ========================================
// PROFILE SELECTION
// ========================================
function initProfileSelection() {
  // Salvar perfil ao clicar nos CTAs

  $$('[data-profile]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const profile = e.currentTarget.dataset.profile;
      localStorage.setItem('loomper_profile', profile);
      
      Tracking.track('profile_selected', { profile });
    });
  });
  
  // Preencher automaticamente o select se houver perfil salvo
  const savedProfile = localStorage.getItem('loomper_profile');
  if (savedProfile) {
    const profileSelect = $('#user_type');
    if (profileSelect) {
      const profileMap = {
        motorista: 'Motorista',
        chapa: 'Chapa / Ajudante',
        transportadora: 'Transportadora',
        investidor: 'Investidor'
      };
      
      if (profileMap[savedProfile]) {
        profileSelect.value = profileMap[savedProfile];
        Tracking.track('profile_auto_filled', { profile: savedProfile });
      }
    }
  }
}

// ========================================
// TABS (SIMULADORES)
// ========================================
function initTabs() {
  const tabBtns = $$('.tab-btn');
  const tabPanels = $$('.tab-panel');
  
  if (!tabBtns.length || !tabPanels.length) return;
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      
      // Remover active de todos
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      
      // Ativar o selecionado
      btn.classList.add('active');
      $(`#panel-${targetTab}`)?.classList.add('active');
      
      Tracking.track('tab_clicked', { tab: targetTab });
    });
  });
  
  // Botões "Ver simulação" nos cards de perfil

  $$('.btn-simulate').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.dataset.target;
      
      // Scroll para a seção de simuladores
      $('#como-funciona')?.scrollIntoView({ behavior: 'smooth' });
      
      // Ativar a tab correta após scroll
      setTimeout(() => {
        const targetBtn = $(`.tab-btn[data-tab="${target}"]`);
        if (targetBtn) targetBtn.click();
      }, 600);
      
      Tracking.track('simulate_clicked', { profile: target });
    });
  });
}

// ========================================
// FORM — VALIDAÇÃO E ENVIO NATIVO
// ========================================
function initForm() {
  const form = $('#waitlistForm');
  if (!form) return;
  
  // Preencher campos hidden ANTES do submit
  const userId = Utils.getOrCreateUserID();
  const referrerId = Utils.getReferrerID();
  
  console.log('🆔 User ID:', userId);
  if (referrerId) console.log('👥 Referrer:', referrerId);
  
  $('#user_id').value = userId;
  $('#referrer_id').value = referrerId;
  
  // Validação de WhatsApp em tempo real
  const whatsappInput = $('#whatsapp');
  const inviteInput = $('#invite_phone');
  
  [whatsappInput, inviteInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  });
  
  // Submit — DEIXAR O NETLIFY PROCESSAR NATIVAMENTE
  form.addEventListener('submit', (e) => {
    // Validar campos
    const userType = $('#user_type').value;
    const name = $('#name').value.trim();
    const whatsapp = $('#whatsapp').value.trim();
    const email = $('#email').value.trim();
    const uf = $('#uf').value;
    const city = $('#city').value.trim();
    const terms = $('#terms').checked;
    
    if (!userType || !name || !whatsapp || !email || !uf || !city || !terms) {
      e.preventDefault();
      alert('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    
    // Validar WhatsApp
    if (whatsapp.length < 10 || whatsapp.length > 11) {
      e.preventDefault();
      alert('WhatsApp inválido. Digite DDD + número (10 ou 11 dígitos).');
      $('#whatsapp').focus();
      return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      e.preventDefault();
      alert('E-mail inválido.');
      $('#email').focus();
      return false;
    }
    
    // Calcular créditos iniciais
    let credits = 0;
    if (userType === 'Motorista') {
      credits = CONFIG.CREDITS_MOTORISTA;
    } else if (userType === 'Transportadora') {
      credits = CONFIG.CREDITS_TRANSPORTADORA;
    } else if (userType === 'Chapa / Ajudante') {
      credits = CONFIG.CREDITS_CHAPA;
    }
    $('#credits_initial').value = credits;
    
    // Timestamp aceite de termos
    $('#terms_accepted_at').value = new Date().toISOString();
    
    // Journey summary
    $('#user_journey').value = JSON.stringify(Tracking.getSummary());
    
    // Tracking
    Tracking.track('form_submit_attempt', {
      user_type: userType,
      uf,
      city
    });
    
    // Desabilitar botão
    const submitBtn = $('#submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    // DEIXAR O FORM SUBMETER NATIVAMENTE
    // O Netlify vai redirecionar automaticamente após o sucesso
    return true;
  });
}

// ========================================
// PIX DONATION
// ========================================
function initPixDonation() {
  const copyPixBtn = $('#copyPix');
  const showQrBtn = $('#showQr');
  const pixQrDiv = $('#pixQr');
  const donateOtherBtn = $('#donateOther');
  const customAmountDiv = $('#customAmount');
  const confirmAmountBtn = $('#confirmAmount');
  
  // Copiar PIX
  if (copyPixBtn) {
    copyPixBtn.addEventListener('click', () => {
      const pixKey = CONFIG.PIX_KEY;
      navigator.clipboard.writeText(pixKey).then(() => {
        copyPixBtn.textContent = '✓ Copiado!';
        setTimeout(() => {
          copyPixBtn.textContent = 'Copiar PIX';
        }, 2000);
        
        Tracking.track('pix_copied', { key: pixKey });
      });
    });
  }
  
  // Mostrar QR Code
  if (showQrBtn && pixQrDiv) {
    showQrBtn.addEventListener('click', () => {
      const isVisible = pixQrDiv.style.display !== 'none';
      pixQrDiv.style.display = isVisible ? 'none' : 'block';
      showQrBtn.textContent = isVisible ? 'Ver QR Code' : 'Ocultar QR';
      
      if (!isVisible) {
        // Gerar QR Code (usando API gratuita)
        const pixKey = CONFIG.PIX_KEY;
        const qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(pixKey)}`;
        pixQrDiv.innerHTML = `<img src="${qrUrl}" alt="QR Code PIX" />`;
        
        Tracking.track('qr_code_shown');
      }
    });
  }
  
  // Botões de valores fixos

  $$('.btn-donate').forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = btn.dataset.amount;
      alert(`Obrigado! Por favor, faça uma transferência PIX de R$ ${amount} para: ${CONFIG.PIX_KEY}`);
      
      Tracking.track('donation_selected', { amount });
    });
  });
  
  // Outro valor
  if (donateOtherBtn && customAmountDiv) {
    donateOtherBtn.addEventListener('click', () => {
      customAmountDiv.style.display = 'flex';
      donateOtherBtn.style.display = 'none';
    });
  }
  
  if (confirmAmountBtn) {
    confirmAmountBtn.addEventListener('click', () => {
      const customAmount = $('#customAmountInput').value;
      if (customAmount && customAmount > 0) {
        alert(`Obrigado! Por favor, faça uma transferência PIX de R$ ${customAmount} para: ${CONFIG.PIX_KEY}`);
        
        Tracking.track('donation_custom', { amount: customAmount });
        
        customAmountDiv.style.display = 'none';
        donateOtherBtn.style.display = 'inline-block';
        $('#customAmountInput').value = '';
      } else {
        alert('Por favor, digite um valor válido.');
      }
    });
  }
}

// ========================================
// WHATSAPP FAB
// ========================================
function initWhatsAppFAB() {
  const fab = $('#whatsappFab');
  if (!fab) return;
  
  const userId = Utils.getOrCreateUserID();
  const message = `Olá! Vim da landing page do Loomper Beta.\n\nMeu ID: ${userId}`;
  
  fab.href = Utils.formatWhatsAppLink(CONFIG.WHATSAPP_NUMBER, message);
  
  fab.addEventListener('click', () => {
    Tracking.track('whatsapp_fab_clicked', { user_id: userId });
  });
}

// ========================================
// SUCCESS MODAL (se houver)
// ========================================
function initSuccessModal() {
  const modal = $('#successModal');
  if (!modal) return;
  
  const closeBtn = $('#modalClose');
  const enterWhatsappBtn = $('#enterWhatsapp');
  const inviteFriendsBtn = $('#inviteFriends');
  
  // Fechar modal
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    });
  }
  
  // Entrar no WhatsApp
  if (enterWhatsappBtn) {
    enterWhatsappBtn.addEventListener('click', () => {
      const userId = Utils.getOrCreateUserID();
      const message = `Olá! Acabei de me cadastrar no Beta do Loomper.\n\nMeu ID: ${userId}`;
      window.open(Utils.formatWhatsAppLink(CONFIG.WHATSAPP_NUMBER, message), '_blank');
      
      Tracking.track('enter_whatsapp_group');
    });
  }
  
  // Convidar amigos
  if (inviteFriendsBtn) {
    inviteFriendsBtn.addEventListener('click', () => {
      const userId = Utils.getOrCreateUserID();
      const inviteLink = `${CONFIG.DOMAIN}?ref=${userId}`;
      const shareMessage = `Olá! Estou no Beta fechado do LOOMPER, a evolução da conexão no transporte de veículos.\n\nEntre você também: ${inviteLink}`;
      
      navigator.clipboard.writeText(shareMessage).then(() => {
        alert('✓ Link de convite copiado! Compartilhe com seus amigos.');
        
        Tracking.track('invite_link_copied', { referrer_id: userId });
      });
    });
  }
}

// ========================================
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 LOOMPER Optimized JS v2.0 Ativo');
  
  initHeader();
  initMobileMenu();
  initProfileSelection();
  initTabs();
  initForm();
  initPixDonation();
  initWhatsAppFAB();
  initSuccessModal();
  
  // Track page view
  Tracking.track('page_view', {
    url: window.location.href,
    referrer: document.referrer
  });
  
  console.log('✅ Todas as funcionalidades carregadas');
});
