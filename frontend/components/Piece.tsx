import { Type as PieceType } from 'chess_typescript';

interface IPiece {
	type: PieceType;
	image: string;
}

export default function PieceBase(props: IPiece) {
	return (
		<>
			<div className="text-[40px] font-bold cursor-pointer">
				<img
					src={props.image}
					alt="piece image"
					className="object-cover w-full h-full"
				/>
			</div>
		</>
	);
}

interface IPiece2 {
	black: boolean;
	type: PieceType;
}

export function Piece(props: IPiece2) {
	let src = '';
	switch (props.type) {
		case PieceType.pawn:
			src = props.black ? 'p.png' : 'pw.png';
			break;
		case PieceType.rook:
			src = props.black ? 'r.png' : 'rw.png';
			break;
		case PieceType.knight:
			src = props.black ? 'n.png' : 'nw.png';
			break;
		case PieceType.bishop:
			src = props.black ? 'b.png' : 'bw.png';
			break;
		case PieceType.queen:
			src = props.black ? 'q.png' : 'qw.png';
			break;
		case PieceType.king:
			src = props.black ? 'k.png' : 'kw.png';
			break;
		default:
			return <></>;
	}
	return <PieceBase type={props.type} image={src} />;
}
