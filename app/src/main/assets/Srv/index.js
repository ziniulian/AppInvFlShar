// 资料下载测试服务
require("lzr");
// var https = require("https");
var mutipart = require("connect-multiparty");
var fs = require("fs");

LZR.load([
	"LZR.Node.Srv"
]);

var dat = [
	{id:1, nam:"电子标签", typ:1, memo:"简单的说明...", pid:0, path:""},
	{id:2, nam:"地面读出装置", typ:1, pid:0, path:""},
	{id:3, nam:"编程器", typ:1, pid:0, path:""},
	{id:4, nam:"便携式标签读出器", typ:1, memo:"简单的说明...", pid:0, path:""},
	{id:5, nam:"检测仪器", typ:1, pid:0, path:""},
	{id:6, nam:"线缆", typ:1, pid:0, path:""},
	{id:7, nam:"防雷单元", typ:1, pid:0, path:""},
	{id:8, nam:"磁钢", typ:1, pid:0, path:""},
	{id:9, nam:"天线", typ:1, pid:0, path:""},
	{id:10, nam:"XCTF", typ:1, pid:1, path:"1"},
	{id:11, nam:"XCTF_2", typ:1, pid:10, path:"1,10"},
	{id:12, nam:"XCTF_2J", typ:1, pid:10, path:"1,10"},
	{id:13, nam:"XCTF_3J", typ:1, pid:10, path:"1,10"},
	{id:14, nam:"XCTF_5", typ:1, pid:10, path:"1,10"},
	{id:15, nam:"XC系列", typ:1, pid:2, path:"2"},
	{id:16, nam:"简配系列", typ:1, pid:2, path:"2"},
	{id:17, nam:"XC-2", typ:1, pid:15, path:"2,15"},
	{id:18, nam:"XC-3", typ:1, pid:15, path:"2,15"},
	{id:19, nam:"XCJP-3", typ:1, pid:16, path:"2,16"},
	{id:20, nam:"XCJP-5", typ:1, pid:16, path:"2,16"},
	{id:21, nam:"XC-3A", typ:1, pid:18, path:"2,15,18"},
	{id:22, nam:"XC-3B", typ:1, pid:18, path:"2,15,18"},
	{id:23, nam:"XC-3C", typ:1, pid:18, path:"2,15,18"},
	{id:24, nam:"XC-3E", typ:1, pid:18, path:"2,15,18"},
	{id:25, nam:"XC-3F", typ:1, pid:18, path:"2,15,18"},
	{id:26, nam:"XCJP-3A", typ:1, pid:19, path:"2,16,19"},
	{id:27, nam:"XCJP-3S", typ:1, pid:19, path:"2,16,19"},
	{id:28, nam:"XCJP-5G", typ:1, pid:20, path:"2,16,20"},
	{id:29, nam:"XCJP-5G说明书", typ:2, memo:"简单的说明...", pid:28, path:"pag.pdf"},
	{id:30, nam:"XCJP-5G图纸", typ:2, memo:"简单的说明...", pid:28, path:"logo.png"},
	{id:31, nam:"XCJP-3A说明书", typ:2, memo:"简单的说明...", pid:26, path:"pag.pdf"},
	{id:32, nam:"XCJP-3S图纸", typ:2, memo:"简单的说明...", pid:27, path:"logo.png"},
	{id:33, nam:"XC-3A图纸", typ:2, memo:"简单的说明...", pid:21, path:"logo.png"},
	{id:34, nam:"XC-3B图纸", typ:2, memo:"简单的说明...", pid:22, path:"logo.png"},
	{id:35, nam:"XC-3C图纸", typ:2, memo:"简单的说明...", pid:23, path:"logo.png"},
	{id:36, nam:"XC-3E图纸", typ:2, memo:"简单的说明...", pid:24, path:"logo.png"},
	{id:37, nam:"XC-3F图纸", typ:2, memo:"简单的说明...", pid:25, path:"logo.png"},
	{id:38, nam:"XCTF_2说明书", typ:2, memo:"简单的说明...", pid:11, path:"pag.pdf"},
	{id:39, nam:"XCTF_2J说明书", typ:2, memo:"简单的说明...", pid:12, path:"pag.pdf"},
	{id:40, nam:"XCTF_3J说明书", typ:2, memo:"简单的说明...", pid:13, path:"pag.pdf"},
	{id:41, nam:"XCTF_5说明书", typ:2, memo:"简单的说明...", pid:14, path:"pag.pdf"},
	{id:42, nam:"读出器简介", typ:2, memo:"简单的说明...", pid:15, path:"pag.pdf"},
	{id:43, nam:"其它", typ:1, pid:0, path:""}
];

var srv = new LZR.Node.Srv ({
	ip: process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0",
	port: process.env.OPENSHIFT_NODEJS_PORT || 8888
});

// 获取分类
srv.ro.get("/getSimi/:id?/", function (req, res) {
	var i, id, o = null;
	id = req.params.id - 0;
	if (!id) {
		id = 0;
	}

	if (id) {
		id = dat[id - 1];
		if (id) {
			o = {
				id: id.id,
				nam: id.nam,
				typ: id.typ
			};
			switch (o.typ) {
				case 1:
					o.sub = [];	// 子类
					for (i = 0; i < dat.length; i ++) {
						if (dat[i].pid === id.id) {
							o.sub.push(dat[i]);
						}
					}
					o.p = [];	// 父类
					if (id.path) {
						id = id.path.split(",");
						for (i = 0; i < id.length; i ++) {
							o.p.push(dat[id[i] - 1]);
						}
					}
					break;
				case 2:
					o.path = id.path;	// 路径
					break;
			}
		}
	} else {
		o = [];
		for (i = 0; i < dat.length; i ++) {
			if (dat[i].pid === id) {
				o.push(dat[i]);
			}
		}
	}
	res.json(o);
});

// 按名称搜索
srv.ro.get("/search/:kw/", function (req, res) {
	var k, r = [];
	k = req.params.kw.toLowerCase();
	for (i = 0; i < dat.length; i ++) {
		if (dat[i].nam.toLowerCase().indexOf(k) > -1) {
			r.push(dat[i]);
		}
	}
	res.json(r);
});

// 新增分类
srv.ro.get("/addSimi/:nam/:pid/:memo?/", function (req, res) {
	var o = {
		id: dat.length + 1,
		nam: req.params.nam,
		typ: 1,
		memo: req.params.memo || "",
		pid: 0,
		path: ""
	};
	var t, p = req.params.pid - 0;
	if (p) {
		o.pid = p;

		// 检查父类的有效性
		t = dat[p - 1];
		if (t && t.typ === 1) {
			if (t.path) {
				o.path = t.path + "," + t.id;
			} else {
				o.path = "" + t.id;
			}
		} else {
			res.send("{\"ok\":false,\"msg\":\"父类不存在\"}");
			return;
		}
	}

	// 检查是否重名
	for (i = 0; i < dat.length; i ++) {
		t = dat[i];
		if (t.pid === o.pid && t.nam === o.nam) {
			res.send("{\"ok\":false,\"msg\":\"重名\"}");
			return;
		}
	}

	dat.push(o);
	res.send("{\"ok\":true,\"id\":" + o.id + "}");
});

// 文件上传
srv.ro.post("/upload/", mutipart({uploadDir:"./web"}));
srv.ro.post("/upload/", function (req, res, next) {
	// 注：此时，文件已接收完毕。无文件传输，则自动生成一个空文件
	// //这里打印可以看到接收到文件的信息。
    // console.log(req.files);
    // console.log(req.body);

	var t, i, p = req.body.pid - 0;
	var f = req.files.myfile;

	if (p && f && f.size) {
		// 检查父类的有效性
		t = dat[p - 1];
		if (t && t.typ === 1) {
			// 检查是否重名
			for (i = 0; i < dat.length; i ++) {
				t = dat[i];
				if (t.pid === p && t.nam === f.name) {
					p = 0;
					res.send("{\"ok\":false,\"msg\":\"重名\"}");
					break;
				}
			}

			// 保存数据
			if (p) {
				t = {
					id: dat.length + 1,
					nam: f.name,
					typ: 2,
					memo: req.body.memo || "",
					pid: p,
					path: f.path.substr(4)
				};
				dat.push(t);
				res.send("{\"ok\":true,\"id\":" + t.id + "}");
			}
		} else {
			p = 0;
			res.send("{\"ok\":false,\"msg\":\"父类不存在\"}");
		}
	} else {
		p = 0;
		res.send("{\"ok\":false,\"msg\":\"文件无效\"}");
	}

	// 条件不符，删除文件
	if (!p && f && f.path) {
		fs.unlink(f.path, function (e) {
			// console.log("del : " + e);
		});
	}
});

// 删除分类


srv.ro.setStaticDir("/", "./web");
srv.use("*", function (req, res) {
	res.status(404).send("404");
});

srv.start();

// // 开启 HTTPS 协议
// var httpsOp = {
// 	// passphrase: "123456",  // 生成密钥有密码时使用
// 	key: fs.readFileSync("./key/privatekey.pem"),
// 	cert: fs.readFileSync("./key/certificate.pem")
// };
// https.createServer(httpsOp, srv.so).listen(443, function() {
// 	console.log("服务已运行 ...");
// });
