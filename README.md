# ZED Mobile - Assistente Virtual Inteligente

<p align="center">
  <strong>Aplicativo mobile do ZED - Seu assistente pessoal com IA</strong>
</p>

---

## 📱 Sobre o Projeto

Esta é a versão mobile do **ZED**, criada com **React Native** e **Expo**. Mantém todas as funcionalidades da versão web, otimizadas para dispositivos móveis iOS e Android.

### ✨ Funcionalidades

- 🔐 **Autenticação** com Supabase
- 💬 **Chat com IA** usando Google Gemini
- 📋 **Kanban** de tarefas
- 💰 **Controle financeiro**
- 📅 **Agenda** (em desenvolvimento)
- 🎯 **Metas** (em desenvolvimento)
- ✅ **Checklists** (em desenvolvimento)
- 📔 **Diário** (em desenvolvimento)

---

## 🛠️ Tecnologias

- **React Native** ~0.76.0
- **Expo** ~52.0.0
- **TypeScript** ^5.7.2
- **React Navigation** (Stack + Bottom Tabs)
- **Supabase** (Backend + Auth)
- **Google Gemini AI**
- **AsyncStorage** (Persistência local)

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo Go (para testar no celular)
- Android Studio ou Xcode (para emuladores)

### 1. Instalar Dependências

```bash
cd mobile
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz da pasta `mobile/`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
EXPO_PUBLIC_GEMINI_API_KEY=sua-gemini-api-key-aqui
```

> Use o mesmo Supabase da versão web para compartilhar dados!

### 3. Iniciar o Servidor de Desenvolvimento

```bash
npx expo start
```

### 4. Testar no Dispositivo

**Opção 1: Expo Go (Recomendado para desenvolvimento)**
1. Instale o app Expo Go no seu celular (iOS ou Android)
2. Escaneie o QR Code que aparece no terminal

**Opção 2: Emulador Android**
```bash
# Pressione 'a' no terminal após iniciar o servidor
```

**Opção 3: Simulador iOS (apenas macOS)**
```bash
# Pressione 'i' no terminal após iniciar o servidor
```

---

## 📁 Estrutura do Projeto

```
mobile/
├── src/
│   ├── components/
│   │   ├── atoms/          # Button, Input, Badge, Avatar, Spinner
│   │   ├── molecules/      # Card, Modal
│   │   └── organisms/      # (futuros componentes complexos)
│   │
│   ├── screens/
│   │   ├── auth/           # Login, SignUp
│   │   └── dashboard/      # Home, Chat, Routine, Finances, Profile
│   │
│   ├── hooks/              # useSupabaseAuth, useTasks, useChat
│   ├── lib/                # supabase, gemini, storage
│   ├── theme/              # colors, typography, spacing
│   └── utils/              # (utilitários futuros)
│
├── assets/                 # Imagens, fontes, ícones
├── App.tsx                 # Entrada principal com navegação
├── app.json                # Configuração do Expo
└── package.json
```

---

## 🎨 Design System

O design system é consistente com a versão web:

### Cores
- **Primary**: `#3B82F6` (azul)
- **Accent**: `#F59E0B` (dourado)
- **Success**: `#10B981` (verde)
- **Error**: `#EF4444` (vermelho)
- **Background**: `#0A101F` (preto azulado)

### Componentes
- **Button**: 3 variantes (primary, secondary, ghost, danger, success)
- **Input**: Com validação e ícones
- **Card**: Elevações configuráveis
- **Badge**: Para tags e status

---

## 🔐 Autenticação

A autenticação é feita com o Supabase e compartilha a mesma base de usuários da versão web:

```typescript
const { signIn, signUp, signOut, isAuthenticated } = useSupabaseAuth();

// Login
await signIn('email@example.com', 'senha123');

// Cadastro
await signUp('email@example.com', 'senha123', { name: 'João' });

// Logout
await signOut();
```

---

## 💬 Chat com ZED

O chat usa o Google Gemini AI e detecta ações automaticamente:

```typescript
const { messages, sendMessage } = useChat();

// Enviar mensagem
const result = await sendMessage('Cria uma tarefa para fazer compras');

// ZED detecta a ação e pode criar a tarefa automaticamente
```

---

## 📊 Gerenciamento de Estado

Usamos **hooks personalizados** para gerenciar dados:

- `useSupabaseAuth()`: Autenticação
- `useTasks()`: Tarefas CRUD
- `useChat()`: Mensagens do chat
- `useTransactions()`: Finanças (a implementar)
- `useEvents()`: Agenda (a implementar)

---

## 📦 Build para Produção

### Android (APK)

```bash
eas build --platform android
```

### iOS (apenas macOS)

```bash
eas build --platform ios
```

### Publicar nas Lojas

```bash
# App Store + Google Play
eas submit
```

---

## 🐛 Debug

### React Native Debugger

```bash
# Abra o menu de desenvolvedor no app (shake no celular)
# Selecione "Debug" para conectar ao debugger
```

### Logs

```bash
# Ver logs em tempo real
npx react-native log-android  # Android
npx react-native log-ios      # iOS
```

---

## 🤝 Contribuindo

Este é um projeto em evolução! Próximas funcionalidades:

- [ ] Implementar agenda completa
- [ ] Adicionar metas e milestones
- [ ] Criar checklists
- [ ] Implementar diário
- [ ] Timer Pomodoro
- [ ] Notificações push
- [ ] Modo offline
- [ ] Sincronização em background

---

## 📄 Licença

Mesmo projeto MIT da versão web.

---

<p align="center">
  <strong>Feito com 💙 pela equipe ZED</strong>
  <br />
  © 2025 ZED Mobile. Versão 1.0.0
</p>
# ZedAI-Mobile
# ZedAI-Mobile
