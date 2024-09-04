import {useContext, useEffect, useState} from "react";
import {GeneralContext, GeneralContextType} from "./App.tsx";

export const Steps = () => {
    const gameSettings: GeneralContextType = useContext(GeneralContext)!;
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

    useEffect(() => {
        setHighlightedIndex(gameSettings.counter);
    }, [gameSettings.steps.length, gameSettings.counter]);

    const stepsCopy = [...gameSettings.steps]

    return (
        <div style={{height: "100px", padding: '10px', margin: '10px', overflowY: "scroll"}}>
            {
                stepsCopy.map((step, index) => {
                return (
                    <p key={index}
                        style={{
                            margin: '0',
                            background: index === highlightedIndex! - 1 ? 'green' : 'none'
                        }}>
                        {index + 1}. {step.notation}
                    </p>

                )})}
        </div>
    )
}