# Configuração do GitHub Pages com Branch Main

Este documento explica como configurar o deploy automático do ComunicaPro usando GitHub Actions e a branch **main**.

---

## 📋 Pré-requisitos

- Repositório no GitHub
- Permissões de administrador no repositório
- Variáveis de ambiente do Supabase

---

## 🔧 Passo 1: Configurar GitHub Secrets

As variáveis de ambiente precisam ser configuradas como **Secrets** no GitHub para segurança.

### Como Adicionar Secrets

1. Acesse o repositório no GitHub: https://github.com/eupedrodiogo/comunicapro
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret**
5. Adicione cada secret abaixo:

### Secrets Necessários

| Nome do Secret | Valor |
|----------------|-------|
| `VITE_SUPABASE_PROJECT_ID` | `sjyellllnsxkebukmoxi` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqeWVsbGxsbnN4a2VidWttb3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTM5NzksImV4cCI6MjA3NjEyOTk3OX0.W40qne_M7gxnJVckPIc-te9sD7Ks_hxe-8Vp3X66sIg` |
| `VITE_SUPABASE_URL` | `https://sjyellllnsxkebukmoxi.supabase.co` |

### Via GitHub CLI (Alternativa)

```bash
# Configurar secrets via CLI
gh secret set VITE_SUPABASE_PROJECT_ID -b"sjyellllnsxkebukmoxi"
gh secret set VITE_SUPABASE_PUBLISHABLE_KEY -b"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqeWVsbGxsbnN4a2VidWttb3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTM5NzksImV4cCI6MjA3NjEyOTk3OX0.W40qne_M7gxnJVckPIc-te9sD7Ks_hxe-8Vp3X66sIg"
gh secret set VITE_SUPABASE_URL -b"https://sjyellllnsxkebukmoxi.supabase.co"
```

---

## 🚀 Passo 2: Configurar GitHub Pages

### Via Interface Web

1. Acesse **Settings** → **Pages**
2. Em **Source**, selecione: **GitHub Actions**
3. Salve as configurações

### Via GitHub CLI

```bash
# Habilitar GitHub Pages com GitHub Actions
gh api repos/eupedrodiogo/comunicapro/pages \
  --method POST \
  -f source[branch]=main \
  -f source[path]=/
```

---

## 📦 Passo 3: Estrutura do Workflow

O workflow está localizado em `.github/workflows/deploy.yml` e executa:

### Jobs

#### 1. **Build**
- Checkout do código
- Setup do Node.js 20
- Instalação de dependências (`npm ci`)
- Build de produção (`npm run build`)
- Upload do artifact (diretório `dist/`)

#### 2. **Deploy**
- Deploy do artifact para GitHub Pages
- Publicação automática

### Triggers

O workflow é executado automaticamente quando:
- Há um **push** na branch **main**
- É executado **manualmente** via GitHub Actions UI

---

## 🔄 Passo 4: Fazer Deploy

### Deploy Automático

Qualquer push para a branch **main** dispara o deploy automaticamente:

```bash
# Fazer alterações
git add .
git commit -m "feat: Nova funcionalidade"
git push origin main

# O deploy será executado automaticamente
```

### Deploy Manual

Via GitHub Actions UI:
1. Acesse **Actions** no repositório
2. Selecione o workflow **Deploy to GitHub Pages**
3. Clique em **Run workflow**
4. Selecione a branch **main**
5. Clique em **Run workflow**

Via GitHub CLI:

```bash
gh workflow run deploy.yml
```

---

## 📊 Monitoramento

### Verificar Status do Deploy

Via GitHub Actions UI:
1. Acesse **Actions** no repositório
2. Veja o status dos workflows em execução

Via GitHub CLI:

```bash
# Listar workflows
gh run list --workflow=deploy.yml

# Ver detalhes de um run específico
gh run view [RUN_ID]

# Ver logs
gh run view [RUN_ID] --log
```

---

## 🔍 Verificação Pós-Deploy

### URLs de Acesso

Após o deploy bem-sucedido, a aplicação estará disponível em:

- **Produção:** https://eupedrodiogo.github.io/comunicapro/
- **Analytics:** https://eupedrodiogo.github.io/comunicapro/analytics
- **Conquistas:** https://eupedrodiogo.github.io/comunicapro/conquistas
- **Comparação:** https://eupedrodiogo.github.io/comunicapro/comparar

### Checklist de Validação

- [ ] Workflow executou sem erros
- [ ] Build foi concluído com sucesso
- [ ] Deploy foi publicado
- [ ] Site está acessível na URL de produção
- [ ] Todas as rotas funcionam corretamente
- [ ] Service Worker está registrado
- [ ] PWA pode ser instalado

---

## 🐛 Troubleshooting

### Erro: "Resource not accessible by integration"

**Causa:** Permissões insuficientes do workflow

**Solução:**
1. Acesse **Settings** → **Actions** → **General**
2. Em **Workflow permissions**, selecione: **Read and write permissions**
3. Marque: **Allow GitHub Actions to create and approve pull requests**
4. Salve as configurações

### Erro: "Secrets not found"

**Causa:** Secrets não configurados

**Solução:**
1. Verifique se todos os secrets foram adicionados corretamente
2. Nomes dos secrets devem ser exatamente como especificado
3. Re-execute o workflow após adicionar os secrets

### Erro: "Build failed"

**Causa:** Erro no código ou dependências

**Solução:**
1. Verifique os logs do workflow
2. Execute `npm run build` localmente para reproduzir o erro
3. Corrija o erro e faça novo commit

### Erro: "Pages deployment failed"

**Causa:** Configuração incorreta do GitHub Pages

**Solução:**
1. Verifique se GitHub Pages está configurado para usar **GitHub Actions**
2. Verifique se o artifact foi criado corretamente
3. Re-execute o workflow

---

## 🔄 Migração da Branch gh-pages

Se você estava usando a branch `gh-pages` anteriormente:

### Remover Branch gh-pages

```bash
# Deletar branch local
git branch -D gh-pages

# Deletar branch remota
git push origin --delete gh-pages
```

### Atualizar package.json

Remova ou comente o script de deploy do gh-pages:

```json
{
  "scripts": {
    // "deploy": "gh-pages -d dist",  // Não mais necessário
  }
}
```

---

## 📝 Vantagens do Deploy via Main

### ✅ Benefícios

1. **Simplicidade:** Tudo em uma única branch
2. **Automação:** Deploy automático a cada push
3. **Rastreabilidade:** Histórico completo no GitHub Actions
4. **Segurança:** Secrets protegidos
5. **Flexibilidade:** Fácil customização do workflow
6. **CI/CD:** Base para pipeline completo

### 🔄 Comparação

| Aspecto | gh-pages package | GitHub Actions |
|---------|------------------|----------------|
| Automação | Manual | Automático |
| Branch | Separada (gh-pages) | Única (main) |
| Configuração | package.json | Workflow YAML |
| Secrets | Expostos localmente | Protegidos no GitHub |
| Logs | Limitados | Completos |
| Customização | Limitada | Total |

---

## 🚀 Próximos Passos

### Melhorias Recomendadas

1. **Adicionar Testes**
   ```yaml
   - name: Run tests
     run: npm test
   ```

2. **Adicionar Linting**
   ```yaml
   - name: Lint code
     run: npm run lint
   ```

3. **Cache de Dependências**
   ```yaml
   - name: Cache node modules
     uses: actions/cache@v3
     with:
       path: node_modules
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
   ```

4. **Notificações**
   - Configurar notificações de sucesso/falha
   - Integrar com Slack, Discord, etc.

5. **Ambientes Múltiplos**
   - Staging environment
   - Preview deployments para PRs

---

## 📞 Suporte

**Desenvolvedor:** Pedro Diogo Santana Mello  
**Email:** pedrodiogo.suporte@gmail.com  
**GitHub:** @eupedrodiogo

---

## 📚 Referências

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Build Documentation](https://vitejs.dev/guide/build.html)
- [GitHub CLI Documentation](https://cli.github.com/manual/)

---

*Última atualização: 17 de outubro de 2025*

