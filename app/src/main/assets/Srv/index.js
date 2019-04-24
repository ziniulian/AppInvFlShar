// 资料下载测试服务
require("lzr");

LZR.load([
	"LZR.Node.Srv"
]);

var dat = [
	{id:1, nam:"电子标签", typ:1, pid:0, path:""},
	{id:2, nam:"地面读出装置", typ:1, pid:0, path:""},
	{id:3, nam:"编程器", typ:1, pid:0, path:""},
	{id:4, nam:"便携式标签读出器", typ:1, pid:0, path:""},
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
	{id:29, nam:"XCJP-5G说明书", typ:2, pid:28, path:"pag.pdf"},
	{id:30, nam:"XCJP-5G图纸", typ:2, pid:28, path:"logo.png"},
	{id:31, nam:"XCJP-3A说明书", typ:2, pid:26, path:"pag.pdf"},
	{id:32, nam:"XCJP-3S图纸", typ:2, pid:27, path:"logo.png"},
	{id:33, nam:"XC-3A图纸", typ:2, pid:21, path:"logo.png"},
	{id:34, nam:"XC-3B图纸", typ:2, pid:22, path:"logo.png"},
	{id:35, nam:"XC-3C图纸", typ:2, pid:23, path:"logo.png"},
	{id:36, nam:"XC-3E图纸", typ:2, pid:24, path:"logo.png"},
	{id:37, nam:"XC-3F图纸", typ:2, pid:25, path:"logo.png"},
	{id:38, nam:"XCTF_2说明书", typ:2, pid:11, path:"pag.pdf"},
	{id:39, nam:"XCTF_2J说明书", typ:2, pid:12, path:"pag.pdf"},
	{id:40, nam:"XCTF_3J说明书", typ:2, pid:13, path:"pag.pdf"},
	{id:41, nam:"XCTF_5说明书", typ:2, pid:14, path:"pag.pdf"},
	{id:42, nam:"读出器简介", typ:2, pid:15, path:"pag.pdf"}
];

var srv = new LZR.Node.Srv ({
	ip: process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0",
	port: process.env.OPENSHIFT_NODEJS_PORT || 80
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

srv.ro.setStaticDir("/", "./web");
srv.use("*", function (req, res) {
	res.status(404).send("404");
});

srv.start();
console.log("服务已运行 ...");
