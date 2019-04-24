package tk.ziniulian.util.dao;

/**
 * SQL建表语句
 * Created by 李泽荣 on 2018/7/19.
 */

public enum EmLocalCrtSql {
	sdDir("Invengo/FileShar/DB/"),	// 数据库存储路径

	dbNam("filShar"),	// 数据库名

	Bkv(	// 基本键值对表
		"create table Bkv(" +	// 表名
		"k text primary key not null, " +	// 键
		"v text)"),	// 值

	Simi(	// 分类
		"create table Simi(" +	// 表名
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +	// 键，自增
		"pid INTEGER, " +	// 父ID
		"nam text, " +	// 名称
		"typ INTEGER, " +	// 类型
		"path text)");	// 路径

	private final String sql;
	EmLocalCrtSql(String s) {
		sql = s;
	}

	@Override
	public String toString() {
		return sql;
	}
}
