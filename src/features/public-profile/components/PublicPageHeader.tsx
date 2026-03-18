import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from 'src/features/auth/services/auth.service';
import { Button } from 'src/shared/components/Button';
import { APP_NAME } from 'src/shared/constants/app-name.constant';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function PublicPageHeader() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        async function checkAuth() {
            const response = await AuthService.authorize();
            setIsAuthenticated(response.isSuccess);
        }

        checkAuth();
    }, []);

    async function handleSignOut() {
        await AuthService.signOut();
        setIsAuthenticated(false);
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-surface border-b border-border">
            <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
                <span
                    className="text-lg font-bold tracking-tight cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    {APP_NAME}
                </span>

                {isAuthenticated === null ? null : isAuthenticated ? (
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            variant={ButtonVariant.PRIMARY}
                            onClick={() => navigate('/workspace')}
                        >
                            Continue to Workspace
                        </Button>

                        <Button variant={ButtonVariant.DANGER} onClick={handleSignOut}>
                            Sign Out
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 flex-wrap">
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
