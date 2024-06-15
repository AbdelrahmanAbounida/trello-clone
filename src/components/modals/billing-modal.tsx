"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createSubscriptionSession } from "@/actions/stripe/create-session";
import { useWSSubscription } from "@/hooks/use-ws-subscription";

const BillingModal = ({ workspaceId }: { workspaceId: string }) => {
  const [loading, setloading] = useState(false);
  const { data: isSubscribed, isLoading: subLoading } =
    useWSSubscription(workspaceId);

  const handleSubscription = async () => {
    try {
      setloading(true);
      const res = await createSubscriptionSession({ workspaceId });
      if (res?.error) {
        toast.error(res.details);
      } else {
        const url = res.details;
        console.log({ url });
        window.location.href = url;
      }
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong");
    } finally {
      setloading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          type="submit"
          variant={"secondary"}
          className="bg-sky-700 w-[210px] hover:bg-sky-600 text-white  transition-transform transform scale-100 active:scale-[0.97]"
        >
          {!subLoading && (isSubscribed ? "Manage Subscription" : "Upgrade")}
        </Button>
      </DialogTrigger>

      <DialogContent className=" gap-1">
        <DialogHeader>
          {/* */}
          <img className="w-full h-72" src="/assets/payment.jpg" />
        </DialogHeader>

        <DialogTitle className="p-0 mt-3  w-full flex text-2xl text-left items-center justify-left dark:text-white text-zinc-800">
          {!subLoading &&
            (isSubscribed
              ? "Mange Your subscription"
              : "Upgrade to Trellofy Pro Today!")}
        </DialogTitle>
        <DialogDescription className="text-left p-0 ">
          Explore the best of Trellofy
        </DialogDescription>
        <ul className="mt-2 list-disc ml-5 text-md text-zinc-600 text-[15px]">
          <li>Unlimited boards</li>
          <li>Advanced checklists</li>
          <li>Admin and security features</li>
          <li>And more!</li>
        </ul>

        <DialogFooter className="mt-7">
          <Button
            onClick={handleSubscription}
            disabled={loading}
            className="w-3/4 bg-sky-700 hover:bg-sky-600 transition-all hover:opaciyt-90 opacity-100"
          >
            {!subLoading && (isSubscribed ? "Manage Subscription" : "Upgrade")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BillingModal;
