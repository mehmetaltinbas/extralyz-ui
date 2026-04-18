import { ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthButtons } from 'src/features/public-visit/components/AuthButtons';
import { UserSearchBar } from 'src/features/user/components/UserSearchBar';
import { Button } from 'src/shared/components/Button';
import { LightDarkModeButton } from 'src/shared/components/LightDarkModeButton';
import { SendFeedbackButton } from 'src/shared/components/SendFeedbackButton';
import { APP_NAME } from 'src/shared/constants/app-name.constant';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAuth } from 'src/shared/hooks/use-auth.hook';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';

export function PublicPageHeader() {
    const navigate = useNavigate();

    const { isMobile } = useBreakpoint();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const { isAuthenticated } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full bg-surface border-b border-border">
            <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-2 md:gap-4">
                {isMobile ? (
                    isSearchOpen ? (
                        <>
                            <Button
                                variant={ButtonVariant.ICON}
                                onClick={() => setIsSearchOpen(false)}
                            >
                                <ArrowLeft size={20} />
                            </Button>

                            <div className="flex-1">
                                <UserSearchBar />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <span
                                    className="text-lg font-bold tracking-tight cursor-pointer"
                                    onClick={() => navigate('/')}
                                >
                                    {APP_NAME}
                                </span>

                                <LightDarkModeButton />

                                <Button
                                    variant={ButtonVariant.ICON}
                                    onClick={() => setIsSearchOpen(true)}
                                >
                                    <Search size={20} />
                                </Button>

                                {isAuthenticated && <SendFeedbackButton />}
                            </div>

                            <AuthButtons />
                        </>
                    )
                ) : (
                    <>
                        <div className='flex justify-center items-center gap-2 md:gap-4'>
                            <span
                                className="text-lg font-bold tracking-tight cursor-pointer"
                                onClick={() => navigate('/')}
                            >
                                {APP_NAME}
                            </span>

                            <LightDarkModeButton />
                        </div>

                        <UserSearchBar />

                        <AuthButtons />
                    </>
                )}
            </div>
        </header>
    );
}
