import { config } from 'dotenv';
config();
import express from 'express';
import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { v4 } from 'uuid';
import cors from 'cors';
import { post } from './db';

interface Player {
	id: string;
	ws?: WebSocket;
}

interface Move {
	from: number;
	to: number;
	// for promoting
	becomeTo?: number;
}

interface Game {
	white: Player;
	black: Player;
	watchKey: string;
	watchers: WebSocket[];
	moves: Move[];
}

const games = new Map<string, Game>();
const connections = new Map<string, string>();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

app.get('/create', (_req, res) => {
	const whiteId = v4();
	const blackId = v4();
	const gameId = v4();
	const watchKey = v4();
	games.set(gameId, {
		white: {
			id: whiteId,
		},
		black: {
			id: blackId,
		},
		watchKey: watchKey,
		watchers: [],
		moves: [],
	});

	// delete game when no one is playing the game in 6 minutes
	setTimeout(
		() => {
			const game = games.get(gameId);
			if (!game) return;
			if (!game.black.ws || !game.white.ws) {
				games.delete(gameId);
				console.log('closing game (' + gameId + ') due to inactivity');
			}
		},
		// 6 minutes
		1000 * 60 * 6
	);

	res.status(201).send(
		JSON.stringify({
			gameId,
			whiteId,
			blackId,
			watchKey,
		})
	);
});

wss.on('connection', (ws, _req) => {
	const connectionID = v4();
	ws.on('message', (data) => {
		const json = JSON.parse(data.toString());
		if (json.type === 'connectToGame') {
			const roleKey = json.roleKey;
			const gameId = json.gameId;
			const game = games.get(gameId);

			if (!game) {
				ws.send(
					JSON.stringify({
						type: 'error',
						errorType: 'game-not-found',
					})
				);
				ws.close();
				return;
			}

			let res_role = '';
			if (roleKey === game.watchKey) {
				res_role = 'watching';
				game.watchers.push(ws);
				connections.set(connectionID, gameId);
			} else {
				if (roleKey === game.black.id) {
					res_role = 'black';
					if (game.black.ws) {
						ws.send(
							JSON.stringify({
								type: 'error',
								errorType: 'link-already-clicked',
							})
						);
						ws.close();
						return;
					}
					connections.set(connectionID, gameId);
					game.black.ws = ws;
				} else if (roleKey === game.white.id) {
					res_role = 'white';
					if (game.white.ws) {
						ws.send(
							JSON.stringify({
								type: 'error',
								errorType: 'link-already-clicked',
							})
						);
						ws.close();
						return;
					}
					connections.set(connectionID, gameId);
					game.white.ws = ws;
				}
			}
			const res = JSON.stringify({
				type: 'connectToGame',
				role: res_role,
				moves: game.moves,
			});
			ws.send(res);
		} else if (json.type === 'move') {
			const move = json.move as Move;
			const game = games.get(json.gameId)!;
			const res = JSON.stringify({
				type: 'move',
				move,
			});
			game.moves.push(move);
			if (json.role === 'black') {
				if (game.white.ws) {
					game.white.ws.send(res);
				}
			} else {
				if (game.black.ws) {
					game.black.ws.send(res);
				}
			}
			game.watchers.forEach((w) => {
				w.send(res);
			});
		}
	});

	ws.on('close', async () => {
		const gameId = connections.get(connectionID);
		if (gameId) {
			const game = games.get(gameId);
			if (game) {
				if (game.black.ws == ws || game.white.ws == ws) {
					const res = {
						type: 'playerLeave',
						color: '',
					};
					res.color = game.black.ws === ws ? 'black' : 'white';
					const enemy = game.white.ws === ws ? game.black.ws : game.white.ws;
					if (enemy) {
						enemy.send(JSON.stringify(res));
						game.watchers.forEach((w) => {
							w.send(JSON.stringify(res));
							w.close();
						});
					}
					await post('games', 'insertOne', {
						document: {
							_id: gameId,
							moves: game.moves,
						},
					});
					games.delete(gameId);
				} else {
					const index = game.watchers.indexOf(ws);
					if (index !== -1) {
						game.watchers.splice(index, 1);
						const res = {
							type: 'watcherLeave',
						};
						if (game.black.ws) {
							game.black.ws.send(JSON.stringify(res));
						}
						if (game.white.ws) {
							game.white.ws.send(JSON.stringify(res));
						}
					}
				}
			}
		}
	});
});

app.post('/games', async (req, res) => {
	const gameId = req.body.gameId;

	const game = await post('games', 'findOne', {
		filter: {
			_id: gameId,
		},
	});

	res.status(200).send(JSON.stringify(game.document));
});

app.get('/', (_req, res) => {
	res.status(200).send('Hello API');
});

const PORT = process.env.PORT || 3333;

httpServer.listen(PORT, () => {
	console.log('Server listening at port ' + PORT);
});
