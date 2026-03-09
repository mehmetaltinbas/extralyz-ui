import React from "react";
import { ExerciseSetPopupsContext } from "src/features/exercise-set/contexts/exercise-set-popups.context";

export function useExerciseSetPopups() {
    const context = React.useContext(ExerciseSetPopupsContext);

    if (!context) {
        throw new Error('useExerciseSetPopups must be used within an ExerciseSetPopupsProvider');
    }

    return context;
}
