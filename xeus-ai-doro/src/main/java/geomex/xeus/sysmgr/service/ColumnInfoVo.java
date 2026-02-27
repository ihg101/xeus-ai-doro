package geomex.xeus.sysmgr.service;


/**
 * <pre>
 * 파일명 :  ColumnVo.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 27.
 * @version :  1.0
 * @see
 */

public class ColumnInfoVo {

	private String colUid;
	private String colId;
	private String tblId;
	private String colNm;
	private String dataType;

	/**
	 * @return the colUid
	 */
	public String getColUid() {
		return colUid;
	}
	/**
	 * @param colUid the colUid to set
	 */
	public void setColUid(String colUid) {
		this.colUid = colUid;
	}
	/**
	 * @return the colId
	 */
	public String getColId() {
		return colId;
	}
	/**
	 * @param colId the colId to set
	 */
	public void setColId(String colId) {
		this.colId = colId;
	}
	/**
	 * @return the tblId
	 */
	public String getTblId() {
		return tblId;
	}
	/**
	 * @param tblId the tblId to set
	 */
	public void setTblId(String tblId) {
		this.tblId = tblId;
	}
	/**
	 * @return the colNm
	 */
	public String getColNm() {
		return colNm;
	}
	/**
	 * @param colNm the colNm to set
	 */
	public void setColNm(String colNm) {
		this.colNm = colNm;
	}
	public String getDataType() {
		return dataType;
	}
	public void setDataType(String dataType) {
		this.dataType = dataType;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ColumnVo [colUid=" + colUid + ", colId=" + colId + ", tblId=" + tblId + ", colNm=" + colNm + ", dataType=" + dataType + "]";
	}

}
