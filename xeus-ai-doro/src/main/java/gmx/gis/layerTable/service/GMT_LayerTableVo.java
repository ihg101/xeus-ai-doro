package gmx.gis.layerTable.service;

import java.util.HashMap;
import java.util.List;

/**
 * @author 민동현
 *
 */
public class GMT_LayerTableVo {

	private String schema;
	private String tableName;
	private String tableKoreaName;
	private String layerType;
	private String _annox;
	private String _annoy;
	private String point;
	private String line;

	private String colNm;
	private String colKrNm;
	private String type;

	private List<HashMap<String,Object>> columnKrNmMapList;
	private List<HashMap<String,Object>> columnTypeMapList;
	private HashMap<String,Object> columnNewNmMap;
	private HashMap<String,Object> columnValueMap;
	public String getSchema() {
		return schema;
	}
	public void setSchema(String schema) {
		this.schema = schema;
	}
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public String getTableKoreaName() {
		return tableKoreaName;
	}
	public void setTableKoreaName(String tableKoreaName) {
		this.tableKoreaName = tableKoreaName;
	}
	public String getLayerType() {
		return layerType;
	}
	public void setLayerType(String layerType) {
		this.layerType = layerType;
	}
	public String get_annox() {
		return _annox;
	}
	public void set_annox(String _annox) {
		this._annox = _annox;
	}
	public String get_annoy() {
		return _annoy;
	}
	public void set_annoy(String _annoy) {
		this._annoy = _annoy;
	}
	public String getPoint() {
		return point;
	}
	public void setPoint(String point) {
		this.point = point;
	}
	public String getLine() {
		return line;
	}
	public void setLine(String line) {
		this.line = line;
	}
	public String getColNm() {
		return colNm;
	}
	public void setColNm(String colNm) {
		this.colNm = colNm;
	}
	public String getColKrNm() {
		return colKrNm;
	}
	public void setColKrNm(String colKrNm) {
		this.colKrNm = colKrNm;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public List<HashMap<String, Object>> getColumnKrNmMapList() {
		return columnKrNmMapList;
	}
	public void setColumnKrNmMapList(List<HashMap<String, Object>> columnKrNmMapList) {
		this.columnKrNmMapList = columnKrNmMapList;
	}
	public List<HashMap<String, Object>> getColumnTypeMapList() {
		return columnTypeMapList;
	}
	public void setColumnTypeMapList(List<HashMap<String, Object>> columnTypeMapList) {
		this.columnTypeMapList = columnTypeMapList;
	}
	public HashMap<String, Object> getColumnNewNmMap() {
		return columnNewNmMap;
	}
	public void setColumnNewNmMap(HashMap<String, Object> columnNewNmMap) {
		this.columnNewNmMap = columnNewNmMap;
	}
	public HashMap<String, Object> getColumnValueMap() {
		return columnValueMap;
	}
	public void setColumnValueMap(HashMap<String, Object> columnValueMap) {
		this.columnValueMap = columnValueMap;
	}
	@Override
	public String toString() {
		return "GMT_LayerTableVo [schema=" + schema + ", tableName=" + tableName + ", tableKoreaName=" + tableKoreaName
				+ ", layerType=" + layerType + ", _annox=" + _annox + ", _annoy=" + _annoy + ", point=" + point
				+ ", line=" + line + ", colNm=" + colNm + ", colKrNm=" + colKrNm + ", type=" + type
				+ ", columnKrNmMapList=" + columnKrNmMapList + ", columnTypeMapList=" + columnTypeMapList
				+ ", columnNewNmMap=" + columnNewNmMap + ", columnValueMap=" + columnValueMap + "]";
	}

}
