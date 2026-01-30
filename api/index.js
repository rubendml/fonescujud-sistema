import app from '../backend/src/server.js';

export default (req, res) => {
	if (req.method === 'OPTIONS') {
		const origin = req.headers.origin || 'https://rubendml.github.io';
		res.setHeader('Access-Control-Allow-Origin', origin);
		res.setHeader('Access-Control-Allow-Credentials', 'true');
		res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		res.status(200).end();
		return;
	}
	return app(req, res);
};
