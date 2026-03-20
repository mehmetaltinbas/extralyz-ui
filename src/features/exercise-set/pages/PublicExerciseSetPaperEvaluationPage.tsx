import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MAX_PAPER_EVALUATION_UPLOAD_COUNT } from 'src/features/exercise-set/constants/max-paper-evaluation-upload-count.constant';
import { ExerciseSetEvaluationPage } from 'src/features/exercise-set/pages/ExerciseSetEvaluationPage';
import { PublicExerciseSetService } from 'src/features/exercise-set/services/public-exercise-set.service';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import type { EvaluateAnswersResponse } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputType } from 'src/shared/enums/input-type.enum';
import { LoadingPage } from 'src/shared/pages/LoadingPage';

export function PublicExerciseSetPaperEvaluationPage({
    exerciseSet,
    exercises,
    isActiveComponent,
    ownerUserName
}: {
    exerciseSet?: ExerciseSet;
    exercises?: Exercise[];
    isActiveComponent: boolean;
    ownerUserName: string;
}) {
    const [files, setFiles] = React.useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [evaluation, setEvaluation] = React.useState<EvaluateAnswersResponse>();
    const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);

    const navigate = useNavigate();

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

        const response = await PublicExerciseSetService.evaluatePublicPaperAnswers(
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

                        <div className='flex flex-col justify-center items-center gap-4'>
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-lg font-bold">{exerciseSet.title}</p>

                                <p className="text-text-secondary">
                                    by{' '}
                                    <span onClick={() => navigate(`/user/${ownerUserName}`)} className='cursor-pointer'>@{ownerUserName}</span>
                                </p>
                            </div>

                            <div className='flex flex-wrap gap-2 justify-center'>
                                <p><span>Type:</span> <span className='italic'>{exerciseSet.type}</span></p>

                                <p>|</p>

                                <p><span>Difficulty:</span><span className='italic'> {exerciseSet.difficulty}</span></p>

                                <p>|</p>

                                <p><span>Count:</span> <span className='italic'>{exerciseSet.count}</span></p>
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
                            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
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
