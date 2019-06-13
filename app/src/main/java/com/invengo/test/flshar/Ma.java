package com.invengo.test.flshar;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.view.KeyEvent;
import android.webkit.DownloadListener;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.invengo.test.flshar.entity.Web;
import com.invengo.test.flshar.enums.EmUh;
import com.invengo.test.flshar.enums.EmUrl;

import java.io.File;

import tk.ziniulian.util.AdrSys;
import tk.ziniulian.util.DownLoader;
import tk.ziniulian.util.Str;

import static tk.ziniulian.util.UriParser.getPhotoPathFromContentUri;

public class Ma extends AppCompatActivity {
	private Handler uh = new UiHandler();
	private DownLoader dr = new DownLoader(this, uh);
	private WebView wv;
	private String ver = "";
	private Web w = new Web(this);

	private static String[] PERMISSIONS_STORAGE = {
			"android.permission.READ_EXTERNAL_STORAGE",
			"android.permission.ACCESS_ALL_DOWNLOADS",
			"android.permission.WRITE_EXTERNAL_STORAGE" };

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_ma);
		ver = AdrSys.getVerNam(this);

		this.getPermission();
		this.dr.setRcBc();

		wv = (WebView)findViewById(R.id.wv);
		WebSettings ws = wv.getSettings();
		ws.setDefaultTextEncodingName("UTF-8");
		ws.setJavaScriptEnabled(true);
		wv.addJavascriptInterface(w, "rfdo");

		// 页面跳转处理
		wv.setWebViewClient(new WebViewClient() {
			@Override
			public boolean shouldOverrideUrlLoading(WebView v, String url) {
				v.loadUrl(url);
				return true;
			}
		});

		// 下载处理
		wv.setDownloadListener(new DownloadListener() {
			@Override
			public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
				dr.downloadBySystem(url, contentDisposition, mimetype);
			}
		});

		sendUrl(EmUrl.Login );
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		this.dr.dropRcBc();
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		switch (keyCode) {
			case KeyEvent.KEYCODE_BACK:
				EmUrl e = getCurUi();
				if (e != null) {
					switch (e) {
						case Exit:
							return super.onKeyDown(keyCode, event);
						default:
							sendUrl(EmUrl.Back);
							return true;
					}
				} else if (wv.canGoBack()) {
					wv.goBack();
					return true;
				} else {
					return super.onKeyDown(keyCode, event);
				}
			default:
				return super.onKeyDown(keyCode, event);
		}
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);
		if (requestCode == 101) {
			if (resultCode == RESULT_OK) {
				Uri uri = data.getData();
				if (uri != null) {
					File f = new File(uri.toString());
					String path = getPhotoPathFromContentUri(this, uri);
					if (path != null) {
						File file = new File(path);
						if (file.exists()) {
							wv.loadUrl(Str.meg(EmUrl.SetFil.toString(), file.toString(), file.getName()));
							return;
						}
					}
				}
			}
		}
		wv.loadUrl(Str.meg(EmUrl.Memo.toString(), "文件选择失败！"));
	}

	public DownLoader getDr() {
		return dr;
	}

	public String getVer() {
		return ver;
	}

	public Handler getHd() {
		return uh;
	}

	// 获取当前页面信息
	private EmUrl getCurUi () {
		try {
			return EmUrl.valueOf(wv.getTitle());
		} catch (Exception e) {
			return null;
		}
	}

	// 页面跳转
	public void sendUrl (String url) {
		uh.sendMessage(uh.obtainMessage(EmUh.Url.ordinal(), 0, 0, url));
	}

	// 页面跳转
	public void sendUrl (EmUrl e) {
		sendUrl(e.toString());
	}

	// 页面跳转
	public void sendUrl (EmUrl e, String... args) {
		sendUrl(Str.meg(e.toString(), args));
	}

	// 发送页面处理消息
	public void sendUh (EmUh e) {
		uh.sendMessage(uh.obtainMessage(e.ordinal()));
	}

	// 页面处理器
	private class UiHandler extends Handler {
		@Override
		public void handleMessage(Message msg) {
			EmUh e = EmUh.values()[msg.what];
			switch (e) {
				case Url:
					wv.loadUrl((String)msg.obj);
					break;
				case Ajax:
					switch (msg.arg1) {
						case 1:	// OkFil
							wv.loadUrl(Str.meg(EmUrl.OkFil.toString(), (String)msg.obj));
						default:
							wv.loadUrl(Str.meg(EmUrl.AjaxCb.toString(), (String)msg.obj));
					}
					break;
				case Err:
					wv.loadUrl(Str.meg(EmUrl.Memo.toString(), (String)msg.obj));
					break;
				default:
					break;
			}
		}
	}

	// 动态申请权限
	private void getPermission () {
		int permission = ActivityCompat.checkSelfPermission(this, "android.permission.WRITE_EXTERNAL_STORAGE");
		if (permission != PackageManager.PERMISSION_GRANTED) {
			ActivityCompat.requestPermissions(this, PERMISSIONS_STORAGE, 1);
		}
	}

}
