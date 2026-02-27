package gmx.gis.nms.service;

/**
 *
 * <pre>
 * Ping 체크 정보를 담당합니다.
 * </pre>
 *
 * @author 이주영
 *
 */
public class GMT_PingVo {

	private int mgrSeq;
	private int lyrMgrSeq;
	private String ipFieldEnNm;
	private String ipFieldKrNm;
	private int intervalMin;
	private String lastWorkDat;
	private int totalCnt;
	private int failCnt;
	private String regUsrId;

	private String schemNm;
	private String tblId;
	private String lyrNm;
	private boolean isExistsTable;
	private boolean isExistsColumn;

	public int getMgrSeq() {
		return mgrSeq;
	}
	public int getLyrMgrSeq() {
		return lyrMgrSeq;
	}
	public String getIpFieldEnNm() {
		return ipFieldEnNm;
	}
	public String getIpFieldKrNm() {
		return ipFieldKrNm;
	}
	public int getIntervalMin() {
		return intervalMin;
	}
	public String getLastWorkDat() {
		return lastWorkDat;
	}
	public int getTotalCnt() {
		return totalCnt;
	}
	public int getFailCnt() {
		return failCnt;
	}
	public String getRegUsrId() {
		return regUsrId;
	}
	public String getSchemNm() {
		return schemNm;
	}
	public String getTblId() {
		return tblId;
	}
	public String getLyrNm() {
		return lyrNm;
	}
	public boolean isExistsTable() {
		return isExistsTable;
	}
	public boolean isExistsColumn() {
		return isExistsColumn;
	}
	public void setMgrSeq(int mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public void setLyrMgrSeq(int lyrMgrSeq) {
		this.lyrMgrSeq = lyrMgrSeq;
	}
	public void setIpFieldEnNm(String ipFieldEnNm) {
		this.ipFieldEnNm = ipFieldEnNm;
	}
	public void setIpFieldKrNm(String ipFieldKrNm) {
		this.ipFieldKrNm = ipFieldKrNm;
	}
	public void setIntervalMin(int intervalMin) {
		this.intervalMin = intervalMin;
	}
	public void setLastWorkDat(String lastWorkDat) {
		this.lastWorkDat = lastWorkDat;
	}
	public void setTotalCnt(int totalCnt) {
		this.totalCnt = totalCnt;
	}
	public void setFailCnt(int failCnt) {
		this.failCnt = failCnt;
	}
	public void setRegUsrId(String regUsrId) {
		this.regUsrId = regUsrId;
	}
	public void setSchemNm(String schemNm) {
		this.schemNm = schemNm;
	}
	public void setTblId(String tblId) {
		this.tblId = tblId;
	}
	public void setLyrNm(String lyrNm) {
		this.lyrNm = lyrNm;
	}
	public void setExistsTable(boolean isExistsTable) {
		this.isExistsTable = isExistsTable;
	}
	public void setExistsColumn(boolean isExistsColumn) {
		this.isExistsColumn = isExistsColumn;
	}

}
