import ChessGameComponent from '../components/ChessGame';

function MonkeyMode() {
	return (
		<div className="h-screen flex justify-center items-center">
			<ChessGameComponent ai="monkey" />
		</div>
	);
}

export default MonkeyMode;
