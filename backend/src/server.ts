import express from 'express';
import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { v4 } from 'uuid';

interface Player {
	id: string;
	ws?: WebSocket;
}

interface Game {
	gameId: string;
	white: Player;
	black: Player;
	watchers: WebSocket[];
}

const games: Game[] = [];

const app = express();

const httpServer = createServer(app);

const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

app.get('/create', (_req, res) => {
	const whiteId = v4();
	const blackId = v4();
	const gameId = v4();
	games.push({
		gameId,
		white: {
			id: whiteId,
		},
		black: {
			id: blackId,
		},
		watchers: [],
	});
	res.status(201).send(
		JSON.stringify({
			gameId,
			whiteId,
			blackId,
		})
	);
});

wss.on('connection', (ws, req) => {
	ws.on('message', (data) => {
		console.log('got a message: ' + data.toString());
	});

	console.log(req.url);

	console.log('new socket openned');
});

app.get('/', (_req, res) => {
	res.status(200).send('Hello API');
});

httpServer.listen(3333, () => {
	console.log('Server listening at http://localhost:3333');
});
