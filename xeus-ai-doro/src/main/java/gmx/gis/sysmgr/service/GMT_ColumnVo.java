package gmx.gis.sysmgr.service;

/**
 *
 * <pre>
 * 레이어의 그룹 정보를 담당합니다.
 * </pre>
 *
 * @author 이주영
 *
 */
public class GMT_ColumnVo {

	private String colUid;
	private String colId;
	private String tblId;
	private String tblSchema;
	private String colNm;
	private String dataType;
	private String stringSize;
	private int numericPrecision;
	private int numericPrecisionRadixsize;
	private int numericScale;




	private boolean isPkey;

	public String getColUid() {
		return colUid;
	}
	public String getColId() {
		return colId;
	}
	public String getTblId() {
		return tblId;
	}
	public String getTblSchema() {
		return tblSchema;
	}
	public String getColNm() {
		return colNm;
	}
	public String getDataType() {
		return dataType;
	}
	public String getStringSize() {
		return stringSize;
	}
	public int getNumericPrecision() {
		return numericPrecision;
	}
	public int getNumericPrecisionRadixsize() {
		return numericPrecisionRadixsize;
	}
	public boolean isPkey() {
		return isPkey;
	}
	public void setColUid(String colUid) {
		this.colUid = colUid;
	}
	public void setColId(String colId) {
		this.colId = colId;
	}
	public void setTblId(String tblId) {
		this.tblId = tblId;
	}
	public void setTblSchema(String tblSchema) {
		this.tblSchema = tblSchema;
	}
	public void setColNm(String colNm) {
		this.colNm = colNm;
	}
	public void setDataType(String dataType) {
		this.dataType = dataType;
	}
	public void setStringSize(String stringSize) {
		this.stringSize = stringSize;
	}
	public void setNumericPrecision(int numericPrecision) {
		this.numericPrecision = numericPrecision;
	}
	public void setNumericPrecisionRadixsize(int numericPrecisionRadixsize) {
		this.numericPrecisionRadixsize = numericPrecisionRadixsize;
	}
	public void setPkey(boolean isPkey) {
		this.isPkey = isPkey;
	}
	public int getNumericScale() {
		return numericScale;
	}
	public void setNumericScale(int numericScale) {
		this.numericScale = numericScale;
	}

	@Override
	public String toString() {
		return "GMT_ColumnVo [colUid=" + colUid + ", colId=" + colId + ", tblId=" + tblId + ", tblSchema=" + tblSchema
				+ ", colNm=" + colNm + ", dataType=" + dataType + ", stringSize=" + stringSize + ", numericPrecision="
				+ numericPrecision + ", numericPrecisionRadixsize=" + numericPrecisionRadixsize + ", numericScale="
				+ numericScale + ", isPkey=" + isPkey + "]";
	}

}
