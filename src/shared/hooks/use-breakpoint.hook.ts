import { useEffect, useState } from 'react';
import { MOBILE_QUERY } from 'src/shared/constants/mobile-query.constant';
import { TABLET_QUERY } from 'src/shared/constants/tablet-query.constant';
import { Breakpoint } from 'src/shared/enums/breakpoint.enum';
import { getBreakpoint } from 'src/shared/utils/get-breakpoint.util';

export function useBreakpoint(): {
    breakpoint: Breakpoint;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
} {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
        const mobileMatch = window.matchMedia(MOBILE_QUERY).matches;
        const tabletMatch = window.matchMedia(TABLET_QUERY).matches;

        return getBreakpoint(mobileMatch, tabletMatch);
    });

    useEffect(() => {
        const mobileMql = window.matchMedia(MOBILE_QUERY);
        const tabletMql = window.matchMedia(TABLET_QUERY);

        function update() {
            setBreakpoint(getBreakpoint(mobileMql.matches, tabletMql.matches));
        }

        mobileMql.addEventListener('change', update);
        tabletMql.addEventListener('change', update);

        return () => {
            mobileMql.removeEventListener('change', update);
            tabletMql.removeEventListener('change', update);
        };
    }, []);

    return {
        breakpoint,
        isMobile: breakpoint === Breakpoint.MOBILE,
        isTablet: breakpoint === Breakpoint.TABLET,
        isDesktop: breakpoint === Breakpoint.DESKTOP,
    };
}
