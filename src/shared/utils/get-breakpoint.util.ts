import { Breakpoint } from 'src/shared/enums/breakpoint.enum';

export function getBreakpoint(mobileMatch: boolean, tabletMatch: boolean): Breakpoint {
    if (mobileMatch) return Breakpoint.MOBILE;
    if (tabletMatch) return Breakpoint.TABLET;
    return Breakpoint.DESKTOP;
}
