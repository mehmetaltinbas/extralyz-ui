import React from 'react';

export function useClickOutside(
    ref: React.RefObject<HTMLElement | null>,
    callback: () => void,
    isActive: boolean
) {
    React.useEffect(() => {
        if (!isActive) return;

        function handleMouseDown(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        }

        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [ref, callback, isActive]);
}
