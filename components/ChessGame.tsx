import { ChessGame } from 'chess_typescript';
import { useMemo } from 'react';
import Board from './Board';

export default function ChessGameComponent() {
	const chessGame = useMemo(() => ChessGame.newStandardGame(), []);
	return (
		<div className="w-[500px] h-[500px] border-black border-[1px]">
			<Board game={chessGame} />
		</div>
	);
}
