import { ChessGame, ChessTimer } from 'chess_typescript';
import { useMemo } from 'react';
import { AIMode } from '../types/ai';
import Board from './Board';

interface IChessGameComponent {
	ai: AIMode;
}

export default function ChessGameComponent(props: IChessGameComponent) {
	const chessGame = useMemo(() => ChessGame.newStandardGame(), []);
	return (
		<div className="w-[500px] h-[500px] border-black border-[1px]">
			<Board ai={props.ai} game={chessGame} />
		</div>
	);
}
