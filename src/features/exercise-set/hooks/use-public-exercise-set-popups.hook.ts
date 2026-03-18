import React from "react";
import { PublicExerciseSetPopupsContext } from "src/features/exercise-set/contexts/public-exercise-set-popups.context";

export function usePublicExerciseSetPopups() {
    const context = React.useContext(PublicExerciseSetPopupsContext);

    if (!context) {
        throw new Error('useExerciseSetPopups must be used within an ExerciseSetPopupsProvider');
    }

    return context;
}
