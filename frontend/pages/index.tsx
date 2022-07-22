import { useState } from 'react';

function App() {
	const [playAsWhite, setPlayAsWhite] = useState('');
	const [playAsBlack, setPlayAsBlack] = useState('');
	const [watchLink, setwatchLink] = useState('');
	const getLink = async () => {
		const res = await fetch(
			'https://chess-web-production.up.railway.app/create'
		);
		const json = await res.json();
		const url =
			'chess-web-ten.vercel.app/online?gameId=' + json.gameId + '&roleKey=';
		setPlayAsWhite(url + json.whiteId);
		setPlayAsBlack(url + json.blackId);
		setwatchLink(url + json.watchKey);
	};
	return (
		<div className="h-screen flex flex-col gap-3 justify-center items-center">
			<h1 className="font-bold text-5xl">
				HOME PAGE (have not designed it yet).
			</h1>
			<h2 className="font-bold text-4xl">Online Mode</h2>
			<div className="flex">
				<button className="bg-blue-400" onClick={getLink}>
					Get game links (Online mode)
				</button>
				(If the game link is not played in 10 minutes, it will delete itself.)
			</div>
			<p>
				Play as white: <span className="bg-orange-400">{playAsWhite}</span>
			</p>
			<p>
				Play as black: <span className="bg-orange-400">{playAsBlack}</span>
			</p>
			<p>
				watch: <span className="bg-orange-400">{watchLink}</span>
			</p>
			<h2 className="font-bold text-4xl">Play with computer</h2>
			<div className="flex gap-2">
				<a className="bg-orange-400" href={'/computer?ai=easy'}>
					Easy mode (as white)
				</a>
				<a className="bg-orange-400" href={'/computer?asBlack=1&ai=easy'}>
					Easy mode (as black)
				</a>
			</div>
			<div className="flex gap-2">
				<a className="bg-orange-400" href={'/computer?ai=monkey'}>
					Random mode (as white)
				</a>
				<a className="bg-orange-400" href={'/computer?asBlack=1&ai=monkey'}>
					Random mode (as black)
				</a>
			</div>
			<a className="bg-orange-400" href={'/computer'}>
				Local multiplayer
			</a>
		</div>
	);
}

export default App;
