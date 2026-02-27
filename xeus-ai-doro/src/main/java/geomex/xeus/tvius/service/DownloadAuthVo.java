package geomex.xeus.tvius.service;

/**
 * <pre>
 * 파일명 :  DownloadAuthVo.java
 * 설  명 :
 *   DownloadAuth 관련 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 11. 30.      이은규          최초 생성
 *
 * </pre>
 *
 * @since : 2017. 11. 30.
 * @version : 1.0
 * @see
 */
public class DownloadAuthVo {

	private String cctvMgrNo;
	private String cctvLabel;
	private String downCnt;
	private String fileNm;
	private String secStDat;
	private String secEdDat;
	private String userId;
	private String userStat;

	public String getCctvMgrNo() {
		return cctvMgrNo;
	}
	public void setCctvMgrNo(String cctvMgrNo) {
		this.cctvMgrNo = cctvMgrNo;
	}
	public String getCctvLabel() {
		return cctvLabel;
	}
	public void setCctvLabel(String cctvLabel) {
		this.cctvLabel = cctvLabel;
	}
	public String getDownCnt() {
		return downCnt;
	}
	public void setDownCnt(String downCnt) {
		this.downCnt = downCnt;
	}
	public String getFileNm() {
		return fileNm;
	}
	public void setFileNm(String fileNm) {
		this.fileNm = fileNm;
	}
	public String getSecStDat() {
		return secStDat;
	}
	public void setSecStDat(String secStDat) {
		this.secStDat = secStDat;
	}
	public String getSecEdDat() {
		return secEdDat;
	}
	public void setSecEdDat(String secEdDat) {
		this.secEdDat = secEdDat;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserStat() {
		return userStat;
	}
	public void setUserStat(String userStat) {
		this.userStat = userStat;
	}

}
