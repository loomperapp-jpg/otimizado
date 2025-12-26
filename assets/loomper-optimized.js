// ============================================
// LOOMPER v3.0 - JAVASCRIPT CORRIGIDO
// assets/loomper-optimized.js
// CORREÇÕES: Menu, Tabs, Formulário, Confirmações
// ============================================

// ============================================
// 1. INICIALIZAÇÃO CORRIGIDA
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 LOOMPER v3.0 - Versão Corrigida carregada!');
    
    // Inicializar módulos na ordem correta
    initHamburgerMenu();
    initWhatsAppFloat();
    initSmoothScroll();
    initProgressIndicator();
    initTabs(); // CORRIGIDO: Tabs primeiro
    initIBGEAPI();
    initFormValidation();
    initPIXCopy();
    initVagasCounter();
    initConviteTracking();
    initSimulacao();
    initInputMasks();
    
    console.log('✅ Todos os módulos inicializados');
});

// ============================================
// 2. CORREÇÃO: MENU HAMBURGER FUNCIONAL
// ============================================
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    if (!hamburger || !navMenu) {
        console.warn('⚠️ Menu hamburger não encontrado');
        return;
    }

    console.log('✅ Menu hamburger inicializado');

    // Toggle menu
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        const isActive = hamburger.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        body.style.overflow = 'hidden';
        console.log('📱 Menu aberto');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = '';
        console.log('📱 Menu fechado');
    }

    // Fechar ao clicar em link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    // Fechar ao clicar fora
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active')) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu();
            }
        }
    });

    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ============================================
// 3. CORREÇÃO: TABS FUNCIONAIS (CRÍTICO)
// ============================================
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    if (tabs.length === 0 || contents.length === 0) {
        console.warn('⚠️ Tabs não encontrados');
        return;
    }

    console.log(`✅ ${tabs.length} tabs encontrados`);

    // Ativar primeira tab por padrão
    if (tabs[0]) {
        tabs[0].classList.add('active');
    }
    if (contents[0]) {
        contents[0].classList.add('active');
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;
            console.log(`🔄 Tab clicado: ${target}`);

            // Remover active de todos
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Ativar selecionado
            this.classList.add('active');
            
            const targetContent = document.getElementById(target);
            if (targetContent) {
                targetContent.classList.add('active');
                console.log(`✅ Conteúdo ativado: ${target}`);
                
                // Scroll suave até a seção
                targetContent.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            } else {
                console.error(`❌ Conteúdo não encontrado: ${target}`);
            }
        });
    });
}

// ============================================
// 4. CORREÇÃO: FORMULÁRIO COM REDIRECIONAMENTO
// ============================================
function initFormValidation() {
    const form = document.getElementById('cadastro-form');
    
    if (!form) {
        console.warn('⚠️ Formulário não encontrado');
        return;
    }

    console.log('✅ Formulário encontrado');

    // CORREÇÃO CRÍTICA: Garantir action correto
    form.setAttribute('action', '/sucesso.html');
    form.setAttribute('method', 'POST');
    form.setAttribute('data-netlify', 'true');
    form.setAttribute('name', 'cadastro-beta');

    const inputs = form.querySelectorAll('input[required], select[required]');

    // Validar cada campo
    inputs.forEach(input => {
        ['input', 'change', 'blur'].forEach(event => {
            input.addEventListener(event, function() {
                setTimeout(() => validateField(this), 100);
            });
        });

        // Detectar autocomplete
        input.addEventListener('animationstart', function(e) {
            if (e.animationName === 'onAutoFillStart') {
                setTimeout(() => validateField(this), 100);
            }
        });
    });

    // Submit com validação
    form.addEventListener('submit', handleFormSubmit);

    // Progress bar
    inputs.forEach(input => {
        input.addEventListener('change', updateFormProgress);
        input.addEventListener('input', updateFormProgress);
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group');
    
    if (!fieldGroup) return true;

    // Remover erros antigos
    const oldError = fieldGroup.querySelector('.error-message');
    if (oldError) oldError.remove();

    let isValid = true;
    let errorMessage = '';

    // Validações
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Campo obrigatório';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'E-mail inválido';
        }
    } else if (field.id === 'whatsapp' && value) {
        const phone = value.replace(/\D/g, '');
        if (phone.length < 10 || phone.length > 11) {
            isValid = false;
            errorMessage = 'WhatsApp inválido';
        }
    }

    // Aplicar visual
    if (isValid && value) {
        field.classList.add('valid');
        field.classList.remove('invalid');
        field.dataset.filled = 'true';
    } else if (!isValid) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '0.5rem';
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

    const progressText = document.querySelector('.form-progress-text');
    if (progressText) {
        progressText.textContent = `${Math.round(progress)}% completo`;
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    console.log('📝 Formulário enviado');

    // Validar todos os campos
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isFormValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
            console.log(`❌ Campo inválido: ${input.name || input.id}`);
        }
    });

    if (!isFormValid) {
        showNotification('Por favor, preencha todos os campos corretamente', 'error');
        return;
    }

    // Gerar user_id
    const userId = generateUserId();
    const urlParams = new URLSearchParams(window.location.search);
    const referredBy = urlParams.get('ref') || '';

    // Adicionar campos hidden
    addHiddenField(form, 'user_id', userId);
    if (referredBy) {
        addHiddenField(form, 'referred_by', referredBy);
    }

    // Salvar localStorage
    const userData = {
        nome: form.querySelector('#nome')?.value,
        email: form.querySelector('#email')?.value,
        whatsapp: form.querySelector('#whatsapp')?.value,
        perfil: form.querySelector('#perfil')?.value,
        estado: form.querySelector('#estado')?.value,
        cidade: form.querySelector('#cidade')?.value,
        user_id: userId,
        referred_by: referredBy,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('loomper_user_id', userId);
    localStorage.setItem('loomper_user_data', JSON.stringify(userData));

    console.log('💾 Dados salvos no localStorage:', userData);

    // Loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Cadastrando...';
    showLoadingOverlay('🎉 Cadastrando você como Pioneiro...');

    // CORREÇÃO: Redirecionar para sucesso.html
    try {
        // Para Netlify Forms
        const formData = new FormData(form);
        
        await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        });

        console.log('✅ Formulário enviado ao Netlify');

        // Redirecionar após 500ms
        setTimeout(() => {
            console.log('🔄 Redirecionando para /sucesso.html');
            window.location.href = '/sucesso.html';
        }, 500);

    } catch (error) {
        console.error('❌ Erro ao enviar:', error);
        hideLoadingOverlay();
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Quero ser pioneiro';
        showNotification('Erro ao enviar. Tente novamente.', 'error');
    }
}

function addHiddenField(form, name, value) {
    const existing = form.querySelector(`input[name="${name}"]`);
    if (existing) existing.remove();

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
}

// ============================================
// 5. CORREÇÃO: MODAL DE SIMULAÇÃO
// ============================================
function initSimulacao() {
    const modalOverlay = document.getElementById('modal-simulacao');
    const closeBtn = modalOverlay?.querySelector('.modal-close');
    const simulacaoBtns = document.querySelectorAll('[data-open-simulacao], .btn-simulacao');

    if (!modalOverlay) {
        console.warn('⚠️ Modal de simulação não encontrado');
        return;
    }

    console.log(`✅ Modal inicializado, ${simulacaoBtns.length} botões encontrados`);

    // Abrir modal
    simulacaoBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openSimulacaoModal();
        });
    });

    // Fechar
    closeBtn?.addEventListener('click', closeSimulacaoModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeSimulacaoModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeSimulacaoModal();
        }
    });

    // Botão "Cadastrar agora" no modal
    const cadastrarBtn = modalOverlay.querySelector('.btn-cadastrar-modal');
    if (cadastrarBtn) {
        cadastrarBtn.addEventListener('click', function() {
            closeSimulacaoModal();
            document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function openSimulacaoModal() {
    const modal = document.getElementById('modal-simulacao');
    if (!modal) return;

    console.log('🔍 Abrindo modal de simulação');

    // Pegar dados
    const form = document.getElementById('cadastro-form');
    const estadoSelect = form?.querySelector('#estado');
    const cidadeInput = form?.querySelector('#cidade');
    const perfilSelect = form?.querySelector('#perfil');

    const estado = estadoSelect?.options[estadoSelect.selectedIndex]?.text || 'Não informado';
    const cidade = cidadeInput?.value || 'Não informado';
    const perfil = perfilSelect?.value || 'motorista';

    // Atualizar modal
    const simEstado = document.getElementById('sim-estado');
    const simCidade = document.getElementById('sim-cidade');
    
    if (simEstado) simEstado.textContent = estado;
    if (simCidade) simCidade.textContent = cidade;

    // Dados por perfil
    let dados = {};
    
    if (perfil === 'motorista') {
        dados = {
            titulo: '💰 Economize até R$ 1.200/mês',
            economia: 'R$ 1.200,00',
            ganhos: '+3 entregas/mês',
            tempo: '-2h de espera',
            entregas: '15 entregas/mês'
        };
    } else if (perfil === 'chapa') {
        dados = {
            titulo: '💰 Ganhe até R$ 3.500/mês',
            economia: 'R$ 3.500,00',
            ganhos: '+8 serviços/mês',
            tempo: 'Agenda previsível',
            entregas: '20 serviços/mês'
        };
    } else {
        dados = {
            titulo: '📈 Aumente faturamento em 25%',
            economia: 'R$ 8.500,00',
            ganhos: '+40 entregas/mês',
            tempo: '-15% ociosidade',
            entregas: '248 entregas/mês'
        };
    }

    // Atualizar valores
    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) modalTitle.innerHTML = dados.titulo;
    
    const simEconomia = document.getElementById('sim-economia');
    const simGanhos = document.getElementById('sim-ganhos');
    const simTempo = document.getElementById('sim-tempo');
    const simEntregas = document.getElementById('sim-entregas');
    
    if (simEconomia) simEconomia.textContent = dados.economia;
    if (simGanhos) simGanhos.textContent = dados.ganhos;
    if (simTempo) simTempo.textContent = dados.tempo;
    if (simEntregas) simEntregas.textContent = dados.entregas;

    // Mostrar
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Confirmação visual
    showNotification('✨ Simulação gerada com sucesso!', 'success');
    
    console.log('✅ Modal aberto:', perfil);
}

function closeSimulacaoModal() {
    const modal = document.getElementById('modal-simulacao');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    console.log('❌ Modal fechado');
}

// ============================================
// 6. API IBGE (mantida do código anterior)
// ============================================
let estadosCache = null;
let cidadesCache = {};

function initIBGEAPI() {
    const estadoSelect = document.getElementById('estado');
    const cidadeInput = document.getElementById('cidade');

    if (!estadoSelect) {
        console.warn('⚠️ Campo estado não encontrado');
        return;
    }

    console.log('✅ API IBGE inicializada');

    loadEstados();

    if (estadoSelect && cidadeInput) {
        estadoSelect.addEventListener('change', function() {
            const uf = this.value;
            if (uf) {
                loadCidades(uf);
                cidadeInput.value = '';
                cidadeInput.removeAttribute('disabled');
                cidadeInput.placeholder = 'Digite sua cidade...';
                cidadeInput.focus();
            } else {
                cidadeInput.setAttribute('disabled', 'disabled');
                cidadeInput.value = '';
                cidadeInput.placeholder = 'Selecione o estado primeiro';
            }
        });
    }
}

async function loadEstados() {
    const estadoSelect = document.getElementById('estado');
    if (!estadoSelect) return;

    try {
        estadoSelect.innerHTML = '<option value="">Carregando...</option>';
        estadoSelect.disabled = true;

        if (estadosCache) {
            populateEstados(estadosCache);
            return;
        }

        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        
        if (!response.ok) throw new Error('Erro ao carregar estados');
        
        const estados = await response.json();
        estadosCache = estados;
        populateEstados(estados);

        console.log('✅ Estados carregados:', estados.length);

    } catch (error) {
        console.error('❌ Erro ao carregar estados:', error);
        const estadosFallback = [
            {sigla: 'SP', nome: 'São Paulo'},
            {sigla: 'RJ', nome: 'Rio de Janeiro'},
            {sigla: 'MG', nome: 'Minas Gerais'},
            {sigla: 'RS', nome: 'Rio Grande do Sul'},
            {sigla: 'PR', nome: 'Paraná'},
            {sigla: 'SC', nome: 'Santa Catarina'}
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
        if (cidadesCache[uf]) {
            setupCidadeAutocomplete(cidadesCache[uf]);
            return;
        }

        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
        
        if (!response.ok) throw new Error('Erro ao carregar cidades');
        
        const cidades = await response.json();
        cidadesCache[uf] = cidades.map(c => c.nome);
        setupCidadeAutocomplete(cidadesCache[uf]);

        console.log(`✅ Cidades de ${uf} carregadas:`, cidades.length);

    } catch (error) {
        console.error('❌ Erro ao carregar cidades:', error);
        showNotification('Erro ao carregar cidades. Digite manualmente.', 'error');
    }
}

function setupCidadeAutocomplete(cidades) {
    const cidadeInput = document.getElementById('cidade');
    if (!cidadeInput) return;

    const oldList = document.getElementById('cidade-autocomplete');
    if (oldList) oldList.remove();

    const datalist = document.createElement('div');
    datalist.id = 'cidade-autocomplete';
    datalist.className = 'autocomplete-list';
    cidadeInput.parentNode.appendChild(datalist);

    cidadeInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        datalist.innerHTML = '';

        if (query.length < 2) {
            datalist.style.display = 'none';
            return;
        }

        const matches = cidades.filter(cidade => 
            cidade.toLowerCase().startsWith(query) ||
            cidade.toLowerCase().includes(' ' + query)
        ).slice(0, 8);

        if (matches.length === 0) {
            datalist.style.display = 'none';
            return;
        }

        matches.forEach(cidade => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            
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

    document.addEventListener('click', (e) => {
        if (!cidadeInput.contains(e.target) && !datalist.contains(e.target)) {
            datalist.style.display = 'none';
        }
    });
}

// ============================================
// 7. WHATSAPP FLUTUANTE (mantido)
// ============================================
function initWhatsAppFloat() {
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (!whatsappFloat) return;

    let currentSection = 'Início';

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

    function updateWhatsAppLink(section) {
        const whatsappLink = whatsappFloat.querySelector('a');
        if (whatsappLink) {
            const message = `Olá! Estava na seção: ${section}. Tenho uma dúvida sobre o Loomper.`;
            whatsappLink.href = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
        }
    }

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 300) {
            whatsappFloat.classList.add('visible');
        } else {
            whatsappFloat.classList.remove('visible');
        }
    });

    console.log('✅ WhatsApp flutuante inicializado');
}

// ============================================
// 8. SMOOTH SCROLL (mantido)
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
// 9. PROGRESS BAR (mantido)
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
// 10. PIX COPIAR (mantido)
// ============================================
function initPIXCopy() {
    const copyBtn = document.getElementById('copy-pix');
    const pixKey = 'contato@loomper.com.br';

    if (!copyBtn) return;

    copyBtn.addEventListener('click', async function() {
        try {
            await navigator.clipboard.writeText(pixKey);
            
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

    console.log('✅ PIX copiar inicializado');
}

// ============================================
// 11. CONTADOR DE VAGAS (mantido)
// ============================================
function initVagasCounter() {
    const vagasAtual = document.getElementById('vagas-atual');
    const vagasTotal = document.getElementById('vagas-total');
    const progressBar = document.querySelector('.vagas-progress-bar');

    if (!vagasAtual || !vagasTotal) return;

    const atual = 47;
    const total = 200;
    const progresso = (atual / total) * 100;

    animateCounter(vagasAtual, 0, atual, 1500);

    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = progresso + '%';
        }, 500);
    }

    console.log('✅ Contador de vagas inicializado');
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
// 12. TRACKING DE CONVITES (mantido)
// ============================================
function initConviteTracking() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');

    if (ref) {
        localStorage.setItem('loomper_referred_by', ref);
        console.log('👥 Cadastro via convite de:', ref);
    }

    if (window.location.pathname.includes('sucesso')) {
        generateConviteLink();
    }
}

function generateUserId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `${timestamp}-${random}`;
}

function generateConviteLink() {
    const userId = localStorage.getItem('loomper_user_id');
    if (!userId) return;

    const baseUrl = window.location.origin;
    const conviteUrl = `${baseUrl}?ref=${userId}`;

    const conviteInput = document.getElementById('convite-link');
    if (conviteInput) {
        conviteInput.value = conviteUrl;
    }

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
// 13. MÁSCARAS DE INPUT
// ============================================
function initInputMasks() {
    const whatsappInput = document.getElementById('whatsapp');
    
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                } else {
                    value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });

        console.log('✅ Máscara de WhatsApp inicializada');
    }
}

// ============================================
// 14. NOTIFICAÇÕES (CORRIGIDO)
// ============================================
function showNotification(message, type = 'info') {
    console.log(`📢 Notificação [${type}]: ${message}`);
    
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-message">${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

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

// ============================================
// 15. LOADING OVERLAY (CORRIGIDO)
// ============================================
function showLoadingOverlay(message = 'Carregando...') {
    console.log(`⏳ Loading: ${message}`);
    
    const existing = document.querySelector('.loading-overlay');
    if (existing) existing.remove();
    
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
// FIM DO ARQUIVO
// ============================================
console.log('✅ LOOMPER v3.0 - JavaScript Corrigido carregado!');
