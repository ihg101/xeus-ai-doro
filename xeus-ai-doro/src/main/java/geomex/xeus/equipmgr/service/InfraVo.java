package geomex.xeus.equipmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  InfraVo.java
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
 * @since   :  2017. 8. 29.
 * @version :  1.0
 * @see
 */

public class InfraVo {

	private String mgrNo;

	@NotNull(message="관리기관은 필수사항 입니다.")
	@NotEmpty(message="관리기관은 필수사항 입니다.")
	private String orgMgrNo;

	@NotNull(message="사이트 관리번호는 필수사항 입니다.")
	@NotEmpty(message="사이트 관리번호는 필수사항 입니다.")
	private String siteMgrNo;

	@Size(min=0, max=14, message="설치일자는 최대 14자 까지 입력하실 수 있습니다.")
	private String instDat;

	private String fclGbnCd;

	@Pattern(regexp = "^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
					  "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
					  "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
					  "([01]?\\d\\d?|2[0-4]\\d|25[0-5])$", message="IP 양식에 맞게 입력해 주세요.")
	private String ipAddr;

	@Size(min=0, max=5, message="포트번호는 최대 5자리 까지 입력하실 수 있습니다.")
	@Pattern(regexp = "^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$", message="포트번호는 0~65535 까지 입력하실 수 있습니다.")
	private String portNum;

	@NotNull(message="사용여부는 필수사항 입니다.")
	@NotEmpty(message="사용여부는 필수사항 입니다.")
	private String useYn;

	@Size(min=0, max=30, message="접속ID는 최대 30자리 까지 입력하실 수 있습니다.")
	private String conId;
	@Size(min=0, max=50, message="접속암호는 최대 50자리 까지 입력하실 수 있습니다.")
    private String conPwd;
	@Size(min=0, max=100, message="SNMP인증문자는 최대 100자리 까지 입력하실 수 있습니다.")
    private String snmpStr;

	@NotNull(message="상태체크 여부는 필수사항 입니다.")
	@NotEmpty(message="상태체크 여부는 필수사항 입니다.")
	private String statChkYn;

	@NotNull(message="장비식별번호는 필수사항 입니다.")
    @NotEmpty(message="장비식별번호는 필수사항 입니다.")
    @Size(min=0, max=30, message="장비식별번호는 최대 30자 까지 입력하실 수 있습니다.")
    private String facilityId;

	@NotNull(message="시설명은 필수사항 입니다.")
	@NotEmpty(message="시설명은 필수사항 입니다.")
	@Size(min=0, max=50, message="시설명은 최대 50자 까지 입력하실 수 있습니다.")
	private String facilityNm;

	/*@NotNull(message="시설분류는 필수사항 입니다.")
	@NotEmpty(message="시설분류는 필수사항 입니다.")*/
	@Size(min=0, max=20, message="시설분류는 최대 20자 까지 입력하실 수 있습니다.")
	private String facilityClscd;

	@Size(min=0, max=255, message="위치설명은 최대 255자 까지 입력하실 수 있습니다.")
	private String locDesc;

	@Size(min=0, max=255, message="비고는 최대 255자 까지 입력하실 수 있습니다.")
	private String rmark;

	private String chkStatCd;
	private String addr;
	private String pnu;
	@NotNull(message="경도는 필수사항 입니다.")
    @NotEmpty(message="경도는 필수사항 입니다.")
	private String lng;
	@NotNull(message="위도는 필수사항 입니다.")
    @NotEmpty(message="위도는 필수사항 입니다.")
	private String lat;

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
	 * @return the fclGbnCd
	 */
	public String getFclGbnCd() {
		return fclGbnCd;
	}
	/**
	 * @param fclGbnCd the fclGbnCd to set
	 */
	public void setFclGbnCd(String fclGbnCd) {
		this.fclGbnCd = fclGbnCd;
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
	public String getConId() {
        return conId;
    }
    public void setConId(String conId) {
        this.conId = conId;
    }
    public String getConPwd() {
        return conPwd;
    }
    public void setConPwd(String conPwd) {
        this.conPwd = conPwd;
    }
    public String getSnmpStr() {
        return snmpStr;
    }
    public void setSnmpStr(String snmpStr) {
        this.snmpStr = snmpStr;
    }
    /**
	 * @return the statChkYn
	 */
	public String getStatChkYn() {
		return statChkYn;
	}
	/**
	 * @param statChkYn the statChkYn to set
	 */
	public void setStatChkYn(String statChkYn) {
		this.statChkYn = statChkYn;
	}
	public String getFacilityId() {
        return facilityId;
    }
    public void setFacilityId(String facilityId) {
        this.facilityId = facilityId;
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
	public String getFacilityClscd() {
		return facilityClscd;
	}
	public void setFacilityClscd(String facilityClscd) {
		this.facilityClscd = facilityClscd;
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
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "InfraVo [mgrNo="
			+ mgrNo + ", orgMgrNo=" + orgMgrNo + ", siteMgrNo=" + siteMgrNo + ", instDat=" + instDat + ", fclGbnCd="
			+ fclGbnCd + ", ipAddr=" + ipAddr + ", portNum=" + portNum + ", useYn=" + useYn
			+ ", statChkYn=" + statChkYn + ", facilityNm=" + facilityNm + ", facilityId=" + facilityId
			+ ", locDesc=" + locDesc + ", rmark=" + rmark + ", chkStatCd=" + chkStatCd + ", addr=" + addr + ", pnu="
			+ pnu + ", lng=" + lng + ", lat=" + lat + "]";
	}

}
