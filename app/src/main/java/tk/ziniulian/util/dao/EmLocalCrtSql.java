package tk.ziniulian.util.dao;

/**
 * SQL建表语句
 * Created by 李泽荣 on 2018/7/19.
 */

public enum EmLocalCrtSql {
	sdDir("Invengo/FlShar/DB/"),	// 数据库存储路径

	dbNam("flShar.db"),	// 数据库名

	Bkv(	// 基本键值对表
		"create table Bkv(" +	// 表名
		"k text primary key not null, " +	// 键
		"v text)"),	// 值

	Fl(	// 文件存储键值对
		"create table Fl(" +	// 表名
		"k text primary key not null, " +	// 文件服务端ID
		"v text)");	// 文件下载ID

	private final String sql;
	EmLocalCrtSql(String s) {
		sql = s;
	}

	@Override
	public String toString() {
		return sql;
	}
}
