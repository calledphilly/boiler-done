# Documentation API

## 🚀 Vue d'ensemble

Cette API REST est construite avec Fastify et Better Auth, offrant des endpoints pour l'authentification, la gestion des utilisateurs, et les paiements Stripe.

**Base URL :** `http://localhost:3000/api`

## 🔐 Authentification

L'API utilise Better Auth pour l'authentification avec support des sessions, OAuth, et intégration Stripe.

### Endpoints d'Authentification

Tous les endpoints d'authentification sont disponibles sous `/api/auth/*` et sont gérés par Better Auth.

#### 1. **Inscription**

```http
POST /api/auth/sign-up
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "address": "123 Main St",
  "city": "New York",
  "region": "NY",
  "postalCode": "10001",
  "country": "US"
}
```

**Réponse :**

```json
{
	"user": {
		"id": "user_123",
		"name": "John Doe",
		"email": "john@example.com",
		"emailVerified": false,
		"address": "123 Main St",
		"city": "New York",
		"region": "NY",
		"postalCode": "10001",
		"country": "US",
		"createdAt": "2024-01-01T00:00:00.000Z"
	},
	"session": {
		"id": "session_123",
		"expiresAt": "2024-01-08T00:00:00.000Z",
		"token": "session_token_123"
	}
}
```

#### 2. **Connexion**

```http
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Réponse :**

```json
{
	"user": {
		"id": "user_123",
		"name": "John Doe",
		"email": "john@example.com",
		"emailVerified": true
	},
	"session": {
		"id": "session_123",
		"expiresAt": "2024-01-08T00:00:00.000Z",
		"token": "session_token_123"
	}
}
```

#### 3. **Déconnexion**

```http
POST /api/auth/sign-out
Authorization: Bearer <session_token>
```

**Réponse :**

```json
{
	"message": "Successfully signed out"
}
```

#### 4. **Vérification Email**

```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_123"
}
```

**Réponse :**

```json
{
	"user": {
		"id": "user_123",
		"emailVerified": true
	}
}
```

#### 5. **Demande de Reset Password**

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Réponse :**

```json
{
	"message": "Password reset email sent"
}
```

#### 6. **Reset Password**

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_123",
  "password": "newSecurePassword123"
}
```

**Réponse :**

```json
{
	"message": "Password successfully reset"
}
```

#### 7. **OAuth GitHub**

```http
GET /api/auth/sign-in/github
```

Redirige vers GitHub pour l'authentification OAuth.

#### 8. **Session Actuelle**

```http
GET /api/auth/session
Authorization: Bearer <session_token>
```

**Réponse :**

```json
{
	"user": {
		"id": "user_123",
		"name": "John Doe",
		"email": "john@example.com",
		"emailVerified": true,
		"address": "123 Main St",
		"city": "New York",
		"region": "NY",
		"postalCode": "10001",
		"country": "US",
		"stripeCustomerId": "cus_123",
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	},
	"session": {
		"id": "session_123",
		"expiresAt": "2024-01-08T00:00:00.000Z",
		"token": "session_token_123"
	}
}
```

## 💳 Paiements et Abonnements

### Endpoints Stripe

#### 1. **Créer une Session de Paiement**

```http
POST /api/auth/stripe/create-checkout-session
Authorization: Bearer <session_token>
Content-Type: application/json

{
  "plan": "pro",
  "billing": "monthly"
}
```

**Réponse :**

```json
{
	"url": "https://checkout.stripe.com/c/pay/cs_123"
}
```

#### 2. **Gérer l'Abonnement**

```http
POST /api/auth/stripe/create-portal-session
Authorization: Bearer <session_token>
Content-Type: application/json

{
  "returnUrl": "http://localhost:5173/dashboard"
}
```

**Réponse :**

```json
{
	"url": "https://billing.stripe.com/p/session_123"
}
```

#### 3. **Webhook Stripe**

```http
POST /api/auth/stripe/webhook
Content-Type: application/json
Stripe-Signature: <stripe_signature>

{
  "id": "evt_123",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_123",
      "customer_email": "john@example.com",
      "amount_total": 2999,
      "currency": "usd"
    }
  }
}
```

## 📋 Plans et Tarifs

### Endpoint Plans

#### **Récupérer les Plans Disponibles**

```http
GET /api/v1/plans
```

**Réponse :**

```json
{
	"plans": [
		{
			"name": "basic",
			"displayName": "Plan Basique",
			"description": "Parfait pour commencer",
			"monthlyPrice": {
				"amount": 9.99,
				"currency": "usd",
				"priceId": "price_1S8yuNRvGJ6lPiv4fERR99U9"
			},
			"annualPrice": {
				"amount": 99.99,
				"currency": "usd",
				"priceId": "price_1S8yuNRvGJ6lPiv4zBKnutcI"
			},
			"limits": {
				"projects": 3
			},
			"features": [
				{
					"name": "3 projets maximum"
				},
				{
					"name": "Support email"
				}
			]
		},
		{
			"name": "pro",
			"displayName": "Plan Pro",
			"description": "Pour les professionnels",
			"monthlyPrice": {
				"amount": 29.99,
				"currency": "usd",
				"priceId": "price_1S92oIRvGJ6lPiv4zZk6Lq64"
			},
			"annualPrice": {
				"amount": 299.99,
				"currency": "usd",
				"priceId": "price_1S92p3RvGJ6lPiv4qs1g2PyZ"
			},
			"limits": {
				"projects": 10
			},
			"features": [
				{
					"name": "10 projets maximum"
				},
				{
					"name": "Support prioritaire"
				},
				{
					"name": "Analytics avancées"
				}
			]
		},
		{
			"name": "enterprise",
			"displayName": "Plan Enterprise",
			"description": "Pour les grandes entreprises",
			"monthlyPrice": {
				"amount": 99.99,
				"currency": "usd",
				"priceId": "price_1S92r0RvGJ6lPiv4ojNbb8zy"
			},
			"annualPrice": {
				"amount": 999.99,
				"currency": "usd",
				"priceId": "price_1S92r0RvGJ6lPiv4k7DIqB9c"
			},
			"limits": {
				"projects": 100
			},
			"features": [
				{
					"name": "100 projets maximum"
				},
				{
					"name": "Support 24/7"
				},
				{
					"name": "API personnalisée"
				},
				{
					"name": "SLA garanti"
				}
			]
		}
	]
}
```

## 📚 Documentation OpenAPI

### Accès à la Documentation Interactive

La documentation OpenAPI est disponible à : `http://localhost:3000/api/auth/reference`

Cette documentation interactive permet de :

- Tester les endpoints directement
- Voir les schémas de requête/réponse
- Comprendre les paramètres requis
- Explorer les exemples

## 🔒 Sécurité

### Headers Requis

#### Authentification

```http
Authorization: Bearer <session_token>
```

#### CORS

L'API accepte les requêtes depuis :

- `http://localhost:5173` (Frontend de développement)
- `http://localhost:3000` (Backend)

### Validation des Données

Tous les endpoints utilisent Zod pour la validation :

- **Requêtes** : Validation automatique des body/query/params
- **Réponses** : Sérialisation cohérente
- **Types** : Génération automatique des types TypeScript

### Gestion des Erreurs

#### Codes de Statut HTTP

| Code | Description       |
| ---- | ----------------- |
| 200  | Succès            |
| 201  | Créé              |
| 400  | Requête invalide  |
| 401  | Non authentifié   |
| 403  | Non autorisé      |
| 404  | Non trouvé        |
| 422  | Données invalides |
| 500  | Erreur serveur    |

#### Format des Erreurs

```json
{
	"error": "Description de l'erreur",
	"code": "ERROR_CODE",
	"details": {
		"field": "Message spécifique au champ"
	}
}
```

## 🧪 Tests

### Variables d'Environnement pour les Tests

```bash
# Base URL
API_BASE_URL=http://localhost:3000/api

# Credentials de test
TEST_EMAIL=test@example.com
TEST_PASSWORD=testPassword123

# Stripe (mode test)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Exemples de Tests

#### Test d'Inscription

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testPassword123",
    "address": "123 Test St"
  }'
```

#### Test de Connexion

```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testPassword123"
  }'
```

#### Test des Plans

```bash
curl -X GET http://localhost:3000/api/v1/plans
```

## 📊 Monitoring et Logs

### Logs Disponibles

L'API génère des logs structurés pour :

- **Requêtes** : Méthode, URL, statut, durée
- **Erreurs** : Stack trace, contexte
- **Authentification** : Tentatives de connexion
- **Paiements** : Événements Stripe

### Métriques

- **Performance** : Temps de réponse par endpoint
- **Erreurs** : Taux d'erreur par type
- **Utilisation** : Nombre de requêtes par endpoint
- **Authentification** : Succès/échecs de connexion

## 🚀 Déploiement

### Variables d'Environnement de Production

```bash
# Base de données
DATABASE_URL=postgresql://user:password@host:5432/database

# Better Auth
BETTER_AUTH_SECRET=your-super-secure-secret
BETTER_AUTH_URL=https://your-domain.com

# Client
CLIENT_ORIGIN=https://your-frontend-domain.com

# Stripe (Production)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Production)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

### Health Check

```http
GET /api/health
```

**Réponse :**

```json
{
	"status": "healthy",
	"timestamp": "2024-01-01T00:00:00.000Z",
	"services": {
		"database": "connected",
		"stripe": "connected",
		"email": "connected"
	}
}
```

## 📝 Changelog

### Version 1.0.0

- ✅ Authentification complète (email/password, OAuth)
- ✅ Gestion des sessions
- ✅ Intégration Stripe
- ✅ API des plans
- ✅ Documentation OpenAPI
- ✅ Validation Zod
- ✅ Support CORS

### Roadmap

- 🔄 API de gestion des utilisateurs
- 🔄 Webhooks personnalisés
- 🔄 Rate limiting
- 🔄 Cache Redis
- 🔄 Métriques avancées

---

Pour plus d'informations sur l'architecture, consultez [ARCHITECTURE.md](./ARCHITECTURE.md).

