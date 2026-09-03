"use client";

import { useSuspenseQuery } from "@tanstack/react-query"; // 'useSuspense...

import { useTRPC } from "@/trpc/client"; // 'useTRPC' is defined but neve...
import { authClient } from "@/lib/auth-client"; // 'authClient' is defin...
import { ErrorState } from "@/components/error-state"; // 'ErrorState' is...
import { LoadingState } from "@/components/loading-state"; // 'LoadingSta...
import { PricingCard } from "../components/pricing-card";

// Polar returns currency codes lowercased.
const DISPLAY_CURRENCY = "usd";

export const UpgradeView = () => {
  const trpc = useTRPC();

  const { data: products } = useSuspenseQuery(
    trpc.premium.getProducts.queryOptions(),
  );

  const { data: currentSubscription } = useSuspenseQuery(
    trpc.premium.getCurrentSubscription.queryOptions(),
  );
  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-10">
      <div className="mt-4 flex-1 flex flex-col gap-y-10 items-center">
        <h5 className="font-medium text-2xl md:text-3xl">
          You are on the{" "}
          <span className="font-semibold text-primary">
            {currentSubscription?.name ?? "Free"}
          </span>{" "}
          plan
        </h5>
       <div className="flex flex-wrap justify-center gap-4 w-full">
  {products.map((product) => {
  const isCurrentProduct = currentSubscription?.id === product.id;
  const isPremium = !!currentSubscription;

  let buttonText = "Upgrade";
  let onClick = () => authClient.checkout({ products: [product.id] });

  if (isCurrentProduct) {
    buttonText = "Manage";
    onClick = () => authClient.customer.portal();
  } else if (isPremium) {
    buttonText = "Change Plan";
    onClick = () => authClient.customer.portal();
  }

  // A product can carry one active price per currency (plus archived ones
  // kept for history), so neither prices[0] nor "first non-archived" is
  // reliably the one to show. Match the display currency explicitly.
  const livePrices = product.prices.filter((price) => !price.isArchived);
  const activePrice =
    livePrices.find((price) => price.priceCurrency === DISPLAY_CURRENCY) ??
    livePrices[0] ??
    product.prices[0];

  return (
    <PricingCard
      key={product.id}
      className="max-w-sm"
      buttonText={buttonText}
      onClick={onClick}
      variant={
        product.metadata.variant === "highlighted"
          ? "highlighted"
          : "default"
      }
      title={product.name}
      price={
        activePrice.amountType === "fixed"
          ? activePrice.priceAmount / 100
          : 0
      }
      description={product.description}
      currency={activePrice.priceCurrency}
      priceSuffix={`/${product.recurringInterval}`}
      features={product.benefits.map(
        (benefit) => benefit.description
      )}
      badge={product.metadata.badge as string | null}
    />
  );
})}
</div>
      </div>
    </div>
  );
};

export const UpgradeViewLoading = () => {
  return (
    <LoadingState title="Loading" description="This may take a few seconds" />
  );
};

export const UpgradeViewError = () => {
  return <ErrorState title="Error" description="Please try again later" />;
};
