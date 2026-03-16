import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserService } from 'src/features/user/services/user.service';
import type { SignUpUserDto } from 'src/features/user/types/dto/sign-up-user.dto';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputSize } from 'src/shared/enums/input-size.enum';

export function SignUpPage() {
    const [signUpDto, setSignUpDto] = React.useState<SignUpUserDto>({
        userName: '',
        email: '',
        password: '',
    });
    const [isSignedUp, setIsSignedUp] = React.useState<boolean>(false);

    async function signUp() {
        const response = await UserService.signUp(signUpDto);

        if (!response.isSuccess) {
            alert(response.message);
        }

        setIsSignedUp(response.isSuccess);
    }

    return isSignedUp ? (
        <Navigate to="/sign-in" />
    ) : (
        <div className="h-[75%] flex flex-col justify-center items-center gap-2">
            <p className=" text-lg">Sign Up</p>
            <Input
                onChange={(event) =>
                    setSignUpDto({
                        ...signUpDto,
                        userName: event.target.value,
                    })
                }
                type="text"
                size={InputSize.LG}
                placeholder="username..."
            />
            <Input
                onChange={(event) =>
                    setSignUpDto({
                        ...signUpDto,
                        email: event.target.value,
                    })
                }
                type="text"
                size={InputSize.LG}
                placeholder="email..."
            />
            <Input
                onChange={(event) =>
                    setSignUpDto({
                        ...signUpDto,
                        password: event.target.value,
                    })
                }
                type="password"
                size={InputSize.LG}
                placeholder="password..."
            />
            <Button variant={ButtonVariant.PRIMARY} onClick={signUp}>
                sign up
            </Button>
            <p>or</p>
            <Button
                variant={ButtonVariant.PRIMARY}
                onClick={(event) => (window.location.href = '/sign-in')}
            >
                sign in
            </Button>
        </div>
    );
}
