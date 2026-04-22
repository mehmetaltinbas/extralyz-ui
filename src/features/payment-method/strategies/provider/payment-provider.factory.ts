import { StripePaymentProviderStrategy } from 'src/features/payment-method/strategies/provider/implementations/stripe-payment-provider.strategy';
import type { PaymentProviderStrategy } from 'src/features/payment-method/strategies/provider/payment-provider-strategy.interface';
import { PaymentProviderName } from 'src/features/subscription/enums/payment-provider-name.enum';
import type { StrategyFactory } from 'src/shared/types/strategy-factory.interface';

const map: Map<PaymentProviderName, PaymentProviderStrategy> = new Map([
    [PaymentProviderName.STRIPE, new StripePaymentProviderStrategy()],
]);

export const paymentProviderFactory: StrategyFactory<PaymentProviderName, PaymentProviderStrategy> = {
    resolveStrategy: function (kind: PaymentProviderName): PaymentProviderStrategy | undefined {
        return map.get(kind);
    },
};
