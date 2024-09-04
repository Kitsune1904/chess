import {CellState, ChessDesk, DeskBackground, IChessCellProps, ParsedCell} from "./Types.ts";

export enum CellFigure {
    PAWN = 0, //пешка
    BISHOP = 1, //слон
    KNIGHT = 2, //конь
    ROOK = 3, //ладья
    QUEEN = 4, //ферзь
    KING = 5 //король
}

export enum CellStatus {
    EMPTY,
    WHITE,
    BLACK
}

export enum HelperCell {
    REGULAR = 0,
    LETTER = 1,
    NUMBER = 2,
    EMPTY_ANGLE = 3
}

const altFiguresList: string[] = ["bishop", "bishop", "knight", "knight", "rook", "rook", "queen"];


export const createEmptyDesk = () => {
    const desk = new Array(8).fill(null).map(() => new Array(8).fill(null));
    return desk
}

export const createDeskSkeleton = (len: number, fill: boolean | CellState): (boolean | CellState)[][] => {
    return new Array(len).fill(null).map(() => {
        return new Array(len).fill(null).map(() => fill)
    })
}

/**
 * Ф-ция создает стартовую игровую доску с полным набором фигур
 * @returns ChessDesk
 */
export function createStartDesk(): ChessDesk {

    const desk = createDeskSkeleton(8, {status: CellStatus.EMPTY})

    for (let i = 0; i < 8; i++) {
        desk[1][i] = {
            status: CellStatus.WHITE,
            figure: CellFigure.PAWN
        };
        desk[6][i] = {
            status: CellStatus.BLACK,
            figure: CellFigure.PAWN
        }
        switch (i) {
            case 0:
            case 7:
                desk[0][i] = {
                    status: CellStatus.WHITE,
                    figure: CellFigure.ROOK
                };
                desk[7][i] = {
                    status: CellStatus.BLACK,
                    figure: CellFigure.ROOK
                }
                break;
            case 1:
            case 6:
                desk[0][i] = {
                    status: CellStatus.WHITE,
                    figure: CellFigure.KNIGHT
                };
                desk[7][i] = {
                    status: CellStatus.BLACK,
                    figure: CellFigure.KNIGHT
                }
                break;
            case 2:
            case 5:
                desk[0][i] = {
                    status: CellStatus.WHITE,
                    figure: CellFigure.BISHOP
                };
                desk[7][i] = {
                    status: CellStatus.BLACK,
                    figure: CellFigure.BISHOP
                }
                break;
            case 3:
                desk[0][i] = {
                    status: CellStatus.WHITE,
                    figure: CellFigure.QUEEN
                };
                desk[7][i] = {
                    status: CellStatus.BLACK,
                    figure: CellFigure.QUEEN
                }
                break;
            case 4:
                desk[0][i] = {
                    status: CellStatus.WHITE,
                    figure: CellFigure.KING
                };
                desk[7][i] = {
                    status: CellStatus.BLACK,
                    figure: CellFigure.KING
                }
                break;
        }
    }
    return <CellState[][]>desk;
}


/**
 * Ф-ция при помощи которой происходит изменение сторон для фигур, в зависимости от цвета игрока
 * @param desk
 * @param isWhiteGamer
 * @returns ChessDesk
 */
export function getRotatedDesk(desk: ChessDesk, isWhiteGamer: boolean): ChessDesk {
    if (isWhiteGamer) {
        const desk2: (boolean | CellState)[][] = createDeskSkeleton(8, {status: CellStatus.EMPTY})

        for (let i = 0; i < 8; i++) {
            desk2[7 - i] = [...desk[i]];
        }
        return <ChessDesk>desk2;
    }
    return desk;
}

/**
 * Ф-ция при помощи которой окрашиваются ячейки доски, в зависимости от того какой цвет у игрока
 * @param isWhiteGamer
 * @returns DeskBackground
 */
export function getRotatedBackground(isWhiteGamer: boolean): DeskBackground {
    const proto: (boolean | CellState)[][] = createDeskSkeleton(8, false)

    for (let row = 0; row < 8; row++) {
        for (let cell = 0; cell < 8; cell++) {
            if (row % 2 !== (isWhiteGamer ? 1 : 0)) {
                proto[row][cell] = cell % 2 !== 0;
            } else {
                proto[row][cell] = cell % 2 === 0
            }
        }
    }
    return <DeskBackground>proto
}


/**
 * Ф-ция создает полную информацию о всей доске
 * @param desk
 * @param isWhiteGamer
 * @param shouldRotate
 * @returns IChessCellProps[][]
 */
export function getRenderSource(desk: ChessDesk, shouldRotate: boolean = true, isWhiteGamer: boolean = true): IChessCellProps[][] {
    const result: IChessCellProps[][] = [];
    result[0] = [
        {cellType: HelperCell.EMPTY_ANGLE, x: 0, y: 0},
        ...new Array(8).fill(0).map((_: number, index: number): IChessCellProps => {
            return {cellType: HelperCell.LETTER, x: index + 1, y: 0};
        }),
        {cellType: HelperCell.EMPTY_ANGLE, x: 9, y: 0}
    ]
    // const datas: ChessDesk = getRotatedDesk(desk, isWhiteGamer);
    const datas: ChessDesk = shouldRotate ? getRotatedDesk(desk, isWhiteGamer) : desk;

    const backgrounds: DeskBackground = getRotatedBackground(isWhiteGamer);
    for (let y = 1; y < 9; y++) {
        result[y] = []
        result[y].push({cellType: HelperCell.NUMBER, x: 0, y: y})
        for (let x = 0; x < 8; x++) {
            result[y].push({
                cellType: HelperCell.REGULAR, x: x + 1, y: y,
                data: datas[y - 1][x],
                isBlackBackground: backgrounds[y - 1][x]
            })
        }
        result[y].push({cellType: HelperCell.NUMBER, x: 9, y: y})
    }
    result[9] = [
        {cellType: HelperCell.EMPTY_ANGLE, x: 0, y: 9},
        ...new Array(8).fill(0).map((_: number, index: number): IChessCellProps => {
            return {cellType: HelperCell.LETTER, x: index + 1, y: 9};
        }),
        {cellType: HelperCell.EMPTY_ANGLE, x: 9, y: 9}
    ]
    return result;
}

/**
 * Ф-ция генератор рандомных чисел по определенному промежутку
 * @param min
 * @param max
 * @returns number
 */
const getRandomNum = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Ф-ция рандомизатор массива. Алгоритм "Тасование Фишера — Йетса"
 * @param array
 * @returns string[] | CellState[]
 */
function shuffle(array: string[] | CellState[]): string[] | CellState[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}


/**
 * Ф-ция рандомизатор для старших фигур, рандомизирует старшие фигуры из массива и
 * дополняет младшими по достижению нужного кол-ва фигур
 * @param altCount
 * @param figuresCount
 * @returns string[] - массив строк с рандомно выбранными старшими фигурами и дополненными младшими
 */
const getRandomFiguresList = (altCount: number, figuresCount: number): string[] => {
    const arr = [];
    while (arr.length < figuresCount) {
        if (arr.length < altCount) {
            if (altCount > 1) {
                const randomList: string[] = shuffle([...altFiguresList]) as string[]
                randomList.unshift('king');
                arr.push(...randomList.slice(0, altCount))
            } else {
                arr.push('king');
            }
        } else {
            arr.push('pawn')
        }
    }
    return arr
}

/**
 * Ф-ция которая создает массив обхектоыв по типу CellState, где отображена информация про
 * цвет фигуры и саму фигуру
 * @param arr
 * @param color
 * @returns CellState[]
 */
const getCellState = (arr: string[], color: string): CellState[] => {
    const colorScheme = color === "white" ? CellStatus.WHITE : CellStatus.BLACK;
    const arrWithState = [];
    for (let i = 0; i < arr.length; i++) {
        switch (arr[i]) {
            case('king'):
                arrWithState[i] = {
                    status: colorScheme,
                    figure: CellFigure.KING
                }
                break;
            case('bishop'):
                arrWithState[i] = {
                    status: colorScheme,
                    figure: CellFigure.BISHOP
                }
                break;
            case('knight'):
                arrWithState[i] = {
                    status: colorScheme,
                    figure: CellFigure.KNIGHT
                }
                break;
            case('rook'):
                arrWithState[i] = {
                    status: colorScheme,
                    figure: CellFigure.ROOK
                }
                break;
            case('queen'):
                arrWithState[i] = {
                    status: colorScheme,
                    figure: CellFigure.QUEEN
                }
                break;
            case('pawn'):
                arrWithState[i] = {
                    status: colorScheme,
                    figure: CellFigure.PAWN
                }
                break;
        }
    }
    return arrWithState
}


/**
 * Ф-ция создает двумерный массив, в котором записана рандомизированная информация о клетках доски
 * @returns ChessDesk
 */
export const getRandomDesk = (): ChessDesk => {
    const figuresCount = getRandomNum(10, 32);

    const whiteCount = getRandomNum(1, figuresCount < 16 ? figuresCount : 16);
    const whiteAltCount = (getRandomNum(1, whiteCount < 8 ? whiteCount : 8));

    const blackCount = figuresCount - whiteCount;
    const blackAltCount = (getRandomNum(1, blackCount < 8 ? blackCount : 8));


    const whiteFiguresList: string[] = getRandomFiguresList(whiteAltCount, whiteCount);
    const blackFiguresList: string[] = getRandomFiguresList(blackAltCount, blackCount);

    const white: CellState[] = getCellState(whiteFiguresList, "white");
    const black: CellState[] = getCellState(blackFiguresList, "black");

    const resultArr: CellState[] = [...white, ...black];

    while (resultArr.length < 64) {
        resultArr.push({
            status: CellStatus.EMPTY
        })
    }

    const randomArr: CellState[] = shuffle([...resultArr]) as CellState[];

    let counter = 0;
    const matrix: CellState[][] = new Array(8).fill(0).map(() => new Array(8));
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            matrix[row][col] = randomArr[counter++];
        }
    }
    return matrix
}

export const parseClickedCell = (/*firstStep: IChessCellProps,*/ secondStep: IChessCellProps, isTakeFigure?: boolean): ParsedCell => {
    const letters: string = ' abcdefgh '
    const indexes = secondStep.data?.status === CellStatus.BLACK ? ' 12345678 ' : ' 87654321 ';
    let parsedCellInfo: string = '';
    switch (secondStep.data?.figure) {
        case CellFigure.PAWN:
            break
        case CellFigure.KING:
            parsedCellInfo += 'K';
            break;
        case CellFigure.QUEEN:
            parsedCellInfo += 'Q';
            break;
        case CellFigure.ROOK:
            parsedCellInfo += 'R';
            break;
        case CellFigure.KNIGHT:
            parsedCellInfo += 'N';
            break;
        case CellFigure.BISHOP:
            parsedCellInfo += 'B';
            break;
    }

    if (isTakeFigure) {
        return {
            /*notation: secondStep.data?.figure === CellFigure.PAWN ?
                `${letters[firstStep.x]}${letters[secondStep.x]}` :
                `${parsedCellInfo}:${letters[secondStep.x]}${indexes[secondStep.y]}`,*/
            notation: `${parsedCellInfo}:${letters[secondStep.x]}${indexes[secondStep.y]}`,
            prevX: secondStep.prevX,
            prevY: secondStep.prevY,
            x: secondStep.x,
            y: secondStep.y
        }
    } else {
        return {
            notation: `${parsedCellInfo}${letters[secondStep.x]}${indexes[secondStep.y]}`,
            prevX: secondStep.prevX,
            prevY: secondStep.prevY,
            x: secondStep.x,
            y: secondStep.y
        }
    }
}

export const getFigure = (notation: string): CellFigure => {
    if (notation.length === 2 || notation[0] === ':') {
        return CellFigure.PAWN
    } else {
        switch (notation[0]){
            case 'K':
                return CellFigure.KING;
            case 'Q':
                return CellFigure.QUEEN;
            case 'R':
                return CellFigure.ROOK;
            case 'N':
                return CellFigure.KNIGHT;
            case 'B':
                return CellFigure.BISHOP;
            default:
                throw new Error(`Unknown figure notation: ${notation[0]}`);
        }
    }
}

const getCellAdress = (notation: string, isWhiteGamer: boolean) => {

}

export const stepsConventor = (steps: ParsedCell[], isWhiteGamer: boolean): IChessCellProps[] => {
    if (!steps || steps.length === 0) {
        console.log('Steps array is empty.');
        return [];
    }
    const convertedSteps: IChessCellProps[] = [];

    const backgrounds: DeskBackground = getRotatedBackground(isWhiteGamer);

    for (let i = 0; i < steps.length; i++) {
        if (i % 2 !== 0) {
            convertedSteps.push({
                isBlackBackground: backgrounds[steps[i].y-1][steps[i].x],
                data: {
                    status: CellStatus.WHITE,
                    figure: getFigure(steps[i].notation),
                },
                cellType: HelperCell.REGULAR,
                x: steps[i].x,
                y: steps[i].y,
                // prevX: steps[i].prevX,
                // prevY: steps[i].prevY,
            });
        } else if (i % 2 === 0) {
            convertedSteps.push({
                isBlackBackground: backgrounds[steps[i].y][steps[i].x],
                data: {
                    status: CellStatus.BLACK,
                    figure: getFigure(steps[i].notation),
                },
                cellType: HelperCell.REGULAR,
                x: steps[i].x,
                y: steps[i].y,
                // prevX: steps[i].prevX,
                // prevY: steps[i].prevY,
            });
        } else {
            throw new Error(`Unknown figure notation`);
        }
    }
    return convertedSteps;
}

/*const getBackground = (x, y, prevX, prevY) => {

}*/

/*export const historyController = (counter: number, steps: ParsedCell[], eaten: ParsedCell[], desk: IChessCellProps[][], isWhiteGamer: boolean) => {

    const convertedSteps: IChessCellProps[] = stepsConventor([...steps], isWhiteGamer);
    const convertedEaten: IChessCellProps[] = stepsConventor([...eaten], isWhiteGamer)

    const move: IChessCellProps = convertedSteps[counter];

    const eatenFigure: IChessCellProps = convertedEaten[counter - 1];

    console.log(steps[counter - 1].notation.includes(":"))
    if(steps[counter - 1].notation.includes(":")) {
        desk[move.x][move.y] = move;
        desk[eatenFigure.x][eatenFigure.y] = eatenFigure;
    } else {
        console.log(convertedSteps[counter])
        console.log(move)

        if (isWhiteGamer) {
            desk[move.y][move.x]= {
                ...move,
                data: {
                    status: CellStatus.EMPTY
                }
            };

            desk[move.prevX!][move.prevY!] = {
                ...move,
                data: {
                    status: CellStatus.WHITE,
                    figure: convertedSteps[counter].data!.figure
                }
            };
        } else {
            desk[move.y][move.x]= {
                ...move,
                data: {
                    status: CellStatus.EMPTY
                }
            };

            desk[move.prevY!][move.prevX!] = {
                ...move,
                data: {
                    status: CellStatus.BLACK,
                    figure: convertedSteps[counter].data!.figure
                }
            };
        }



    }
}*/
