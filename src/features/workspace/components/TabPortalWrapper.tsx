import React from 'react';
import { BodyModalPortalContext } from 'src/shared/contexts/body-modal-portal.context';

export function TabPortalWrapper({ isActive, children }: { isActive: boolean; children: React.ReactNode }) {
    const portalTargetRef = React.useRef<HTMLDivElement | null>(null);

    return (
        <BodyModalPortalContext.Provider value={portalTargetRef}>
            {children}
            <div ref={portalTargetRef} className={isActive ? '' : 'hidden'} />
        </BodyModalPortalContext.Provider>
    );
}

