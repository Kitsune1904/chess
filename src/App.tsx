
import './App.css'
import * as React from "react";
import {createContext, useEffect, useState} from "react";
import {Desk} from "./desk.tsx";
import {ChessDesk, createStartDesk, getRandomDesk} from "./chess_core.ts";

export type GeneralContextType = {
    gamerIsWhiteColor: boolean;
    setDeskMemory: (desk:ChessDesk) => void
}
export const GeneralContext: React.Context<GeneralContextType|null> = createContext<GeneralContextType|null>(null)

function App() {
    const [deskMemory, setDeskMemory] = useState<ChessDesk>(createStartDesk());
    const [isGamerColorWhite, setGamerColor] = useState<boolean>(true)

    const box: React.MutableRefObject<HTMLDivElement|null> = React.useRef<HTMLDivElement|null>(null); // константа, хранящая элемент разметки или null

    const callBack: (() => void) = React.useCallback(() => { // константа, что хранит колбэк МЕЖДУ РЕНДЕРАМИ! (т.е она мемоизирована между ними)
        const desk: HTMLElement | null = document.getElementById("chess_desk"); // константа с элементом по айди chess_desk (замена useRef для HTML элементов (работает только в эффектах и колбэках))
        if (!box.current || !desk) { // если какая-то из констант пустая - досвидос (общий паттерн проверок ПЕРЕД функцией, подходит для случаев валидации чего-либо, тогда они идут один под другим - экономия памяти)
            return
        }
        const fatherWidth: number = box.current!.offsetWidth; // константа с настоящим значением ширины боксика в момент вызова функции

        const fatherHeight: number = box.current!.offsetHeight; // константа с настоящим значением высоты боксика в момент вызова функции
        const minimalSize: number = Math.floor(fatherWidth < fatherHeight ? fatherWidth : fatherHeight) - 1 // константа, хранящая наименьшее значение из двух (высоты или ширины)
        desk.style.height = minimalSize.toString() + 'px' // назначение СТИЛЕВОЙ высоты деску по минимальной
        desk.style.width = minimalSize.toString() + 'px' // назначение СТИЛЕВОЙ ширины деску по минимальной
        box.current!.style.flexDirection = fatherWidth < fatherHeight ? "column" : "row" // назначение СТИЛЕВОГО направления флекса, с учетом наименьшего размера из двух (высоты или ширины)
    }, []); // зависимостей нет, т.е. исполнение только на встраивание

    useEffect(() => {
        callBack(); // вызывается на момент встраивания
        window.addEventListener('resize', callBack); // следит за размерами окна и вызывает callBack
        return () => window.removeEventListener('resize', callBack) // очистка по демонтажу от события
    }, [callBack]) // зависимость на создание колбэка (т.е. пока он там создан не будет, не пойдет)

    return (
        <GeneralContext.Provider value={{gamerIsWhiteColor: isGamerColorWhite, setDeskMemory: setDeskMemory}}>
            <div ref={box} style={{display: "flex", flexWrap: "nowrap", alignItems: 'stretch', alignContent: 'stretch', width: '100%', height: '100%', flexDirection: "row"}}>
                <div style={{backgroundColor: 'red', flexGrow: 1}}>

                </div>
                <div id="chess_desk" style={{backgroundColor: '#b64600'}}>
                    <Desk desk={deskMemory}></Desk>
                </div>
                <div style={{backgroundColor: 'blue', flexGrow: 1}}>
                    <button onClick={() => setGamerColor(!isGamerColorWhite)}>Сменить игрока</button>
                    <button onClick={() => setDeskMemory(getRandomDesk)}>Рандом</button>
                </div>
            </div>
        </GeneralContext.Provider>
    )
}

export default App
