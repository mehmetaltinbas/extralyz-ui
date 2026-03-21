import { useNavigate } from 'react-router-dom';
import { AuthService } from 'src/features/auth/services/auth.service';
import { UserSearchBar } from 'src/features/user/components/UserSearchBar';
import { Button } from 'src/shared/components/Button';
import { LightDarkModeButton } from 'src/shared/components/LightDarkModeButton';
import { APP_NAME } from 'src/shared/constants/app-name.constant';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAuth } from 'src/shared/hooks/use-auth.hook';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';
import { LoadingPage } from 'src/shared/pages/LoadingPage';

export function PublicPageHeader() {
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated, isAuthLoading} = useAuth();

    const { isDesktop } = useBreakpoint();

    async function handleSignOut() {
        await AuthService.signOut();
        setIsAuthenticated(false);
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-surface border-b border-border">
            <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-2 md:gap-4">
                <div className='flex justify-center items-center gap-2 md:gap-4'>
                    {isDesktop &&
                        <span
                            className="text-lg font-bold tracking-tight cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            {APP_NAME}
                        </span>
                    }

                    <LightDarkModeButton />

                </div>

                <UserSearchBar />

                {isAuthLoading ? <LoadingPage /> : isAuthenticated ? (
                    <div className="flex items-center gap-2">
                        <Button
                            variant={ButtonVariant.PRIMARY}
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
                )}
            </div>
        </header>
    );
}
