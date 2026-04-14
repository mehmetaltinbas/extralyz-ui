import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Source } from 'src/features/source/types/source.interface';

export function PublicSourceCard({
    source,
    userName,
}: {
    source: Source;
    userName: string;
}) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() =>
                navigate(`/user/${userName}/source/${encodeURIComponent(source.title)}`)
            }
            className="relative w-[180px] md:w-[250px] h-[120px] md:h-[150px] cursor-pointer rounded-[10px]
            flex-shrink-0 flex flex-col justify-start items-center gap-1
            border border-border p-1
            hover:border-border-strong"
        >
            <div
                className="w-full h-[35px] border-b-1 border-border
                flex justify-center items-center"
            >
                <div className="flex-1 h-full flex justify-center items-center gap-1">
                    <FileText size={14} className="flex-shrink-0" />
                    <p className="max-w-[150px] px-2 font-serif font-semibold truncate text-sm md:text-base">
                        {source.title}
                    </p>
                </div>
            </div>

            <p className="text-sm md:text-base">{source.type}</p>
        </div>
    );
}
