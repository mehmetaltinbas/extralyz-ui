import { createContext, type RefObject } from 'react';

export const BodyModalPortalContext = createContext<RefObject<HTMLDivElement | null> | null>(null);
