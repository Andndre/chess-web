import { ChessGame, Color, Type, Utils } from 'chess_typescript';
import { Piece } from './Piece';
import { getIndex } from 'chess_typescript';

interface IBoard {
	game: ChessGame;
	asBlack: boolean;
	onClick: (x: number, y: number) => void;
	selected: number;
	promoteIndex: number;
	onPromoteSelected: (type: Type) => void;
}

// TODO: make this responsive (currently overflowed on small screen devices)
export default function Board(props: IBoard) {
	const getColor = (x: number, y: number) => {
		return (x + y) % 2 == 0 ? 'darkTileColor' : 'lightTileColor';
	};

	const getOverlayColor = (
		x: number,
		y: number,
		game: ChessGame,
		selected: number
	) => {
		const index = getIndex(x, y);
		let col = '';
		if (game.mover.history.length) {
			const lastMove = Utils.lastElementInAnArray(game.mover.history);
			if (lastMove.from.index === index) {
				col = 'bg-[rgba(220,200,0,.3)]';
			} else if (lastMove.to.index === index) {
				col = 'bg-[rgba(250,200,0,.3)]';
			}
		}
		if (selected >= 0 && selected < 64) {
			const avMoves = game.mover.allMoves[selected];
			for (const avMove of avMoves) {
				if (avMove.to.index === index) {
					return 'bg-[rgba(200,0,0,.5)]';
				}
			}
		}
		if (
			index === selected &&
			game.board.tiles[index].isColor(game.mover.current)
		) {
			return 'bg-[rgba(200,0,0,.5)]';
		}
		const color =
			game.mover.current === Color.white ? Color.white : Color.black;
		if (index === game.mover.checkIndex[color]) {
			return 'bg-[rgba(255,0,0,.5)]';
		}
		return col;
	};

	const listOf8 = props.asBlack
		? [7, 6, 5, 4, 3, 2, 1, 0]
		: [0, 1, 2, 3, 4, 5, 6, 7];

	return (
		<div className="w-[524px] h-[524px] shadow-lg rounded-md overflow-clip">
			<div className="flex-col aspect-square">
				{listOf8.map((y) => {
					return (
						<div key={`row-${y}`} className="flex w-full h-[12.5%]">
							{listOf8.map((x) => {
								return (
									<div
										key={`row-${y}_col-${x}`}
										className={`w-[12.5%] ${getColor(x, y)}`}
										onClick={() => {
											props.onClick(x, y);
										}}
									>
										<div
											className={`w-full h-full ${getOverlayColor(
												x,
												y,
												props.game,
												props.selected
											)}`}
										>
											{props.promoteIndex !== getIndex(x, y) ? (
												<Piece
													type={props.game.board.tiles[
														getIndex(x, y)
													].getType()}
													black={props.game.board.tiles[getIndex(x, y)].isColor(
														Color.black
													)}
												/>
											) : (
												<div className="flex flex-col w-full h-full cursor-pointer">
													<div className="flex w-full h-1/2">
														<div
															className="w-1/2 h-full"
															onClick={() => {
																props.onPromoteSelected(Type.queen);
															}}
														>
															<Piece
																type={Type.queen}
																black={props.game.board.tiles[
																	getIndex(x, y)
																].isColor(Color.black)}
															/>
														</div>
														<div
															className="w-1/2 h-full"
															onClick={() => {
																props.onPromoteSelected(Type.rook);
															}}
														>
															<Piece
																type={Type.rook}
																black={props.game.board.tiles[
																	getIndex(x, y)
																].isColor(Color.black)}
															/>
														</div>
													</div>
													<div className="flex w-full h-1/2">
														<div
															className="w-1/2 h-full"
															onClick={() => {
																props.onPromoteSelected(Type.knight);
															}}
														>
															<Piece
																type={Type.knight}
																black={props.game.board.tiles[
																	getIndex(x, y)
																].isColor(Color.black)}
															/>
														</div>
														<div
															className="w-1/2 h-full"
															onClick={() => {
																props.onPromoteSelected(Type.bishop);
															}}
														>
															<Piece
																type={Type.bishop}
																black={props.game.board.tiles[
																	getIndex(x, y)
																].isColor(Color.black)}
															/>
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
}
