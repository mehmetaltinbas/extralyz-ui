import React from 'react';
import { SourceService } from 'src/features/source/services/source.service';
import type { UpdateSourceDto } from 'src/features/source/types/dto/update-source.dto';
import type { Source } from 'src/features/source/types/source.interface';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function UpdateSourceForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    toggle,
    refreshData,
    source,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    toggle: () => void;
    refreshData: () => void;
    source: Source;
}) {
    const dispatch = useAppDispatch();

    const initialDto: UpdateSourceDto = {
        title: source.title,
    };
    const [dto, setDto] = React.useState<UpdateSourceDto>(initialDto);

    React.useEffect(() => {
        setDto(initialDto);
    }, [isHidden, source]);

    async function update() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await SourceService.updateById(
                source._id,
                dto
            );

            if (!response.isSuccess) {
                alert(response.message);
                setIsHidden(false);
            } else {
                refreshData();

                dispatch(tabsActions.invalidateTabPropsById(source._id));

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
        <Modal isHidden={isHidden} onClose={toggle}>
            <div className="flex justify-start items-center gap-2">
                <div className="flex justify-start items-center gap-2">
                    <p>title: </p>
                    <input
                        value={dto.title}
                        onChange={(e) =>
                            setDto({
                                ...dto,
                                title: e.currentTarget.value,
                            })
                        }
                        className="w-64 py-[2px] px-2 border rounded-[10px]"
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
