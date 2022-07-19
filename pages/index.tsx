import { DndProvider } from 'react-dnd';
import ChessGameComponent from '../components/ChessGame';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
	return (
		<div className="App">
			<ChessGameComponent />
		</div>
	);
}

export default App;
