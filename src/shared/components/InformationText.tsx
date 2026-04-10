export function InformationText({ text }: { text: string }) {
    return (
        <p className="w-auto text-xs text-center opacity-60 max-w-72 sm:max-w-96">
            {text}
        </p>
    );
}
