package geomex.xeus.equipmgr.service;

import javax.validation.constraints.Pattern;

public class VmsVo {

	private String mgrNo;
	private String vmsTyp;
	private String vmsNm;
	@Pattern(regexp = "^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
        "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
        "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
        "([01]?\\d\\d?|2[0-4]\\d|25[0-5])$", message="IP 양식에 맞게 입력해 주세요.")
	private String ipAddr;
	@Pattern(regexp = "(6553[0-5]|655[0-2]\\d|65[0-4]\\d{2}|6[0-4]\\d{3}|5\\d{4}|[0-9]\\d{0,3})", message="Port번호 양식에 맞게 입력해 주세요.")
	private String portNum;
	private String conId;
	private String conPwd;
	private String rmark;

	public String getMgrNo() {
		return mgrNo;
	}
	public void setMgrNo(String mgrNo) {
		this.mgrNo = mgrNo;
	}
	public String getVmsTyp() {
		return vmsTyp;
	}
	public void setVmsTyp(String vmsTyp) {
		this.vmsTyp = vmsTyp;
	}
	public String getVmsNm() {
		return vmsNm;
	}
	public void setVmsNm(String vmsNm) {
		this.vmsNm = vmsNm;
	}
	public String getIpAddr() {
		return ipAddr;
	}
	public void setIpAddr(String ipAddr) {
		this.ipAddr = ipAddr;
	}
	public String getPortNum() {
		return portNum;
	}
	public void setPortNum(String portNum) {
		this.portNum = portNum;
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
	public String getRmark() {
		return rmark;
	}
	public void setRmark(String rmark) {
		this.rmark = rmark;
	}
	@Override
	public String toString() {
		return "VmsVo [mgrNo=" + mgrNo + ", vmsTyp=" + vmsTyp + ", vmsNm=" + vmsNm + ", ipAddr=" + ipAddr + ", portNum="
				+ portNum + ", conId=" + conId + ", conPwd=" + conPwd + ", rmark=" + rmark + "]";
	}

}
