function init () {
	dat.padH = padDoe.clientHeight;
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
	pt: null,   // 翻页前的顶部元素

    hdAjaxCb: function (d) {
        if (d.ok) {
            switch (dat.stu) {
                case 1:
                    for (var i = 0; i < d.data.length; i ++) {
                        dat.crtDoe(d.data[i]);
                    }
                    if (!dat.pag && dat.size) {
                        boso.scrollTop = outDoe.scrollHeight; // 消息区滚动至最底部
                    } else if (dat.pt) {
                        boso.scrollTop = dat.pt.offsetTop - dat.padH; // 消息区滚动至翻页前最顶部元素
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
                txt: o.mcontent,
                ad: o.address,
                cNam: o.customer_name,
                cTel: o.customer_phone,
                cCp: o.customer_company,
                cDep: o.customer_department,
                cJob: o.customer_job
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
            var t = r.tim;
            t += " ";
            if (r.ad) {
                t += "<br/>";
                t += r.ad;
                t += " ";
            }
            if (r.cNam) {
                t += "<br/>客户姓名：";
                t += r.cNam;
                if (r.cJob) {
                    t += "(";
                    t += r.cJob;
                    t += ")";
                }
                t += " ";
            }
            if (r.cTel) {
                t += "<br/>客户电话：";
                t += r.cTel;
                t += " ";
            }
            if (r.cCp) {
                t += "<br/>客户单位：";
                t += r.cCp;
                t += " ";
            }
            if (r.cDep) {
                t += "<br/>客户部门：";
                t += r.cDep;
                t += " ";
            }
            t += "<br/>";
            d.innerHTML = t;
            d.className = "msgTim sfs";
            r.doe.appendChild(d);

            if (o.c_uid === dat.uid) {
                d = document.createElement("div");
                d.className = "msgDel sfs";
                d.innerHTML = "✖";
                d.name = o.mid;
                d.onclick = dat.delMsg;
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
	    if (boso.scrollTop === 0) {
	        dat.pt = outDoe.firstChild;
	        dat.getMsg();
	    }
	},

	// 回退
	back: function () {
		window.location.href = "./home.html";
	}
};
