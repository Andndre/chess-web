import { ChessGame, Type, getIndex } from 'chess_typescript';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Popup from 'reactjs-popup';
import { useWindowSize } from '../hooks/useWindowSize';
import Board from './Board';
import { MessageContainer } from './MessageContainer';

interface IBoard {
	gameId: string;
	roleKey: string;
}

export default function ChessOnline(props: IBoard) {
	const [selected, setSelected] = useState(-1);
	const [promoteIndex, setPromoteIndex] = useState(-1);
	const [watching, setWatching] = useState(false);
	const [freezed, setFreezed] = useState(false);
	const [asBlack, setAsBlack] = useState(false);
	const [isMessage, setIsMessage] = useState(true);
	const [message, setMessage] = useState('Connecting...');
	const [watchers, setWatchers] = useState(0);
	const [watchReplay, setWatchReplay] = useState(false);
	const [popup, setPopup] = useState(false);
	const [popupMessage, setPopupMessage] = useState('');
	const [gameOver, setGameOver] = useState(false);
	const game = useMemo(() => ChessGame.newStandardGame(), []);
	const windowSize = useWindowSize(0, 80);
	const webSocket = useMemo(
		() => new WebSocket('wss://chess-web-production.up.railway.app/ws'),
		// () => new WebSocket('ws://localhost:3333/ws'),
		[]
	);

	const boardSize = useMemo(() => {
		let res = Math.min(windowSize.width, windowSize.height);

		return res;
	}, [windowSize.width, windowSize.height]);

	useEffect(() => {
		game.onGameOver = () => {
			setPopupMessage('Game Over!\n' + game.gameOverReason);
			setPopup(true);
			setFreezed(true);
			setGameOver(true);
		};
		webSocket.onopen = (_ev) => {
			webSocket.send(
				JSON.stringify({
					type: 'connectToGame',
					roleKey: props.roleKey,
					gameId: props.gameId,
				})
			);
			webSocket.onmessage = (ev) => {
				const json = JSON.parse(ev.data);
				switch (json.type) {
					case 'connectToGame':
						if (json.role === 'watching') {
							setWatching(true);
						} else if (json.role === 'black') {
							setAsBlack(true);
						}
						if (!json.waiting) {
							setIsMessage(false);
						} else {
							setIsMessage(true);
							setMessage('Waiting for the players to be ready...');
						}
						setWatchers(json.watchers);
						if (!json.moves.length) break;
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
						break;
					case 'move':
						const move = json.move;
						game.mover.moveStrict(move.from, move.to);
						if (move.becomeTo) {
							const lastMove = game.mover.getLastMove();
							game.board.tiles[lastMove.to.index].code = move.becomeTo;
						}
						if (game.gameOver) {
							webSocket.send(
								JSON.stringify({
									type: 'gameOver',
									gameOverReason: game.gameOverReason,
								})
							);
						} else {
							game.mover.next();
						}
						// rerender
						setSelected((prev) => prev - 1);
						setFreezed(false);
						break;
					case 'start':
						setIsMessage(false);
						break;
					case 'playerLeave':
						if (gameOver) break;
						setIsMessage(true);
						if (getRole() === 'watching') {
							setMessage(
								'A player just quit the game... reload this window to watch the replay'
							);
							break;
						}
						setMessage(
							'Your opponent just quit the game... reload this window to watch the replay'
						);
						break;
					case 'watcherJoin':
						setWatchers((prev) => prev + 1);
						break;
					case 'watcherLeave':
						setWatchers((prev) => prev - 1);
						break;
					case 'error':
						if (json.errorType === 'link-already-clicked') {
							setIsMessage(true);
							setMessage(
								'Somebody already clicked this link. If that person is supposed to be you, make sure to not share the link with anybody.'
							);
							break;
						}
						if (json.errorType === 'game-not-found') {
							setIsMessage(false);
							setWatchReplay(true);
						}
						break;
				}
			};
		};

		return () => webSocket.close();
	}, []);

	const getRole = () => {
		if (watching) return 'watching';
		if (asBlack) return 'black';
		return 'white';
	};

	const onPromoteSelected = (type: Type) => {
		const lastMove = game.mover.getLastMove();
		game.mover.promoteLastMoveTo(type);
		game.mover.next();
		webSocket.send(
			JSON.stringify({
				type: 'move',
				gameId: props.gameId,
				role: getRole(),
				move: {
					from: lastMove.from.index,
					to: lastMove.to.index,
					becomeTo: type,
				},
			})
		);
		setPromoteIndex(-1);
	};

	const handleClick = (x: number, y: number) => {
		if (watching || freezed || game.gameOver) return;
		const index = getIndex(x, y);
		if (selected >= 0 && selected < 64) {
			const avMoves = game.mover.allMoves[selected];
			for (const avMove of avMoves) {
				if (avMove.to.index === index) {
					game.mover.moveStrict(avMove.from.index, avMove.to.index);
					const lastMove = game.mover.getLastMove();
					setSelected(-1);
					setFreezed(true);
					if (game.mover.isPromote()) {
						setPromoteIndex(lastMove.to.index);
						return;
					}
					game.mover.next();
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

	if (isMessage) {
		return (
			<div className="center">
				<MessageContainer>{message}</MessageContainer>
			</div>
		);
	}

	if (watchReplay) {
		return (
			<div className="center">
				<MessageContainer>
					<h3 className="text-3xl font-bold">Game not Found</h3>
					<p>
						It looks like the game has already ended, or you entered the wrong
						link. Try watching the replay right here.
					</p>
					<Link href={`/online/replay/${props.gameId}`}>
						<a className="px-5 py-3 bg-gray-700 border-gray-700 border-[6px] rounded-lg font-bold text-white">
							Watch Replay
						</a>
					</Link>
				</MessageContainer>
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex items-center justify-center w-full h-14">
				<p className="font-medium">{watchers} watching</p>
			</div>
			<Popup open={popup} position="center center" closeOnDocumentClick={false}>
				<MessageContainer>
					<div className="flex flex-col items-center gap-3">
						<h3 className="text-3xl font-bold">
							{popupMessage.split('\n')[0]}
						</h3>
						<p>{popupMessage.split('\n')[1]}</p>
						<button
							onClick={() => {
								setPopup(false);
							}}
							className="px-5 py-3 bg-gray-700 border-gray-700 border-[6px] rounded-lg font-bold text-white"
						>
							Close
						</button>
					</div>
				</MessageContainer>
			</Popup>
			<div className="flex items-center justify-center w-full h-full">
				<Board
					game={game}
					size={boardSize}
					asBlack={asBlack}
					selected={selected}
					onClick={handleClick}
					promoteIndex={promoteIndex}
					onPromoteSelected={onPromoteSelected}
				/>
			</div>
		</div>
	);
}
