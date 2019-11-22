package com.invengo.test.flshar.entity;

import android.app.DownloadManager;
import android.content.Intent;
import android.database.Cursor;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.webkit.JavascriptInterface;

import com.invengo.test.flshar.Ma;
import com.invengo.test.flshar.enums.EmUh;
import com.invengo.test.flshar.enums.EmUrl;

import java.io.FileNotFoundException;

import tk.ziniulian.util.DownLoader;
import tk.ziniulian.util.dao.DbLocal;
import tk.ziniulian.util.dao.HttpAjax;
import tk.ziniulian.util.dao.HttpAjaxUpFile;

import static android.content.Context.DOWNLOAD_SERVICE;

/**
 * 业务接口
 * Created by LZR on 2019/4/15.
 */

public class Web {
	private Ma ma;
	private Handler h;
	private HttpAjax ajx;
	private HttpAjaxUpFile ajxuf;
	private DownLoader dr;
	private DbLocal db;
	private String doMain = "http://125.74.27.226:8888/api/";
//	private String doMain = "http://192.169.0.12/api/";
//	private String doMain = "http://134.175.29.108/api/";

	public Web (Ma m) {
		this.ma = m;
		this.h = m.getHd();
		this.ajx = new HttpAjax(this.h);
		this.ajxuf = new HttpAjaxUpFile(this.h);
		this.dr = ma.getDr();
		this.db = new DbLocal(m, 1, true);
		this.dr.setDb(this.db);
	}

	@JavascriptInterface
	public void log (String txt) {
		Log.i("---web---", txt);
	}

	@JavascriptInterface
	public void ajxGet (String url) {
		this.ajx.get(doMain + url);
	}

	@JavascriptInterface
	public void ajxPost (String url, String dat) {
		this.ajx.post(doMain + url, dat);
	}

	@JavascriptInterface
	public void downLoad (String url, String nam, String fid) {
		Long did = this.db.getDid(fid);
		if (did != null) {
			DownloadManager downloadManager = (DownloadManager)ma.getSystemService(DOWNLOAD_SERVICE);
			DownloadManager.Query query = new DownloadManager.Query();
			query.setFilterById(did);
			Cursor cursor = downloadManager.query(query);
			if (cursor != null && cursor.moveToFirst()) {
				int columnIndex = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS);
				switch (cursor.getInt(columnIndex)) {
					case DownloadManager.STATUS_FAILED:        // 下载失败
						break;
					case DownloadManager.STATUS_PENDING:    // 等待下载
					case DownloadManager.STATUS_RUNNING:    // 正在下载
					case DownloadManager.STATUS_PAUSED:        // 下载暂停
						h.sendMessage(h.obtainMessage(EmUh.Err.ordinal(), 0, 0, "该文件正在下载中..."));
						return;
					case DownloadManager.STATUS_SUCCESSFUL:    // 下载成功
						boolean b = true;
						try {
							downloadManager.openDownloadedFile(did).close();    // 检查下载的文件是否存在
						} catch (FileNotFoundException e) {
							b = false;	// 文件不存在
						} catch (Exception e) {
//							e.printStackTrace();
						}
						if (b) {
							this.dr.openFilByDid(ma, did);
							return;
						}
						break;
				}
			}
		}
		url = doMain + url;
		this.dr.downloadBySystem(url, nam, fid);
	}

	@JavascriptInterface
	public void scdFil () {
		Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
		intent.setType("*/*");
		intent.addCategory(Intent.CATEGORY_OPENABLE);
		ma.startActivityForResult(intent, 101);
	}

	@JavascriptInterface
	public void upFil (String url, String path, String pid, String memo, String uid) {
		if (this.ajxuf.post(doMain + url, path, pid, memo, uid)) {
			h.sendMessage(h.obtainMessage(EmUh.Err.ordinal(), 0, 0, "文件上传中，请稍候..."));
		} else {
			h.sendMessage(h.obtainMessage(EmUh.Err.ordinal(), 0, 0, "上传失败：有文件正在上传"));
		}
	}

	@JavascriptInterface
	public String kvGet (String k) {
		return this.db.kvGet(k);
	}

	@JavascriptInterface
	public void kvSet (String k, String v) {
		this.db.kvSet(k, v);
	}

	@JavascriptInterface
	public void kvDel (String k) {
		this.db.kvDel(k);
	}

	@JavascriptInterface
	public void logout () {
		this.db.kvDel("uid");
		this.ma.sendUrl(EmUrl.Login);
	}

	@JavascriptInterface
	public String getUid () {
		return this.db.kvGet("uid");
	}

	// 设置日期
	@JavascriptInterface
	public void showDatePicker (int y, int m, int d) {
		Message msg = h.obtainMessage(EmUh.Date.ordinal());
		Bundle b = msg.getData();
		b.putInt("y", y);
		b.putInt("m", m);
		b.putInt("d", d);
		h.sendMessage(msg);
	}
}
