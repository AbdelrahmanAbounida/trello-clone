"use server";

import { prismadb } from "@/lib/db";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const validateSubscription = async ({
  workspaceId,
}: {
  workspaceId: string;
}): Promise<Boolean> => {
  const ws_sub = await prismadb.workspaceSubscription.findFirst({
    where: {
      workspaceId,
    },
  });

  if (!ws_sub) {
    return false;
  }

  const isValid =
    ws_sub.stripePriceId &&
    ws_sub.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();
  return !!isValid;
};
