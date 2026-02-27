package geomex.xeus.bigdata.service;

public class CovidVo {

	private String mgrSeq;
	private String startDat;
	private String regDat;
	private String note;
	private String lon;
	private String lat;

	public String getMgrSeq() {
		return mgrSeq;
	}
	public String getStartDat() {
		return startDat;
	}
	public String getRegDat() {
		return regDat;
	}
	public String getNote() {
		return note;
	}
	public String getLon() {
		return lon;
	}
	public String getLat() {
		return lat;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public void setStartDat(String startDat) {
		this.startDat = startDat;
	}
	public void setRegDat(String regDat) {
		this.regDat = regDat;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public void setLon(String lon) {
		this.lon = lon;
	}
	public void setLat(String lat) {
		this.lat = lat;
	}
	@Override
	public String toString() {
		return "CovidVo [mgrSeq=" + mgrSeq + ", startDat=" + startDat + ", regDat=" + regDat + ", note=" + note
				+ ", lon=" + lon + ", lat=" + lat + "]";
	}

}
