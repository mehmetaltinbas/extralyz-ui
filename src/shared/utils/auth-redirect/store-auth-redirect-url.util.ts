import { REDIRECT_KEY } from "src/shared/constants/redirect-after-auth-key.constant";

export function storeAuthRedirectUrl(url: string): void {
    sessionStorage.setItem(REDIRECT_KEY, url);
}
