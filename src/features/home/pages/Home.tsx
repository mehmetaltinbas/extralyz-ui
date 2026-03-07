import { useNavigate } from 'react-router-dom';
import { features } from 'src/features/home/constants/features.constant';
import { Button } from 'src/shared/components/Button';
import { APP_NAME } from 'src/shared/constants/app-name.constant';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function Home() {
    const navigate = useNavigate();

    function handleGetStarted() {
        navigate('/sign-up');
    }

    function handleSignIn() {
        navigate('/sign-in');
    }

    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between">
                    <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>

                    <div className="flex items-center gap-3">
                        <Button variant={ButtonVariant.SECONDARY} onClick={handleSignIn}>
                            Sign In
                        </Button>

                        <Button variant={ButtonVariant.PRIMARY} onClick={handleGetStarted}>
                            Get Started
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="w-full flex flex-col justify-center items-center px-8 py-20">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
                    <h1 className="text-5xl font-bold leading-tight tracking-tight">
                        Turn Your Documents Into
                        <br />
                        Practice Exercises
                    </h1>

                    <p className="text-xl text-gray-500 max-w-2xl">
                        AI-powered platform that converts your study materials into custom
                        exercise sets for active recall — then grades your answers
                        automatically.
                    </p>

                    <div className="flex items-center gap-4 mt-4">
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
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full flex flex-col items-center px-8 py-16 bg-white">
                <div className="max-w-5xl w-full">
                    <h2 className="text-3xl font-bold text-center pb-12 tracking-tight">
                        Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-[10px] p-8 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-600">
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>

                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full flex flex-col items-center bg-gray-50 py-8 mt-auto">
                <div className="max-w-6xl w-full px-8">
                    <p className="text-sm text-gray-400 text-center">
                        Copyright © 2025 {APP_NAME}. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
