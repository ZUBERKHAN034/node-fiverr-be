import Stripe from 'stripe';
import utility from './utility';
import constants from '../common/constants';
class StripeHelper {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
  });

  public async createCustomer(params: { email: string; name?: string; description?: string }): Promise<string> {
    try {
      const paramsCustomer: Stripe.CustomerCreateParams = {
        email: params.email,
        name: params.name,
        description: params.description,
      };
      const customer = await this.stripe.customers.create(paramsCustomer);
      return customer.id;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getCustomers(params?: Stripe.CustomerListParams, options?: Stripe.RequestOptions): Promise<any | null> {
    try {
      const customers = await this.stripe.customers.list(params, options);
      return customers.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async customerByEmail(email: string): Promise<any | null> {
    try {
      const paramsCustomer: Stripe.CustomerListParams = {
        email: email,
        limit: 1,
      };
      const customer = await this.stripe.customers.list(paramsCustomer);
      return customer.data[0] ? customer.data[0] : null;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async customerById(id: string): Promise<any | null> {
    try {
      return await this.stripe.customers.retrieve(id);
    } catch (error) {
      return error.code === 'resource_missing' ? null : { status: false, error: error.type, message: error.message };
    }
  }

  public async createCardToken(params: {
    number: string;
    expMonth: string;
    expYear: string;
    cvc: string;
  }): Promise<any> {
    try {
      const paramsCardToken: Stripe.TokenCreateParams = {
        card: {
          number: params.number,
          exp_month: params.expMonth,
          exp_year: params.expYear,
          cvc: params.cvc,
        },
      };
      return await this.stripe.tokens.create(paramsCardToken);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addCardToCustomer(id: string, cardToken: string): Promise<any> {
    try {
      const paramsCardSource: Stripe.CustomerSourceCreateParams = {
        source: cardToken,
      };

      return await this.stripe.customers.createSource(id, paramsCardSource);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async paymentCustomerById(params: {
    id: string;
    currency: string;
    amount: number;
    description?: string;
  }): Promise<any> {
    try {
      const paramsCharge: Stripe.PaymentIntentCreateParams = {
        customer: params.id,
        currency: params.currency,
        amount: params.amount * 100,
        description: params.description,
        payment_method_types: ['card'],
      };

      const intent = await this.stripe.paymentIntents.create(paramsCharge);
      const cardType = 'pm_card_visa'; // need to be dynamically changed
      return await this.stripe.paymentIntents.confirm(intent.id, {
        payment_method: cardType,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async createCheckoutSession(
    mode: Stripe.Checkout.SessionCreateParams.Mode,
    params: {
      customerId: string;
      productId: string;
      productName: string;
      productDescription: string;
      productImage: string;
      price: number;
    },
    metadata?: { productId?: string; subscriptionId?: string; orderId?: string }
  ): Promise<string> {
    try {
      const DOMAIN_URL = constants.ENUMS.FE_BASE_URL;
      let SUCCESS_URL = `/success`;
      let CANCEL_URL = `/failure`;

      const amountToCharge = params.price * 100;

      if (!utility.isEmpty(params.productId)) {
        SUCCESS_URL = `/gig/${params.productId}`;
        CANCEL_URL = `/gig/${params.productId}`;
      }

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        customer: params.customerId,
        mode: mode,
        metadata: {},
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              unit_amount: amountToCharge,
              currency: 'inr',
              product_data: {
                name: params.productName,
                description: params.productDescription,
                images: [params.productImage],
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${DOMAIN_URL}${SUCCESS_URL}?success=true`,
        cancel_url: `${DOMAIN_URL}${CANCEL_URL}?canceled=true`,
      };

      if (!utility.isEmpty(metadata)) {
        if (!utility.isEmpty(metadata.productId)) {
          sessionParams.metadata.productId = metadata.productId;
        }
        if (!utility.isEmpty(metadata.subscriptionId)) {
          sessionParams.metadata.subscriptionId = metadata.subscriptionId;
        }
        if (!utility.isEmpty(metadata.orderId)) {
          sessionParams.metadata.orderId = metadata.orderId;
        }
      }

      const { url } = await this.stripe.checkout.sessions.create(sessionParams);
      return url;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async checkoutSessionById(sessionId: string): Promise<any | null> {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      return error.code === 'resource_missing' ? null : { status: false, error: error.type, message: error.message };
    }
  }

  public async createWebhook(requestBody: any, signature: string): Promise<any> {
    try {
      const event = this.stripe.webhooks.constructEvent(requestBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
      return { type: event.type, data: event.data.object };
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getSubscription(customerId: string): Promise<string> {
    try {
      const paramsSubscriptions: Stripe.SubscriptionListParams = {
        customer: customerId,
        limit: 1,
      };
      const subscriptions = await this.stripe.subscriptions.list(paramsSubscriptions);
      return subscriptions.data[0] ? subscriptions.data[0].id : null;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async delSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.stripe.subscriptions.del(subscriptionId);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async createProduct(params: {
    name: string;
    price: number;
    currency: string;
    recurring: boolean;
    interval?: string;
  }): Promise<string> {
    try {
      const product = await this.stripe.products.create({
        name: params.name,
      });
      const priceParams = {
        unit_amount: params.price * 100,
        currency: params.currency,
        product: product.id,
      };
      if (params.recurring === true) {
        priceParams['recurring'] = { interval: params.interval };
      }
      const price = await this.stripe.prices.create(priceParams as Stripe.PriceCreateParams);
      return price.id;
    } catch (error) {
      throw new Error(error);
    }
  }
  public async getReceipt(chargeId: string): Promise<string> {
    try {
      const charge = await this.stripe.charges.retrieve(chargeId);
      return charge.receipt_url;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new StripeHelper();
