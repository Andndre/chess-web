import ChessGameComponent from '../components/ChessGame';

function App() {
	return (
		<div className="h-screen flex justify-center items-center">
			<ChessGameComponent ai="no-ai" />
		</div>
	);
}

export default App;
