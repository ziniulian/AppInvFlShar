package tk.ziniulian.util.dao;

import android.os.Handler;

import com.invengo.test.flshar.enums.EmUh;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import tk.ziniulian.util.Str;

/**
 * Ajax 上传文件
 * Created by LZR on 2019/4/15.
 */

public class HttpAjaxUpFile implements Runnable {
	private Handler h;
	private String url;
	private String filNam;	// POST的内容
	private boolean busy = false;	// 繁忙

	private String pid;
	private String memo;

	public HttpAjaxUpFile(Handler hd) {
		this.h = hd;
	}

	public boolean post(String u, String fil, String id, String m) {
		if (!this.busy) {
			this.busy = true;
			this.url = u;
			this.filNam = fil;
			this.pid = id;
			this.memo = m;
			new Thread(this).start();
			return true;
		}
		return false;
	}

	@Override
	public void run() {
		try {
			URL u = new URL(this.url);
			HttpURLConnection c = (HttpURLConnection)u.openConnection();
			c.setRequestMethod("POST");

			c.setDoInput(true);
			c.setUseCaches(false);
			c.setRequestProperty("Accept-Charset", "UTF-8");
			c.setRequestProperty("Content-Type", "multipart/form-data;boundary=ZnGpDtePMx0KLzr_G0X99Yef9rZiniulian");
			c.connect();
			DataOutputStream o = new DataOutputStream(c.getOutputStream());

			// 参数 pid
			o.writeBytes("--ZnGpDtePMx0KLzr_G0X99Yef9rZiniulian\r\n" +
					"Content-Disposition: form-data; name=\"pid\"\r\n" +
					"Content-Type: text/plain; charset=UTF-8\r\n" +
					"Content-Transfer-Encoding: 8bit\r\n\r\n");
			o.writeBytes(this.pid);

			// 参数 memo
			o.writeBytes("\r\n--ZnGpDtePMx0KLzr_G0X99Yef9rZiniulian\r\n" +
					"Content-Disposition: form-data; name=\"memo\"\r\n" +
					"Content-Type: text/plain; charset=UTF-8\r\n" +
					"Content-Transfer-Encoding: 8bit\r\n\r\n");
			o.write(Str.Dat2Bytes(this.memo));

			//  文件部分
			File f = new File (this.filNam);
			o.writeBytes("\r\n--ZnGpDtePMx0KLzr_G0X99Yef9rZiniulian\r\n" +
					"Content-Disposition: form-data; name=\"myfile\"; filename=\"" + f.getName() + "\"\r\n" +
					"Content-Type: application/octet-stream\r\n" +
					"Content-Transfer-Encoding: binary\r\n\r\n");
			InputStream in = new FileInputStream(f);
			byte[] buf = new byte[1024];
			int size = 0;
			while ((size = in.read(buf)) != -1) {
				o.write(buf, 0, size);
			}

			// 结尾
			o.writeBytes("\r\n--ZnGpDtePMx0KLzr_G0X99Yef9rZiniulian--\r\n\r\n");
			o.flush();
			o.close();

			if (c.getResponseCode() == 200) {
				InputStream is = c.getInputStream();
				BufferedReader bf = new BufferedReader(new InputStreamReader(is));
				StringBuffer sb = new StringBuffer();
				String s = "";
				do {
					sb.append(s);
					s = bf.readLine();
				} while (s != null);
				is.close();
				bf.close();
				c.disconnect();
				this.h.sendMessage(this.h.obtainMessage(EmUh.Ajax.ordinal(), 1, 0, sb.toString()));
			}
		} catch (Exception e) {
			this.h.sendMessage(this.h.obtainMessage(EmUh.Err.ordinal(), 0, 0, "网络连接失败！"));
		} finally {
			this.busy = false;
		}
	}
}
