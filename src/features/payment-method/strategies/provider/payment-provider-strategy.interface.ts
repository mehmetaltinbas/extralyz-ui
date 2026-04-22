import type React from 'react';
import type { PaymentProviderName } from 'src/features/payment-method/enums/payment-provider-name.enum';
import type { GetAddCardFormProps } from 'src/features/payment-method/strategies/provider/types/props/get-add-card-form.props';
import type { InitializeAddResultResponse } from 'src/features/payment-method/strategies/provider/types/response/initialize-add-result.response';

export interface PaymentProviderStrategy {
    provider: PaymentProviderName;

    initializeAdd: () => Promise<InitializeAddResultResponse>;
    getAddCardForm: (props: GetAddCardFormProps) => React.JSX.Element;
    getBrandIcon: (brand: string) => React.JSX.Element;
}
