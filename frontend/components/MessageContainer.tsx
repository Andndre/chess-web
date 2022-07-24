interface IMessageContainer {
	children: JSX.Element | JSX.Element[] | string;
}

export function MessageContainer(props: IMessageContainer) {
	return (
		<div className="p-8 rounded-lg bg-white max-w-2xl text-center flex flex-col gap-3 items-center shadow-lg">
			{props.children}
		</div>
	);
}
