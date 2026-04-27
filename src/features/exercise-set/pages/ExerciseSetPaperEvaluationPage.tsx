import React from 'react';
import { MAX_PAPER_EVALUATION_UPLOAD_COUNT } from 'src/features/exercise-set/constants/max-paper-evaluation-upload-count.constant';
import { ExerciseSetContextType } from 'src/features/exercise-set/enums/exercise-set-context-type.enum';
import { ExerciseSetEvaluationPage } from 'src/features/exercise-set/pages/ExerciseSetEvaluationPage';
import { ExerciseSetEstimateService } from 'src/features/exercise-set/services/exercise-set-estimate.service';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import type { EvaluateAnswersResponse } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import { viewExerciseSetAsPdf } from 'src/features/exercise-set/utils/view-exercise-set-as-pdf.util';
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

        const estimate = await ExerciseSetEstimateService.estimateEvaluatePaperAnswers(
            exerciseSet._id,
            { imageCount: files.length }
        );

        if (estimate.isSuccess && estimate.credits && estimate.credits > 0) {
            const confirmed = confirm(`This will cost ${estimate.credits} credits. Proceed?`);
            if (!confirmed) return;
        }

        setIsSubmitting(true);

        const response = await ExerciseSetService.evaluatePaperAnswers(
            exerciseSet._id,
            files
        );

        if (response.isSuccess) {
            setEvaluation(response);
        } else if (!response.isSuccess) {
            alert(response.message);
        }

        setIsSubmitting(false);
    }

    function startOver() {
        setFiles([]);
        setEvaluation(undefined);
    }

    function viewPdf() {
        if (!exerciseSet) {
            alert('exercise set is undefined'); 
            return;
        }

        viewExerciseSetAsPdf(false, false, exerciseSet);
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
                        <div className='flex flex-col justify-start items-center gap-2 w-[325px] md:w-[900px]'>
                            <p className="text-lg font-bold">Evaluate Paper Answers</p>

                            <p className='text-center'>
                                Complete your exercises on paper and get instant digital feedback. Simply <span onClick={viewPdf} className='underline cursor-pointer'>download the PDF</span>, print it, write down your answers on paper, and upload photos of your work for automatic scoring and evaluation.
                            </p>
                        </div>


                        <div className='flex flex-col gap-1 justify-center items-center'>
                            <p className='text-lg font-bold'>{exerciseSet.title}</p>

                            <div className='flex gap-2'>
                                <p><span className=''>Source:</span> <span className='italic'>{exerciseSet.contextType === ExerciseSetContextType.SOURCE ? sources.find((source) => source._id === exerciseSet.contextId)?.title : exerciseSet.contextType}</span></p>

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
                            disabled={files.length === 0 || files.length > MAX_PAPER_EVALUATION_UPLOAD_COUNT}
                        >
                            Submit for Evaluation
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
