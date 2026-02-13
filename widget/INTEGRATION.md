# Auralis ChatWidget — Guide d'intégration

## Prérequis

Ce widget nécessite :
- React + TypeScript
- TailwindCSS
- Framer Motion (`npm install framer-motion`)

## Étapes d'intégration

### 1. Installer la dépendance

```bash
npm install framer-motion
```

### 2. Ajouter les Google Fonts

Dans le fichier `index.html`, ajouter dans `<head>` :

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;1,400&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet" />
```

### 3. Importer le CSS du widget

Dans le fichier CSS principal du projet (ex: `index.css`, `globals.css`, `app.css`), ajouter :

```css
@import './widget/chatwidget.css';
```

OU dans le fichier d'entrée TypeScript (ex: `main.tsx`, `App.tsx`) :

```tsx
import './widget/chatwidget.css';
```

### 4. Ajouter le composant

Dans le composant racine du projet (ex: `App.tsx`), ajouter :

```tsx
import { ChatWidget } from './widget';

// Dans le JSX, à la fin du return, AVANT la fermeture du dernier élément :
<ChatWidget />
```

Le widget est en `position: fixed`, il se superpose automatiquement au contenu existant.

### 5. Configurer les variables d'environnement

Dans le fichier `.env` à la racine du projet :

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_USE_MOCK_API=false
```

S'assurer que `.env` est dans `.gitignore`.

### 6. Vérifier

Lancer `npm run dev` et vérifier que :
- Le bouton flottant apparaît en bas à droite
- Le panel s'ouvre au clic
- Le message de bienvenue s'affiche
- L'API Groq répond aux messages

## Structure du dossier

```
widget/
├── index.ts                 # Export unique : ChatWidget
├── chatwidget.css           # Animations CSS requises
├── types.ts                 # Types TypeScript
├── INTEGRATION.md           # Ce fichier
├── components/
│   ├── ChatWidget.tsx       # Composant principal (point d'entrée)
│   ├── ChatButton.tsx       # Bouton flottant
│   ├── ChatPanel.tsx        # Panel desktop + mobile
│   ├── ChatHeader.tsx       # Header avec avatar
│   ├── MessageList.tsx      # Liste de messages
│   ├── MessageBubble.tsx    # Bulle de message
│   ├── ChatInput.tsx        # Zone de saisie
│   ├── TypingIndicator.tsx  # Indicateur de frappe
│   └── QuickReplies.tsx     # Boutons de réponse rapide
├── hooks/
│   ├── useChat.ts           # Logique de conversation
│   ├── useAutoScroll.ts     # Auto-scroll des messages
│   ├── useRateLimit.ts      # Limite de 10 msg/min
│   └── useWelcomeSequence.ts # Séquence d'accueil
└── services/
    └── api.ts               # Appel API Groq + mode mock
```

## Personnalisation

- **Email de contact** : Modifier dans `services/api.ts` (system prompt + mock responses) et `hooks/useChat.ts` (message d'erreur)
- **Nom du bot** : Modifier "Auralis AI" dans `components/ChatHeader.tsx`
- **Message de bienvenue** : Modifier dans `hooks/useWelcomeSequence.ts`
- **Quick replies** : Modifier dans `components/QuickReplies.tsx`
- **Couleurs** : Primaire `#0ea5e9` (bleu), Secondaire `#34d399` (émeraude), Accent `#f59e0b` (ambre)
