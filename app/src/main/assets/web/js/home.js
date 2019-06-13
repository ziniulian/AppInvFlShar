function init () {
	dat.uid = rfdo.kvGet("uid");
	if (dat.uid) {
		var req = tools.getUrlReq();
		// var url = "getSimi/";	// 测试服务版
		var url = "getSimi?uid=" + dat.uid;
		if (req.id) {
			dat.id = req.id;
			// url += dat.id;	// 测试服务版
			url += "&id=" + dat.id;
		}
		tools.memo.bind(memoDom);
		rfdo.ajxGet(url);
	} else {
		window.location.href = "./login.html";
	}
}

dat = {
	uid: "",
	id: 0,
	burl: "",	// 回退路径

    hdAjaxCb: function (d) {
	    if (d.ok === undefined) {
	        if (d.id) {
				dat.crtBcn(d.p, d.nam);
				dat.crtSub(d.sub);

				// 权限遮蔽
				if (d.pow === 1) {
					if (d.id[0] === "P") {
						btnDirDom.className = "Lc_nosee";
					} else {
						btnFilDom.className = "Lc_nosee";
					}
				} else if (d.pow === 0) {
					btnDirDom.className = "Lc_nosee";
					btnFilDom.className = "Lc_nosee";
				}
			} else {
				dat.crtSub(d);
				btnDirDom.className = "Lc_nosee";
				btnFilDom.className = "Lc_nosee";
			}
		} else {
			if (d.ok) {
				window.location.reload();
			} else {
				tools.memo.show("新增失败：" + d.msg);
			}
		}
    },

	// 创建面包屑
	crtBcn: function (d, n) {
		var a, i;
		dat.burl = "./home.html";
		for (i = 0; i < d.length; i ++) {
			a = document.createElement("a");
			a.innerHTML = d[i].nam;
			a.href = "?id=" + d[i].id;
			bcnDom.innerHTML += " ➣ ";
			bcnDom.appendChild(a);
			dat.burl = a.href;
		}
		bcnDom.innerHTML += " ➣ " + n;
	},

	// 创建列表明细
	crtSub: function (d) {
		var a, i;
		if (d.length) {
			for (i = 0; i < d.length; i ++) {
				a = document.createElement("a");
				switch (d[i].typ) {
					case 1:
						a.innerHTML = "<strong>📁 </strong>" + d[i].nam;
						a.href = "?id=" + d[i].id;
						break;
					case 2:
						a.innerHTML = "<strong>📄 </strong>" + d[i].nam;
						a.href = "javascript: rfdo.downLoad(\"" + d[i].path + "\",\"" + d[i].nam + "\",\"" + d[i].id + "\");";
						break;
					default:
						a.innerHTML = d[i].nam;
						break;
				}
				listDom.appendChild(a);
				if (d[i].memo) {
					a = document.createElement("div");
					a.innerHTML = d[i].memo;
					listDom.appendChild(a);
				}
			}
		} else {
			a = document.createElement("div");
			a.innerHTML = "暂无数据";
			a.className = "non";
			listDom.appendChild(a);
		}
	},

	// 登出
	logout: function () {
		rfdo.kvDel("uid");
		window.location.href = "./login.html";
	},

	// 显示文件夹添加框
	showDir: function () {
		listDom.className = "Lc_nosee";
		filDom.className = "Lc_nosee";
		dirDom.className = "";
		dnamDom.value = "";
		dmmoDom.value = "";
	},

	// 隐藏文件夹添加框
	hidDir: function () {
		dirDom.className = "Lc_nosee";
		filDom.className = "Lc_nosee";
		listDom.className = "list mfs";
	},

	// 添加文件夹
	addDir: function () {
		var nam = dnamDom.value;
		if (nam) {
			// rfdo.ajxGet("addSimi/" + nam + "/" + dat.id + "/" + dmmoDom.value);	// 测试服务版
			rfdo.ajxPost("addSimi/", "nam=" + nam + "&pid=" + dat.id + "&memo=" + dmmoDom.value + "&uid=" + dat.uid);
		} else {
			tools.memo.show("名称不能为空！");
		}
	},

	// 显示上传文件框
	showFil: function () {
		listDom.className = "Lc_nosee";
		dirDom.className = "Lc_nosee";
		filDom.className = "";
		fpathDom.value = "";
		fmmoDom.value = "";
		fnamDom.innerHTML = "点此选择文件";
	},

	// 文件选择
	scdFil: function () {
		rfdo.scdFil();
	},

	// 设置文件路径
	setFil: function (path, nam) {
		fpathDom.value = path;
		fnamDom.innerHTML = nam;
	},

	// 上传文件
	addFil: function () {
		var nam = fpathDom.value;
		if (nam) {
			rfdo.upFil("upload/", nam, dat.id, fmmoDom.value, dat.uid);
		} else {
			tools.memo.show("请先选择文件");
		}
	},

	// 文件上传完毕
	okFil: function (r) {
		var nam = fpathDom.value;
		if (r.ok) {
			window.location.reload();
		} else {
			tools.memo.show("上传失败：" + r.msg);
		}
	},

	// 回退
	back: function () {
		if (barDom.className === "bar") {
			barDom.className = "Lc_nosee";
		} else if (listDom.className === "Lc_nosee") {
			dat.hidDir();
		} else if (dat.burl) {
			window.location.href = dat.burl;
		} else {
			tools.memo.exit("再按一次退出程序", "Exit");
		}
	}
};
