function init () {
	dat.uid = rfdo.kvGet("uid");
	if (dat.uid) {
		tools.memo.bind(memoDom);
	} else {
		window.location.href = "./login.html";
	}
	tools.memo.bind(memoDom);
}

dat = {
	uid: "",
    hdAjaxCb: function (d) {
		dat.crtSub(d);
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
						a.href = "./home.html?id=" + d[i].id;
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

	// 搜索
	search: function () {
		var url, k = inDom.value;
		if (k) {
			listDom.innerHTML = "";
			// url = "search/" + k;	// 测试服务版
			url = "search?uid=" + dat.uid + "&id=" + k;
			rfdo.ajxGet(url);
		} else {
			tools.memo.show("关键字不能为空！");
		}
	},

	// 回退
	back: function () {
		window.location.href = "./home.html";
	}
};
