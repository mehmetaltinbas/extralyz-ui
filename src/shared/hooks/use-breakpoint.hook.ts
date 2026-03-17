import { useEffect, useState } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

interface UseBreakpointReturn {
    breakpoint: Breakpoint;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}

const MOBILE_QUERY = '(max-width: 767px)';
const TABLET_QUERY = '(min-width: 768px) and (max-width: 1024px)';

function getBreakpoint(mobileMatch: boolean, tabletMatch: boolean): Breakpoint {
    if (mobileMatch) return 'mobile';
    if (tabletMatch) return 'tablet';
    return 'desktop';
}

export function useBreakpoint(): UseBreakpointReturn {
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
        isMobile: breakpoint === 'mobile',
        isTablet: breakpoint === 'tablet',
        isDesktop: breakpoint === 'desktop',
    };
}
