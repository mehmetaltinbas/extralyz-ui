import React from 'react';
import { MAX_PAPER_EVALUATION_UPLOAD_COUNT } from 'src/features/exercise-set/constants/max-paper-evaluation-upload-count.constant';
import { ExerciseSetSourceType } from 'src/features/exercise-set/enums/exercise-set-source-type.enum';
import { ExerciseSetEvaluationPage } from 'src/features/exercise-set/pages/ExerciseSetEvaluationPage';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import type { EvaluateAnswersResponse } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputType } from 'src/shared/enums/input-type.enum';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppSelector } from 'src/store/hooks';

export function ExerciseSetPaperEvaluationPage({
    exerciseSet,
    exercises,
    isActiveComponent,
}: {
    exerciseSet?: ExerciseSet;
    exercises?: Exercise[];
    isActiveComponent: boolean;
}) {
    const [files, setFiles] = React.useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [evaluation, setEvaluation] = React.useState<EvaluateAnswersResponse>();
    const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);

    const sources = useAppSelector(state => state.sources);

    React.useEffect(() => {
        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [files]);

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            setFiles((prev) => [...prev, ...Array.from(event.target.files!)]);
        }
    }

    function removeFile(index: number) {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleSubmit() {
        if (!exerciseSet || files.length === 0) return;

        setIsSubmitting(true);

        const response = await ExerciseSetService.evaluatePaperAnswers(
            exerciseSet._id,
            files
        );

        if (response.isSuccess) {
            setEvaluation(response);
        }

        setIsSubmitting(false);
    }

    function startOver() {
        setFiles([]);
        setEvaluation(undefined);
    }

    return (
        <div className={`${isActiveComponent ? 'block' : 'hidden'} relative w-full h-full`}>
            <div className='absolute w-full h-full flex justify-start items-start'>
                {!exerciseSet || !exercises ? (
                    <div>undefined</div>
                ) : isSubmitting ? (
                    <LoadingPage />
                ) : evaluation ? (
                    <ExerciseSetEvaluationPage
                        exercises={exercises}
                        evaluation={evaluation}
                        startOver={startOver}
                    />
                ) : (
                    <div className={`w-full h-full flex flex-col items-center gap-6 p-4`}>
                        <p className="text-lg font-bold">Evaluate Paper Answers</p>

                        <div className='flex flex-col gap-1 justify-center items-center'>
                            <p className='text-lg font-bold'>{exerciseSet.title}</p>

                            <div className='flex gap-2'>
                                <p><span className=''>Source:</span> <span className='italic'>{exerciseSet.sourceType === ExerciseSetSourceType.SOURCE ? sources.find((source) => source._id === exerciseSet.sourceId)?.title : exerciseSet.sourceType}</span></p>

                                <p>|</p>

                                <p><span className=''>Type:</span> <span className='italic'>{exerciseSet.type}</span></p>

                                <p>|</p>

                                <p><span className=''>Difficulty:</span><span className='italic'> {exerciseSet.difficulty}</span></p>

                                <p>|</p>

                                <p><span className=''>Count:</span> <span className='italic'>{exerciseSet.count}</span></p>
                            </div>
                        </div>

                        <p className="text-sm">
                            Upload photos of your completed paper (max {MAX_PAPER_EVALUATION_UPLOAD_COUNT} images)
                        </p>

                        <Input
                            type={InputType.FILE}
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            disabled={files.length >= MAX_PAPER_EVALUATION_UPLOAD_COUNT}
                        />

                        {previewUrls.length > 0 && (
                            <div className="w-full grid grid-cols-4 gap-4">
                                {previewUrls.map((url, index) => (
                                    <div key={url} className="relative w-full flex items-center justify-center h-40 max-w-[20rem] bg-surface-hover rounded-[10px] overflow-hidden mx-auto">
                                        <img
                                            src={url}
                                            alt={`Upload ${index + 1}`}
                                            className="h-full w-full object-contain"
                                        />

                                        <div className='absolute top-1 right-1'>
                                            <Button
                                                variant={ButtonVariant.DANGER}
                                                onClick={() => removeFile(index)}
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="hidden absolute top-1 right-1 bg-accent text-text-inverted rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                        >
                                            x
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button
                            variant={ButtonVariant.PRIMARY}
                            onClick={handleSubmit}
                            disabled={files.length === 0 || files.length >= MAX_PAPER_EVALUATION_UPLOAD_COUNT}
                        >
                            Submit for Evaluation
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
