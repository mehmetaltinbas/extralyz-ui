import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from 'src/features/auth/services/auth.service';
import type { SignInDto } from 'src/features/auth/types/auth-dtos';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function SignInPage() {
    const [signInDto, setSignInDto] = React.useState<SignInDto>({
        userName: '',
        password: '',
    });
    const [isSignedIn, setIsSignedIn] = React.useState<boolean>(false);

    async function handleSignInSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const response = await authService.signIn(signInDto);

        if (!response.isSuccess)
            alert(response.message);

        setIsSignedIn(response.isSuccess);
    }

    return isSignedIn ? (
        <Navigate to="/workspace" />
    ) : (
        <div className="h-[75%] flex flex-col justify-center items-center gap-2">
            <p className=" text-lg">Sign In</p>
            <input
                onChange={(event) =>
                    setSignInDto({
                        ...signInDto,
                        userName: event.target.value,
                    })
                }
                type="text"
                value={signInDto.userName}
                placeholder="username..."
                className="p-2 border rounded-full"
            />
            <input
                onChange={(event) =>
                    setSignInDto({
                        ...signInDto,
                        password: event.target.value,
                    })
                }
                value={signInDto.password}
                type="password"
                placeholder="password..."
                className="p-2 border rounded-full"
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
    );
}
