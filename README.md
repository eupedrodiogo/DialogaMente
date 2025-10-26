# ComunicaPro

> Plataforma de análise profissional de **Preferência de Comunicação** (VAK) com foco em insights de memorização e interação interpessoal

[![Deploy Status](https://img.shields.io/badge/deploy-active-success)](https://eupedrodiogo.github.io/comunicapro/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org)

## 📋 Sobre o Projeto

**ComunicaPro** é uma aplicação web que utiliza o modelo VAK (Visual, Auditivo ou Cinestésico) reenquadrado como **Preferência de Comunicação e Modalidade de Percepção**. O objetivo é fornecer insights personalizados sobre como o usuário tende a processar informações e se comunicar de forma mais eficaz, alinhado com as mais recentes descobertas da ciência cognitiva sobre memorização e significado. **(Veja o [disclaimer científico completo](src/lib/scientificBasis.ts))**

### 🌐 URLs

- **Produção:** https://eupedrodiogo.github.io/comunicapro/
- **Repositório:** https://github.com/eupedrodiogo/comunicapro

## ✨ Funcionalidades

### Core Features
- 🧪 **Teste de Perfil de Comunicação** - 30 questões científicas
- 📊 **Resultados Detalhados** - Análise completa do perfil
- 📄 **Relatório em PDF** - Download do resultado
- ⭐ **Sistema de Avaliações** - Reviews e ratings de usuários
- 💎 **Planos Premium** - Acesso a conteúdo exclusivo
- 🎫 **Sistema de Cupons** - Descontos e promoções
- 💬 **Suporte Integrado** - WhatsApp, email e formulário
- 🌓 **Tema Claro/Escuro** - Interface adaptável
- 📱 **Design Responsivo** - Mobile-first

### 🎉 Novos Recursos (v2.2.0)
- 📊 **Dashboard de Analytics** - Métricas em tempo real com gráficos interativos
- 🏆 **Sistema de Conquistas** - Gamificação com badges e pontos
- 🔄 **Comparação de Resultados** - Compare-se com outros usuários
- 📡 **Progressive Web App** - Funciona offline e pode ser instalado
- ♿ **Menu de Acessibilidade** - Conformidade WCAG 2.2
- 🔔 **Notificações Push** - Sistema preparado para alerts
- 🧠 **Plano de Ação de Processamento Profundo (PAPP)** - **IA-Powered** com LLM, sugere estratégias ativas de aprendizado alinhadas com a Neurociência Cognitiva e o Processamento Profundo (v2.2.1)

## 🚀 Tecnologias

### Frontend
- **React 18.3.1** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite 5.4.19** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **React Router** - Roteamento
- **Tanstack Query** - State management

### Backend
- **Supabase** - BaaS (Backend as a Service)
  - Autenticação
  - PostgreSQL Database
  - Storage
  - Edge Functions

### Hospedagem
- **GitHub Pages** - Hosting estático
- **Configurado para:** Vercel, Netlify, Cloudflare, Render

## 🛠️ Instalação e Uso

### Pré-requisitos

- Node.js 20.x ou superior
- npm ou yarn
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/eupedrodiogo/comunicapro.git

# Entre no diretório
cd comunicapro

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:8080
```

### Build de Produção

```bash
# Gere o build otimizado
npm run build

# Preview do build
npm run preview
```

### Deploy

```bash
# Deploy para GitHub Pages
npm run deploy

# Deploy para Vercel
npm run deploy:vercel

# Deploy para Netlify
npm run deploy:netlify
```

## 📁 Estrutura do Projeto

```
comunicapro/
├── src/
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes shadcn/ui
│   │   └── ...           # Componentes customizados
│   ├── pages/            # Páginas da aplicação
│   │   ├── Landing.tsx   # Página inicial
│   │   ├── Test.tsx      # Teste de comunicação
│   │   ├── Results.tsx   # Resultados
│   │   ├── Pricing.tsx   # Planos e preços
│   │   └── ...
│   ├── integrations/     # Integrações externas
│   │   └── supabase/     # Cliente Supabase
│   ├── lib/              # Utilitários
│   ├── styles/           # Estilos globais
│   └── main.tsx          # Entry point
├── supabase/
│   ├── migrations/       # Migrações do banco
│   └── functions/        # Edge Functions
├── public/               # Assets estáticos
├── scripts/              # Scripts auxiliares
├── .env                  # Variáveis de ambiente
├── vite.config.ts        # Configuração Vite
├── tailwind.config.ts    # Configuração Tailwind
├── vercel.json           # Config Vercel
├── netlify.toml          # Config Netlify
├── render.yaml           # Config Render
├── Dockerfile            # Config Docker
└── package.json          # Dependências
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://sjyellllnsxkebukmoxi.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

### Supabase

O projeto usa Supabase para:
- Autenticação de usuários
- Armazenamento de dados (testes, resultados, reviews)
- Storage de arquivos
- Edge Functions (checkout, cupons, emails)

## 📊 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Preview do build local |
| `npm run lint` | Executa linter |
| `npm run deploy` | Deploy para GitHub Pages |
| `npm run deploy:vercel` | Deploy para Vercel |
| `npm run deploy:netlify` | Deploy para Netlify |
| `npm run migrate:remove-ghpages` | Remove config GitHub Pages |

## 🔄 Migração de Plataforma

Para migrar para outra plataforma de hospedagem:

1. Execute o script de migração:
   ```bash
   npm run migrate:remove-ghpages
   ```

2. Faça rebuild:
   ```bash
   npm run build
   ```

3. Siga as instruções em [MIGRATION.md](MIGRATION.md)

## 📝 Páginas

### Páginas Principais
- `/` - Landing page
- `/instrucoes` - Instruções do teste
- `/test` - Teste de comunicação
- `/results` - Resultados do teste
- `/pricing` - Planos e preços
- `/reviews` - Avaliações de usuários
- `/suporte` - Suporte ao cliente
- `/escopo` - Escopo do projeto

### Novas Páginas (v2.0.0)
- `/analytics` - Dashboard de métricas e estatísticas
- `/conquistas` - Sistema de conquistas e gamificação
- `/comparar` - Comparação de resultados com outros usuários
- `/dashboard` - Painel do usuário

### Administração
- `/admin/cupons` - Administração de cupons
- `/payment-success` - Confirmação de pagamento

## 🎨 Design

- **UI Framework:** shadcn/ui
- **Estilização:** Tailwind CSS
- **Ícones:** Lucide React
- **Fontes:** Sistema padrão
- **Tema:** Claro/Escuro com next-themes
- **Animações:** Tailwind CSS Animate

## 🔐 Segurança

- ✅ HTTPS habilitado
- ✅ Variáveis de ambiente protegidas
- ✅ Validação de formulários (Zod)
- ✅ Sanitização de inputs
- ✅ Autenticação via Supabase
- ✅ Row Level Security (RLS) no banco

## 📈 Performance

- ⚡ Build otimizado com Vite
- 📦 Code splitting
- 🗜️ Compressão gzip
- 🖼️ Lazy loading de imagens
- 🎯 Tree shaking
- 📊 Lighthouse Score: 90+

## 👤 Autor

**Pedro Diogo Santana Mello**
- GitHub: [@eupedrodiogo](https://github.com/eupedrodiogo)
- Email: pedrodiogo.suporte@gmail.com
- WhatsApp: (21) 97252-5151

## 📞 Suporte

Para suporte, entre em contato:
- Email: pedrodiogo.suporte@gmail.com
- WhatsApp: (21) 97252-5151
- Formulário: https://eupedrodiogo.github.io/comunicapro/suporte

---

**Desenvolvido com ❤️ por Pedro Diogo**

**Status:** ✅ Em Produção | **Versão:** 2.2.1 | **Última atualização:** 26 de outubro de 2025

