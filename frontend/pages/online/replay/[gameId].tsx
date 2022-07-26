import { ChessGame } from 'chess_typescript';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useMemo, useState } from 'react';
import { useWindowSize } from '../../../hooks/useWindowSize';

interface Move {
	from: number;
	to: number;
	becomeTo?: number;
}

interface Game {
	_id: string;
	moves: Move[];
}

function GameReplay(props: InferGetStaticPropsType<typeof getStaticProps>) {
	const [index, setIndex] = useState(0);
	const windowSize = useWindowSize(0, 80);
	const chessGame = useMemo(() => ChessGame.newStandardGame(), []);

	const boardSize = useMemo(
		() => Math.min(windowSize.height, windowSize.width),
		[windowSize.height, windowSize.width]
	);

	return <div className="center">{JSON.stringify(props)}</div>;
}

export const getStaticProps: GetStaticProps = async (context) => {
	const res = await fetch('https://chess-web-production.up.railway.app/games', {
		// const res = await fetch('http://localhost:3333/games', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			gameId: context.params?.gameId || '',
		}),
	});
	const game = (await res.json()) as Game;

	return {
		props: game,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const res = await fetch(
		'https://chess-web-production.up.railway.app/allGames'
	);
	// const res = await fetch('http://localhost:3333/allGames');
	const json = await res.json();
	const paths = json.games.map((game: Game) => ({
		params: { gameId: game._id },
	}));

	return { paths, fallback: 'blocking' };
};

export default GameReplay;
