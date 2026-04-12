import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoogleSignInButton } from 'src/features/auth/components/GoogleSignInButton';
import { AuthService } from 'src/features/auth/services/auth.service';
import type { SignUpUserDto } from 'src/features/auth/types/dto/sign-up.dto';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputSize } from 'src/shared/enums/input-size.enum';
import { InputType } from 'src/shared/enums/input-type.enum';

export function SignUpPage() {
    const [signUpDto, setSignUpDto] = React.useState<SignUpUserDto>({
        userName: '',
        email: '',
        password: '',
    });
    const [isSignedUp, setIsSignedUp] = React.useState<boolean>(false);
    
    const navigate = useNavigate();

    async function signUp() {
        const response = await AuthService.signUp(signUpDto);

        alert(response.message);

        setIsSignedUp(response.isSuccess);
    }

    return isSignedUp ? (
        <Navigate to={`/verify-email?email=${encodeURIComponent(signUpDto.email)}`} />
    ) : (
        <div className='h-[75%] flex justify-center items-center'>
            <p onClick={() => navigate('/')} className='absolute top-4 sm:left-8 left-4 sm:left-8 text-lg font-bold tracking-tight cursor-pointer'>Home</p>

            <div className="h-auto w-48 flex flex-col justify-center items-center gap-2">
                <p className=" text-lg">Sign Up</p>

                <Input
                    onChange={(event) =>
                        setSignUpDto({
                            ...signUpDto,
                            userName: event.target.value,
                        })
                    }
                    size={InputSize.LG}
                    placeholder="userName..."
                />

                <Input
                    onChange={(event) =>
                        setSignUpDto({
                            ...signUpDto,
                            email: event.target.value,
                        })
                    }
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
                    type={InputType.PASSWORD}
                    size={InputSize.LG}
                    placeholder={InputType.PASSWORD}
                />
                
                <Button variant={ButtonVariant.PRIMARY} onClick={signUp}>
                    Sign Up
                </Button>

                <p>or</p>

                <GoogleSignInButton />
                
                <p>or</p>

                <Button
                    variant={ButtonVariant.PRIMARY}
                    onClick={(event) => (window.location.href = '/sign-in')}
                >
                    Sign In
                </Button>
            </div>
        </div>
    );
}
