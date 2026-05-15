declare module "@cashfreepayments/cashfree-js" {
  interface CashfreeInstance {
    checkout(options: {
      paymentSessionId: string;
      redirectTarget?: "_self" | "_blank" | "_top" | "_modal" | HTMLElement;
    }): Promise<void>;
  }

  interface LoadOptions {
    mode: "sandbox" | "production";
  }

  export function load(options: LoadOptions): Promise<CashfreeInstance>;
}