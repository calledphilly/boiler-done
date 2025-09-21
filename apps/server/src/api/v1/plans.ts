import { plugin } from '../../utils/plugin';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { stripeClient } from '../../utils/stripe';
import z from 'zod/v4';
import { plans } from '../../constants/plans';
import type Stripe from 'stripe';

// Schéma de réponse pour un plan
const PlanSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  description: z.string().nullable(),
  monthlyPrice: z.object({
    amount: z.number(),
    currency: z.string(),
    priceId: z.string(),
  }),
  annualPrice: z.object({
    amount: z.number(),
    currency: z.string(),
    priceId: z.string(),
  }),
  limits: z.object({
    projects: z.number(),
  }),
  features: z.array(
    z.object({
      name: z.string().optional(),
    })
  ),
});

const PlansResponseSchema = z.object({
  plans: z.array(PlanSchema),
});

const ErrorResponseSchema = z.object({
  error: z.string(),
});

const routes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    '/plans',
    {
      schema: {
        response: {
          200: PlansResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        // Récupérer tous les produits depuis Stripe
        const products = await stripeClient.products.list({
          active: true,
          expand: ['data.default_price', 'data'],
        });

        // Récupérer tous les prix depuis Stripe
        const prices = await stripeClient.prices.list({
          active: true,
        });

        const formattedPlans = [];

        // Pour chaque plan défini dans nos constantes
        for (const localPlan of plans) {
          // Trouver le produit Stripe correspondant au priceId mensuel
          const monthlyPrice = prices.data.find(
            (price) => price.id === localPlan.priceId
          );
          const annualPrice = prices.data.find(
            (price) => price.id === localPlan.annualDiscountPriceId
          );

          if (!monthlyPrice || !annualPrice) {
            fastify.log.warn(
              `Plan ${localPlan.name}: Prix manquant dans Stripe`
            );
            continue;
          }

          // Récupérer le produit associé
          const product = products.data.find(
            (prod) => prod.id === monthlyPrice.product
          );

          if (!product) {
            fastify.log.warn(
              `Plan ${localPlan.name}: Produit manquant dans Stripe`
            );
            continue;
          }

          // Extraire les features depuis les métadonnées du produit Stripe
          const features =
            product.marketing_features.filter((feature) => feature.name) || [];

          formattedPlans.push({
            name: localPlan.name, // Nom technique pour Better Auth
            displayName: product.name, // Nom officiel depuis Stripe
            description: product.description,
            monthlyPrice: {
              amount: monthlyPrice.unit_amount
                ? monthlyPrice.unit_amount / 100
                : 0,
              currency: monthlyPrice.currency,
              priceId: monthlyPrice.id,
            },
            annualPrice: {
              amount: annualPrice.unit_amount
                ? annualPrice.unit_amount / 100
                : 0,
              currency: annualPrice.currency,
              priceId: annualPrice.id,
            },
            limits: localPlan.limits,
            features,
          });
        }

        return reply.code(200).send({
          plans: formattedPlans,
        });
      } catch (error) {
        fastify.log.error('Erreur lors de la récupération des plans');
        return reply.code(500).send({
          error: 'Erreur interne du serveur',
        });
      }
    }
  );
};

export default plugin(routes);
