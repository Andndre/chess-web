import { ChessGame } from 'chess_typescript';
import { getIndex } from 'chess_typescript';
import { useEffect, useMemo, useState } from 'react';
import Board from './Board';

interface IBoard {
	gameId: string;
	roleKey: string;
}

export default function ChessOnline(props: IBoard) {
	const [selected, setSelected] = useState(-1);
	const webSocket = useMemo(() => new WebSocket('ws://localhost:3333/ws'), []);
	const [watching, setWatching] = useState(false);
	const [freezed, setFreezed] = useState(false);
	const [asBlack, setAsBlack] = useState(false);
	const game = useMemo(() => ChessGame.newStandardGame(), []);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		webSocket.onopen = (_ev) => {
			setConnected(true);
			webSocket.send(
				JSON.stringify({
					type: 'connectToGame',
					roleKey: props.roleKey,
					gameId: props.gameId,
				})
			);
			webSocket.onmessage = (ev) => {
				const json = JSON.parse(ev.data);

				if (json.type === 'connectToGame') {
					if (json.role === 'watching') {
						setWatching(true);
					} else if (json.role === 'black') {
						setAsBlack(true);
					}
					if (json.moves.length) {
						for (const move of json.moves) {
							game.mover.moveStrict(move.from, move.to);
							if (move.becomeTo) {
								const lastMove = game.mover.getLastMove();
								game.board.tiles[lastMove.to.index].code = move.becomeTo;
							}
							game.mover.next();
						}
						// rerender
						setSelected((prev) => prev - 1);
					}
				} else if (json.type === 'move') {
					const move = json.move;
					game.mover.moveStrict(move.from, move.to);
					if (move.becomeTo) {
						const lastMove = game.mover.getLastMove();
						game.board.tiles[lastMove.to.index].code = move.becomeTo;
					}
					game.mover.next();
					// rerender
					setSelected((prev) => prev - 1);
					setFreezed(false);
				}
			};
		};
	}, []);

	const getRole = () => {
		if (watching) return 'watching';
		if (asBlack) return 'black';
		return 'white';
	};

	const handleClick = (x: number, y: number) => {
		if (watching || freezed || game.gameOver) return;
		const index = getIndex(x, y);
		if (selected >= 0 && selected < 64) {
			const avMoves = game.mover.allMoves[selected];
			for (const avMove of avMoves) {
				if (avMove.to.index === index) {
					game.mover.moveStrict(avMove.from.index, avMove.to.index);
					game.mover.next();
					setSelected(-1);
					setFreezed(true);
					webSocket.send(
						JSON.stringify({
							type: 'move',
							gameId: props.gameId,
							role: getRole(),
							move: {
								from: avMove.from.index,
								to: avMove.to.index,
							},
						})
					);
					return;
				}
			}
		}
		setSelected(index);
	};

	if (!connected) return <div>CONNECTING...</div>;

	return (
		<Board
			game={game}
			selected={selected}
			asBlack={asBlack}
			onClick={handleClick}
		/>
	);
}
