import { useNavigate } from "react-router-dom";
import { Button } from "src/shared/components/Button";
import { ButtonVariants } from "src/shared/enums/button-variants.enum";

export function Home() {
    const navigate = useNavigate();

    function handleStartNowAction() {
        navigate('/sign-up');
    }

    function handleTryDemoAction() {

    }

    return (
        <div className="w-full h-full flex flex-col text-center">
            <header className="w-full h-[52px] bg-black">

            </header>

            <section // hero section
                className="w-full h-auto bg-gray-100 p-4
                flex flex-col justify-center items-center gap-4"
            >
                <p className="text-3xl font-bold">Master Learning. Effortlessly.</p>
                <div className="w-full h-auto
                    flex flex-col justify-center items-center gap-1"
                >
                    <p className="text-2xl">Extralyz transforms your documents into interactive, study-ready content in seconds.</p>
                    <p className="text-lg">Study smarter, not harder.</p>
                </div>
                <div className="w-full h-auto
                    flex justify-center items-center gap-2"
                >
                    <Button 
                        variant={ButtonVariants.PRIMARY}
                        onClick={handleStartNowAction} 
                    >Start Now</Button>
                    {/*
                    <BlackButton 
                        onClick={handleTryDemoAction} 
                        className="text-[16px]"
                    >Try Demo</BlackButton>
                    */}
                </div>
            </section>

            <section // feature 1: abstractive summarization
                className="w-full h-auto bg-gray-200 p-4
                    flex flex-col justify-center items-center gap-2"
            >
                <p className="text-xl">Concise Synthesis</p>
                <p className="text-lg">Transform sources into clear and compact formats, makingt he contentr easier to read, understand, and work with.</p>
            </section>

            <section // feature 2: interactive practical exercise set generation
                className="w-full h-auto bg-gray-100 p-4
                    flex flex-col justify-center items-center gap-2"
            >
                <p className="text-xl">Interactive Exercises</p>
                <p className="text-lg">Automatically create exercise sets in the form of multiple choice, true or false, and open ended questions directly from your sources.</p>
            </section>

            <section // feature 3: downloadable pdf documents
                className="w-full h-auto bg-gray-200 p-4
                    flex flex-col justify-center items-center gap-2"
            >
                <p className="text-xl">Edit & Export</p>
                <p className="text-lg">Edit content directly in Extralyz and export print-ready PDFs for offline study.</p>
            </section>

            <footer
                className="w-full h-auto bg-gray-400 p-4
                    "
            >
                <p>Copyright © 2025 Extralyz. All rights reserved.</p>
            </footer>
        </div>
    );
}
