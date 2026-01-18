import React, { useEffect, useState } from 'react';
import { ProcessedSourceComprehensionLevel } from 'src/features/processed-source/enums/processed-source-comprehension-level.enum';
import { ProcessedSourceLength } from 'src/features/processed-source/enums/processed-source-length.enum';
import { ProcessedSourcePerspective } from 'src/features/processed-source/enums/processed-source-perspective.enum';
import { ProcessedSourceStyle } from 'src/features/processed-source/enums/processed-source-style.enum';
import { ProcessedSourceTone } from 'src/features/processed-source/enums/processed-source-tone.enum';
import { processedSourceService } from 'src/features/processed-source/services/processed-source.service';
import { processedSourcesActions } from 'src/features/processed-source/store/processed-sources.slice';
import type { CreateProcessedSourceDto } from 'src/features/processed-source/types/dto/CreateProcessedSourceDto';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';
import { useAppDispatch } from 'src/store/hooks';

export function ProcessSourceForm({
    isHidden,
    setIsHidden,
    setIsLoadingPageHidden,
    setIsPopUpActive,
    toggle,
    sourceId,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    toggle: () => void;
    sourceId: string;
}) {
    const dispatch = useAppDispatch();
    const [createProcessedSourceDto, setCreateProcessedSourceDto] =
        useState<CreateProcessedSourceDto>({
            title: '',
            tone: 'formal',
            style: 'narrative',
            perspective: 'firstPerson',
            comprehensionLevel: 'intermediate',
            length: 'medium',
        });

    useEffect(() => {
        setCreateProcessedSourceDto({
            title: '',
            tone: 'formal',
            style: 'narrative',
            perspective: 'firstPerson',
            comprehensionLevel: 'intermediate',
            length: 'medium',
        });
    }, [isHidden]);

    async function processSource() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);
        const response = await processedSourceService.createBySourceId(
            sourceId,
            createProcessedSourceDto
        );
        dispatch(processedSourcesActions.fetchData());
        setIsLoadingPageHidden(true);
        alert(response.message);
        setIsPopUpActive(false);
    }

    return (
        <div
            className={`${isHidden && 'hidden'} w-auto h-auto relative border px-2 py-4 bg-white rounded-[10px]
            flex flex-col justify-center items-center gap-2`}
        >
            <Button
                variant={ButtonVariants.DANGER}
                className="absolute top-1 right-1" onClick={(event) => toggle()}>
                X
            </Button>
            <div className="flex justify-start items-center gap-2">
                <p>title: </p>
                <input
                    data-key="userName"
                    onChange={(event) =>
                        setCreateProcessedSourceDto({
                            ...createProcessedSourceDto,
                            title: event.target.value,
                        })
                    }
                    type="text"
                    value={createProcessedSourceDto.title}
                    placeholder="title..."
                    className="px-2 py-[2px] border rounded-full"
                />
            </div>
            <div className="flex justify-start items-center gap-2">
                <p>tone: </p>
                <select
                    value={createProcessedSourceDto?.tone}
                    onChange={(e) =>
                        setCreateProcessedSourceDto({
                            ...createProcessedSourceDto,
                            tone: e.target.value,
                        })
                    }
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    <option value="">select</option>
                    <option value={ProcessedSourceTone.FORMAL}>Formal</option>
                    <option value={ProcessedSourceTone.CASUAL}>Casual</option>
                    <option value={ProcessedSourceTone.FRIENDLY}>Friendly</option>
                    <option value={ProcessedSourceTone.PROFESSIONAL}>Professional</option>
                    <option value={ProcessedSourceTone.PERSUASIVE}>Persuasive</option>
                </select>
            </div>
            <div className="flex justify-start items-center gap-2">
                <p>style: </p>
                <select
                    value={createProcessedSourceDto?.style}
                    onChange={(e) =>
                        setCreateProcessedSourceDto({
                            ...createProcessedSourceDto,
                            style: e.target.value,
                        })
                    }
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    <option value="">select</option>
                    <option value={ProcessedSourceStyle.NARRATIVE}>Narrative</option>
                    <option value={ProcessedSourceStyle.TECHNICAL}>Technical</option>
                    <option value={ProcessedSourceStyle.EXPLANATORY}>Explanatory</option>
                    <option value={ProcessedSourceStyle.CREATIVE}>Creative</option>
                </select>
            </div>
            <div className="flex justify-start items-center gap-2">
                <p>perspective: </p>
                <select
                    value={createProcessedSourceDto?.perspective}
                    onChange={(e) => {
                        setCreateProcessedSourceDto({
                            ...createProcessedSourceDto,
                            perspective: e.target.value,
                        });
                    }}
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    <option value="">select</option>
                    <option value={ProcessedSourcePerspective.FIRST_PERSON}>
                        First person
                    </option>
                    <option value={ProcessedSourcePerspective.SECOND_PERSON}>
                        Second person
                    </option>
                    <option value={ProcessedSourcePerspective.THIRD_PERSON}>
                        Third person
                    </option>
                </select>
            </div>
            <div className="flex justify-start items-center gap-2">
                <p>comprehensionLevel: </p>
                <select
                    value={createProcessedSourceDto?.comprehensionLevel}
                    onChange={(e) =>
                        setCreateProcessedSourceDto({
                            ...createProcessedSourceDto,
                            comprehensionLevel: e.target.value,
                        })
                    }
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    <option value="">select</option>
                    <option value={ProcessedSourceComprehensionLevel.BASIC}>Basic</option>
                    <option value={ProcessedSourceComprehensionLevel.INTERMEDIATE}>
                        Intermediate
                    </option>
                    <option value={ProcessedSourceComprehensionLevel.ADVANCED}>
                        Advanced
                    </option>
                </select>
            </div>
            <div className="flex justify-start items-center gap-2">
                <p>length: </p>
                <select
                    value={createProcessedSourceDto?.length}
                    onChange={(e) =>
                        setCreateProcessedSourceDto({
                            ...createProcessedSourceDto,
                            length: e.target.value,
                        })
                    }
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    <option value="">select</option>
                    <option value={ProcessedSourceLength.CONCISE}>Concise</option>
                    <option value={ProcessedSourceLength.MEDIUM}>Medium</option>
                    <option value={ProcessedSourceLength.DETAILED}>Detailed</option>
                </select>
            </div>
            <Button
                variant={ButtonVariants.PRIMARY}
                onClick={async (event) => {
                    await processSource();
                }}
            >
                Process the Source
            </Button>
        </div>
    );
}
