import { prismadb } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const session = event.data.object as Stripe.Checkout.Session;
    const workspaceId = session.metadata?.workspaceId;

    if (!workspaceId) {
      return NextResponse.json(
        { error: "webhook error missing  workspaceId" },
        { status: 400 }
      );
    }

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // first time handle subscription
    if (event.type === "checkout.session.completed") {
      const newWssub = await prismadb.workspaceSubscription.create({
        data: {
          workspaceId,
          stripeCustomerId: (subscription.customer as Stripe.Customer).id,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
    }

    // monthly pay
    else if (event.type == "invoice.payment_succeeded") {
      await prismadb.workspaceSubscription.update({
        where: {
          // workspaceId,
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
    } else {
      return NextResponse.json(
        { error: "Webhook error: unhandled event" },
        { status: 200 }
      );
    }
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 }
    );
  }
}
