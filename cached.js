const NodeCache = require("node-cache");

const cache = new NodeCache( {
	stdTTL: 30,
	checkperiod: 3600,
} )

module.exports = async function(key, supplierAsyncFunc) {
	let val = cache.get(key);
	if (typeof val === "undefined") {
		val = await supplierAsyncFunc();
		cache.set(key, val);
	}
	return val;
};