import { FC } from 'react';
import Script from 'next/script';

interface StripeScriptProps {
  pricingTableId: string;
  publishableKey: string;
  clientReferenceId: string;
  customerEmail: string;
}

export const STRIPE_PRICING_TABLE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID || 'prctbl_1PMJvXF13HnrV5idhlPAisFn'
export const STRIPE_PUBLIC_APIKEY  = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_APIKEY || 'pk_test_51HWDddF13HnrV5idZ8U2VcwSQe9DOiBieyFrwu1qciOITRwZtKSYgjTLC9fTYyioqlDM75HClCUejd1zwAs4oMzD00iThoXYdV'

const StripeScript: FC<StripeScriptProps> = ({ pricingTableId, publishableKey, clientReferenceId, customerEmail }) => {
  return (
    <>
      <Script async src="https://js.stripe.com/v3/pricing-table.js"></Script>
      <stripe-pricing-table
        pricing-table-id={pricingTableId}
        publishable-key={publishableKey}
        client-reference-id={clientReferenceId}
        customer-email={customerEmail}>
      </stripe-pricing-table>
    </>
  );
}

export default StripeScript;
