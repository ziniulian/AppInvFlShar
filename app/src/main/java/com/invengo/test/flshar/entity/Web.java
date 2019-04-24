package com.invengo.test.flshar.entity;

import android.webkit.JavascriptInterface;

import com.invengo.test.flshar.Ma;

import tk.ziniulian.util.DownLoader;
import tk.ziniulian.util.dao.HttpAjax;

/**
 * 业务接口
 * Created by LZR on 2019/4/15.
 */

public class Web {
	private Ma ma;
	private HttpAjax ajx;
	private DownLoader dr;
	private String doMain = "http://192.169.0.150/";

	public Web (Ma m) {
		this.ma = m;
		this.ajx = new HttpAjax(m.getHd());
		this.dr = ma.getDr();
	}

	@JavascriptInterface
	public void ajxGet (String url) {
		this.ajx.get(doMain + url);
	}

	@JavascriptInterface
	public void downLoad (String url) {
		url = doMain + url;
		this.dr.downloadBySystem(url, "", this.dr.getMIMEType(url));
	}
}
