import Head from 'next/head';
import { useRouter } from 'next/router';
import ChessOnline from '../../components/ChessOnline';

function App() {
	const router = useRouter();

	if (!router.query.gameId || !router.query.roleKey)
		return <div className="center">Reading Input..</div>;

	return (
		<>
			<Head>
				<title>Chess - Online</title>
			</Head>
			<ChessOnline
				gameId={router.query.gameId as string}
				roleKey={router.query.roleKey as string}
			/>
		</>
	);
}

export default App;
