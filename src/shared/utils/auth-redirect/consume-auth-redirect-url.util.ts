import { REDIRECT_KEY } from "src/shared/constants/redirect-after-auth-key.constant";

export function consumeAuthRedirectUrl(): string | null {
    const url = sessionStorage.getItem(REDIRECT_KEY);

    sessionStorage.removeItem(REDIRECT_KEY);

    return url;
}
