import { useRouter } from 'next/router';
import ChessOnline from '../components/ChessOnline';

function App() {
	const router = useRouter();

	if (!router.query.gameId || !router.query.roleKey) return <div>LOADING</div>;

	return (
		<div className="h-screen flex justify-center items-center">
			<ChessOnline
				gameId={router.query.gameId as string}
				roleKey={router.query.roleKey as string}
			/>
		</div>
	);
}

export default App;
