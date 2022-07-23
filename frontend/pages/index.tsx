import Link from 'next/link';

function App() {
	return (
		<div className="relative">
			<img className="w-screen absolute z-0 top-0" src="herobg.svg" alt="bg" />
			<div className="absolute z-10 w-full">
				<div className="pt-36 px-4 text-center">
					<section className="min-h-screen items-center w-full flex flex-col">
						<h1 className="font-bold text-4xl md:text-5xl lg:text-6xl max-w-4xl text-gray-700">
							The Easiest Way to <span className="text-chess">Play Chess</span>{' '}
							With Your <span className="text-discord">Discord</span> Friends
						</h1>
						<div className="pt-12"></div>
						<img
							className="w-full max-w-4xl rounded-lg overflow-hidden"
							src="screenshot.png"
							alt="screenshot"
						/>
						<div className="pt-12"></div>
						<div className="flex gap-2 sm:gap-5 items-center md:text-xl">
							<div className="px-5 py-3 bg-gray-600 border-gray-600 border-[6px] rounded-lg font-bold text-gray-400 cursor-not-allowed">
								Invite Bot
								<br />
								Coming soon
							</div>
							or
							<Link href="https://github.com/Andndre/chess-bot">
								<a className="px-5 py-3 flex items-center gap-2 font-bold rounded-lg border-gray-700 border-[6px]">
									<img className="h-[24px]" src="github.png" alt="github" />
									Host it Yourself
								</a>
							</Link>
						</div>
					</section>
					<section className="min-h-screen flex flex-col gap-2 items-center justify-center">
						<h2 className="font-bold text-3xl md:text-4xl lg:text-5xl">
							Offline mode
						</h2>
						<div className="pt-4"></div>
						<div className="flex gap-4 items-center font-bold text-lg p-2 bg-slate-400">
							<div className="w-24">Easy</div>
							<div className="flex w-24 h-11">
								<Link href="/computer?ai=easy">
									<a className="w-1/2 h-full bg-slate-200 cursor-pointer" />
								</Link>
								<Link href="/computer?ai=easy&asBlack=1">
									<a className="w-1/2 h-full bg-gray-800 cursor-pointer" />
								</Link>
							</div>
						</div>
						<div className="flex gap-4 items-center font-bold text-lg p-2 bg-slate-400">
							<div className="w-24">Monkey</div>
							<div className="flex w-24 h-11">
								<Link href="/computer?ai=monkey">
									<a className="w-1/2 h-full bg-slate-200 cursor-pointer" />
								</Link>
								<Link href="/computer?ai=monkey&asBlack=1">
									<a className="w-1/2 h-full bg-gray-800 cursor-pointer" />
								</Link>
							</div>
						</div>
						<div className="flex gap-4 items-center font-bold text-lg p-2 bg-slate-400">
							<div className="w-24">Local multiplayer</div>
							<div className="flex w-24 h-11">
								<Link href="/computer">
									<a className="w-1/2 h-full bg-slate-200 cursor-pointer" />
								</Link>
								<Link href="/computer?asBlack=1">
									<a className="w-1/2 h-full bg-gray-800 cursor-pointer" />
								</Link>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

export default App;
