package geomex.xeus.bigdata.service;

public class BigDataAnalyzeResultVo {

	private String mgrSeq;
	private String analyMgrSeq;
	private String grid50mGid;
	private String grid100mGid;
	private String grid10mGid;
	private String gridTxt;
	private String jibnAddr;
	private String roadAddr;
	private String resultVal;
	private String rgbTxt;
	private String grpNm;

	private String tmx;
	private String tmy;
	private String lon;
	private String lat;
	private String cnt;

	public String getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getAnalyMgrSeq() {
		return analyMgrSeq;
	}
	public void setAnalyMgrSeq(String analyMgrSeq) {
		this.analyMgrSeq = analyMgrSeq;
	}
	public String getGrid50mGid() {
		return grid50mGid;
	}
	public void setGrid50mGid(String grid50mGid) {
		this.grid50mGid = grid50mGid;
	}
	public String getGrid100mGid() {
		return grid100mGid;
	}
	public void setGrid100mGid(String grid100mGid) {
		this.grid100mGid = grid100mGid;
	}
	public String getGrid10mGid() {
		return grid10mGid;
	}
	public void setGrid10mGid(String grid10mGid) {
		this.grid10mGid = grid10mGid;
	}
	public String getGridTxt() {
		return gridTxt;
	}
	public void setGridTxt(String gridTxt) {
		this.gridTxt = gridTxt;
	}
	public String getJibnAddr() {
		return jibnAddr;
	}
	public void setJibnAddr(String jibnAddr) {
		this.jibnAddr = jibnAddr;
	}
	public String getRoadAddr() {
		return roadAddr;
	}
	public void setRoadAddr(String roadAddr) {
		this.roadAddr = roadAddr;
	}
	public String getResultVal() {
		return resultVal;
	}
	public void setResultVal(String resultVal) {
		this.resultVal = resultVal;
	}
	public String getRgbTxt() {
		return rgbTxt;
	}
	public void setRgbTxt(String rgbTxt) {
		this.rgbTxt = rgbTxt;
	}
	public String getGrpNm() {
		return grpNm;
	}
	public void setGrpNm(String grpNm) {
		this.grpNm = grpNm;
	}
	public String getTmx() {
		return tmx;
	}
	public void setTmx(String tmx) {
		this.tmx = tmx;
	}
	public String getTmy() {
		return tmy;
	}
	public void setTmy(String tmy) {
		this.tmy = tmy;
	}
	public String getLon() {
		return lon;
	}
	public void setLon(String lon) {
		this.lon = lon;
	}
	public String getLat() {
		return lat;
	}
	public void setLat(String lat) {
		this.lat = lat;
	}
	public String getCnt() {
		return cnt;
	}
	public void setCnt(String cnt) {
		this.cnt = cnt;
	}
	@Override
	public String toString() {
		return "BigDataAnalyzeResultVo [mgrSeq=" + mgrSeq + ", analyMgrSeq=" + analyMgrSeq + ", grid50mGid="
				+ grid50mGid + ", grid100mGid=" + grid100mGid + ", grid10mGid=" + grid10mGid + ", gridTxt=" + gridTxt
				+ ", jibnAddr=" + jibnAddr + ", roadAddr=" + roadAddr + ", resultVal=" + resultVal + ", rgbTxt="
				+ rgbTxt + ", grpNm=" + grpNm + ", tmx=" + tmx + ", tmy=" + tmy + "]";
	}

}
