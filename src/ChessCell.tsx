import React, {useContext} from "react";
import {GeneralContext, GeneralContextType} from "./App.tsx";
import {CellStatus, HelperCell} from "./chess_core.ts";
import {ChessFigure} from "./ChessFigure.tsx";
import {IChessCellProps} from "./Types.ts";

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
                    {props.data?.status !== CellStatus.EMPTY && <ChessFigure {...props.data!}/>}
                </div>)
    }
}