import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
type PieceColor = 'white' | 'black';

interface Piece {
  type: PieceType;
  color: PieceColor;
}

interface Position {
  row: number;
  col: number;
}

const pieceSymbols: Record<PieceColor, Record<PieceType, string>> = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙',
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟',
  },
};

const initialBoard: (Piece | null)[][] = [
  [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' },
  ],
  Array(8).fill({ type: 'pawn', color: 'black' }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ type: 'pawn', color: 'white' }),
  [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' },
  ],
];

const Index = () => {
  const [board, setBoard] = useState<(Piece | null)[][]>(
    initialBoard.map(row => row.map(piece => piece ? { ...piece } : null))
  );
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[]; black: Piece[] }>({
    white: [],
    black: [],
  });

  const isValidMove = (from: Position, to: Position, piece: Piece): boolean => {
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    const absRowDiff = Math.abs(rowDiff);
    const absColDiff = Math.abs(colDiff);
    const targetPiece = board[to.row][to.col];

    if (targetPiece && targetPiece.color === piece.color) return false;

    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        if (colDiff === 0 && !targetPiece) {
          if (rowDiff === direction) return true;
          if (from.row === startRow && rowDiff === 2 * direction && !board[from.row + direction][from.col]) {
            return true;
          }
        }
        
        if (absColDiff === 1 && rowDiff === direction && targetPiece) {
          return true;
        }
        return false;

      case 'knight':
        return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);

      case 'bishop':
        if (absRowDiff !== absColDiff) return false;
        return isPathClear(from, to);

      case 'rook':
        if (rowDiff !== 0 && colDiff !== 0) return false;
        return isPathClear(from, to);

      case 'queen':
        if (rowDiff !== 0 && colDiff !== 0 && absRowDiff !== absColDiff) return false;
        return isPathClear(from, to);

      case 'king':
        return absRowDiff <= 1 && absColDiff <= 1;

      default:
        return false;
    }
  };

  const isPathClear = (from: Position, to: Position): boolean => {
    const rowStep = Math.sign(to.row - from.row);
    const colStep = Math.sign(to.col - from.col);
    let currentRow = from.row + rowStep;
    let currentCol = from.col + colStep;

    while (currentRow !== to.row || currentCol !== to.col) {
      if (board[currentRow][currentCol]) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    return true;
  };

  const getValidMoves = (position: Position, piece: Piece): Position[] => {
    const moves: Position[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(position, { row, col }, piece)) {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  };

  const handleSquareClick = (row: number, col: number) => {
    const clickedPiece = board[row][col];

    if (selectedPosition) {
      const isValidMoveTarget = validMoves.some(
        move => move.row === row && move.col === col
      );

      if (isValidMoveTarget) {
        const newBoard = board.map(r => [...r]);
        const movingPiece = newBoard[selectedPosition.row][selectedPosition.col];
        const capturedPiece = newBoard[row][col];

        if (capturedPiece) {
          setCapturedPieces(prev => ({
            ...prev,
            [capturedPiece.color]: [...prev[capturedPiece.color], capturedPiece],
          }));
        }

        newBoard[row][col] = movingPiece;
        newBoard[selectedPosition.row][selectedPosition.col] = null;

        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        setSelectedPosition(null);
        setValidMoves([]);
      } else if (clickedPiece && clickedPiece.color === currentPlayer) {
        setSelectedPosition({ row, col });
        setValidMoves(getValidMoves({ row, col }, clickedPiece));
      } else {
        setSelectedPosition(null);
        setValidMoves([]);
      }
    } else if (clickedPiece && clickedPiece.color === currentPlayer) {
      setSelectedPosition({ row, col });
      setValidMoves(getValidMoves({ row, col }, clickedPiece));
    }
  };

  const resetGame = () => {
    setBoard(initialBoard.map(row => row.map(piece => piece ? { ...piece } : null)));
    setSelectedPosition(null);
    setCurrentPlayer('white');
    setValidMoves([]);
    setCapturedPieces({ white: [], black: [] });
  };

  const isSelected = (row: number, col: number) => {
    return selectedPosition?.row === row && selectedPosition?.col === col;
  };

  const isValidMoveSquare = (row: number, col: number) => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
            Шахматы ♟️
          </h1>
          <p className="text-slate-300 text-lg">
            Классическая игра для двоих
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-start">
          <Card className="p-6 bg-slate-800/50 backdrop-blur border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Icon name="User" size={20} className="text-slate-400" />
                Чёрные
              </h3>
              <div className="text-sm text-slate-400">
                Взято: {capturedPieces.black.length}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {capturedPieces.black.map((piece, idx) => (
                <span key={idx} className="text-3xl opacity-50">
                  {pieceSymbols[piece.color][piece.type]}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-8 bg-slate-800/80 backdrop-blur border-slate-700">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                <div className={`w-3 h-3 rounded-full ${currentPlayer === 'white' ? 'bg-white' : 'bg-slate-900'} animate-pulse`} />
                <span className="text-white font-semibold text-lg">
                  Ход: {currentPlayer === 'white' ? 'Белые' : 'Чёрные'}
                </span>
              </div>
            </div>

            <div className="inline-block border-4 border-slate-700 rounded-lg overflow-hidden shadow-2xl">
              {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((piece, colIndex) => {
                    const isLight = (rowIndex + colIndex) % 2 === 0;
                    const selected = isSelected(rowIndex, colIndex);
                    const validMove = isValidMoveSquare(rowIndex, colIndex);

                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                        className={`
                          w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-5xl sm:text-6xl
                          transition-all duration-200 relative
                          ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                          ${selected ? 'ring-4 ring-sky-400 ring-inset scale-95' : ''}
                          ${validMove ? 'after:absolute after:w-4 after:h-4 after:bg-sky-400 after:rounded-full after:animate-pulse' : ''}
                          hover:brightness-110 active:scale-95
                        `}
                      >
                        {piece && (
                          <span className={`
                            ${piece.color === 'white' ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-slate-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]'}
                            transition-transform duration-200
                            ${selected ? 'scale-110' : ''}
                          `}>
                            {pieceSymbols[piece.color][piece.type]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button
                onClick={resetGame}
                variant="outline"
                size="lg"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <Icon name="RotateCcw" size={20} className="mr-2" />
                Новая игра
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800/50 backdrop-blur border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Icon name="User" size={20} className="text-slate-400" />
                Белые
              </h3>
              <div className="text-sm text-slate-400">
                Взято: {capturedPieces.white.length}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {capturedPieces.white.map((piece, idx) => (
                <span key={idx} className="text-3xl opacity-50">
                  {pieceSymbols[piece.color][piece.type]}
                </span>
              ))}
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-6 bg-slate-800/30 backdrop-blur border-slate-700">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Icon name="Info" size={20} className="text-sky-400" />
            Как играть
          </h3>
          <ul className="text-slate-300 space-y-2 text-sm">
            <li>• Кликните на фигуру, чтобы увидеть возможные ходы (синие точки)</li>
            <li>• Кликните на подсвеченную клетку, чтобы сделать ход</li>
            <li>• Игра ведётся по классическим шахматным правилам</li>
            <li>• Взятые фигуры отображаются в боковых панелях</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Index;
