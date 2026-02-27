package geomex.xeus.equipmgr.service;

import java.util.ArrayList;

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
 * 2018-03-23      이은규          투망모니터링용 추가
 * 2018-04-11      이은규          설치목적 미입력시 지도에 표시되지 않으므로 필수입력사항으로 변경
 * 2018-04-19      이은규          CCTV 추가 작업 로그 생성을 위해 작업 정보 추가
 * 2018-09-12      이은규          테이블 정보 수정으로 인한 수정 작업
 *
 * </pre>
 *
 * @since   :  2017. 9. 15.
 * @version :  1.0
 * @see
 */

public class CctvVo {

	private String mgrNo;

	private String orgMgrNo;

	/*@NotNull(message="모델관리번호는 필수사항 입니다.")
	@NotEmpty(message="모델관리번호는 필수사항 입니다.")
	@Size(min=0, max=10, message="모델관리번호는 최대 10자 까지 입력하실 수 있습니다.")*/
	private String mdMgrNo;

	private String siteMgrNo;

	@Size(min=0, max=14, message="설치일자는 최대 14자 까지 입력하실 수 있습니다.")
	private String instDat;

	@Size(min=0, max=200, message="CCTV명은 최대 200자 까지 입력하실 수 있습니다.")
	private String cctvNm;

	@Size(min=0, max=50, message="접속디바이스명은 최대 50자 까지 입력하실 수 있습니다.")
	private String deviceId;

	@Size(min=0, max=2, message="접속채널번호는 최대 2자리 까지 입력하실 수 있습니다.")
	@Pattern(regexp = "^([0-9]|[1-9][0-9])$", message="접속채널번호는 0~99 까지 입력하실 수 있습니다.")
	private String chnlNo;

	private String gbnCd;

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
	private String panYn;

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

	@NotNull(message="투어링여부는 필수사항 입니다.")
    @NotEmpty(message="투어링여부는 필수사항 입니다.")
    @Size(min=0, max=1, message="투어링여부는 최대 1자 까지 입력하실 수 있습니다.")
    private String tourYn;

	@Size(min=0, max=30, message="접속ID는 최대 30자 까지 입력하실 수 있습니다.")
	private String conId;

	@Size(min=0, max=255, message="접속암호는 최대 255자 까지 입력하실 수 있습니다.")
	private String conPwd;

	@Size(min=0, max=100, message="SNMP인증문자는 최대 100자 까지 입력하실 수 있습니다.")
	private String snmpStr;

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
	@NotNull(message="경도는 필수사항 입니다.")
    @NotEmpty(message="경도는 필수사항 입니다.")
	private String lng;
	@NotNull(message="위도는 필수사항 입니다.")
    @NotEmpty(message="위도는 필수사항 입니다.")
	private String lat;
	private String gid;
	private String angle;

	@NotNull(message="설치목적은 필수사항 입니다.")
    @NotEmpty(message="설치목적은 필수사항 입니다.")
	private String gbnNm;

	/**
	 * 180326 이은규
	 * 투망모니터링용 변수 생성
	 */

	private String netSchGbn;
	private String srid;
	private String geometry;
	private int dist;
	private String centerX;
	private String centerY;
	private double minX;
	private double minY;
	private double maxX;
	private double maxY;

	/**
	 * 180419 이은규
	 * CCTV 추가 로그 생성을 위해 작업 정보 추가
	 */
	private String workerId;
	private String workDat;
	private String workGbn;

	/**
	 * 180517 이은규
	 * CCTV 상태 체크를 위해 변수 추가
	 * asset_status 테이블과 조인해서 가져옴.
	 */
	private String stateCd;

	private ArrayList<String> gidList;

	private String cctvNoList;

	/**
	 * 181105 이은규
	 * CCTV 목적별 갯수 조회 기능 변수 추가
	 * 히트맵 조회에서 사용됨.
	 */
	private String gbnCnt;

	private String hjd;
	private String bjd;

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
	 * @return the panYn
	 */
	public String getPanYn() {
		return panYn;
	}
	/**
	 * @param panYn the panYn to set
	 */
	public void setPanYn(String panYn) {
		this.panYn = panYn;
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
	public String getTourYn() {
        return tourYn;
    }
    public void setTourYn(String tourYn) {
        this.tourYn = tourYn;
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
	public String getSnmpStr() {
        return snmpStr;
    }
    public void setSnmpStr(String snmpStr) {
        this.snmpStr = snmpStr;
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
	public String getAngle() {
		return angle;
	}
	public void setAngle(String angle) {
		this.angle = angle;
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
	public String getNetSchGbn() {
        return netSchGbn;
    }
    public void setNetSchGbn(String netSchGbn) {
        this.netSchGbn = netSchGbn;
    }
    public String getSrid() {
        return srid;
    }
    public void setSrid(String srid) {
        this.srid = srid;
    }
    public String getGeometry() {
        return geometry;
    }
    public void setGeometry(String geometry) {
        this.geometry = geometry;
    }
    public int getDist() {
        return dist;
    }
    public void setDist(int dist) {
        this.dist = dist;
    }
    public String getCenterX() {
        return centerX;
    }
    public void setCenterX(String centerX) {
        this.centerX = centerX;
    }
    public String getCenterY() {
        return centerY;
    }
    public void setCenterY(String centerY) {
        this.centerY = centerY;
    }
    public double getMinX() {
        return minX;
    }
    public void setMinX(double minX) {
        this.minX = minX;
    }
    public double getMinY() {
        return minY;
    }
    public void setMinY(double minY) {
        this.minY = minY;
    }
    public double getMaxX() {
        return maxX;
    }
    public void setMaxX(double maxX) {
        this.maxX = maxX;
    }
    public double getMaxY() {
        return maxY;
    }
    public void setMaxY(double maxY) {
        this.maxY = maxY;
    }
    public String getWorkerId() {
        return workerId;
    }
    public void setWorkerId(String workerId) {
        this.workerId = workerId;
    }
    public String getWorkDat() {
        return workDat;
    }
    public void setWorkDat(String workDat) {
        this.workDat = workDat;
    }
    public String getWorkGbn() {
        return workGbn;
    }
    public void setWorkGbn(String workGbn) {
        this.workGbn = workGbn;
    }
    public String getStateCd() {
        return stateCd;
    }
    public void setStateCd(String stateCd) {
        this.stateCd = stateCd;
    }
    public ArrayList<String> getGidList() {
        return gidList;
    }
    public void setGidList(ArrayList<String> gidList) {
        this.gidList = gidList;
    }
    public String getCctvNoList() {
        return cctvNoList;
    }
    public void setCctvNoList(String cctvNoList) {
        this.cctvNoList = cctvNoList;
    }
	public String getGbnCnt() {
		return gbnCnt;
	}
	public void setGbnCnt(String gbnCnt) {
		this.gbnCnt = gbnCnt;
	}
	public String getHjd() {
		return hjd;
	}
	public String getBjd() {
		return bjd;
	}
	public void setHjd(String hjd) {
		this.hjd = hjd;
	}
	public void setBjd(String bjd) {
		this.bjd = bjd;
	}
	public String getGbnNm() {
		return gbnNm;
	}
	public void setGbnNm(String gbnNm) {
		this.gbnNm = gbnNm;
	}
	@Override
	public String toString() {
		return "CctvVo [mgrNo=" + mgrNo + ", orgMgrNo=" + orgMgrNo + ", mdMgrNo=" + mdMgrNo + ", siteMgrNo=" + siteMgrNo
				+ ", instDat=" + instDat + ", cctvNm=" + cctvNm + ", deviceId=" + deviceId + ", chnlNo=" + chnlNo
				+ ", gbnCd=" + gbnCd + ", ipAddr=" + ipAddr + ", portNum=" + portNum + ", useYn=" + useYn + ", panYn="
				+ panYn + ", lightYn=" + lightYn + ", infrdYn=" + infrdYn + ", tiltYn=" + tiltYn + ", zoomYn=" + zoomYn
				+ ", talkYn=" + talkYn + ", tourYn=" + tourYn + ", conId=" + conId + ", conPwd=" + conPwd + ", snmpStr="
				+ snmpStr + ", constYear=" + constYear + ", constNm=" + constNm + ", locDesc=" + locDesc + ", rmark="
				+ rmark + ", vmsMgrNo=" + vmsMgrNo + ", chkStatCd=" + chkStatCd + ", addr=" + addr + ", pnu=" + pnu
				+ ", lng=" + lng + ", lat=" + lat + ", gid=" + gid + ", angle=" + angle + ", gbnNm=" + gbnNm
				+ ", netSchGbn=" + netSchGbn + ", srid=" + srid + ", geometry=" + geometry + ", dist=" + dist
				+ ", centerX=" + centerX + ", centerY=" + centerY + ", minX=" + minX + ", minY=" + minY + ", maxX="
				+ maxX + ", maxY=" + maxY + ", workerId=" + workerId + ", workDat=" + workDat + ", workGbn=" + workGbn
				+ ", stateCd=" + stateCd + ", gidList=" + gidList + ", cctvNoList=" + cctvNoList + ", gbnCnt=" + gbnCnt
				+ ", hjd=" + hjd + ", bjd=" + bjd + "]";
	}

}
