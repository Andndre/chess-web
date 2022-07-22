import express from 'express';
import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { v4 } from 'uuid';
import cors from 'cors';

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
	gameId: string;
	white: Player;
	black: Player;
	watchKey: string;
	watchers: WebSocket[];
	moves: Move[];
}

const games: Game[] = [];

const app = express();
app.use(cors());

const httpServer = createServer(app);

const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

app.get('/create', (_req, res) => {
	const whiteId = v4();
	const blackId = v4();
	const gameId = v4();
	const watchKey = v4();
	games.push({
		gameId,
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

	setTimeout(
		() => {
			for (let i = 0; i < games.length; i++) {
				if (games[i].gameId === gameId) {
					if (
						!games[i].watchers.length &&
						!games[i].black.ws &&
						!games[i].white.ws
					) {
						games.splice(i, 1);
					}
					return;
				}
			}
		},
		// 10 minutes
		1000 * 60 * 10
	);

	// TODO: close this when the game is finished, not if 60 minutes have passed.
	setTimeout(() => {
		for (let i = 0; i < games.length; i++) {
			if (games[i].gameId === gameId) {
				games.splice(i, 1);

				return;
			}
		}
	}, 1000 * 60 * 60);

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
	ws.on('message', (data) => {
		const json = JSON.parse(data.toString());
		if (json.type === 'connectToGame') {
			const roleKey = json.roleKey;
			const gameId = json.gameId;
			const game = games.find((e) => e.gameId === gameId);

			let res_role = '';
			if (roleKey === game?.watchKey) {
				res_role = 'watching';
				game!.watchers.push(ws);
			} else {
				if (roleKey === game?.black.id) {
					res_role = 'black';
					game!.black.ws = ws;
				} else if (roleKey === game?.white.id) {
					res_role = 'white';
					game!.white.ws = ws;
				}
			}
			const res = JSON.stringify({
				type: 'connectToGame',
				role: res_role,
				moves: game?.moves,
			});
			ws.send(res);
		} else if (json.type === 'move') {
			const move = json.move as Move;
			const game = games.find((e) => e.gameId === json.gameId);
			const res = JSON.stringify({
				type: 'move',
				move,
			});
			game!.moves.push(move);
			if (json.role === 'black') {
				if (game!.white.ws) {
					game!.white.ws.send(res);
				}
			} else {
				if (game!.black.ws) {
					game!.black.ws.send(res);
				}
			}
			game!.watchers.forEach((w) => {
				w.send(res);
			});
		}
	});
});

app.get('/', (_req, res) => {
	res.status(200).send('Hello API');
});

const PORT = process.env.PORT || 3333;

httpServer.listen(PORT, () => {
	console.log('Server listening at port ' + PORT);
});
