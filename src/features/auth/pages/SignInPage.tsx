import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthService } from 'src/features/auth/services/auth.service';
import type { SignInDto } from 'src/features/auth/types/auth-dtos';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputSize } from 'src/shared/enums/input-size.enum';
import { InputType } from 'src/shared/enums/input-type.enum';
import { consumeAuthRedirectUrl } from 'src/shared/utils/auth-redirect/consume-auth-redirect-url.util';

export function SignInPage() {
    const [signInDto, setSignInDto] = React.useState<SignInDto>({
        userName: '',
        password: '',
    });
    const [isSignedIn, setIsSignedIn] = React.useState<boolean>(false);

    const navigate = useNavigate();

    async function handleSignInSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const response = await AuthService.signIn(signInDto);

        if (!response.isSuccess)
            alert(response.message);

        setIsSignedIn(response.isSuccess);
    }

    return isSignedIn ? (
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
                    sign in
                </Button>
                <p>or</p>
                <Button
                    variant={ButtonVariant.PRIMARY}
                    onClick={(event) => (window.location.href = '/sign-up')}
                >
                    sign up
                </Button>
            </div>
        </div>
    );
}
