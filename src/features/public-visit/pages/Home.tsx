import { useNavigate } from 'react-router-dom';
import { PricingSection } from 'src/features/public-visit/components/PricingSection';
import { PublicPageHeader } from 'src/features/public-visit/components/PublicPageHeader';
import { FEATURES } from 'src/features/public-visit/constants/features.constant';
import { UserPopupsProvider } from 'src/features/user/components/UserPopupsProvider';
import { Button } from 'src/shared/components/Button';
import { APP_NAME } from 'src/shared/constants/app-name.constant';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAuth } from 'src/shared/hooks/use-auth.hook';
import { LoadingPage } from 'src/shared/pages/LoadingPage';

export function Home() {
    const navigate = useNavigate();
    const { isAuthenticated, isAuthLoading} = useAuth();

    function handleGetStarted() {
        navigate('/sign-up');
    }

    function handleSignIn() {
        navigate('/sign-in');
    }

    function handleContinueToWorkspace() {
        navigate('/workspace');
    }

    return (
        <UserPopupsProvider>
        <div className="w-full min-h-screen flex flex-col">
            {/* Navigation Header */}
            <PublicPageHeader />

            {/* Hero Section */}
            <section className="w-full flex flex-col justify-center items-center px-4 sm:px-8 py-20">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
                    <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight md:hidden">{APP_NAME}</h1>
                    <h2 className="text-2xl md:text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
                        Stop Passive Reading
                        <br />
                        Start Active Recalling
                    </h2>

                    <p className="text-xl text-text-secondary max-w-2xl">
                        Convert your notes, audio, and videos into interactive practice automatically with AI, or build custom exercise sets from scratch manually. Master any subject faster with AI-powered automated grading for open-ended exercises.
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                        {isAuthLoading? <LoadingPage /> : isAuthenticated ? (
                            <Button
                                variant={ButtonVariant.PRIMARY}
                                onClick={handleContinueToWorkspace}
                            >
                                Continue to Workspace
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant={ButtonVariant.PRIMARY}
                                    onClick={handleGetStarted}
                                >
                                    Get Started
                                </Button>

                                <Button
                                    variant={ButtonVariant.SECONDARY}
                                    onClick={handleSignIn}
                                >
                                    Sign In
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full flex flex-col items-center px-8 py-16 bg-surface">
                <div className="max-w-5xl w-full">
                    <h2 className="text-3xl font-bold text-center pb-12 tracking-tight">
                        Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {FEATURES.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-[10px] p-8 bg-surface-alt hover:bg-surface-hover transition-colors"
                            >
                                <div className='flex justify-start items-center gap-2'>
                                    <div className="w-10 h-10 bg-surface-hover rounded-full flex items-center justify-center mb-4 text-text-secondary">
                                        {feature.icon}
                                    </div>

                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                </div>


                                <p className="text-text-secondary leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <PricingSection />

            {/* Footer */}
            <footer className="w-full flex flex-col items-center bg-surface-alt py-8 mt-auto">
                <div className="max-w-6xl w-full px-8">
                    <p className="text-sm text-text-muted text-center">
                        Copyright © 2026 {APP_NAME}. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
        </UserPopupsProvider>
    );
}
