package tk.ziniulian.util;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.text.TextUtils;
import android.webkit.MimeTypeMap;
import android.webkit.URLUtil;

import com.invengo.test.flshar.enums.EmUh;

import static android.content.Context.DOWNLOAD_SERVICE;

/**
 * 下载器
 * Created by LZR on 2019/4/17.
 */

public class DownLoader {
	private Handler h;
	private Context c;
	private DownloadCompleteReceiver receiver = null;

	public DownLoader (Context c, Handler hd) {
		this.c = c;
		this.h = hd;
	}

	// 获取文件类型
	public String getMIMEType(String url) {
		String type = null;
		String extension = MimeTypeMap.getFileExtensionFromUrl(url);
//Log.i("-----extension:{}", extension + "");
		if (extension != null) {
			type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
		}
//Log.i("-----type:{}", type + "");
		return type;
	}

	// 通过系统下载器下载文件
	public void downloadBySystem (String url, String contentDisposition, String mimeType) {
		// 指定下载地址
		DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
		// 允许媒体扫描，根据下载的文件类型被加入相册、音乐等媒体库
		request.allowScanningByMediaScanner();
		// 设置通知的显示类型，下载进行时和完成后显示通知
		request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
		// 设置通知栏的标题，如果不设置，默认使用文件名
//        request.setTitle("This is title");
		// 设置通知栏的描述
//        request.setDescription("This is description");
		// 允许在计费流量下下载
		request.setAllowedOverMetered(true);
		// 允许该记录在下载管理界面可见
		request.setVisibleInDownloadsUi(true);
		// 允许漫游时下载
		request.setAllowedOverRoaming(true);
		// 允许下载的网路类型
		request.setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI);
		// 设置下载文件保存的路径和文件名
		String fileName  = URLUtil.guessFileName(url, contentDisposition, mimeType);
//Log.i("-----fileName:{}", fileName);
		request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);
//        另外可选一下方法，自定义下载路径
//        request.setDestinationUri()
//        request.setDestinationInExternalFilesDir()
		// 设置标题
		request.setTitle(fileName);
		final DownloadManager downloadManager = (DownloadManager) this.c.getSystemService(DOWNLOAD_SERVICE);
		// 添加一个下载任务
		long downloadId = downloadManager.enqueue(request);
//Log.i("-----downloadId:{}", downloadId + "");
	}

	// 获取下载监听
	public void setRcBc () {
		if (this.receiver == null) {
			this.receiver = new DownloadCompleteReceiver();
			IntentFilter intentFilter = new IntentFilter();
			intentFilter.addAction(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
			this.c.registerReceiver(this.receiver, intentFilter);
		}
	}

	// 取消下载监听
	public void dropRcBc () {
		if (this.receiver != null) {
			this.c.unregisterReceiver(this.receiver);
			this.receiver = null;
		}
	}

	// 下载管理器回调
	public class DownloadCompleteReceiver extends BroadcastReceiver {
		@Override
		public void onReceive(Context context, Intent intent) {
//Log.i("-----onReceive:{}", (intent != null ? intent.toUri(0) : null) + "");
			if (intent != null) {
				if (DownloadManager.ACTION_DOWNLOAD_COMPLETE.equals(intent.getAction())) {
					long downloadId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
//Log.i("-----downloadId:{}", downloadId + "");
					DownloadManager downloadManager = (DownloadManager) context.getSystemService(DOWNLOAD_SERVICE);
					String type = downloadManager.getMimeTypeForDownloadedFile(downloadId);
//Log.i("-----getMimeType:{}", type + "");
					if (TextUtils.isEmpty(type)) {
						type = "*/*";
					}
					Uri uri = downloadManager.getUriForDownloadedFile(downloadId);
//Log.i("-----Uri:{}", uri.toString() + "," + uri.getPath());
					if (uri != null) {
						Intent handlerIntent = new Intent(Intent.ACTION_VIEW);
						if (Build.VERSION.SDK_INT >= 24) {	//判读版本是否在7.0以上
							handlerIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);	//添加这一句表示对目标应用临时授权该Uri所代表的文件
						}
						handlerIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
						handlerIntent.setDataAndType(uri, type);
						try {
							context.startActivity(handlerIntent);
						} catch (Exception e) {
							h.sendMessage(h.obtainMessage(EmUh.Err.ordinal(), 0, 0, "无法打开文件！"));
						}
					}
				}
			}
		}
	}
}
