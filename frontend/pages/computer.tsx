import { ChessGame } from 'chess_typescript';
import { useMemo } from 'react';
import ChessOffline from '../components/ChessOffline';
import { useRouter } from 'next/router';
import { getAI } from '../types/ai';

function App() {
	const chessGame = useMemo(() => ChessGame.newStandardGame(), []);
	const router = useRouter();

	return (
		<div className="center">
			<ChessOffline
				ai={getAI(router.query.ai as string)}
				game={chessGame}
				asBlack={!!router.query.asBlack}
			/>
		</div>
	);
}

export default App;
