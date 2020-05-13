const NodeCache = require("node-cache");

const cache = new NodeCache( {
	stdTTL: 30,
	checkperiod: 3600,
} )

module.exports = async function(key, supplierAsyncFunc) {
	console.log(`Cache: query = ${key}`);
	let val = cache.get(key);
	if (typeof val === "undefined") {
		console.log(`Cache: ${key} not found in cache, applying supplier...`);
		val = await supplierAsyncFunc();
		cache.set(key, val);
	}
	return val;
};