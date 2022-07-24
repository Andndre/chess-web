import { ChessGame } from 'chess_typescript';
import { useMemo } from 'react';
import ChessOffline from '../components/ChessOffline';
import { useRouter } from 'next/router';
import { getAI } from '../types/ai';
import Head from 'next/head';

function App() {
	const chessGame = useMemo(() => ChessGame.newStandardGame(), []);
	const router = useRouter();

	return (
		<>
			<Head>
				<title>Chess - Computer</title>
			</Head>
			<div className="center">
				<ChessOffline
					ai={getAI(router.query.ai as string)}
					game={chessGame}
					asBlack={!!router.query.asBlack}
				/>
			</div>
		</>
	);
}

export default App;
