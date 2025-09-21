# Boilerplate Full Stack - Architecture et Choix Techniques

## 🏗️ Vue d'ensemble de l'architecture

Ce projet est un boilerplate full-stack moderne utilisant une architecture monorepo avec des technologies de pointe. Il implémente un système d'authentification complet, des paiements Stripe, et une interface utilisateur moderne.

## 📁 Structure du Monorepo

```
boiler-done/
├── apps/
│   ├── client/          # Application React Router (Frontend)
│   └── server/          # API Fastify (Backend)
├── packages/
│   ├── db/              # Base de données Drizzle ORM
│   └── config/          # Configuration partagée (TypeScript, ESLint)
└── docker-compose.yml   # Services de développement
```

## 🛠️ Choix Techniques Détaillés

### 1. **Monorepo avec Turborepo**

**Pourquoi Turborepo ?**

- **Performance** : Cache intelligent et parallélisation des tâches
- **Scalabilité** : Gestion efficace des dépendances entre packages
- **DX (Developer Experience)** : Scripts unifiés et configuration centralisée
- **CI/CD optimisé** : Builds incrémentaux et cache distribué

**Configuration :**

```json
{
	"ui": "tui", // Interface utilisateur moderne
	"tasks": {
		"build": { "dependsOn": ["^build"] },
		"dev": { "cache": false, "persistent": true }
	}
}
```

### 2. **Frontend : React Router v7 + Vite**

**Choix de React Router v7 :**

- **Full-Stack** : SSR natif avec React Server Components
- **Performance** : Hydratation partielle et streaming
- **DX** : Type-safe routing avec génération automatique des types
- **Modernité** : Support des dernières fonctionnalités React 19

**Stack Frontend :**

```typescript
// Technologies clés
- React 19.1.0          // Framework UI
- React Router 7.7.1    // Routing full-stack
- Vite 6.3.3           // Build tool ultra-rapide
- Tailwind CSS 4.1.4   // Styling utility-first
- Radix UI             // Composants accessibles
- TanStack Query 5.89.0 // State management serveur
```

**Configuration Vite :**

```typescript
export default defineConfig({
	plugins: [
		tailwindcss(), // Intégration Tailwind
		reactRouter(), // Plugin React Router
		tsconfigPaths(), // Support des paths TypeScript
	],
})
```

### 3. **Backend : Fastify + Better Auth**

**Pourquoi Fastify ?**

- **Performance** : 2-3x plus rapide qu'Express
- **Type Safety** : Support TypeScript natif
- **Validation** : Intégration Zod pour la validation des schémas
- **Plugins** : Architecture modulaire et écosystème riche

**Stack Backend :**

```typescript
// Technologies clés
- Fastify 5.6.0                    // Framework web
- Better Auth 1.3.11              // Authentification moderne
- Drizzle ORM 0.44.5              // ORM type-safe
- PostgreSQL 17                   // Base de données relationnelle
- Stripe 18.5.0                   // Paiements
- Zod 4.1.11                      // Validation de schémas
```

**Configuration Fastify :**

```typescript
const app = Fastify({ logger: true })
	.setValidatorCompiler(validatorCompiler) // Validation Zod
	.setSerializerCompiler(serializerCompiler) // Sérialisation optimisée
	.withTypeProvider<ZodTypeProvider>() // Type safety
```

### 4. **Authentification : Better Auth**

**Pourquoi Better Auth ?**

- **Type Safety** : Génération automatique des types TypeScript
- **Modernité** : Support des dernières pratiques de sécurité
- **Flexibilité** : Configuration déclarative et hooks personnalisables
- **Intégrations** : Stripe, OAuth, email verification natifs

**Fonctionnalités implémentées :**

```typescript
- Email/Password authentication
- Email verification obligatoire
- Password reset avec tokens sécurisés
- OAuth GitHub (optionnel)
- Sessions sécurisées avec cookies
- Hooks personnalisés pour les emails
- Intégration Stripe pour les abonnements
- Client React avec hooks optimisés
```

**Configuration côté client :**

```typescript
// Client Better Auth pour React
export const {
	signOut,
	signIn,
	signUp,
	useSession,
	sendVerificationEmail,
	requestPasswordReset,
	resetPassword,
	subscription,
	stripe,
	...auth
} = createAuthClient({
	baseURL: 'http://localhost:3000',
	plugins: [
		stripeClient({
			subscription: true, // Gestion des abonnements
		}),
	],
})
```

### 5. **Base de Données : Drizzle ORM + PostgreSQL**

**Pourquoi Drizzle ?**

- **Type Safety** : Schémas TypeScript-first
- **Performance** : Requêtes SQL optimisées
- **DX** : Auto-complétion et validation à la compilation
- **Migration** : Système de migration robuste

**Schéma utilisateur étendu :**

```typescript
export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	// Champs personnalisés
	address: text('address').notNull(),
	city: text('city'),
	region: text('region'),
	postalCode: text('postal_code'),
	country: text('country'),
	stripeCustomerId: text('stripe_customer_id'),
	// Timestamps automatiques
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.notNull(),
})
```

**Configuration Better Auth :**

```typescript
user: {
	additionalFields: {
		address: { type: 'string', required: false },
		city: { type: 'string', required: false },
		region: { type: 'string', required: false },
		postalCode: { type: 'string', required: false },
		country: { type: 'string', required: false },
	},
}
```

**Note importante :** Il y a une incohérence entre le schéma DB (address notNull) et la config Better Auth (required: false). Cette configuration permet une flexibilité lors de l'inscription tout en maintenant la contrainte en base.

### 6. **Paiements : Stripe Integration**

**Fonctionnalités Stripe :**

- **Abonnements** : 3 plans (Basic, Pro, Enterprise)
- **Webhooks** : Gestion des événements en temps réel
- **Emails** : Notifications automatiques de paiement
- **Customer Portal** : Gestion des abonnements par l'utilisateur

**Plans configurés :**

```typescript
export const plans = [
	{ name: 'basic', priceId: 'price_...', limits: { projects: 3 } },
	{ name: 'pro', priceId: 'price_...', limits: { projects: 10 } },
	{ name: 'enterprise', priceId: 'price_...', limits: { projects: 100 } },
]
```

### 7. **UI/UX : Radix UI + Tailwind CSS**

**Design System :**

- **Radix UI** : 40+ composants accessibles et personnalisables
- **Tailwind CSS 4** : Version la plus récente avec nouvelles fonctionnalités
- **Shadcn/ui** : Configuration "new-york" style
- **Lucide React** : Icônes modernes et cohérentes

**Configuration Shadcn :**

```json
{
	"style": "new-york",
	"tailwind": {
		"baseColor": "neutral",
		"cssVariables": true
	},
	"iconLibrary": "lucide"
}
```

### 8. **TypeScript : Configuration Stricte**

**Configuration ultra-stricte :**

```json
{
	"strict": true,
	"exactOptionalPropertyTypes": true,
	"noUncheckedIndexedAccess": true,
	"noImplicitReturns": true,
	"noUnusedLocals": true,
	"noUnusedParameters": true
}
```

**Avantages :**

- **Sécurité** : Détection des erreurs à la compilation
- **Maintenabilité** : Code plus robuste et prévisible
- **DX** : Auto-complétion et refactoring fiables

### 9. **Développement : Docker Compose**

**Services de développement :**

```yaml
services:
  db: # PostgreSQL 17
    image: postgres:17
    environment:
      - POSTGRES_DB=boilerplate
    ports: ['5432:5432']

  mailer: # MailDev pour les emails
    image: maildev/maildev
    ports: ['1080:1080', '1025:1025']
```

### 10. **Gestion des Emails : MJML + Nodemailer**

**Stack email :**

- **MJML** : Templates responsive et cross-client
- **Nodemailer** : Envoi d'emails robuste
- **MailDev** : Interface de test en développement

**Templates disponibles :**

- Welcome email
- Email verification
- Password reset
- Payment confirmation

## 🚀 Scripts de Développement

```bash
# Développement (tous les services)
bun run dev

# Build (production)
bun run build

# Linting
bun run lint

# Type checking
bun run typecheck

# Formatage
bun run format
```

## 📦 Gestion des Dépendances

**Package Manager :** Bun 1.2.22

- **Performance** : 10-100x plus rapide que npm/yarn
- **Compatibilité** : API compatible avec npm
- **Built-in** : Bundler, test runner, et package manager

**Workspaces :**

```json
{
	"workspaces": ["apps/*", "packages/*", "packages/config/*"]
}
```

### Exports Conditionnels et Type Safety

**Stratégie d'exports moderne :**

Chaque package utilise des exports conditionnels pour une meilleure compatibilité et type safety :

**Package Database (`@workspace/db`) :**

```json
{
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"default": "./dist/index.js"
		},
		"./schema": {
			"types": "./dist/schema.d.ts",
			"default": "./dist/schema.js"
		},
		"./schema/auth": {
			"types": "./dist/schema/auth.d.ts",
			"default": "./dist/schema/auth.js"
		}
	}
}
```

**Avantages des exports conditionnels :**

- **Type Safety** : Import automatique des types TypeScript
- **Tree Shaking** : Import sélectif des modules nécessaires
- **Compatibilité** : Support des bundlers modernes (Vite, Webpack, etc.)
- **Performance** : Chargement optimisé des dépendances
- **DX** : Auto-complétion et navigation dans l'IDE

## 🔧 Configuration des Outils

### ESLint + Prettier

- Configuration partagée dans `packages/config/`
- Règles strictes pour la qualité du code
- Formatage automatique

### TypeScript

- Configuration de base partagée
- Builds optimisés avec `tsup`
- Génération de types pour l'API

## 🎯 Points Forts de l'Architecture

1. **Type Safety End-to-End** : TypeScript strict de la DB à l'UI
2. **Performance** : Vite + Fastify + Drizzle pour des temps de réponse optimaux
3. **Developer Experience** : Hot reload, auto-complétion, et debugging facilité
4. **Scalabilité** : Architecture modulaire et monorepo organisé
5. **Sécurité** : Authentification robuste et validation stricte
6. **Modernité** : Technologies de pointe et bonnes pratiques

## 🚀 Déploiement

Le projet est prêt pour le déploiement avec :

- **Docker** : Configuration Docker Compose pour la production
- **Build optimisé** : Scripts de build pour chaque environnement
- **Variables d'environnement** : Configuration sécurisée
- **Monitoring** : Logs structurés avec Fastify

Cette architecture représente un boilerplate moderne et production-ready, optimisé pour le développement rapide et la maintenance à long terme.

## 🚀 Setup et Installation

### Prérequis

#### 1. **Bun (Package Manager)**

**Installation selon l'OS :**

**macOS :**

```bash
# Via Homebrew (recommandé)
brew install bun

# Ou via curl
curl -fsSL https://bun.sh/install | bash
```

**Linux :**

```bash
# Installation directe
curl -fsSL https://bun.sh/install | bash

# Ou via npm (si Node.js est installé)
npm install -g bun
```

**Windows :**

```powershell
# Via PowerShell
irm bun.sh/install.ps1 | iex

# Ou via npm
npm install -g bun
```

**Vérification :**

```bash
bun --version
# Doit afficher : 1.2.22 ou plus récent
```

#### 2. **Docker et Docker Compose**

**macOS :**

```bash
# Via Homebrew
brew install --cask docker

# Ou télécharger Docker Desktop depuis le site officiel
# https://www.docker.com/products/docker-desktop/
```

**Linux (Ubuntu/Debian) :**

```bash
# Installation Docker
sudo apt update
sudo apt install docker.io docker-compose-plugin

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER
# Redémarrer la session ou faire : newgrp docker
```

**Windows :**

- Télécharger Docker Desktop depuis le site officiel
- Installer et redémarrer l'ordinateur

**Vérification :**

```bash
docker --version
docker compose version
```

#### 3. **Stripe CLI**

**macOS :**

```bash
# Via Homebrew
brew install stripe/stripe-cli/stripe

# Ou télécharger depuis GitHub
# https://github.com/stripe/stripe-cli/releases
```

**Linux :**

```bash
# Télécharger et installer
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_*_linux_x86_64.tar.gz
tar -xvf stripe_*_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/

# Ou via snap
sudo snap install stripe
```

**Windows :**

```powershell
# Via Chocolatey
choco install stripe-cli

# Ou télécharger l'exécutable depuis GitHub
# https://github.com/stripe/stripe-cli/releases
```

**Vérification :**

```bash
stripe --version
```

### Installation du Projet

#### 1. **Cloner et installer les dépendances**

```bash
# Cloner le projet
git clone <votre-repo-url>
cd boiler-done

# Installer toutes les dépendances
bun install
```

#### 2. **Configuration de l'environnement**

Créer un fichier `.env` à la racine :

```bash
# Base de données
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/boilerplate"

# Better Auth
BETTER_AUTH_SECRET="votre-secret-super-securise"
BETTER_AUTH_URL="http://localhost:3000"

# Client
CLIENT_ORIGIN="http://localhost:5173"

# GitHub OAuth (optionnel)
GITHUB_CLIENT_ID="votre-github-client-id"
GITHUB_CLIENT_SECRET="votre-github-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (pour le développement)
SMTP_HOST="localhost"
SMTP_PORT="1025"
SMTP_USER=""
SMTP_PASS=""
```

#### 3. **Démarrage des services**

```bash
# Démarrer PostgreSQL et MailDev
docker compose up -d

# Vérifier que les services sont actifs
docker compose ps
```

**Services disponibles :**

- **PostgreSQL** : `localhost:5432`
- **MailDev** : `http://localhost:1080` (interface web)

#### 4. **Configuration de la base de données**

```bash
# Générer les migrations
bun run db:generate

# Appliquer les migrations
bun run db:migrate

# Vérifier la connexion
bun run db:studio  # Interface web Drizzle (optionnel)
```

#### 5. **Configuration Stripe**

```bash
# Se connecter à Stripe
stripe login

# Écouter les webhooks en local
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook

# Dans un autre terminal, récupérer le webhook secret
# Copier la clé "whsec_..." dans votre .env
```

#### 6. **Démarrage du développement**

```bash
# Démarrer tous les services en mode développement
bun run dev

# Ou démarrer individuellement :
# Terminal 1 - Backend
cd apps/server && bun run dev

# Terminal 2 - Frontend
cd apps/client && bun run dev
```

### URLs de Développement

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000
- **MailDev** : http://localhost:1080
- **OpenAPI** : http://localhost:3000/api/auth/reference
- **Drizzle Studio** : http://localhost:4983 (si activé)

### Commandes Utiles

```bash
# Développement
bun run dev              # Démarrer tous les services
bun run build            # Build de production
bun run lint             # Linter le code
bun run typecheck        # Vérifier les types TypeScript
bun run format           # Formater le code

# Base de données
bun run db:generate      # Générer les migrations
bun run db:migrate       # Appliquer les migrations
bun run db:studio        # Interface web Drizzle

# Docker
docker compose up -d     # Démarrer les services
docker compose down      # Arrêter les services
docker compose logs      # Voir les logs
```

### Dépannage

#### Problèmes courants :

**1. Port déjà utilisé :**

```bash
# Vérifier les ports utilisés
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Arrêter le processus ou changer le port
```

**2. Erreur de connexion à la base :**

```bash
# Vérifier que PostgreSQL est démarré
docker compose ps

# Redémarrer les services
docker compose restart db
```

**3. Erreur Stripe webhook :**

```bash
# Vérifier que le webhook est actif
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook

# Vérifier la clé dans .env
echo $STRIPE_WEBHOOK_SECRET
```

**4. Erreurs TypeScript :**

```bash
# Nettoyer et réinstaller
rm -rf node_modules
bun install

# Vérifier les types
bun run typecheck
```

### Structure des Variables d'Environnement

```bash
# Obligatoires
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=...

# Optionnelles (pour fonctionnalités avancées)
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

Votre projet est maintenant prêt pour le développement ! 🎉

## 📚 Documentation

### Fichiers de Documentation

- **[README.md](./README.md)** - Guide de démarrage et vue d'ensemble
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Choix techniques détaillés et architecture
- **[API.md](./API.md)** - Documentation complète de l'API REST
- **[Boilerplate-API.postman_collection.json](./Boilerplate-API.postman_collection.json)** - Collection Postman pour tester l'API

### Documentation Interactive

- **OpenAPI** : `http://localhost:3000/api/auth/reference` - Documentation interactive de l'API
- **Drizzle Studio** : `http://localhost:4983` - Interface de gestion de la base de données
- **MailDev** : `http://localhost:1080` - Interface de test des emails

### Import de la Collection Postman

1. Ouvrir Postman
2. Cliquer sur "Import"
3. Sélectionner le fichier `Boilerplate-API.postman_collection.json`
4. Configurer les variables d'environnement :
   - `base_url` : `http://localhost:3000/api`
   - `session_token` : (sera automatiquement rempli après connexion)
   - `stripe_signature` : `whsec_...` (depuis Stripe CLI)

### Workflow de Test

1. **Démarrer les services** : `bun run dev`
2. **Importer la collection** Postman
3. **Tester l'inscription** : `Sign Up`
4. **Tester la connexion** : `Sign In` (le token sera automatiquement sauvegardé)
5. **Tester les autres endpoints** avec le token automatique
