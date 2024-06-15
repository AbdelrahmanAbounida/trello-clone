"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { absolutePath } from "@/lib/utils";
import { ActionResponse } from "@/schemas/action-resp";
import Stripe from "stripe";

// a method to create new session to reroute the user too in which we gonna handle subscriptions
// using the webhook
export const createSubscriptionSession = async ({
  workspaceId,
}: {
  workspaceId: string;
}): Promise<ActionResponse> => {
  try {
    const user = await auth();

    if (!user) {
      return { error: true, details: "You are not authorized" };
    }
    const wsSubscription = await prismadb.workspaceSubscription.findUnique({
      where: {
        workspaceId,
      },
    });

    // 1- create sesssion
    const returnUrl = absolutePath(`/${workspaceId}/boards`);
    let url = "";

    // if we already have a subscription
    if (wsSubscription && wsSubscription.stripeCustomerId) {
      const stripe_session = await stripe.billingPortal.sessions.create({
        customer: wsSubscription.stripeCustomerId,
        return_url: returnUrl,
      });
      url = stripe_session.url;
    } else {
      // create new subscription with session
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          quantity: 1,
          price_data: {
            currency: "USD",
            product_data: {
              name: "Trellofy Pro",
              description: "Unlimited boards for your workspace",
            },
            unit_amount: Math.round(
              parseInt(process.env.NEXT_PUBLIC_PRO_PRICE!) * 100
            ),
          },
        },
      ];

      // no need to create it since we gonna pass the email
      // const stripe_customer = await stripe.customers.create({
      //   email: user.user.email!,
      //   metadata: {
      //     workspaceId,
      //   },
      // });

      const stripe_session = await stripe.checkout.sessions.create({
        // customer: stripe_customer?.id,
        mode: "subscription",
        payment_method_types: ["paypal", "card"],
        success_url: returnUrl,
        cancel_url: returnUrl,
        billing_address_collection: "auto",
        customer_email: user?.user.email!,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "USD",
              product_data: {
                name: "Trellofy Pro",
                description: "Unlimited boards for your workspace",
              },
              unit_amount: Math.round(
                parseInt(process.env.NEXT_PUBLIC_PRO_PRICE!) * 100
              ),
              recurring: {
                interval: "month",
              },
            },
          },
        ],
        metadata: {
          workspaceId,
        },
      });
      // this will be done in session webhook
      //   await prismadb.workspaceSubscription.upsert({
      //     where: {
      //       workspaceId,
      //     },
      //     update: {
      //       stripeCustomerId: stripe_customer.id,
      //     },
      //     create: {
      //       workspaceId,
      //       stripeCustomerId: stripe_customer.id,
      //     },
      //   });

      url = stripe_session.url!;
    }

    return { error: false, details: url };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "Something went wrong" };
  }
};
