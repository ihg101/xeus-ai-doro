package geomex.xeus.sysmgr.service;

public class SmsTempVo {

	private String mgrSeq;
	private String rcvId;
	private String rcvPhone;
	private String conts;
	private String regDat;

	public String getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getRcvId() {
		return rcvId;
	}
	public void setRcvId(String rcvId) {
		this.rcvId = rcvId;
	}
	public String getRcvPhone() {
		return rcvPhone;
	}
	public void setRcvPhone(String rcvPhone) {
		this.rcvPhone = rcvPhone;
	}
	public String getConts() {
		return conts;
	}
	public void setConts(String conts) {
		this.conts = conts;
	}
	public String getRegDat() {
		return regDat;
	}
	public void setRegDat(String regDat) {
		this.regDat = regDat;
	}

	public String toString(){
	    return " [mgrSeq] : " + mgrSeq
	            +"\r\n [rcvId] : " + rcvId
	            +"\r\n [rcvPhone] : " + rcvPhone
	            +"\r\n [conts] : " + conts
	            +"\r\n [regDat] : " + regDat;
	}

}
