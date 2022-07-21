import ChessGameComponent from '../components/ChessGame';

function EasyMode() {
	return (
		<div className="h-screen flex justify-center items-center">
			<ChessGameComponent ai="easy" />
		</div>
	);
}

export default EasyMode;
