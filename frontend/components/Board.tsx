import { AI, ChessGame, Color } from 'chess_typescript';
import { Piece } from './Piece';
import { getIndex } from 'chess_typescript';
import { useEffect, useState } from 'react';
import { Utils } from 'chess_typescript';
import { AIMode } from '../types/ai';

interface IBoard {
	game: ChessGame;
	ai: AIMode;
}

export default function Board(props: IBoard) {
	const [chessGame, setChessGame] = useState(props.game);
	const [selected, setSelected] = useState(-1);

	useEffect(() => {
		chessGame.onGameOver[0] = () => {
			console.log('The game is over: ' + chessGame.gameOverReason + '!');
		};
		setChessGame(chessGame);
	}, []);

	const getColor = (x: number, y: number) => {
		return (x + y) % 2 == 0 ? 'darkTileColor' : 'lightTileColor';
	};

	const getOverlayColor = (x: number, y: number) => {
		const index = getIndex(x, y);
		let col = '';
		if (chessGame.mover.history.length) {
			const lastMove = Utils.lastElementInAnArray(chessGame.mover.history);
			if (lastMove.from.index === index) {
				col = 'bg-[rgba(220,200,0,.3)]';
			} else if (lastMove.to.index === index) {
				col = 'bg-[rgba(250,200,0,.3)]';
			}
		}
		if (selected !== -1) {
			const avMoves = chessGame.mover.allMoves[selected];
			for (const avMove of avMoves) {
				if (avMove.to.index === index) {
					return 'bg-[rgba(200,0,0,.5)]';
				}
			}
		}
		if (
			index === selected &&
			chessGame.board.tiles[index].isColor(chessGame.mover.current)
		) {
			return 'bg-[rgba(200,0,0,.5)]';
		}
		const color =
			chessGame.mover.current === Color.white ? Color.white : Color.black;
		if (index === chessGame.mover.checkIndex[color]) {
			return 'bg-[rgba(255,0,0,.5)]';
		}
		return col;
	};

	const handleClick = (x: number, y: number) => {
		if (chessGame.gameOver) return;
		const index = getIndex(x, y);
		if (selected !== -1) {
			const avMoves = chessGame.mover.allMoves[selected];
			for (const avMove of avMoves) {
				if (avMove.to.index === index) {
					chessGame.mover.moveStrict(avMove.from.index, avMove.to.index);
					setSelected(-1);
					if (props.ai !== 'no-ai') {
						const ai =
							props.ai === 'easy'
								? new AI.EasyAI(chessGame)
								: new AI.MonkeyAI(chessGame);
						const move = ai.getMove();
						if (move) {
							chessGame.mover.moveStrict(move.from, move.to);
						}
					}
					setChessGame(chessGame);
					return;
				}
			}
		}
		setSelected(index);
	};

	const listOf8 = [0, 1, 2, 3, 4, 5, 6, 7];

	return (
		<div className="flex-col w-full h-full">
			{listOf8.map((y) => {
				return (
					<div key={`row-${y}`} className="flex h-[12.5%]">
						{listOf8.map((x) => {
							return (
								<div
									key={`row-${y}_col-${x}`}
									// 100% / 8 = 12.5%
									className={`w-[12.5%] ${getColor(x, y)}`}
									onClick={() => {
										handleClick(x, y);
									}}
								>
									<div className={`w-full h-full ${getOverlayColor(x, y)}`}>
										<Piece
											type={chessGame.board.tiles[getIndex(x, y)].getType()}
											black={chessGame.board.tiles[getIndex(x, y)].isColor(
												Color.black
											)}
										/>
									</div>
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}
