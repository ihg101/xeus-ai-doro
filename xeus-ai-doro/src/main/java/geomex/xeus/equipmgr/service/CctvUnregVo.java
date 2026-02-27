package geomex.xeus.equipmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  CctvVo.java
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
 * @since   :  2017. 9. 15.
 * @version :  1.0
 * @see
 */

public class CctvUnregVo {

	private String mgrNo;

	private String orgMgrNo;

	@NotNull(message="모델관리번호는 필수사항 입니다.")
	@NotEmpty(message="모델관리번호는 필수사항 입니다.")
	@Size(min=0, max=10, message="모델관리번호는 최대 10자 까지 입력하실 수 있습니다.")
	private String mdMgrNo;

	private String siteMgrNo;

	@Size(min=0, max=14, message="설치일자는 최대 14자 까지 입력하실 수 있습니다.")
	private String instDat;

	@Size(min=0, max=50, message="CCTV명은 최대 50자 까지 입력하실 수 있습니다.")
	private String cctvNm;

	@Size(min=0, max=50, message="접속디바이스명은 최대 50자 까지 입력하실 수 있습니다.")
	private String deviceId;

	@Size(min=0, max=2, message="접속채널번호는 최대 2자리 까지 입력하실 수 있습니다.")
	@Pattern(regexp = "^([0-9]|[1-9][0-9])$", message="접속채널번호는 0~99 까지 입력하실 수 있습니다.")
	private String chnlNo;

	private String gbnCd;

	@Size(min=0, max=2, message="관제방향은 최대 2자리 까지 입력하실 수 있습니다.")
	@Pattern(regexp = "^([0-9]|[1-9][0-9])$", message="접속채널번호는 0~99 까지 입력하실 수 있습니다.")
	private String viewDir;

	@Pattern(regexp = "^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
					  "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
					  "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
					  "([01]?\\d\\d?|2[0-4]\\d|25[0-5])$", message="IP 양식에 맞게 입력해 주세요.")
	private String ipAddr;

	@Size(min=0, max=5, message="포트번호는 최대 5자리 까지 입력하실 수 있습니다.")
	@Pattern(regexp = "^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$", message="포트번호는 0~65535 까지 입력하실 수 있습니다.")
	private String portNum;

	@NotNull(message="사용 여부는 필수사항 입니다.")
	@NotEmpty(message="사용 여부는 필수사항 입니다.")
	@Size(min=0, max=1, message="사용 여부는 최대 1자 까지 입력하실 수 있습니다.")
	private String useYn;

	@NotNull(message="회전 여부는 필수사항 입니다.")
	@NotEmpty(message="회전 여부는 필수사항 입니다.")
	@Size(min=0, max=1, message="회전 여부는 최대 1자 까지 입력하실 수 있습니다.")
	private String turnYn;

	@NotNull(message="조명 여부는 필수사항 입니다.")
	@NotEmpty(message="조명 여부는 필수사항 입니다.")
	@Size(min=0, max=1, message="조명 여부는 최대 1자 까지 입력하실 수 있습니다.")
	private String lightYn;

	@NotNull(message="적외선 여부는 필수사항 입니다.")
	@NotEmpty(message="적외선 여부는 필수사항 입니다.")
	@Size(min=0, max=1, message="적외선 여부는 최대 1자 까지 입력하실 수 있습니다.")
	private String infrdYn;

	@NotNull(message="틸트 여부는 필수사항 입니다.")
	@NotEmpty(message="틸트 여부는 필수사항 입니다.")
	@Size(min=0, max=1, message="틸트 여부는 최대 1자 까지 입력하실 수 있습니다.")
	private String tiltYn;

	@NotNull(message="줌 여부는 필수사항 입니다.")
	@NotEmpty(message="줌 여부는 필수사항 입니다.")
	@Size(min=0, max=1, message="줌 여부는 최대 1자 까지 입력하실 수 있습니다.")
	private String zoomYn;

	@NotNull(message="음성지원 여부는 필수사항 입니다.")
	@NotEmpty(message="음성지원 여부는 필수사항 입니다.")
	@Size(min=0, max=1, message="음성지원 여부는 최대 1자 까지 입력하실 수 있습니다.")
	private String talkYn;

	@NotNull(message="투망 여부는 필수사항 입니다.")
	@NotEmpty(message="투망 여부는 필수사항 입니다.")
	@Size(min=0, max=1, message="투망 여부는 최대 1자 까지 입력하실 수 있습니다.")
	private String netYn;

	@Size(min=0, max=30, message="접속ID는 최대 30자 까지 입력하실 수 있습니다.")
	private String conId;

	@Size(min=0, max=255, message="접속암호는 최대 255자 까지 입력하실 수 있습니다.")
	private String conPwd;

	@Size(min=0, max=4, message="사업년도는 최대 4자 까지 입력하실 수 있습니다.")
	private String constYear;

	@Size(min=0, max=255, message="사업명은 최대 255자 까지 입력하실 수 있습니다.")
	private String constNm;

	@Size(min=0, max=255, message="위치설명은 최대 255자 까지 입력하실 수 있습니다.")
	private String locDesc;

	@Size(min=0, max=255, message="비고는 최대 255자 까지 입력하실 수 있습니다.")
	private String rmark;

	@Size(min=0, max=10, message="VMS관리번호는 최대 10자 까지 입력하실 수 있습니다.")
	private String vmsMgrNo;

	private String chkStatCd;
	private String addr;
	private String pnu;
	private String lng;
	private String lat;
	private String gid;

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
	 * @return the orgMgrNo
	 */
	public String getOrgMgrNo() {
		return orgMgrNo;
	}
	/**
	 * @param orgMgrNo the orgMgrNo to set
	 */
	public void setOrgMgrNo(String orgMgrNo) {
		this.orgMgrNo = orgMgrNo;
	}
	/**
	 * @return the mdMgrNo
	 */
	public String getMdMgrNo() {
		return mdMgrNo;
	}
	/**
	 * @param mdMgrNo the mdMgrNo to set
	 */
	public void setMdMgrNo(String mdMgrNo) {
		this.mdMgrNo = mdMgrNo;
	}
	/**
	 * @return the siteMgrNo
	 */
	public String getSiteMgrNo() {
		return siteMgrNo;
	}
	/**
	 * @param siteMgrNo the siteMgrNo to set
	 */
	public void setSiteMgrNo(String siteMgrNo) {
		this.siteMgrNo = siteMgrNo;
	}
	/**
	 * @return the instDat
	 */
	public String getInstDat() {
		return instDat;
	}
	/**
	 * @param instDat the instDat to set
	 */
	public void setInstDat(String instDat) {
		this.instDat = instDat;
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
	 * @return the deviceId
	 */
	public String getDeviceId() {
		return deviceId;
	}
	/**
	 * @param deviceId the deviceId to set
	 */
	public void setDeviceId(String deviceId) {
		this.deviceId = deviceId;
	}
	/**
	 * @return the chnlNo
	 */
	public String getChnlNo() {
		return chnlNo;
	}
	/**
	 * @param chnlNo the chnlNo to set
	 */
	public void setChnlNo(String chnlNo) {
		this.chnlNo = chnlNo;
	}
	/**
	 * @return the gbnCd
	 */
	public String getGbnCd() {
		return gbnCd;
	}
	/**
	 * @param gbnCd the gbnCd to set
	 */
	public void setGbnCd(String gbnCd) {
		this.gbnCd = gbnCd;
	}
	/**
	 * @return the viewDir
	 */
	public String getViewDir() {
		return viewDir;
	}
	/**
	 * @param viewDir the viewDir to set
	 */
	public void setViewDir(String viewDir) {
		this.viewDir = viewDir;
	}
	/**
	 * @return the ipAddr
	 */
	public String getIpAddr() {
		return ipAddr;
	}
	/**
	 * @param ipAddr the ipAddr to set
	 */
	public void setIpAddr(String ipAddr) {
		this.ipAddr = ipAddr;
	}
	/**
	 * @return the portNum
	 */
	public String getPortNum() {
		return portNum;
	}
	/**
	 * @param portNum the portNum to set
	 */
	public void setPortNum(String portNum) {
		this.portNum = portNum;
	}
	/**
	 * @return the useYn
	 */
	public String getUseYn() {
		return useYn;
	}
	/**
	 * @param useYn the useYn to set
	 */
	public void setUseYn(String useYn) {
		this.useYn = useYn;
	}
	/**
	 * @return the turnYn
	 */
	public String getTurnYn() {
		return turnYn;
	}
	/**
	 * @param turnYn the turnYn to set
	 */
	public void setTurnYn(String turnYn) {
		this.turnYn = turnYn;
	}
	/**
	 * @return the lightYn
	 */
	public String getLightYn() {
		return lightYn;
	}
	/**
	 * @param lightYn the lightYn to set
	 */
	public void setLightYn(String lightYn) {
		this.lightYn = lightYn;
	}
	/**
	 * @return the infrdYn
	 */
	public String getInfrdYn() {
		return infrdYn;
	}
	/**
	 * @param infrdYn the infrdYn to set
	 */
	public void setInfrdYn(String infrdYn) {
		this.infrdYn = infrdYn;
	}
	/**
	 * @return the ptYn
	 */
	public String getTiltYn() {
		return tiltYn;
	}
	/**
	 * @param ptYn the ptYn to set
	 */
	public void setTiltYn(String tiltYn) {
		this.tiltYn = tiltYn;
	}
	/**
	 * @return the zoomYn
	 */
	public String getZoomYn() {
		return zoomYn;
	}
	/**
	 * @param zoomYn the zoomYn to set
	 */
	public void setZoomYn(String zoomYn) {
		this.zoomYn = zoomYn;
	}
	/**
	 * @return the talkYn
	 */
	public String getTalkYn() {
		return talkYn;
	}
	/**
	 * @param talkYn the talkYn to set
	 */
	public void setTalkYn(String talkYn) {
		this.talkYn = talkYn;
	}
	/**
	 * @return the netYn
	 */
	public String getNetYn() {
		return netYn;
	}
	/**
	 * @param netYn the netYn to set
	 */
	public void setNetYn(String netYn) {
		this.netYn = netYn;
	}
	/**
	 * @return the conId
	 */
	public String getConId() {
		return conId;
	}
	/**
	 * @param conId the conId to set
	 */
	public void setConId(String conId) {
		this.conId = conId;
	}
	/**
	 * @return the conPwd
	 */
	public String getConPwd() {
		return conPwd;
	}
	/**
	 * @param conPwd the conPwd to set
	 */
	public void setConPwd(String conPwd) {
		this.conPwd = conPwd;
	}
	/**
	 * @return the constYear
	 */
	public String getConstYear() {
		return constYear;
	}
	/**
	 * @param constYear the constYear to set
	 */
	public void setConstYear(String constYear) {
		this.constYear = constYear;
	}
	/**
	 * @return the constNm
	 */
	public String getConstNm() {
		return constNm;
	}
	/**
	 * @param constNm the constNm to set
	 */
	public void setConstNm(String constNm) {
		this.constNm = constNm;
	}
	/**
	 * @return the locDesc
	 */
	public String getLocDesc() {
		return locDesc;
	}
	/**
	 * @param locDesc the locDesc to set
	 */
	public void setLocDesc(String locDesc) {
		this.locDesc = locDesc;
	}
	/**
	 * @return the rmark
	 */
	public String getRmark() {
		return rmark;
	}
	/**
	 * @param rmark the rmark to set
	 */
	public void setRmark(String rmark) {
		this.rmark = rmark;
	}
	/**
	 * @return the chkStatCd
	 */
	public String getChkStatCd() {
		return chkStatCd;
	}
	/**
	 * @param chkStatCd the chkStatCd to set
	 */
	public void setChkStatCd(String chkStatCd) {
		this.chkStatCd = chkStatCd;
	}
	/**
	 * @return the addr
	 */
	public String getAddr() {
		return addr;
	}
	/**
	 * @param addr the addr to set
	 */
	public void setAddr(String addr) {
		this.addr = addr;
	}
	/**
	 * @return the pnu
	 */
	public String getPnu() {
		return pnu;
	}
	/**
	 * @param pnu the pnu to set
	 */
	public void setPnu(String pnu) {
		this.pnu = pnu;
	}
	/**
	 * @return the lng
	 */
	public String getLng() {
		return lng;
	}
	/**
	 * @param lng the lng to set
	 */
	public void setLng(String lng) {
		this.lng = lng;
	}
	/**
	 * @return the lat
	 */
	public String getLat() {
		return lat;
	}
	/**
	 * @param lat the lat to set
	 */
	public void setLat(String lat) {
		this.lat = lat;
	}
	/**
	 * @return the gid
	 */
	public String getGid() {
		return gid;
	}
	/**
	 * @param gid the gid to set
	 */
	public void setGid(String gid) {
		this.gid = gid;
	}
	/**
	 * @return the vmsMgrNo
	 */
	public String getVmsMgrNo() {
		return vmsMgrNo;
	}
	/**
	 * @param vmsMgrNo the vmsMgrNo to set
	 */
	public void setVmsMgrNo(String vmsMgrNo) {
		this.vmsMgrNo = vmsMgrNo;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "CctvVo [mgrNo="
			+ mgrNo + ", orgMgrNo=" + orgMgrNo + ", mdMgrNo=" + mdMgrNo + ", siteMgrNo=" + siteMgrNo + ", instDat="
			+ instDat + ", cctvNm=" + cctvNm + ", deviceId=" + deviceId + ", chnlNo=" + chnlNo + ", gbnCd=" + gbnCd
			+ ", viewDir=" + viewDir + ", ipAddr=" + ipAddr + ", portNum=" + portNum + ", useYn=" + useYn + ", turnYn="
			+ turnYn + ", lightYn=" + lightYn + ", infrdYn=" + infrdYn + ", tiltYn=" + tiltYn + ", zoomYn=" + zoomYn
			+ ", talkYn=" + talkYn + ", netYn=" + netYn + ", conId=" + conId + ", conPwd=" + conPwd + ", constYear="
			+ constYear + ", constNm=" + constNm + ", locDesc=" + locDesc + ", rmark=" + rmark + ", vmsMgrNo="
			+ vmsMgrNo + ", chkStatCd=" + chkStatCd + ", addr=" + addr + ", pnu=" + pnu + ", lng=" + lng + ", lat="
			+ lat + ", gid=" + gid + "]";
	}

}
