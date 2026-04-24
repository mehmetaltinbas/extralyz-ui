import { ExerciseSetService } from "src/features/exercise-set/services/exercise-set.service";
import { PublicExerciseSetService } from "src/features/exercise-set/services/public-exercise-set.service";
import type { ExerciseSet } from "src/features/exercise-set/types/exercise-set.interface";
import type { GetPdfResponse } from "src/features/exercise-set/types/response/get-pdf.response";

export async function viewExerciseSetAsPdf(isPublicAccess: boolean, withAnswers: boolean, exerciseSet: ExerciseSet) {
    let response: GetPdfResponse = { isSuccess: false, message: "request couldn't be sent" };

    if (isPublicAccess) {
        response = await PublicExerciseSetService.getPdf(exerciseSet._id, withAnswers);
    } else {
        response = await ExerciseSetService.getPdf(exerciseSet._id, withAnswers);
    }

    if (!response.isSuccess || !response.pdfBase64) {
        alert(response.message);
        return;
    }

    const byteCharacters = atob(response.pdfBase64);
    
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const url = window.URL.createObjectURL(blob);

    const newWindow = window.open(url, '_blank');

    if (!newWindow) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${exerciseSet.title}.pdf`;
        a.click();
    }
}
