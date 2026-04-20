import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthService } from 'src/features/auth/services/auth.service';
import type { SignInDto } from 'src/features/auth/types/dto/sign-in.dto';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputSize } from 'src/shared/enums/input-size.enum';
import { InputType } from 'src/shared/enums/input-type.enum';
import { GoogleSignInButton } from 'src/features/auth/components/GoogleSignInButton';
import { useAuth } from 'src/shared/hooks/use-auth.hook';
import { consumeAuthRedirectUrl } from 'src/shared/utils/auth-redirect/consume-auth-redirect-url.util';

export function SignInPage() {
    const [signInDto, setSignInDto] = React.useState<SignInDto>({
        userName: '',
        password: '',
    });
    const [verificationRedirectEmail, setVerificationRedirectEmail] = React.useState<string | null>(null);

    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useAuth();

    async function handleSignInSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const response = await AuthService.signIn(signInDto);

        if (response.isEmailVerificationRequired && response.email) {
            setVerificationRedirectEmail(response.email);
            return;
        }

        if (!response.isSuccess) {
            alert(response.message);
            return;
        }

        setIsAuthenticated(true);
    }

    if (verificationRedirectEmail) {
        return <Navigate to={`/verify-email?email=${encodeURIComponent(verificationRedirectEmail)}`} />;
    }

    return isAuthenticated ? (
        <Navigate to={consumeAuthRedirectUrl() || '/workspace'} />
    ) : (
        <div className='h-[75%] flex justify-center items-center relative'>
            <p onClick={() => navigate('/')} className='absolute top-4 sm:left-8 left-4 sm:left-8 text-lg font-bold tracking-tight cursor-pointer'>Home</p>

            <div className="h-auto w-48 flex flex-col justify-center items-center gap-2">
                <p className=" text-lg">Sign In</p>
                
                <Input
                    onChange={(event) =>
                        setSignInDto({
                            ...signInDto,
                            userName: event.target.value,
                        })
                    }
                    size={InputSize.LG}
                    value={signInDto.userName}
                    placeholder="username..."
                />

                <Input
                    onChange={(event) =>
                        setSignInDto({
                            ...signInDto,
                            password: event.target.value,
                        })
                    }
                    value={signInDto.password}
                    type={InputType.PASSWORD}
                    size={InputSize.LG}
                    placeholder="password..."
                />

                <Button variant={ButtonVariant.PRIMARY} onClick={handleSignInSubmit}>
                    Sign In
                </Button>

                <p onClick={() => navigate('/forgot-password')} className="text-sm text-text-secondary cursor-pointer hover:underline">
                    forgot password?
                </p>

                <p>or</p>

                <GoogleSignInButton />

                <p>or</p>

                <Button
                    variant={ButtonVariant.PRIMARY}
                    onClick={(event) => (window.location.href = '/sign-up')}
                >
                    Sign Up
                </Button>
            </div>
        </div>
    );
}
