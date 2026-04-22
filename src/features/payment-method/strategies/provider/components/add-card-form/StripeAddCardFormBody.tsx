import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React from 'react';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function StripeAddCardFormBody({
    clientSecret,
    onTokenized,
    onError,
    onCancel,
}: {
    clientSecret: string;
    onTokenized: (token: string) => void;
    onError: (message: string) => void;
    onCancel: () => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    async function handleSubmit() {
        const cardElement = stripe && elements ? elements.getElement(CardElement) : null;
        if (stripe && cardElement) {
            setIsSubmitting(true);

            const result = await stripe.confirmCardSetup(clientSecret, {
                payment_method: { card: cardElement },
            });

            setIsSubmitting(false);

            const paymentMethodId = result.setupIntent?.payment_method;
            if (result.error) {
                onError(result.error.message ?? 'Could not save card');
            } else if (typeof paymentMethodId !== 'string') {
                onError('Stripe did not return a payment method');
            } else {
                onTokenized(paymentMethodId);
            }
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="border border-border rounded-md px-3 py-2.5 bg-surface">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '14px',
                                color: 'var(--color-text-primary, #111)',
                                '::placeholder': { color: '#888' },
                            },
                            invalid: { color: '#d33' },
                        },
                    }}
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.SM}
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    variant={ButtonVariant.PRIMARY}
                    size={ButtonSize.SM}
                    onClick={handleSubmit}
                    disabled={!stripe || !elements || isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save card'}
                </Button>
            </div>
        </div>
    );
}
