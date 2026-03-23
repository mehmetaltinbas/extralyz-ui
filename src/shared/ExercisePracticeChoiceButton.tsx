import type React from "react";

export function ExercisePracticeChoiceButton({ children, onClick, isSelected }: {
    children: React.ReactNode;
    onClick: () => void;
    isSelected: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={`${isSelected ? 'font-bold bg-surface-hover' : 'bg-transparent'} w-auto cursor-pointer border-[2px] transition-colors whitespace-nowrap
                px-3 pt-[3px] pb-[2px] rounded-[12px] text-sm
                text-text-primary border-transparent hover:bg-surface-hover
            `}
        >
            {children}
        </button>
    );
}
