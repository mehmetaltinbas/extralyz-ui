import { Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { themeActions } from "src/store/theme.slice";

export function LightDarkModeButton() {
    const dispatch = useAppDispatch();
    const themeMode = useAppSelector((state) => state.theme.mode);

    return (
        <button
            onClick={() => dispatch(themeActions.toggle())}
            className="w-8 h-8 rounded-full bg-surface-hover text-text-primary cursor-pointer flex justify-center items-center hover:bg-surface-muted"
        >
            {themeMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
    );
}