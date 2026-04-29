import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoogleSignInButton } from 'src/features/auth/components/GoogleSignInButton';
import { AuthService } from 'src/features/auth/services/auth.service';
import type { SignUpUserDto } from 'src/features/auth/types/dto/sign-up.dto';
import { UserOccupation } from 'src/features/user/enums/user-occupation.enum';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputSize } from 'src/shared/enums/input-size.enum';
import { InputType } from 'src/shared/enums/input-type.enum';
import { camelToTitleCase } from 'src/shared/utils/camel-to-title-case.util';

export function SignUpPage() {
    const [dto, setDto] = React.useState<SignUpUserDto>({
        userName: '',
        email: '',
        password: '',
        allowsMarketing: false,
        occupation: ''
    });
    const [isSignedUp, setIsSignedUp] = React.useState<boolean>(false);
    
    // Track if the user selected 'other' in the dropdown
    const [isOtherOccupation, setIsOtherOccupation] = React.useState<boolean>(false);
    
    const navigate = useNavigate();

    async function signUp() {
        const response = await AuthService.signUp(dto);

        alert(response.message);

        setIsSignedUp(response.isSuccess);
    }

    return isSignedUp ? (
        <Navigate to={`/verify-email?email=${encodeURIComponent(dto.email)}`} />
    ) : (
        <div className='h-[75%] flex justify-center items-center'>
            <p onClick={() => navigate('/')} className='absolute top-4 sm:left-8 left-4 sm:left-8 text-lg font-bold tracking-tight cursor-pointer'>Home</p>

            <div className="h-auto w-48 flex flex-col justify-center items-center gap-2">
                <p className=" text-lg">Sign Up</p>

                <Input
                    onChange={(event) =>
                        setDto({
                            ...dto,
                            userName: event.target.value,
                        })
                    }
                    size={InputSize.LG}
                    placeholder="userName..."
                />

                <Input
                    onChange={(event) =>
                        setDto({
                            ...dto,
                            email: event.target.value,
                        })
                    }
                    size={InputSize.LG}
                    placeholder="email..."
                />

                <Input
                    onChange={(event) =>
                        setDto({
                            ...dto,
                            password: event.target.value,
                        })
                    }
                    type={InputType.PASSWORD}
                    size={InputSize.LG}
                    placeholder={InputType.PASSWORD}
                />

                <div className="flex flex-col w-full gap-2">
                    <div className="flex justify-start items-center gap-2">
                        <p>Occupation: </p>
                        <select
                            // Ensure the dropdown displays "Other" when the custom mode is active
                            value={isOtherOccupation ? 'other' : dto.occupation}
                            onChange={(e) => {
                                const value = e.currentTarget.value;
                                if (value === 'other') {
                                    setIsOtherOccupation(true);
                                    setDto({ ...dto, occupation: '' }); // Clear the value for custom input
                                } else {
                                    setIsOtherOccupation(false);
                                    setDto({ ...dto, occupation: value }); // Set standard enum value
                                }
                            }}
                            className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                        >
                            <option value="" disabled>Select...</option>
                            {Object.values(UserOccupation).map((val, index) => (
                                <option key={`occupation-${index}`} value={val}>{camelToTitleCase(val)}</option>
                            ))}
                            <option key={`occupation-${Object.values(UserOccupation).length + 1}`} value={'other'}>Other</option>
                        </select>
                    </div>

                    {/* Conditionally render the custom input if 'Other' is selected */}
                    {isOtherOccupation && (
                        <Input
                            value={dto.occupation}
                            onChange={(event) =>
                                setDto({
                                    ...dto,
                                    occupation: event.target.value,
                                })
                            }
                            size={InputSize.LG}
                            placeholder="Type your occupation..."
                        />
                    )}
                </div>

                <div className='flex justify-start items-center gap-2'>
                    <Input
                        onChange={(event) =>
                            setDto({
                                ...dto,
                                allowsMarketing: Boolean(event.target.checked ?? event.target.value),
                            })
                        }
                        type={InputType.CHECKBOX}
                        size={InputSize.LG}
                    />

                    <label className='whitespace-nowrap'>Send me study tips & updates</label>
                </div>
                
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
