export interface GetAddCardFormProps {
    initPayload: unknown;
    onTokenized: (token: string) => void;
    onError: (message: string) => void;
    onCancel: () => void;
}
