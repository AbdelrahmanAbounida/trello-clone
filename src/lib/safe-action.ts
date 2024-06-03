import { createSafeActionClient } from "next-safe-action";

// a client for safe-action lib (a helper lib for calling server actions)
export const actionClient = createSafeActionClient();
