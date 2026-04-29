import React from 'react';
import { ExerciseGenerationMode } from 'src/features/exercise-set/enums/exercise-generation-mode.enum';
import { ExerciseSetContextType } from 'src/features/exercise-set/enums/exercise-set-context-type.enum';
import { ExerciseSetType } from 'src/features/exercise-set/enums/exercise-set-type.enum';
import { ExerciseSetVisibility } from 'src/features/exercise-set/enums/exercise-set-visibility.enum';
import { ExerciseSetDifficulty } from 'src/features/exercise-set/enums/exericse-set-difficulty.enum';
import { ExerciseSetEstimateService } from 'src/features/exercise-set/services/exercise-set-estimate.service';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { refreshExerciseSetsData } from 'src/features/exercise-set/store/thunks/refresh-exercise-sets-data.thunk';
import type { CreateExerciseSetDto } from 'src/features/exercise-set/types/dto/create-exercise-set.dto';
import { userActions } from 'src/features/user/store/user.slice';
import { Button } from 'src/shared/components/Button';
import { InformationText } from 'src/shared/components/InformationText';
import { Input } from 'src/shared/components/Input';
import { InsufficientCreditsNotice } from 'src/shared/components/InsufficientCreditsNotice';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InformationTextSize } from 'src/shared/enums/information-text-size.enum';
import { InputType } from 'src/shared/enums/input-type.enum';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';
import { useCreditEstimate } from 'src/shared/hooks/use-credit-estimate.hook';
import { camelToTitleCase } from 'src/shared/utils/camel-to-title-case.util';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function CreateExerciseSetForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    onClose,
    sourceId,
    setIsLoadingPageHidden,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    sourceId: string | undefined;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const dispatch = useAppDispatch();

    const { isDesktop } = useBreakpoint();

    const sources = useAppSelector((state) => state.sources);
    const groups = useAppSelector((state) => state.exerciseSetGroups);

    const initialDto: CreateExerciseSetDto = {
        contextType: sourceId ? ExerciseSetContextType.SOURCE : ExerciseSetContextType.INDEPENDENT,
        title: '',
        type: ExerciseSetType.MIX,
        difficulty: ExerciseSetDifficulty.MIX,
        count: 0,
        visibility: ExerciseSetVisibility.PRIVATE,
        generationMode: ExerciseGenerationMode.DIRECT_RECALL
    };

    const [dto, setDto] = React.useState<CreateExerciseSetDto>(initialDto);
    const [countStr, setCountStr] = React.useState(String(initialDto.count));
    const [selectedContextId, setSelectedContextId] = React.useState<string>(sourceId ?? '');

    const isSubmittingRef = React.useRef(false);

    const resolvedContextId = dto.contextType === ExerciseSetContextType.INDEPENDENT
        ? undefined
        : selectedContextId;

    const {
        credits,
        creditBalance,
        isEstimating,
        isInsufficient,
        buttonLabel,
    } = useCreditEstimate({
        isEnabled: !isHidden && !!resolvedContextId,
        estimateFn: () => ExerciseSetEstimateService.estimateCreate(resolvedContextId!, dto),
        actionLabel: 'Create',
        deps: [resolvedContextId, dto.type, dto.difficulty, dto.count, dto.generationMode, dto.contextType],
    });

    function resetForm() {
        setDto(initialDto);
        setCountStr(String(initialDto.count));
        setSelectedContextId(sourceId ?? '');
    }

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            resetForm();
        }
    }, [isHidden, sourceId]);

    React.useEffect(() => {
        if (sourceId) {
            setSelectedContextId(sourceId);
            setDto(prev => ({ ...prev, contextType: ExerciseSetContextType.SOURCE }));
        }
    }, [sourceId]);

    function handleAssociationTypeChange(type: ExerciseSetContextType) {
        let firstId = '';

        if (type === ExerciseSetContextType.GROUP && groups.length > 0) {
            firstId = groups[0]._id;
        } else if (type === ExerciseSetContextType.SOURCE && sources.length > 0) {
            firstId = sources[0]._id;
        }

        setDto({ ...dto, contextType: type });
        setSelectedContextId(firstId);
    }

    async function createExerciseSet() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        const response = await ExerciseSetService.create(resolvedContextId, dto);

        setIsLoadingPageHidden(true);
        dispatch(userActions.fetchData());

        if (!response.isSuccess) {
            alert(response.message);
            setIsHidden(false);
            isSubmittingRef.current = false;
            return;
        }

        isSubmittingRef.current = false;
        resetForm();
        dispatch(refreshExerciseSetsData());
        setIsPopUpActive(false);
    }

    function onChangeForEnum(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectElement = event.currentTarget;

        if (!Object.keys(dto).includes(selectElement.name)) {
            return;
        }

        if (
            !(Object.values(ExerciseSetType) as string[]).includes(selectElement.value) &&
            !(Object.values(ExerciseSetDifficulty) as string[]).includes(selectElement.value) &&
            !(Object.values(ExerciseSetVisibility) as string[]).includes(selectElement.value) &&
            !(Object.values(ExerciseGenerationMode) as string[]).includes(selectElement.value)
        ) {
            return;
        }

        setDto({
            ...dto,
            [selectElement.name]: selectElement.value,
        });
    }

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div className="flex flex-col justify-start items-center gap-2">
                <div className="w-48 sm:w-72 flex justify-start items-center gap-2">
                    <p>Title: </p>
                    <Input
                        name="title"
                        value={dto.title}
                        onChange={(e) => setDto({ ...dto, title: e.currentTarget.value })}
                    />
                </div>

                {dto.contextType === ExerciseSetContextType.SOURCE && (
                    <>
                        <div className="flex justify-start items-center gap-2">
                            <p>Count: </p>
                            <Input
                                name="count"
                                type={InputType.NUMBER}
                                value={countStr}
                                onChange={(e) => {
                                    setCountStr(e.target.value);
                                    setDto({
                                        ...dto,
                                        count: e.target.value === '' ? 0 : Number(e.target.value),
                                    });
                                }}
                            />
                        </div>

                        <InformationText
                            size={isDesktop ? InformationTextSize.MD : InformationTextSize.SM}
                            text="AI will generate specified count of exercises automatically based on source content."
                        />
                    </>
                )}

                <div className="flex justify-start items-center gap-2">
                    <p>Type: </p>
                    <select
                        name="type"
                        value={dto.type}
                        onChange={(e) => onChangeForEnum(e)}
                        className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                    >
                        {Object.values(ExerciseSetType).map((val, index) => (
                            <option key={`type-${index}`} value={val}>{camelToTitleCase(val)}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-start items-center gap-2">
                    <p>Difficulty: </p>
                    <select
                        name="difficulty"
                        value={dto.difficulty}
                        onChange={(e) => onChangeForEnum(e)}
                        className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                    >
                        {Object.values(ExerciseSetDifficulty).map((val, index) => (
                            <option key={`diff-${index}`} value={val}>{camelToTitleCase(val)}</option>
                        ))}
                    </select>
                </div>

                <InformationText
                    size={isDesktop ? InformationTextSize.MD : InformationTextSize.SM}
                    text="Type and Difficuly are not permanent, they change dynamically based on exercises within the set."
                />

                <div className="flex justify-start items-center gap-2">
                    <p>Visibility: </p>
                    <select
                        name="visibility"
                        value={dto.visibility}
                        onChange={(e) => onChangeForEnum(e)}
                        className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                    >
                        <option value={ExerciseSetVisibility.PRIVATE}>Private</option>
                        <option value={ExerciseSetVisibility.PUBLIC}>Public</option>
                    </select>
                </div>

                {!sourceId && (
                    <div className="flex flex-col justify-start items-center gap-4">
                        <div className="flex justify-start items-center gap-2">
                            <p>Association: </p>
                            <select
                                value={dto.contextType}
                                onChange={(e) => handleAssociationTypeChange(e.currentTarget.value as ExerciseSetContextType)}
                                className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                            >
                                {Object.values(ExerciseSetContextType).map((type) => (
                                    <option key={`ctx-${type}`} value={type}>
                                        {camelToTitleCase(type)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {dto.contextType === ExerciseSetContextType.GROUP && (
                            <div className="flex justify-start items-center gap-2">
                                <p>Group: </p>
                                <select
                                    value={selectedContextId}
                                    onChange={(e) => setSelectedContextId(e.currentTarget.value)}
                                    className="w-48 sm:w-72 py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                                >
                                    {groups.map((group) => (
                                        <option key={group._id} value={group._id}>{group.title}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {dto.contextType === ExerciseSetContextType.SOURCE && (
                            <>
                                <div className="flex justify-start items-center gap-2">
                                    <p>Source: </p>
                                    <select
                                        value={selectedContextId}
                                        onChange={(e) => setSelectedContextId(e.currentTarget.value)}
                                        className="w-48 sm:w-72 py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                                    >
                                        {sources.map((source) => (
                                            <option key={source._id} value={source._id}>{source.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {(sourceId && dto.contextType === ExerciseSetContextType.SOURCE) && (
                    <>
                        <div className="flex justify-start items-center gap-2">
                            <p>Focus: </p>
                            <select
                                name="generationMode"
                                value={dto.generationMode}
                                onChange={(e) => setDto({ ...dto, generationMode: e.target.value as ExerciseGenerationMode })}
                                className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                            >
                                {Object.values(ExerciseGenerationMode).map((value, index) => (
                                    <option key={`generation-mode-${index}`} value={value}>{camelToTitleCase(value)}</option>
                                ))}
                            </select>
                        </div>

                        <InformationText
                            size={isDesktop ? InformationTextSize.MD : InformationTextSize.SM}
                            text={
                                dto.generationMode === ExerciseGenerationMode.DIRECT_RECALL
                                    ? "Focuses on facts and definitions found directly in your source."
                                    : "Focuses on applying concepts to NEW examples and scenarios not in the text."
                            }
                        />
                    </>
                )}

                {isInsufficient ? (
                    <InsufficientCreditsNotice
                        needed={credits}
                        balance={creditBalance}
                        onBeforeNavigate={() => setIsPopUpActive(false)}
                    />
                ) : (
                    <Button
                        variant={ButtonVariant.PRIMARY}
                        disabled={isEstimating}
                        onClick={createExerciseSet}
                    >
                        {buttonLabel}
                    </Button>
                )}
            </div>
        </Modal>
    );
}
