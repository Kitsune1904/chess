import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {CellFigure, CellState, CellStatus, ChessDesk, getRenderSource, HelperCell} from "./chess_core.ts";
import {GeneralContext, GeneralContextType} from "./App.tsx";


export interface IDeskProps {
    desk: ChessDesk,
}

export interface IChessCellProps {
    isBlackBackground?: boolean,
    data?: CellState,
    cellType: HelperCell,
    isHighlighted?: boolean;
    onClick?: () => void
    x: number,
    y: number
}

export interface IChessFigureProps {
    figure?: CellFigure,
    status: CellStatus
}

export const Desk = (props: IDeskProps): React.ReactNode => {
    const [selectedCell, setSelectedCell] = useState<IChessCellProps | null>(null);
    const [sources, setSources] = useState<IChessCellProps[][]>([]);

    const gamerSettings: GeneralContextType = useContext(GeneralContext)!;

    const currentPlayerColor: CellStatus.WHITE | CellStatus.BLACK = useMemo(() =>
        gamerSettings.gamerIsWhiteColor ?
            CellStatus.WHITE :
            CellStatus.BLACK
        , [gamerSettings.gamerIsWhiteColor]);

    useEffect((): void => {
        setSources(getRenderSource(props.desk, gamerSettings.gamerIsWhiteColor));
    }, [props.desk, gamerSettings.gamerIsWhiteColor]);

    const handleCellClick = useCallback((cell: IChessCellProps) => {
        const clickedFigureStatus: CellStatus = cell.data!.status

        if (selectedCell) {
            const targetFigureStatus: CellStatus= cell.data!.status;
            const isSamePosition: boolean = selectedCell.x === cell.x && selectedCell.y === cell.y;

            if (isSamePosition) {
                setSelectedCell(null);
            } else if (selectedCell.data?.status === currentPlayerColor && (targetFigureStatus !== currentPlayerColor || cell.data?.status === CellStatus.EMPTY)) {
                const updatedSources: IChessCellProps[][] = [...sources];
                updatedSources[selectedCell.y][selectedCell.x] = {
                    ...selectedCell,
                    data: { 
                        status: CellStatus.EMPTY 
                    }
                };
                updatedSources[cell.y][cell.x] = {
                    ...cell,
                    data: selectedCell.data
                };

                setSources(updatedSources);
                setSelectedCell(null);
            } else {
                setSelectedCell(null);
            }
        } else if (clickedFigureStatus === currentPlayerColor) {
            setSelectedCell(cell);
        }
    }, [selectedCell, currentPlayerColor, sources]);

    return (
        <div style={{
            height: '100%',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `minmax(0, 1fr) repeat(8, minmax(0, 3fr)) minmax(0, 1fr)`,
            gridTemplateRows: `minmax(0, 1fr) repeat(8, minmax(0, 3fr)) minmax(0, 1fr)`,
            alignItems: 'stretch',
            justifyContent: 'stretch'
        }}>
            {sources.map((cells: IChessCellProps[], index: number): React.ReactNode => {
                return cells.map((cell: IChessCellProps, index2: number): React.ReactNode => {
                    return (
                        <ChessCell {...cell}
                                   key={index * 10 + index2}
                                   isHighlighted={selectedCell?.x === cell.x && selectedCell?.y === cell.y}
                                   onClick={() => handleCellClick(cell)}
                        />
                    )
                });
            })}
        </div>
    );
}


export const ChessFigure = (props: IChessFigureProps) => {
    return (
        <svg style={{
            fill: props.status == CellStatus.WHITE ? "white" : "black",
            margin: "10%",
            height: "80%",
            width: "80%"
        }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            {props.figure == CellFigure.PAWN && <path
                d="M19 22H5V20H19V22M16 18H8L10.18 10H8V8H10.72L10.79 7.74C10.1 7.44 9.55 6.89 9.25 6.2C8.58 4.68 9.27 2.91 10.79 2.25C12.31 1.58 14.08 2.27 14.74 3.79C15.41 5.31 14.72 7.07 13.2 7.74L13.27 8H16V10H13.82L16 18Z"/>}
            {props.figure == CellFigure.BISHOP && <path
                d="M19,22H5V20H19V22M17.16,8.26C18.22,9.63 18.86,11.28 19,13C19,15.76 15.87,18 12,18C8.13,18 5,15.76 5,13C5,10.62 7.33,6.39 10.46,5.27C10.16,4.91 10,4.46 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.46 13.84,4.91 13.54,5.27C14.4,5.6 15.18,6.1 15.84,6.74L11.29,11.29L12.71,12.71L17.16,8.26Z"/>}
            {props.figure == CellFigure.KING && <path
                d="M19,22H5V20H19V22M17,10C15.58,10 14.26,10.77 13.55,12H13V7H16V5H13V2H11V5H8V7H11V12H10.45C9.35,10.09 6.9,9.43 5,10.54C3.07,11.64 2.42,14.09 3.5,16C4.24,17.24 5.57,18 7,18H17A4,4 0 0,0 21,14A4,4 0 0,0 17,10Z"/>}
            {props.figure == CellFigure.KNIGHT && <path
                d="M19,22H5V20H19V22M13,2V2C11.75,2 10.58,2.62 9.89,3.66L7,8L9,10L11.06,8.63C11.5,8.32 12.14,8.44 12.45,8.9C12.47,8.93 12.5,8.96 12.5,9V9C12.8,9.59 12.69,10.3 12.22,10.77L7.42,15.57C6.87,16.13 6.87,17.03 7.43,17.58C7.69,17.84 8.05,18 8.42,18H17V6A4,4 0 0,0 13,2Z"/>}
            {props.figure == CellFigure.QUEEN && <path
                d="M18,3A2,2 0 0,1 20,5C20,5.81 19.5,6.5 18.83,6.82L17,13.15V18H7V13.15L5.17,6.82C4.5,6.5 4,5.81 4,5A2,2 0 0,1 6,3A2,2 0 0,1 8,5C8,5.5 7.82,5.95 7.5,6.3L10.3,9.35L10.83,5.62C10.33,5.26 10,4.67 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.67 13.67,5.26 13.17,5.62L13.7,9.35L16.47,6.29C16.18,5.94 16,5.5 16,5A2,2 0 0,1 18,3M5,20H19V22H5V20Z"/>}
            {props.figure == CellFigure.ROOK &&
                <path d="M5,20H19V22H5V20M17,2V5H15V2H13V5H11V2H9V5H7V2H5V8H7V18H17V8H19V2H17Z"/>}
        </svg>

    )
}



export const ChessCell = (props: IChessCellProps): React.ReactNode => {
    const generalSetting: GeneralContextType = useContext(GeneralContext)!
    const numbers: string = !generalSetting.gamerIsWhiteColor ? " 12345678 " : " 87654321 ";

    const backgroundColor = props.isHighlighted
        ? 'green'
        : props.isBlackBackground
            ? "#3b0083"
            : "#c2a4ff";

    switch (props.cellType){
        case HelperCell.EMPTY_ANGLE:
            return (<div style={{backgroundColor: '#b64600'}}></div>);
        case HelperCell.NUMBER:
            return (<div style={{backgroundColor: '#b64600', alignSelf: 'center', textAlign: 'center'}} >{numbers[props.y]}</div>);
        case HelperCell.LETTER:
            return (<div style={{backgroundColor: '#b64600', alignSelf: 'center', textAlign: "center"}}>{" ABCDEFGH "[props.x]}</div>);
        case HelperCell.REGULAR:
            return (
                <div style={{ backgroundColor }}
                     onClick={props.onClick}>
                {props.data?.status != CellStatus.EMPTY && <ChessFigure {...props.data!}/>}
                </div>)
    }
}