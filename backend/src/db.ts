import fetch from 'cross-fetch';

type query = {
	filter?: any;
	document?: any;
	update?: any;
};

export const post = async (
	collection: string,
	action: string,
	query: query
) => {
	const URL = `${process.env.DB_URL}/action/${action}`;
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'api-key': process.env.DATA_API_KEY!,
		},
		body: JSON.stringify({
			dataSource: 'Chess',
			database: 'chess_db',
			collection,
			...query,
		}),
	};
	const response = await fetch(URL, options);
	const json = await response.json();
	return json;
};
