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
