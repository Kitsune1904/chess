import React, {useCallback, useContext, useMemo, useState} from "react";
import { CellStatus } from "./chess_core.ts";
import {GeneralContext, GeneralContextType} from "./App.tsx";
import {ChessCell} from "./ChessCell.tsx";
import {IChessCellProps, IDeskProps} from "./Types.ts";


export const Desk = (props: IDeskProps): React.ReactNode => {
    const gamerSettings: GeneralContextType = useContext(GeneralContext)!;
    const [selectedCell, setSelectedCell] = useState<IChessCellProps | null>(null);

    const currentPlayerColor: CellStatus.WHITE | CellStatus.BLACK = useMemo(() =>
        gamerSettings.gamerIsWhiteColor ?
            CellStatus.WHITE :
            CellStatus.BLACK
        , [gamerSettings.gamerIsWhiteColor]);
    console.log(currentPlayerColor)
    /*useEffect((): void => {
        setSources(getRenderSource(props.desk, gamerSettings.gamerIsWhiteColor));
    }, [props.desk, gamerSettings.gamerIsWhiteColor]);*/

    const handleCellClick = useCallback((cell: IChessCellProps) => {
        const clickedFigureStatus: CellStatus = cell.data!.status
        console.log(currentPlayerColor)

        if (selectedCell) {
            const targetFigureStatus: CellStatus= cell.data!.status;
            const isSamePosition: boolean = selectedCell.x === cell.x && selectedCell.y === cell.y;

            if (isSamePosition) {
                setSelectedCell(null);
            } else if (selectedCell.data?.status === currentPlayerColor && (targetFigureStatus !== currentPlayerColor || cell.data?.status === CellStatus.EMPTY)) {
                const updatedSources: IChessCellProps[][] = [...props.sources];
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

                const deskData = [...props.sources];
                const desk = new Array(8).fill(null).map(() => new Array(8).fill(null));
                for (let col = 1; col < 9; col++) {
                    for (let row = 1; row < 9; row++) {
                        desk[col-1][row-1] = deskData[col][row].data;
                    }
                }
                console.log(desk)
                gamerSettings.setDeskMemory(desk)
/*
                props.setSources(getRenderSource(desk,false));
*/
                setSelectedCell(null);

            } else {
                setSelectedCell(null);
            }
        } else if (clickedFigureStatus === currentPlayerColor) {
            setSelectedCell(cell);
        }
    }, [selectedCell, currentPlayerColor, props, gamerSettings]);

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
            {props.sources.map((cells: IChessCellProps[], index: number): React.ReactNode => {
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





