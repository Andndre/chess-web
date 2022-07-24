import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

function App() {
	return (
		<>
			<Head>
				<title>
					Play Chess Quickly With Your Discord Friends - Discord Bot - Chess
				</title>
				<meta
					name="description"
					content="Invite the bot or host the bot yourself to get the ability to play chess with your Discord friends QUICKLY!"
				/>
			</Head>
			<div className="relative">
				<svg
					className="w-full absolute z-0 top-0"
					viewBox="0 0 1440 653"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M-51.4286 651.571C87.1429 671.571 254.487 357.051 535.714 398.714C805.714 438.714 1000.87 607.928 1174.29 528.714C1405.71 423 1565.71 335.857 1565.71 244.429C1565.71 139.528 1533.33 63 1460 -59.8572L-115.714 -95.5714L-51.4286 651.571Z"
						fill="url(#paint0_linear_5_14)"
					/>
					<path
						d="M-222.857 538.714C-135.714 520.143 -71.4286 355.857 428.571 485.857C928.571 615.857 991.429 585.857 1224.29 438.714C1457.14 291.571 1405.71 287.286 1655.71 284.429C1855.71 282.143 1851.43 255.857 1824.29 243V-72.7143H-191.429L-222.857 538.714Z"
						fill="url(#paint1_linear_5_14)"
					/>
					<path
						d="M-160 647.286C-18.5714 631.571 166.776 473.403 418.571 451.571C665.714 430.143 890 545.857 1080 460.143C1302.86 359.604 1328.57 288.714 1581.43 334.429C1688.65 353.813 1532.86 64.9047 1492.86 -78.4286L-115.714 -69.8571L-294.286 517.286L-160 647.286Z"
						fill="url(#paint2_linear_5_14)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_5_14"
							x1="725"
							y1="-95.5714"
							x2="725"
							y2="652.488"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="white" />
							<stop offset="1" stopColor="white" stopOpacity="0.53" />
						</linearGradient>
						<linearGradient
							id="paint1_linear_5_14"
							x1="807.435"
							y1="-72.7143"
							x2="807.435"
							y2="582.634"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="white" />
							<stop offset="1" stopColor="white" stopOpacity="0.22" />
						</linearGradient>
						<linearGradient
							id="paint2_linear_5_14"
							x1="712.916"
							y1="-78.4286"
							x2="712.916"
							y2="631.571"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="white" />
							<stop offset="1" stopColor="white" stopOpacity="0.34" />
						</linearGradient>
					</defs>
				</svg>

				<div className="absolute z-10 w-full">
					<div className="pt-36 px-4 text-center">
						<section className="min-h-screen items-center w-full flex flex-col">
							<h1 className="font-bold text-4xl md:text-5xl lg:text-6xl max-w-4xl text-gray-700">
								The Easiest Way to{' '}
								<span className="text-chess">Play Chess</span> With Your{' '}
								<span className="text-discord">Discord</span> Friends
							</h1>
							<div className="pt-12"></div>
							<Image
								width={741}
								height={298}
								className="rounded-lg overflow-hidden"
								src="/screenshot.png"
								alt="screenshot"
							/>
							<div className="pt-12"></div>
							<div className="flex flex-col sm:flex-row gap-2 sm:gap-5 items-center text-sm md:text-xl">
								<div className="px-5 py-3 bg-gray-700 border-gray-700 border-[6px] rounded-lg font-bold text-gray-50 cursor-not-allowed">
									Invite Bot
									<br />
									Coming soon
								</div>
								or
								<Link href="https://github.com/Andndre/chess-bot">
									<a className="px-5 py-3 flex items-center gap-2 font-bold rounded-lg border-gray-700 border-[6px]">
										<Image
											width={24}
											height={24}
											src="/github.png"
											alt="github"
										/>
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
							<div className="flex gap-4 items-center font-bold text-lg p-2 bg-gray-100 rounded-lg shadow-lg">
								<div className="w-24">Easy</div>
								<div className="flex w-24 h-11 border-[2px] border-gray-600 rounded-full overflow-hidden">
									<Link href="/computer?ai=easy">
										<a className="w-1/2 h-full lightTileColor cursor-pointer"></a>
									</Link>
									<Link href="/computer?ai=easy&asBlack=1">
										<a className="w-1/2 h-full darkTileColor cursor-pointer"></a>
									</Link>
								</div>
							</div>
							<div className="flex gap-4 items-center font-bold text-lg p-2 bg-gray-100 rounded-lg shadow-lg">
								<div className="w-24">Monkey</div>
								<div className="flex w-24 h-11 border-[2px] border-gray-600 rounded-full overflow-hidden">
									<Link href="/computer?ai=monkey">
										<a className="w-1/2 h-full lightTileColor cursor-pointer"></a>
									</Link>
									<Link href="/computer?ai=monkey&asBlack=1">
										<a className="w-1/2 h-full darkTileColor cursor-pointer"></a>
									</Link>
								</div>
							</div>
							<div className="flex gap-4 items-center font-bold text-lg p-2 bg-gray-100 rounded-lg shadow-lg">
								<div className="w-24">Local multiplayer</div>
								<div className="flex w-24 h-11 border-[2px] border-gray-600 rounded-full overflow-hidden">
									<Link href="/computer">
										<a className="w-1/2 h-full lightTileColor cursor-pointer"></a>
									</Link>
									<Link href="/computer?asBlack=1">
										<a className="w-1/2 h-full darkTileColor cursor-pointer"></a>
									</Link>
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
