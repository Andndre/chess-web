import { ChessGame, Color } from 'chess_typescript';
import { Piece } from './Piece';
import { getIndex } from 'chess_typescript';

interface IBoard {
	game: ChessGame;
}

export default function Board(props: IBoard) {
	const getColor = (i: number, j: number) => {
		return (i + j) % 2 == 0 ? 'darkTileColor' : 'lightTileColor';
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
									key={`col-${x}`}
									// 100% / 8 = 12.5%
									className={`w-[12.5%] ${getColor(y, x)}`}
								>
									<Piece
										type={props.game.board.tiles[getIndex(x, y)].getType()}
										black={props.game.board.tiles[getIndex(x, y)].isColor(
											Color.black
										)}
									/>
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}
