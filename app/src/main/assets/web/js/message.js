function init () {
	dat.txtH = txtDoe.scrollHeight;
	dat.txtRow(1);
	txtDoe.style.width = Math.floor(barDoe.clientWidth * 0.9 - btnDoe.clientWidth) + "px"; // 计算输入框的宽度
	dat.uid = rfdo.kvGet("uid");
	if (dat.uid) {
        tools.memo.bind(memoDom);
	    dat.getMsg();
	} else {
		window.location.href = "./login.html";
	}
}

dat = {
	uid: "",
	ps: 5,  // 每页显示个数
	pag: 0, // 页数
	eof: false, // 是否已加载全部消息
	stu: 0, // 1:读取; 2:添加; 3:删除;
	dat: {},    // 数据
	size: 0,
	txtH: 0,    // 输入框高度
	pt: null,   // 翻页前的顶部元素

    hdAjaxCb: function (d) {
        if (d.ok) {
            switch (dat.stu) {
                case 1:
                    for (var i = 0; i < d.data.length; i ++) {
                        dat.crtDoe(d.data[i]);
                    }
                    if (!dat.pag && dat.size) {
                        outDoe.scrollTop = outDoe.scrollHeight; // 消息区滚动至最底部
                    } else if (dat.pt) {
                        outDoe.scrollTop = dat.pt.offsetTop; // 消息区滚动至翻页前最顶部元素
                    }
                    if (d.data.length < dat.ps) {
                        dat.eof = true;
                    } else {
                        dat.pag ++;
                    }
                    break;
                case 2:
                    window.location.reload();
                    break;
                case 3:
                    outDoe.removeChild(dat.dat[dat.pt].doe);
                    tools.memo.show("删除成功");
                    delete dat.dat[dat.pt];
                    dat.size --;
                    break;
            }
        } else {
            if (dat.stu === 1) {
                dat.eof = true;
                if (dat.size === 0) {
                    tools.memo.show("暂无信息");
                }
            } else {
                tools.memo.show(d.msg);
            }
        }
        dat.stu = 0;
    },

    // 创建消息
    crtDoe: function (o) {
        if (!dat[o.mid]) {
            var r = {
                id: o.mid,
                doe: document.createElement("div"),
                tim: o.time,
                nam: o.u_name,
                txt: o.mcontent
            };

            var d = document.createElement("hr");
            r.doe.className = "msgItem";
            r.doe.appendChild(d);

            d = document.createElement("div");
            d.innerHTML = r.nam + " :";
            d.className = "mfs";
            r.doe.appendChild(d);

            d = document.createElement("div");
            d.innerHTML = r.txt;
            d.className = "sfs";
            r.doe.appendChild(d);

            d = document.createElement("div");
            d.innerHTML = r.tim;
            d.className = "msgTim sfs";
            r.doe.appendChild(d);

            if (o.c_uid === dat.uid) {
                d = document.createElement("div");
                d.className = "msgDel sfs";
                d.innerHTML = "✖";
                d.name = o.mid;
                d.onclick = dat.delMsg;
//                d.onclick = "dat.delMsg(\"" + o.mid + "\");";
//                d.onclick = "tools.memo.show(111);";
                r.doe.appendChild(d);
            }

            outDoe.insertBefore(r.doe, outDoe.firstChild);
            dat.dat[o.mid] = r;
            dat.size ++;
        }
    },

	// 获取消息
	getMsg: function () {
	    if (!dat.eof && dat.stu === 0) {
	        dat.stu = 1;
		    rfdo.ajxPost("getMessage/", "n=" + dat.ps + "&a=" + (dat.pag * dat.ps + 1) + "&uid=" + dat.uid);
	    }
	},

	// 添加消息
	addMsg: function () {
	    var t = txtDoe.value;
	    if (t && dat.stu === 0) {
	        dat.stu = 2;
	        rfdo.ajxPost("addMessage/", "content=" + t + "&time=" + tools.getTimStr() + "&uid=" + dat.uid);
	    }
	},

	// 删除消息
	delMsg: function () {
	    if (dat.stu === 0) {
	        dat.stu = 3;
	        dat.pt = this.name;
		    rfdo.ajxPost("delMessage/", "mid=" + dat.pt + "&uid=" + dat.uid);
	    }
	},

	// 翻页
	toPag: function () {
	    if (outDoe.scrollTop === 0) {
	        dat.pt = outDoe.firstChild;
	        dat.getMsg();
	    }
	},

	// 输入框增减行
	txtRow: function (r) {
	    if (!r) {
	        // 计算文本区的行数
	        r = Math.ceil(txtDoe.scrollHeight / dat.txtH);
            if (r > 4) {
                r = 4;
            }
	    }
        txtDoe.rows = r;

        // 计算消息区的高度
        outDoe.style.height =  Math.floor((boso.clientHeight - barDoe.clientHeight) / boso.clientHeight * 100) + "%";
	},

	// 回退
	back: function () {
		window.location.href = "./home.html";
	}
};
