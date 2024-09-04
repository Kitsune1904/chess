import React, {useCallback, useContext, useMemo} from "react";
import {CellStatus, createEmptyDesk, parseClickedCell} from "./chess_core.ts";
import {GeneralContext, GeneralContextType} from "./App.tsx";
import {ChessCell} from "./ChessCell.tsx";
import {IChessCellProps, IDeskProps} from "./Types.ts";




export const Desk = (props: IDeskProps): React.ReactNode => {
    const gamerSettings: GeneralContextType = useContext(GeneralContext)!;


    const currentPlayerColor: CellStatus.WHITE | CellStatus.BLACK = useMemo(() =>
        gamerSettings.gamerIsWhiteColor ?
            CellStatus.WHITE :
            CellStatus.BLACK
        , [gamerSettings.gamerIsWhiteColor]);

    const handleCellClick = useCallback((cell: IChessCellProps) => {
        const clickedFigureStatus: CellStatus = cell.data!.status;

        if (gamerSettings.selectedCell) {
            const targetFigureStatus: CellStatus= cell.data!.status;
            const isSamePosition: boolean = gamerSettings.selectedCell.x === cell.x && gamerSettings.selectedCell.y === cell.y;

            if (isSamePosition) {
                gamerSettings.setSelectedCell(null);
            } else if (gamerSettings.selectedCell.data?.status === currentPlayerColor && (targetFigureStatus !== currentPlayerColor || cell.data?.status === CellStatus.EMPTY)) {
                const updatedSources: IChessCellProps[][] = [...props.sources];

                if(targetFigureStatus !== currentPlayerColor && cell.data?.status !== CellStatus.EMPTY) {
                    gamerSettings.setStep([...gamerSettings.steps, parseClickedCell(/*selectedCell,*/ {...cell,
                        data: gamerSettings.selectedCell.data,
                        // prevX: gamerSettings.selectedCell.x,
                        // prevY: gamerSettings.selectedCell.y
                    }, true)]);

                    console.log(gamerSettings.steps)

                    targetFigureStatus !== currentPlayerColor &&
                    gamerSettings.setEatenFigure([...gamerSettings.eatenFigures, parseClickedCell({...cell,
                        data: cell.data,
                        //
                        // prevX: gamerSettings.selectedCell.x,
                        // prevY: gamerSettings.selectedCell.y
                    }, true)]);
                    console.log(props.sources[gamerSettings.selectedCell.y][gamerSettings.selectedCell.x]);
                    console.log(props.sources[cell.y][cell.x]);
                } else {
                    gamerSettings.setStep([...gamerSettings.steps, parseClickedCell(/*cell,*/{...cell,
                        data: gamerSettings.selectedCell.data,
                        // prevX: gamerSettings.selectedCell.x,
                        // prevY: gamerSettings.selectedCell.y
                    }, false)])

                    console.log(gamerSettings.steps)

                }

                updatedSources[gamerSettings.selectedCell.y][gamerSettings.selectedCell.x] = {
                    ...gamerSettings.selectedCell,
                    data: {
                        status: CellStatus.EMPTY
                    }
                };
                updatedSources[cell.y][cell.x] = {
                    ...cell,
                    data: gamerSettings.selectedCell.data
                };

                const deskData = [...props.sources];
                const desk = createEmptyDesk();
                for (let col = 1; col < 9; col++) {
                    for (let row = 1; row < 9; row++) {
                        desk[col-1][row-1] = deskData[col][row].data;
                    }
                }
                // console.log(desk);


                gamerSettings.setCounter(gamerSettings.steps.length + 1)
                gamerSettings.setDeskMemory(desk);
                gamerSettings.setSelectedCell(null);
                /*setStep([...steps, parseClickedCell({...cell,
                    data: selectedCell.data})])*/
            } else {
                gamerSettings.setSelectedCell(null);
            }
        } else if (clickedFigureStatus === currentPlayerColor) {
            gamerSettings.setSelectedCell(cell);
        }

    }, [gamerSettings.selectedCell, currentPlayerColor, props, gamerSettings.steps, gamerSettings.eatenFigures]);

    console.log(gamerSettings.steps);
    console.log(gamerSettings.eatenFigures);

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
                                   isHighlighted={gamerSettings.selectedCell?.x === cell.x && gamerSettings.selectedCell?.y === cell.y}
                                   onClick={() => handleCellClick(cell)}
                        />
                    )
                });
            })}
        </div>
    );
}





