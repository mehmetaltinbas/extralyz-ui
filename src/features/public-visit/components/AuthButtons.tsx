import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "src/features/auth/services/auth.service";
import { Button } from "src/shared/components/Button";
import { SendFeedbackButton } from "src/shared/components/SendFeedbackButton";
import { ButtonVariant } from "src/shared/enums/button-variant.enum";
import { useAuth } from "src/shared/hooks/use-auth.hook";
import { useBreakpoint } from "src/shared/hooks/use-breakpoint.hook";

export function AuthButtons() {
    const navigate = useNavigate();
    const { isDesktop } = useBreakpoint();
    const { isAuthenticated, setIsAuthenticated, isAuthLoading } = useAuth();

    async function handleSignOut() {
        await AuthService.signOut();
        setIsAuthenticated(false);
    }

    return ( isAuthLoading ?
        <LoaderCircle className="size-5 text-text-secondary animate-spin" />
        : 
        isAuthenticated ? (
            <div className="flex items-center gap-2">
                {isDesktop && <SendFeedbackButton />}

                <Button
                    onClick={() => navigate('/workspace')}
                >
                    {isDesktop ? 'Continue to Workspace' : 'Workspace'}
                </Button>

                <Button variant={ButtonVariant.DANGER} onClick={handleSignOut}>
                    Sign Out
                </Button>
            </div>
        ) : (
            <div className="flex items-center gap-2">
                <Button
                    variant={ButtonVariant.SECONDARY}
                    onClick={() => navigate('/sign-in')}
                >
                    Sign In
                </Button>

                <Button
                    variant={ButtonVariant.PRIMARY}
                    onClick={() => navigate('/sign-up')}
                >
                    Get Started
                </Button>
            </div>
        )
    );
}
