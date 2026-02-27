package geomex.xeus.equipmgr.service;

/**
 * <pre>
 * 파일명 :  StatusVo.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 * 2018-09-13      이은규          테이블 변경으로 인한 수정
 *
 * </pre>
 *
 * @since   :  2017. 8. 29.
 * @version :  1.0
 * @see
 */

public class StatusVo {

	private String mgrNo;
	private String stateCd;
	private String stateJson;
	private String recvDat;

	private String cctvNm;
	private String facilityNm;
	private String pumpjangName;
	private String raingaugeName;

	/**
	 * @return the mgrNo
	 */
	public String getMgrNo() {
		return mgrNo;
	}
	/**
	 * @param mgrNo the mgrNo to set
	 */
	public void setMgrNo(String mgrNo) {
		this.mgrNo = mgrNo;
	}
	/**
	 * @return the stateCd
	 */
	public String getStateCd() {
		return stateCd;
	}
	/**
	 * @param stateCd the stateCd to set
	 */
	public void setStateCd(String stateCd) {
		this.stateCd = stateCd;
	}
	public String getStateJson() {
        return stateJson;
    }
    public void setStateJson(String stateJson) {
        this.stateJson = stateJson;
    }
    /**
	 * @return the recvDat
	 */
	public String getRecvDat() {
		return recvDat;
	}
	/**
	 * @param recvDat the recvDat to set
	 */
	public void setRecvDat(String recvDat) {
		this.recvDat = recvDat;
	}
	/**
	 * @return the cctvNm
	 */
	public String getCctvNm() {
		return cctvNm;
	}
	/**
	 * @param cctvNm the cctvNm to set
	 */
	public void setCctvNm(String cctvNm) {
		this.cctvNm = cctvNm;
	}
	/**
	 * @return the facilityNm
	 */
	public String getFacilityNm() {
		return facilityNm;
	}
	/**
	 * @param facilityNm the facilityNm to set
	 */
	public void setFacilityNm(String facilityNm) {
		this.facilityNm = facilityNm;
	}
	public String getPumpjangName() {
		return pumpjangName;
	}
	public void setPumpjangName(String pumpjangName) {
		this.pumpjangName = pumpjangName;
	}
	public String getRaingaugeName() {
		return raingaugeName;
	}
	public void setRaingaugeName(String raingaugeName) {
		this.raingaugeName = raingaugeName;
	}

}
