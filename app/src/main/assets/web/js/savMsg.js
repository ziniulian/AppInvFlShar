function init () {
	dat.uid = rfdo.kvGet("uid");
	if (dat.uid) {
        var t = tools.getTimStr().split(" ");
        timDoe.innerHTML = t[0];
        dat.tim += t[1];
        tools.memo.bind(memoDom);
	} else {
		window.location.href = "./login.html";
	}
}

dat = {
	uid: "",
	tim: " ",
	stu: 0, // 1:读取; 2:添加; 3:删除;

    hdAjaxCb: function (d) {
        if (d.ok) {
            dat.back();
        } else {
            tools.memo.show(d.msg);
        }
        dat.stu = 0;
    },

	// 添加消息
	addMsg: function () {
	    if (dat.stu === 0) {
	        var s = "content=";
	        var t = txtDoe.value;
	        if (t) {
	            s += t;
	            t = addDoe.value;
	            if (t) {
	                s += "&address=";
	                s += t;
	                s += "&time=";
	                s += timDoe.innerHTML;
	                s += dat.tim;
	                s += "&uid=";
	                s += dat.uid;
	                dat.stu = 2;

	                t = namDoe.value;
	                if (t) {
	                    s += "&customer_name=";
	                    s += t;
	                }
	                t = telDoe.value;
	                if (t) {
	                    s += "&customer_phone=";
	                    s += t;
	                }
	                t = cpDoe.value;
	                if (t) {
	                    s += "&customer_company=";
	                    s += t;
	                }
	                t = depDoe.value;
	                if (t) {
	                    s += "&customer_department=";
	                    s += t;
	                }
	                t = jobDoe.value;
	                if (t) {
	                    s += "&customer_job=";
	                    s += t;
	                }
        	        rfdo.ajxPost("addMessage/", s);
	            } else {
	                tools.memo.show("地点不能为空！");
	            }
	        } else {
	            tools.memo.show("消息内容不能为空！");
	        }
	    }
	},

    // 日期选择
	datePicker: function () {
	    var a = timDoe.innerHTML.split("-");
	    rfdo.showDatePicker(a[0] - 0, a[1] - 1, a[2] - 0);
	},

	// 日期修改
	setDate: function (strd) {
	    timDoe.innerHTML = strd;
    },

	// 回退
	back: function () {
		window.location.href = "./multiMsg.html";
	}
};
