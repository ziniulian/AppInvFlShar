package com.invengo.test.flshar.entity;

import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.webkit.JavascriptInterface;

import com.invengo.test.flshar.Ma;
import com.invengo.test.flshar.enums.EmUh;

import tk.ziniulian.util.DownLoader;
import tk.ziniulian.util.dao.HttpAjax;
import tk.ziniulian.util.dao.HttpAjaxUpFile;

/**
 * 业务接口
 * Created by LZR on 2019/4/15.
 */

public class Web {
	private Ma ma;
	private HttpAjax ajx;
	private HttpAjaxUpFile ajxuf;
	private DownLoader dr;
	private String doMain = "http://125.74.27.226:8888/";

	public Web (Ma m) {
		this.ma = m;
		this.ajx = new HttpAjax(m.getHd());
		this.ajxuf = new HttpAjaxUpFile(m.getHd());
		this.dr = ma.getDr();
	}

	@JavascriptInterface
	public void ajxGet (String url) {
		this.ajx.get(doMain + url);
	}

	@JavascriptInterface
	public void downLoad (String url, String nam) {
		url = doMain + url;
//		this.dr.downloadBySystem(url, "", this.dr.getMIMEType(url));
		this.dr.downloadBySystem(url, nam, "");
	}

	@JavascriptInterface
	public void scdFil () {
		Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
		intent.setType("*/*");
		if (Build.VERSION.SDK_INT >= 24) {	//判读版本是否在7.0以上
			intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);	//添加这一句表示对目标应用临时授权该Uri所代表的文件
		}
		intent.addCategory(Intent.CATEGORY_OPENABLE);
		ma.startActivityForResult(intent, 101);
	}

	@JavascriptInterface
	public void upFil (String url, String path, String pid, String memo) {
		Handler h = ma.getHd();
		if (this.ajxuf.post(doMain + url, path, pid, memo)) {
			h.sendMessage(h.obtainMessage(EmUh.Err.ordinal(), 0, 0, "文件上传中，请稍候..."));
		} else {
			h.sendMessage(h.obtainMessage(EmUh.Err.ordinal(), 0, 0, "上传失败：有文件正在上传"));
		}
	}

}
