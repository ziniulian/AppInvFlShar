package com.invengo.test.flshar.enums;

/**
 *
 * Created by LZR on 2019/4/15.
 */

public enum EmUrl {
	// 主页
	Home("file:///android_asset/web/s01/home.html"),
	Exit("file:///android_asset/web/s01/home.html"),
	Index("file:///android_asset/web/s01/index.html"),
	Mgr("file:///android_asset/web/s01/mgr.html"),
	AjaxCb("javascript: dat.hdAjaxCb(<0>);"),
	Memo("javascript: tools.memo.show(\"<0>\");"),
	SetFil("javascript: dat.setFil(\"<0>\", \"<1>\");"),
	OkFil("javascript: dat.okFil(<0>);"),
	Back("javascript: dat.back();");

	private final String url;
	EmUrl(String u) {
		url = u;
	}

	@Override
	public String toString() {
		return url;
	}
}
