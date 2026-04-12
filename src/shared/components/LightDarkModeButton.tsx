import { Moon, Sun } from 'lucide-react';
import { USER_SECTION_BUTTON_STLES } from 'src/shared/constants/user-section-button-styles.constant';
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { themeActions } from "src/store/theme.slice";

export function LightDarkModeButton() {
    const dispatch = useAppDispatch();
    const themeMode = useAppSelector((state) => state.theme.mode);

    return (
        <button
            onClick={() => dispatch(themeActions.toggle())}
            className={USER_SECTION_BUTTON_STLES}
        >
            {themeMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
    );
}