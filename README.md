# 🚀 LOOMPER — Landing Page Otimizada para Beta

## 📋 Visão Geral

Landing page de **alta conversão** para captura de leads do MVP Loomper Beta.

### 🎯 Objetivos de Captura
- **500 motoristas** de caminhão cegonha
- **500 chapas/ajudantes** de carga e descarga
- **5 transportadoras** de veículos

## ✨ Diferenciais desta Versão

### 🎨 Design Disruptivo & Simples
- ✅ **Bata o olho e entenda em 3 segundos** — Fluxogramas visuais claros
- ✅ **Contraste forte** — Botões evidentes, sem "poluir"
- ✅ **Hierarquia visual clara** — Leitura guiada por blocos
- ✅ **Mobile-first** — Otimizado para smartphones

### 📊 Experiência do Usuário
- ✅ **Fluxos visuais** por perfil (Motorista/Chapa/Transportadora)
- ✅ **Simuladores interativos** — Veja antes de se cadastrar
- ✅ **Destaque para propósito social** — Recorrência de renda para chapas
- ✅ **Formulário otimizado** — Perfil primeiro, validação em tempo real

### 🔧 Funcionalidades Técnicas

#### Tracking Completo
- ✅ **ID rastreável** (`LMP-XXXXXXXX`) gerado e persistido
- ✅ **Referrer tracking** via URL `?ref=ID`
- ✅ **Journey tracking** — Toda jornada do usuário salva
- ✅ **Timestamp aceite de termos** — Registrado no submit

#### Integrações Preparadas
- ✅ **Netlify Forms** — Captura automática de leads
- ✅ **WhatsApp Business API** — Esqueleto pronto (Make.com)
- ✅ **Sistema de indicações** — Link compartilhável com ref
- ✅ **Créditos iniciais** — Banco de dados preparado
  - Motorista: 100 créditos
  - Transportadora: 500 créditos
  - Chapa: 0 créditos (sempre gratuito)

#### Sistema de Convites
- ✅ **Share nativo** (mobile)
- ✅ **Clipboard API** (desktop)
- ✅ **Rastreamento de origem** — Quem indicou quem

## 📁 Estrutura de Arquivos

```
loomper-optimized/
├── index.html                          # Landing page otimizada
├── assets/
│   ├── loomper-optimized.css          # CSS moderno e responsivo
│   └── loomper-optimized.js           # JS com tracking completo
├── netlify.toml                        # Configuração Netlify
├── netlify/functions/
│   ├── sendInvite.js                  # Função: enviar convites
│   └── sendNDA.js                     # Função: enviar NDA/boas-vindas
└── README.md                          # Este arquivo
```

## 🚀 Deploy no Netlify

### 1. Conectar Repositório
```bash
# Via Netlify CLI
netlify init

# Ou conecte via dashboard
# https://app.netlify.com
```

### 2. Configurar Variáveis de Ambiente
No dashboard Netlify, adicione:

```env
# Webhook Make.com (para integrações)
MAKE_WEBHOOK_URL=https://hook.us1.make.com/seu-webhook-id

# URL do site (produção)
URL=https://loomper.com.br
```

### 3. Deploy Automático
Todo push na branch `main` faz deploy automático.

## 📝 Formulário — Campos Capturados

### Campos Visíveis
- ✅ **Perfil** (Motorista/Chapa/Transportadora/Investidor) — PRIMEIRO CAMPO
- ✅ **Nome completo**
- ✅ **WhatsApp** (validação 10-11 dígitos)
- ✅ **Email** (validação regex)
- ✅ **Estado** (UF)
- ✅ **Cidade**
- ✅ **Indicar amigo** (opcional)
- ✅ **Aceite de termos** (checkbox obrigatório)

### Campos Ocultos (Tracking)
- ✅ `user_id` — ID único gerado
- ✅ `referrer_id` — De onde veio (ref ou direct)
- ✅ `user_journey` — JSON com toda jornada
- ✅ `terms_accepted_at` — Timestamp ISO do aceite
- ✅ `credits_initial` — Créditos iniciais por perfil

## 🎯 Fluxo de Conversão

### 1. Hero
- Badge "Beta Fechado • Vagas Limitadas"
- CTAs por perfil (🚚 Motorista / 👷 Chapa / 🏢 Transportadora)
- Stats: 500 + 500 + 5

### 2. O que é (3 segundos)
- Fluxograma visual por perfil
- Cards: Simplicidade / Rapidez / Confiança

### 3. Para quem (Benefícios)
- Grid de cards por perfil
- Chapa destacado: "SEMPRE GRATUITO"
- Botões: Ver Simulação

### 4. Como funciona (Simuladores)
- Tabs: Motorista / Chapa / Transportadora
- Mockups interativos
- Descrição clara abaixo

### 5. Propósito Social
- Destaque para missão: Recorrência de renda
- Stats: Zero taxa / 100% gratuito / ∞ oportunidades

### 6. Cadastro (Formulário)
- Formulário otimizado
- Benefícios de ser pioneiro
- Validação em tempo real

### 7. Apoio (PIX)
- Chave PIX copiável
- QR Code gerado via API
- Botões: Copiar / Ver QR

## 🎨 Cores & Identidade

```css
--color-primary: #FF7A2D    /* Laranja — CTAs, destaques */
--color-secondary: #CFA34A  /* Dourado — Chapas, propósito */
--color-accent: #00D9FF     /* Azul — Destaques secundários */
--color-bg: #050A14         /* Fundo escuro */
--color-text: #FFFFFF       /* Texto principal */
```

## 📱 WhatsApp

### Botão FAB (Fixo)
- Sempre visível no canto inferior direito
- Animação pulsante
- Mensagem pré-formatada com ID do usuário

### Grupo Beta
Atualizar em `assets/loomper-optimized.js`:
```javascript
WA_GROUP: 'https://chat.whatsapp.com/SEU_GRUPO_ID'
```

## 🔗 Sistema de Indicações

### Como funciona
1. Usuário se cadastra → Recebe ID único (`LMP-XXXXXXXX`)
2. Compartilha link: `https://loomper.com.br?ref=LMP-XXXXXXXX`
3. Amigo acessa e se cadastra → `referrer_id` é capturado
4. Sistema registra quem indicou quem

### Benefícios (futuro)
- Ranking de indicações
- Créditos bônus
- Acesso prioritário a features

## 📊 Acessar Dados Capturados

### Netlify Forms
1. Acesse: https://app.netlify.com
2. Vá em: **Forms** (menu lateral)
3. Selecione: **waitlist**
4. Exporte: CSV ou integre via API

### Integração Make.com
Configure webhook no Make para:
- ✅ Enviar email de boas-vindas
- ✅ Adicionar em CRM
- ✅ Enviar convites via WhatsApp
- ✅ Registrar em banco de dados

## 🛠️ Próximos Passos (Pós-Deploy)

### Imediato
- [ ] Atualizar ID do grupo WhatsApp
- [ ] Configurar webhook Make.com
- [ ] Testar formulário em produção
- [ ] Criar imagens OG (Open Graph)

### Curto Prazo
- [ ] Integrar com banco de dados (Supabase/Firebase)
- [ ] Sistema de ranking de indicações
- [ ] Dashboard admin para visualizar leads
- [ ] Email marketing (boas-vindas automático)

### Médio Prazo
- [ ] A/B testing de CTAs
- [ ] Analytics avançado (Google Analytics 4)
- [ ] Pixel Facebook/LinkedIn
- [ ] Retargeting campaigns

## 🔒 Segurança & Privacidade

- ✅ HTTPS obrigatório (Netlify)
- ✅ Headers de segurança configurados
- ✅ Honeypot para anti-spam
- ✅ Validação client-side + server-side
- ✅ Links para Termos e Privacidade

## 📈 Métricas de Sucesso

### KPIs Primários
- **Taxa de conversão** — Visitantes → Cadastros
- **Tempo na página** — Engajamento
- **Taxa de abandono** — Onde usuários saem

### KPIs Secundários
- **Indicações por usuário** — Viralização
- **Taxa de abertura email** — Engajamento pós-cadastro
- **Distribuição por perfil** — Motorista vs Chapa vs Transportadora

## 🐛 Troubleshooting

### Formulário não envia
- Verifique configuração Netlify Forms
- Confirme campo hidden `form-name="waitlist"`
- Teste em modo incógnito

### Tracking não funciona
- Limpe localStorage: `localStorage.clear()`
- Verifique console do navegador
- Teste em diferentes dispositivos

### WhatsApp não abre
- Verifique formato do número em `CONFIG.WA_NUMBER`
- Formato correto: `5511965858142` (sem espaços)

## 📞 Suporte

**LOOMPER — Grupo Ajud.AI**
- 📧 contato@loomper.com.br
- 📱 WhatsApp: +55 11 96585-8142
- 🏢 São Bernardo do Campo • SP • Brasil
- 🆔 CNPJ: 59.150.688/0001-39

---

© 2025 LOOMPER — Do Brasil para o Mundo 🇧🇷