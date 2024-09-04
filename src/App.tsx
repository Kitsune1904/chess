
import './App.css'
import * as React from "react";
import {createContext, useCallback, useEffect, useRef, useState} from "react";
import {Desk} from "./Desk.tsx";
import {
    createEmptyDesk,
    createStartDesk,
    getRandomDesk,
    getRenderSource, historyController,
} from "./chess_core.ts";
import {ChessDesk, IChessCellProps, ParsedCell} from "./Types.ts";
import {Steps} from "./Steps.tsx";

export type GeneralContextType = {
    gamerIsWhiteColor: boolean;
    setDeskMemory: (desk:ChessDesk) => void;
    deskMemory: ChessDesk;
    selectedCell: IChessCellProps | null;
    setSelectedCell: (cell: IChessCellProps | null) => void;
    steps: ParsedCell[] | [];
    setStep: (cell: ParsedCell[]) => void;
    counter: number;
    setCounter: (count: number) => void;
    eatenFigures: ParsedCell[] | [];
    setEatenFigure: (cell: ParsedCell[]) => void;
}
export const GeneralContext: React.Context<GeneralContextType|null> = createContext<GeneralContextType|null>(null)

const isDisabled = (steps: ParsedCell[], counter: number, isIncrement: boolean): boolean => {
    if(isIncrement) {
        // console.log(steps.length)
        return counter > steps.length - 1
    } else {
        return counter <=1
    }
}

function App() {
    const [deskMemory, setDeskMemory] = useState<ChessDesk>(createStartDesk());
    const [isGamerColorWhite, setGamerColor] = useState<boolean>(true);
    const [sources, setSources] = useState<IChessCellProps[][]>(getRenderSource(deskMemory));
    const [selectedCell, setSelectedCell] = useState<IChessCellProps | null>(null);
    const [steps, setStep] = useState<ParsedCell[] | []>([]);
    const [eatenFigures, setEatenFigure] = useState<ParsedCell[] | []>([]);



    const [counter, setCounter] = useState<number>(0);

    const incrementRef = useRef(null);
    const decrementRef = useRef(null);

    const box: React.MutableRefObject<HTMLDivElement|null> = React.useRef<HTMLDivElement|null>(null);

    const callBack: (() => void) = React.useCallback(() => {
        const desk: HTMLElement | null = document.getElementById("chess_desk");
        if (!box.current || !desk) {
            return
        }
        const fatherWidth: number = box.current!.offsetWidth;
        const fatherHeight: number = box.current!.offsetHeight;
        const minimalSize: number = Math.floor(fatherWidth < fatherHeight ? fatherWidth : fatherHeight) - 1
        desk.style.height = minimalSize.toString() + 'px'
        desk.style.width = minimalSize.toString() + 'px'
        box.current!.style.flexDirection = fatherWidth < fatherHeight ? "column" : "row"
    }, []);

    useEffect(() => {
        callBack(); // вызывается на момент встраивания
        window.addEventListener('resize', callBack); // следит за размерами окна и вызывает callBack
        return () => window.removeEventListener('resize', callBack) // очистка по демонтажу от события
    }, [callBack]) // зависимость на создание колбэка (т.е. пока он там создан не будет, не пойдет)

    /*useEffect(() => {
        setSources(getRenderSource(deskMemory, isGamerColorWhite, shouldRotate));
    }, [deskMemory, isGamerColorWhite, shouldRotate]);*/

    const handleSwitchPlayer = () => {
        const deskData = [...sources];
        const desk = createEmptyDesk();
        for (let col = 1; col < 9; col++) {
            for (let row = 1; row < 9; row++) {
                desk[col-1][row-1] = deskData[col][row].data;
            }
        }
        setDeskMemory(desk)
        setGamerColor(!isGamerColorWhite);
        setSources(getRenderSource(desk, true));
    }

    const handleRandomDesk = () => {
        const randomDesk = getRandomDesk();
        setSources(getRenderSource(randomDesk));
    };


    const increment = useCallback(() => {
        setCounter(prevState => prevState + 1);
    }, [counter])

    const decrement = useCallback(() => {
        setCounter(prevState => prevState - 1);
    }, [counter])

    console.log(steps.length)
    console.log(counter)
    return (
        <GeneralContext.Provider value={{
            gamerIsWhiteColor: isGamerColorWhite,
            setDeskMemory: setDeskMemory,
            deskMemory: deskMemory,
            selectedCell: selectedCell,
            setSelectedCell: setSelectedCell,
            steps: steps,
            setStep: setStep,
            counter: counter,
            setCounter: setCounter,
            eatenFigures: eatenFigures,
            setEatenFigure: setEatenFigure
        }}>
            <div ref={box} style={{display: "flex", flexWrap: "nowrap", alignItems: 'stretch', alignContent: 'stretch', width: '100%', height: '100%', flexDirection: "row"}}>
                <div style={{backgroundColor: 'red', flexGrow: 1}}>

                </div>
                <div id="chess_desk" style={{backgroundColor: '#b64600'}}>
                    <Desk desk={deskMemory} sources={sources} setSources={setSources}></Desk>
                </div>
                <div style={{backgroundColor: 'blue', flexGrow: 1}}>
                    {<p>Игра за {isGamerColorWhite ? 'белые' : 'черные'} фигуры</p>}
                    <div style={{display: 'flex', gap: '10px'}}>
                        <button onClick={handleSwitchPlayer}>Сменить игрока</button>
                        <button onClick={handleRandomDesk}>Рандом</button>
                        <button onClick={decrement} ref={decrementRef} disabled={isDisabled(steps, counter, false)}>Шаг назад</button>
                        <button onClick={increment} ref={incrementRef} disabled={isDisabled(steps, counter, true)}>Шаг вперед</button>
                    </div>
                    <Steps/>
                </div>
            </div>
        </GeneralContext.Provider>
    )
}

export default App
