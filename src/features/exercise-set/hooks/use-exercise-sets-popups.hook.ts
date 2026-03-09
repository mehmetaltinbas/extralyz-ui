import React from "react";
import { ExerciseSetsPopupsContext } from "src/features/exercise-set/contexts/exercise-sets-popups.context";

export function useExerciseSetsPopups() {
    const context = React.useContext(ExerciseSetsPopupsContext);

    if (!context) {
        throw new Error('useExerciseSetsPopups must be used within an ExerciseSetsPopupsProvider');
    }

    return context;
}
