// 显示文件夹添加框
dat.showDir = function () {
	listDom.className = "Lc_nosee";
	filDom.className = "Lc_nosee";
	dirDom.className = "";
	dnamDom.value = "";
	dmmoDom.value = "";
};

// 隐藏文件夹添加框
dat.hidDir = function () {
	dirDom.className = "Lc_nosee";
	filDom.className = "Lc_nosee";
	listDom.className = "list mfs";
};

// 添加文件夹
dat.addDir = function () {
	var nam = dnamDom.value;
	if (nam) {
		// rfdo.ajxGet("addSimi/" + nam + "/" + dat.id + "/" + dmmoDom.value);
		rfdo.ajxPost("addSimi/", "nam=" + nam + "&pid=" + dat.id + "&memo=" + dmmoDom.value);
	} else {
		tools.memo.show("名称不能为空！");
	}
};

// 重定义 回退
dat.back = function () {
	if (listDom.className === "Lc_nosee") {
		dat.hidDir();
	} else if (bcnDom.innerHTML) {
		window.history.back(-1);
	} else {
		window.location.href = "./index.html";
	}
};

// 重定义 ajax 回调
dat.hdAjaxCbHome = dat.hdAjaxCb;
dat.hdAjaxCb = function (d) {
    if (d.ok === undefined) {
		dat.hdAjaxCbHome(d);
	} else {
		if (d.ok) {
			window.location.reload();
		} else {
			tools.memo.show("新增失败：" + d.msg);
		}
	}
};

// 显示上传文件框
dat.showFil = function () {
	if (dat.id) {
		listDom.className = "Lc_nosee";
		dirDom.className = "Lc_nosee";
		filDom.className = "";
		fpathDom.value = "";
		fnamDom.innerHTML = "点此选择文件";
	} else {
		tools.memo.show("不能在此上传文件");
	}
};

// 文件选择
dat.scdFil = function () {
	rfdo.scdFil();
};

// 设置文件路径
dat.setFil = function (path, nam) {
	fpathDom.value = path;
	fnamDom.innerHTML = nam;
};

// 上传文件
dat.addFil = function () {
	var nam = fpathDom.value;
	if (nam) {
		rfdo.upFil("upload/", nam, dat.id, fmmoDom.value);
	} else {
		tools.memo.show("请先选择文件");
	}
};

// 文件上传完毕
dat.okFil = function (r) {
	var nam = fpathDom.value;
	if (r.ok) {
		window.location.reload();
	} else {
		tools.memo.show("上传失败：" + r.msg);
	}
};
