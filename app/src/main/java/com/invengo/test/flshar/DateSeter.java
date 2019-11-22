package com.invengo.test.flshar;

import android.app.DialogFragment;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.DatePicker;

import com.invengo.test.flshar.enums.EmUrl;

/**
 * 日期选择器
 * Created by LZR on 2019/11/21.
 */

public class DateSeter extends DialogFragment {
	private Ma ma;
	private DatePicker dp;
	private int y;
	private int m;
	private int d;

	@Nullable
	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
		View view = inflater.inflate(R.layout.date_seter, container);
//		getDialog().requestWindowFeature(Window.FEATURE_NO_TITLE);	// 对话框隐藏Title

		ma = (Ma) getActivity();
		dp = (DatePicker) (view.findViewById(R.id.dpScd));
		Button btn = (Button) (view.findViewById(R.id.dpBtn));
		btn.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				dismiss();
				String arg = dp.getYear() + "-";
				int t = dp.getMonth() + 1;
				if (t < 10) {
					arg += '0';
				}
				arg += t + "-";
				t = dp.getDayOfMonth();
				if (t < 10) {
					arg += '0';
				}
				arg += t;
				ma.sendUrl(EmUrl.SetDate, arg);
			}
		});
		return view;
	}

	@Override
	public void onResume() {
		getDialog().setTitle("设置时间");
		dp.init(y, m, d, null);
		super.onResume();
	}

	// 参数设置
	public void setArg (Bundle b) {
		this.y = b.getInt("y");
		this.m = b.getInt("m");
		this.d = b.getInt("d");
	}
}
