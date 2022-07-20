import { Server, Socket } from 'socket.io';

const EVENTS = {
	connection: 'connection',
};

export function socket(io: Server) {
	io.on(EVENTS.connection, (socket: Socket) => {
		console.log('New connection');
	});
}
