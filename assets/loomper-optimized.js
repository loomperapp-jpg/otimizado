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
