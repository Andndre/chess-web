interface IMessageContainer {
	children: JSX.Element | JSX.Element[] | string;
}

export function MessageContainer(props: IMessageContainer) {
	return (
		<div className="flex flex-col items-center max-w-2xl gap-3 p-8 text-center bg-white rounded-lg shadow-lg">
			{props.children}
		</div>
	);
}
