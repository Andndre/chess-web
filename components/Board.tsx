import { ChessGame } from 'chess_typescript';

interface IBoard {
	game: ChessGame;
}

const listOf8 = [0, 1, 2, 3, 4, 5, 6, 7];

export default function Board(props: IBoard) {
	const getColor = (i: number, j: number) => {
		return (i + j) % 2 == 0 ? 'darkTileColor' : 'lightTileColor';
	};

	return (
		<div className="flex-col w-full h-full">
			{listOf8.map((_v, i) => {
				return (
					<div key={`row-${i}`} className="flex h-[12.5%]">
						{listOf8.map((__v, j) => {
							return (
								<div
									key={`col-${j}`}
									// 100% / 8 = 12.5%
									className={`w-[12.5%] ${getColor(i, j)}`}
								></div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}
