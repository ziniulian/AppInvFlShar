function init () {
	var req = tools.getUrlReq();
	var url = (req.id ? "getSimi/" + req.id : "getSimi");
	tools.memo.bind(memoDom);
	rfdo.ajxGet(url);
	dat.id = req.id - 0;

	// 测试数据
	// console.log(url);
	// dat.hdAjaxCb([{"id":1,"nam":"电子标签","typ":1,"pid":0,"path":""},{"id":2,"nam":"地面读出装置","typ":1,"pid":0,"path":""},{"id":3,"nam":"编程器","typ":1,"pid":0,"path":""},{"id":4,"nam":"便携式标签读出器","typ":1,"pid":0,"path":""},{"id":5,"nam":"检测仪器","typ":1,"pid":0,"path":""},{"id":6,"nam":"线缆","typ":1,"pid":0,"path":""},{"id":7,"nam":"防雷单元","typ":1,"pid":0,"path":""},{"id":8,"nam":"磁钢","typ":1,"pid":0,"path":""},{"id":9,"nam":"天线","typ":1,"pid":0,"path":""}]);
	// dat.hdAjaxCb({"id":14,"nam":"XCTF_5","typ":1,"sub":[{"id":41,"nam":"XCTF_5说明书","typ":2,"pid":14,"path":"pag.pdf"}],"p":[{"id":1,"nam":"电子标签","typ":1,"pid":0,"path":""},{"id":10,"nam":"XCTF","typ":1,"pid":1,"path":"1"}]});
}

dat = {
	id: 0,
    hdAjaxCb: function (d) {
        if (d.id) {
			dat.crtBcn(d.p, d.nam);
			dat.crtSub(d.sub);
		} else {
			dat.crtSub(d);
		}
    },

	// 创建面包屑
	crtBcn: function (d, n) {
		var a, i;
		for (i = 0; i < d.length; i ++) {
			a = document.createElement("a");
			a.innerHTML = d[i].nam;
			a.href = "?id=" + d[i].id;
			bcnDom.innerHTML += " ➣ ";
			bcnDom.appendChild(a);
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
						a.href = "javascript: rfdo.downLoad(\"" + d[i].path + "\",\"" + d[i].nam + "\");";
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
			bcnDom.innerHTML = " ➣ 搜索";
			listDom.innerHTML = "";
			url = "search/" + k;
			rfdo.ajxGet(url);
		} else {
			tools.memo.show("关键字不能为空！");
		}
	},

	// 回退
	back: function () {
		if (bcnDom.innerHTML) {
			if (bcnDom.innerHTML === " ➣ 搜索") {
				window.location.href = "./home.html";
			} else {
				window.history.back(-1);
			}
		} else {
			tools.memo.exit("再按一次退出程序", "Exit");
		}
	}
};
