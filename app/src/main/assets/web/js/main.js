mn = {
/****************** 数据库 ******************/
	ajxGet: function (url) {
mn.log("0003");
	    rfod.ajxGet(url);
mn.log("0004");
	},

/****************** 基础方法 ******************/
	getVersion: function () {
		return rfdo.getVersion();
	},
	setUrl: function (ip, port) {
		return rfdo.setUrl(ip, port);
	},

	kvGet: function (k) {
		return rfdo.kvGet(k);
	},
	kvSet: function (k, v) {
		return rfdo.kvSet(k, v);
	},
	kvDel: function (k) {
		return rfdo.kvDel(k);
	},
	qryWs: function (m, p) {
		return JSON.parse(rfdo.qryWs(m, p));
	},

	music: function (typ) {
		rfdo.music(typ);
	},

	log: function (msg) {
		rfdo.log(msg);
	}
};
