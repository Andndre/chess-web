import Head from 'next/head';
import { useRouter } from 'next/router';
import ChessOnline from '../../components/ChessOnline';
import { MessageContainer } from '../../components/MessageContainer';

function App() {
	const router = useRouter();

	if (!router.query.gameId || !router.query.roleKey)
		return (
			<div className="center">
				<MessageContainer>Reading Input..</MessageContainer>
			</div>
		);

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
