import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socket } from './socket';

const app = express();
// app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:3000',
	},
});

socket(io);

app.get('/', (_req, res) => {
	res.status(200).send('Hello API');
});

httpServer.listen(3333, () => {
	console.log('Server listening at http://localhost:3333');
});
