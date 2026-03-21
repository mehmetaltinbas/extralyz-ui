import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LoaderCircle } from 'lucide-react';
import type { PublicUser } from 'src/features/user/types/public-user.interface';
import { UserService } from 'src/features/user/services/user.service';
import { MIN_USER_NAME_LENGTH } from 'src/shared/constants/min-user-name-length.constant';
import { useClickOutside } from 'src/shared/hooks/use-click-outside.hook';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';

export function UserSearchBar() {
    const navigate = useNavigate();
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState<PublicUser[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    useClickOutside(wrapperRef, () => setIsDropdownOpen(false), isDropdownOpen);
    const { isMobile } = useBreakpoint();

    React.useEffect(() => {
        if (query.length < MIN_USER_NAME_LENGTH) {
            setResults([]);
            setIsDropdownOpen(false);
            return;
        }

        const controller = new AbortController();

        // Show spinner immediately — don't wait for debounce
        setIsLoading(true);
        setIsDropdownOpen(true);

        const timer = setTimeout(async () => {
            const response = await UserService.searchByUserName(query, controller.signal);

            if (!controller.signal.aborted) {
                setIsLoading(false);
                setResults(response.isSuccess && response.users ? response.users : []);
            }
        }, 1000);

        return () => {
            clearTimeout(timer);
            controller.abort();
            setIsLoading(false);
            setIsDropdownOpen(false);
        };
    }, [query]);

    React.useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    function handleResultClick(userName: string) {
        setIsDropdownOpen(false);
        setQuery('');
        navigate(`/user/${userName}`);
    }

    return (
        <div ref={wrapperRef} className="relative w-full sm:w-64">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-text-secondary" />

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => {
                            if (query.length >= MIN_USER_NAME_LENGTH && results.length > 0) {
                                setIsDropdownOpen(true);
                            }
                        }}
                        placeholder="Search users..."
                        className="w-full pl-8 pr-2 py-[6px] rounded-[15px] text-sm border border-border focus:outline-none bg-surface text-text-primary transition-colors"
                    />
                </div>

            {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-[15px] shadow-lg max-h-60 overflow-y-auto z-50">
                    {isLoading ? (
                        <div className="flex justify-center py-3">
                            <LoaderCircle className="size-5 text-text-secondary animate-spin" />
                        </div>
                    ) : results.length > 0 ? (
                        results.map((user) => (
                            <button
                                key={user.userName}
                                type="button"
                                onClick={() => handleResultClick(user.userName)}
                                className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-hover cursor-pointer transition-colors first:rounded-t-[15px] last:rounded-b-[15px]"
                            >
                                {user.userName}
                            </button>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-sm text-text-secondary">No users found</div>
                    )}
                </div>
            )}
        </div>
    );
}
