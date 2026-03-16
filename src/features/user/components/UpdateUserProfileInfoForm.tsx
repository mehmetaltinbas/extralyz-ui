import React from 'react';
import { UserService } from 'src/features/user/services/user.service';
import { userActions } from 'src/features/user/store/user.slice';
import type { UpdateUserDto } from 'src/features/user/types/dto/update-user.dto';
import type { User } from 'src/features/user/types/user.interface';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function UpdateUserProfileInfoForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    onClose,
    user,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    user: User;
}) {
    const dispatch = useAppDispatch();

    const initialDto: UpdateUserDto = {
        userName: user.userName,
        email: user.email,
    };
    const [dto, setDto] = React.useState<UpdateUserDto>(initialDto);

    React.useEffect(() => {
        setDto(initialDto);
    }, [isHidden, user]);

    async function update() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await UserService.updateByToken(dto);

            if (!response.isSuccess) {
                alert(response.message);
                setIsHidden(false);
            } else {
                dispatch(userActions.fetchData());
                setIsPopUpActive(false);
            }
        } catch (error) {
            alert('internal error');
            setIsHidden(false);
        } finally {
            setIsLoadingPageHidden(true);
        }
    }

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div className="flex flex-col gap-2">
                <div className="flex justify-center items-center gap-2">
                    <p>userName: </p>
                    <Input
                        value={dto.userName}
                        onChange={(e) =>
                            setDto({
                                ...dto,
                                userName: e.currentTarget.value,
                            })
                        }
                    />
                </div>

                <div className="flex justify-center items-center gap-2">
                    <p>email: </p>
                    <Input
                        value={dto.email}
                        onChange={(e) =>
                            setDto({
                                ...dto,
                                email: e.currentTarget.value,
                            })
                        }
                    />
                </div>
            </div>

            <Button
                variant={ButtonVariant.PRIMARY}
                onClick={async (event) => await update()}
            >
                Update
            </Button>
        </Modal>
    );
}
