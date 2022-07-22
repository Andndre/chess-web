import { AI, ChessGame } from 'chess_typescript';
import { getIndex } from 'chess_typescript';
import { useEffect, useState } from 'react';
import { AIMode } from '../types/ai';
import Board from './Board';

interface IBoard {
	game: ChessGame;
	ai: AIMode;
	asBlack: boolean;
}

export default function BoardOffline(props: IBoard) {
	const [selected, setSelected] = useState(-1);

	useEffect(() => {
		// TODO: make this a popup, AND send it to the server then finally close the game on the server (without waiting for 60 minutes)
		props.game.onGameOver = () => {
			console.log('The game is over: ' + props.game.gameOverReason + '!');
		};
		if (props.asBlack && props.ai !== 'no-ai') {
			const ai =
				props.ai === 'easy'
					? new AI.EasyAI(props.game)
					: new AI.MonkeyAI(props.game);
			const move = ai.getMove();
			if (move) {
				props.game.mover.moveStrict(move.from, move.to);
				props.game.mover.next();
			}
			setSelected(40);
		}
		console.log('asblack: ' + props.asBlack);
	}, [props.asBlack, props.ai]);

	const handleClick = (x: number, y: number) => {
		if (props.game.gameOver) return;
		const index = getIndex(x, y);
		if (selected !== -1) {
			const avMoves = props.game.mover.allMoves[selected];
			for (const avMove of avMoves) {
				if (avMove.to.index === index) {
					props.game.mover.moveStrict(avMove.from.index, avMove.to.index);
					props.game.mover.next();
					setSelected(-1);
					if (props.ai !== 'no-ai') {
						const ai =
							props.ai === 'easy'
								? new AI.EasyAI(props.game)
								: new AI.MonkeyAI(props.game);
						const move = ai.getMove();
						if (move) {
							props.game.mover.moveStrict(move.from, move.to);
							if (!props.game.gameOver) {
								props.game.mover.next();
							}
						}
					}

					return;
				}
			}
		}
		setSelected(index);
	};

	return (
		<Board
			game={props.game}
			selected={selected}
			asBlack={props.asBlack}
			onClick={handleClick}
		/>
	);
}
