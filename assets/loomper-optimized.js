// ============================================
// LOOMPER v3.0 - JavaScript Otimizado
// assets/loomper-optimized.js
// ============================================

// ============================================
// 1. INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 LOOMPER v3.0 carregado!');
    
    // Inicializar todos os módulos
    initHamburgerMenu();
    initWhatsAppFloat();
    initSmoothScroll();
    initProgressIndicator();
    initIBGEAPI();
    initFormValidation();
    initPIXCopy();
    initVagasCounter();
    initConviteTracking();
    initTabs();
    initSimulacao();
});

// ============================================
// 2. HAMBURGER MENU
// ============================================
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    // Toggle menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar ao clicar em link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// 3. WHATSAPP FLUTUANTE COM TRACKING
// ============================================
function initWhatsAppFloat() {
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (!whatsappFloat) return;

    let currentSection = 'Início';

    // Rastrear seção visível
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionName = entry.target.dataset.sectionName || entry.target.id;
                currentSection = sectionName;
                updateWhatsAppLink(currentSection);
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));

    // Atualizar link do WhatsApp
    function updateWhatsAppLink(section) {
        const whatsappLink = whatsappFloat.querySelector('a');
        if (whatsappLink) {
            const message = `Olá! Estava na seção: ${section}. Tenho uma dúvida sobre o Loomper.`;
            whatsappLink.href = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
        }
    }

    // Mostrar/ocultar ao rolar
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 300) {
            whatsappFloat.classList.add('visible');
        } else {
            whatsappFloat.classList.remove('visible');
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// 4. SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// 5. INDICADOR DE PROGRESSO
// ============================================
function initProgressIndicator() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = progress + '%';
    });
}

// ============================================
// 6. API IBGE COM FALLBACK E LOADING
// ============================================
let estadosCache = null;
let cidadesCache = {};

function initIBGEAPI() {
    const estadoSelect = document.getElementById('estado');
    const cidadeInput = document.getElementById('cidade');

    if (!estadoSelect) return;

    // Carregar estados
    loadEstados();

    // Listener para mudança de estado
    if (estadoSelect && cidadeInput) {
        estadoSelect.addEventListener('change', function() {
            const uf = this.value;
            if (uf) {
                loadCidades(uf);
                cidadeInput.value = '';
                cidadeInput.removeAttribute('disabled');
                cidadeInput.focus();
            } else {
                cidadeInput.setAttribute('disabled', 'disabled');
                cidadeInput.value = '';
            }
        });
    }
}

async function loadEstados() {
    const estadoSelect = document.getElementById('estado');
    if (!estadoSelect) return;

    try {
        // Mostrar loading
        estadoSelect.innerHTML = '<option value="">Carregando...</option>';
        estadoSelect.disabled = true;

        // Tentar cache primeiro
        if (estadosCache) {
            populateEstados(estadosCache);
            return;
        }

        // Buscar da API
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        
        if (!response.ok) throw new Error('Erro ao carregar estados');
        
        const estados = await response.json();
        estadosCache = estados;
        populateEstados(estados);

    } catch (error) {
        console.error('Erro ao carregar estados:', error);
        // Fallback com estados principais
        const estadosFallback = [
            {sigla: 'SP', nome: 'São Paulo'},
            {sigla: 'RJ', nome: 'Rio de Janeiro'},
            {sigla: 'MG', nome: 'Minas Gerais'},
            {sigla: 'RS', nome: 'Rio Grande do Sul'},
            {sigla: 'PR', nome: 'Paraná'},
            {sigla: 'SC', nome: 'Santa Catarina'},
            {sigla: 'BA', nome: 'Bahia'},
            {sigla: 'PE', nome: 'Pernambuco'},
            {sigla: 'CE', nome: 'Ceará'},
            {sigla: 'GO', nome: 'Goiás'}
        ];
        populateEstados(estadosFallback);
        showNotification('Usando lista offline de estados', 'warning');
    }
}

function populateEstados(estados) {
    const estadoSelect = document.getElementById('estado');
    if (!estadoSelect) return;

    estadoSelect.innerHTML = '<option value="">Selecione seu estado</option>';
    
    estados.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado.sigla;
        option.textContent = estado.nome;
        estadoSelect.appendChild(option);
    });

    estadoSelect.disabled = false;
}

async function loadCidades(uf) {
    try {
        // Verificar cache
        if (cidadesCache[uf]) {
            setupCidadeAutocomplete(cidadesCache[uf]);
            return;
        }

        // Buscar da API
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
        
        if (!response.ok) throw new Error('Erro ao carregar cidades');
        
        const cidades = await response.json();
        cidadesCache[uf] = cidades.map(c => c.nome);
        setupCidadeAutocomplete(cidadesCache[uf]);

    } catch (error) {
        console.error('Erro ao carregar cidades:', error);
        showNotification('Erro ao carregar cidades. Digite manualmente.', 'error');
    }
}

// ============================================
// 7. AUTOCOMPLETE INTELIGENTE DE CIDADES
// ============================================
function setupCidadeAutocomplete(cidades) {
    const cidadeInput = document.getElementById('cidade');
    if (!cidadeInput) return;

    // Remover autocomplete anterior
    const oldList = document.getElementById('cidade-autocomplete');
    if (oldList) oldList.remove();

    // Criar lista de sugestões
    const datalist = document.createElement('div');
    datalist.id = 'cidade-autocomplete';
    datalist.className = 'autocomplete-list';
    cidadeInput.parentNode.appendChild(datalist);

    // Listener para input
    cidadeInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        datalist.innerHTML = '';

        if (query.length < 2) {
            datalist.style.display = 'none';
            return;
        }

        // Filtrar cidades
        const matches = cidades.filter(cidade => 
            cidade.toLowerCase().startsWith(query) ||
            cidade.toLowerCase().includes(' ' + query)
        ).slice(0, 8);

        if (matches.length === 0) {
            datalist.style.display = 'none';
            return;
        }

        // Mostrar sugestões
        matches.forEach(cidade => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            
            // Destacar match
            const regex = new RegExp(`(${query})`, 'gi');
            item.innerHTML = cidade.replace(regex, '<strong>$1</strong>');
            
            item.addEventListener('click', () => {
                cidadeInput.value = cidade;
                datalist.style.display = 'none';
                cidadeInput.dispatchEvent(new Event('change'));
                validateField(cidadeInput);
            });
            
            datalist.appendChild(item);
        });

        datalist.style.display = 'block';
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!cidadeInput.contains(e.target) && !datalist.contains(e.target)) {
            datalist.style.display = 'none';
        }
    });
}
// ============================================
// 8. VALIDAÇÃO DE FORMULÁRIO
// ============================================
function initFormValidation() {
    const form = document.getElementById('cadastro-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], select[required]');

    // Validar cada campo
    inputs.forEach(input => {
        // Eventos para validação
        ['input', 'change', 'blur'].forEach(event => {
            input.addEventListener(event, function() {
                // Delay para autocomplete do navegador
                setTimeout(() => {
                    validateField(this);
                }, 100);
            });
        });

        // Detectar autocomplete do navegador
        input.addEventListener('animationstart', function(e) {
            if (e.animationName === 'onAutoFillStart') {
                setTimeout(() => validateField(this), 100);
            }
        });
    });

    // Validar ao submeter
    form.addEventListener('submit', handleFormSubmit);

    // Atualizar barra de progresso do formulário
    inputs.forEach(input => {
        input.addEventListener('change', updateFormProgress);
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group');
    
    if (!fieldGroup) return;

    // Remover mensagens antigas
    const oldError = fieldGroup.querySelector('.error-message');
    if (oldError) oldError.remove();

    // Validações específicas
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'E-mail inválido';
        }
    } else if (field.id === 'whatsapp' && value) {
        const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'WhatsApp inválido (ex: 11 98765-4321)';
        }
    }

    // Aplicar classes
    if (isValid && value) {
        field.classList.add('valid');
        field.classList.remove('invalid');
        field.dataset.filled = 'true';
    } else if (!isValid) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        
        // Mostrar mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        fieldGroup.appendChild(errorDiv);
    } else {
        field.classList.remove('valid', 'invalid');
        delete field.dataset.filled;
    }

    return isValid;
}

function updateFormProgress() {
    const form = document.getElementById('cadastro-form');
    const progressBar = document.querySelector('.form-progress-bar');
    
    if (!form || !progressBar) return;

    const requiredFields = form.querySelectorAll('[required]');
    const filledFields = Array.from(requiredFields).filter(field => {
        return field.value.trim() !== '' && !field.classList.contains('invalid');
    });

    const progress = (filledFields.length / requiredFields.length) * 100;
    progressBar.style.width = progress + '%';

    // Atualizar texto
    const progressText = document.querySelector('.form-progress-text');
    if (progressText) {
        progressText.textContent = `${Math.round(progress)}% completo`;
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validar todos os campos
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isFormValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showNotification('Por favor, preencha todos os campos corretamente', 'error');
        return;
    }

    // Gerar user_id único
    const userId = generateUserId();
    
    // Verificar se veio de convite
    const urlParams = new URLSearchParams(window.location.search);
    const referredBy = urlParams.get('ref') || '';

    // Adicionar campos ocultos
    addHiddenField(form, 'user_id', userId);
    if (referredBy) {
        addHiddenField(form, 'referred_by', referredBy);
    }

    // Salvar no localStorage
    localStorage.setItem('loomper_user_id', userId);
    localStorage.setItem('loomper_user_data', JSON.stringify({
        nome: form.querySelector('#nome')?.value,
        email: form.querySelector('#email')?.value,
        perfil: form.querySelector('#perfil')?.value,
        estado: form.querySelector('#estado')?.value,
        cidade: form.querySelector('#cidade')?.value,
        user_id: userId,
        referred_by: referredBy,
        timestamp: new Date().toISOString()
    }));

    // Mostrar loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';

    // Overlay de loading
    showLoadingOverlay('Cadastrando você como Pioneiro...');

    // Submit real (Netlify Forms)
    try {
        // Netlify processa automaticamente
        form.submit();
        
        // Redirecionar após delay (Netlify faz isso automaticamente, mas garantimos)
        setTimeout(() => {
            window.location.href = '/sucesso.html';
        }, 1000);
        
    } catch (error) {
        console.error('Erro ao enviar:', error);
        hideLoadingOverlay();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Quero ser pioneiro';
        showNotification('Erro ao enviar. Tente novamente.', 'error');
    }
}

function addHiddenField(form, name, value) {
    // Remover campo existente
    const existing = form.querySelector(`input[name="${name}"]`);
    if (existing) existing.remove();

    // Adicionar novo
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
}

// ============================================
// 9. MODAL DE SIMULAÇÃO
// ============================================
function initSimulacao() {
    const modalOverlay = document.getElementById('modal-simulacao');
    const closeBtn = modalOverlay?.querySelector('.modal-close');
    const simulacaoBtns = document.querySelectorAll('[data-open-simulacao]');

    if (!modalOverlay) return;

    // Abrir modal
    simulacaoBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openSimulacaoModal();
        });
    });

    // Fechar modal
    closeBtn?.addEventListener('click', closeSimulacaoModal);
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeSimulacaoModal();
        }
    });

    // ESC para fechar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeSimulacaoModal();
        }
    });
}

function openSimulacaoModal() {
    const modal = document.getElementById('modal-simulacao');
    if (!modal) return;

    // Pegar dados do formulário
    const form = document.getElementById('cadastro-form');
    const estado = form?.querySelector('#estado')?.value || 'Não informado';
    const cidade = form?.querySelector('#cidade')?.value || 'Não informado';
    const perfil = form?.querySelector('#perfil')?.value || 'motorista';

    // Preencher dados no modal
    document.getElementById('sim-estado').textContent = estado;
    document.getElementById('sim-cidade').textContent = cidade;

    // Calcular simulação baseada no perfil
    let dados = {};
    
    if (perfil === 'motorista') {
        dados = {
            titulo: 'Economize até R$ 1.200/mês',
            economia: 'R$ 1.200,00',
            ganhos: '+3 entregas',
            tempo: '-2h de espera',
            entregas: '15 entregas/mês'
        };
    } else if (perfil === 'chapa') {
        dados = {
            titulo: 'Ganhe até R$ 3.500/mês',
            economia: 'R$ 3.500,00',
            ganhos: '+8 serviços',
            tempo: 'Agenda previsível',
            entregas: '20 serviços/mês'
        };
    } else {
        dados = {
            titulo: 'Aumente o faturamento em 25%',
            economia: 'R$ 8.500,00',
            ganhos: '+40 entregas',
            tempo: '-15% ociosidade',
            entregas: '248 entregas/mês'
        };
    }

    // Atualizar valores
    modal.querySelector('.modal-title').textContent = dados.titulo;
    document.getElementById('sim-economia').textContent = dados.economia;
    document.getElementById('sim-ganhos').textContent = dados.ganhos;
    document.getElementById('sim-tempo').textContent = dados.tempo;
    document.getElementById('sim-entregas').textContent = dados.entregas;

    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Analytics (opcional)
    console.log('Modal de simulação aberto:', perfil);
}

function closeSimulacaoModal() {
    const modal = document.getElementById('modal-simulacao');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// 10. PIX COM BOTÃO COPIAR
// ============================================
function initPIXCopy() {
    const copyBtn = document.getElementById('copy-pix');
    const pixKey = 'contato@loomper.com.br';

    if (!copyBtn) return;

    copyBtn.addEventListener('click', async function() {
        try {
            await navigator.clipboard.writeText(pixKey);
            
            // Feedback visual
            const originalText = this.innerHTML;
            this.innerHTML = '✓ Copiado!';
            this.classList.add('copied');

            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('copied');
            }, 2000);

            showNotification('Chave PIX copiada com sucesso!', 'success');

        } catch (error) {
            console.error('Erro ao copiar:', error);
            showNotification('Não foi possível copiar. Tente manualmente.', 'error');
        }
    });
}

// ============================================
// 11. CONTADOR DE VAGAS (BETA FECHADO)
// ============================================
function initVagasCounter() {
    const vagasAtual = document.getElementById('vagas-atual');
    const vagasTotal = document.getElementById('vagas-total');
    const progressBar = document.querySelector('.vagas-progress-bar');

    if (!vagasAtual || !vagasTotal) return;

    // Números reais (você pode atualizar depois via API)
    const atual = 47;
    const total = 200;
    const progresso = (atual / total) * 100;

    // Animação de contagem
    animateCounter(vagasAtual, 0, atual, 1500);

    // Atualizar barra
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = progresso + '%';
        }, 500);
    }
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * easeOutQuad(progress));
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutQuad(t) {
    return t * (2 - t);
}

// ============================================
// 12. SISTEMA DE TRACKING DE CONVITES
// ============================================
function initConviteTracking() {
    // Verificar se veio de convite
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');

    if (ref) {
        // Salvar quem indicou
        localStorage.setItem('loomper_referred_by', ref);
        console.log('Cadastro via convite de:', ref);
    }

    // Gerar link de convite na página de sucesso
    if (window.location.pathname.includes('sucesso')) {
        generateConviteLink();
    }
}

function generateUserId() {
    // Gerar ID único: timestamp + random
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `${timestamp}-${random}`;
}

function generateConviteLink() {
    const userId = localStorage.getItem('loomper_user_id');
    if (!userId) return;

    const baseUrl = window.location.origin;
    const conviteUrl = `${baseUrl}?ref=${userId}`;

    // Atualizar input
    const conviteInput = document.getElementById('convite-link');
    if (conviteInput) {
        conviteInput.value = conviteUrl;
    }

    // Botão de copiar
    const copyBtn = document.getElementById('copy-convite');
    if (copyBtn) {
        copyBtn.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(conviteUrl);
                
                const originalText = this.textContent;
                this.textContent = '✓ Link copiado!';
                
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);

                showNotification('Link de convite copiado!', 'success');

            } catch (error) {
                conviteInput.select();
                document.execCommand('copy');
                showNotification('Link copiado!', 'success');
            }
        });
    }
}

// ============================================
// 13. TABS INTERATIVOS POR PERFIL
// ============================================
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;

            // Remover active de todos
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Ativar selecionado
            this.classList.add('active');
            document.getElementById(target)?.classList.add('active');

            // Analytics (opcional)
            console.log('Tab ativado:', target);
        });
    });
}

// ============================================
// 14. UTILITÁRIOS
// ============================================
function showNotification(message, type = 'info') {
    // Remover notificação anterior
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Criar nova
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-message">${message}</span>
    `;

    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 10);

    // Remover após 4s
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

function showLoadingOverlay(message = 'Carregando...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="spinner-large"></div>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.classList.add('show'), 10);
}

function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    }
}

// ============================================
// 15. MÁSCARAS DE INPUT (OPCIONAL)
// ============================================
function initInputMasks() {
    const whatsappInput = document.getElementById('whatsapp');
    
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            }
            
            e.target.value = value;
        });
    }
}

// Inicializar máscaras
document.addEventListener('DOMContentLoaded', initInputMasks);

// ============================================
// 16. ANIMAÇÕES AO ROLAR (OPCIONAL)
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Inicializar animações
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ============================================
// FIM DO ARQUIVO
// ============================================
console.log('✅ LOOMPER v3.0 - Todos os módulos carregados!');
