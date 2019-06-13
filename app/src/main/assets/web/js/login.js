function init () {
	// rfdo.kvSet("uid", "test");	// 测试服务版
	if (rfdo.kvGet("uid")) {
		window.location.href = "./home.html";
	} else {
		tools.memo.bind(memoDom);
	}
}

dat = {
    login: function () {
		var u = unamDom.value;
		var p = pwdDom.value;
        if (u) {
	        if (p) {
				rfdo.ajxGet("weblogin?cod=" + u + "&pw=" + p);
			} else {
				tools.memo.show("密码不能为空！");
			}
		} else {
			tools.memo.show("用户名不能为空！");
		}
    },

	hdAjaxCb: function (d) {
		if (d.ok) {
			rfdo.kvSet("uid", d.uid);
			rfdo.kvSet("unam", d.nam);
			window.location.href = "./home.html";
		} else {
			tools.memo.show(d.msg);
		}
	}
};
