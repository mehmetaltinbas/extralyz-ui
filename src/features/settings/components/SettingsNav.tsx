import { NavLink } from 'react-router-dom';
import { ITEMS } from 'src/features/settings/constants/settings-items.constant';

export function SettingsNav({ orientation = 'vertical' }: { orientation?: 'vertical' | 'horizontal' }) {
    const isHorizontal = orientation === 'horizontal';

    return (
        <nav
            className={
                isHorizontal
                    ? 'flex flex-row gap-1 overflow-x-auto border-b border-border px-2'
                    : 'flex flex-col gap-1 w-56 shrink-0 border-r border-border p-3'
            }
        >
            {ITEMS.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                        [
                            isHorizontal
                                ? 'whitespace-nowrap px-3 py-2 text-sm rounded-md'
                                : 'px-3 py-2 text-sm rounded-md',
                            isActive
                                ? 'bg-surface-hover text-accent font-medium'
                                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover',
                        ].join(' ')
                    }
                >
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );
}
