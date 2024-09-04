import {CellFigure, CellStatus, HelperCell} from "./chess_core.ts";
import {Dispatch, SetStateAction} from "react";

export type CellState = {
    status: CellStatus,
    figure?: CellFigure
}

export type ChessDesk = CellState[][];

export type DeskBackground = boolean[][]; //черное true

export interface IDeskProps {
    desk: ChessDesk,
    sources: IChessCellProps[][];
    setSources: Dispatch<SetStateAction<IChessCellProps[][]>>
}

export interface IChessCellProps {
    isBlackBackground?: boolean,
    data?: CellState,
    cellType: HelperCell,
    isHighlighted?: boolean;
    onClick?: () => void,
    // prevX?: number,
    // prevY?: number,
    x: number,
    y: number
}

export type ParsedCell = {
    notation: string;
    // prevX?: number,
    // prevY?: number,
    x: number;
    y: number;
}

export type StepsData = {
    steps: ParsedCell[],
    eatenFigures: ParsedCell[]
}
