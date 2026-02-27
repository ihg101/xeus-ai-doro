package geomex.xeus.bigdata.service;

import javax.validation.constraints.Size;

public class CctvInstallVo {

	private String mgrSeq;
	private String instYear;
	private String instMon;
	private String instDay;
	private String emd;
	private String bjd;
	private String san;

	@Size(min=0, max=20, message="지번은 최대 20자 까지 입력하실 수 있습니다.")
	private String jibun;
	private String lon;
	private String lat;
	private String regReqOne;
	private String regReqTwo;
	private String regReq;
	private String instYn;
	private String ovrpYn;
	private String instRes;

	private String userNm;

	@Size(min=0, max=50, message="민원인 전화번호는 최대 50자 까지 입력하실 수 있습니다.")
	private String userTell;

	@Size(min=0, max=12, message="접수방법은 최대 8자 까지 입력하실 수 있습니다.")
	private String regHow;
	private String rmark;

	@Size(min=0, max=12, message="현장실사는 최대 10자 까지 입력하실 수 있습니다.")
	private String fieldInsp;
	private String resDate;

	private String tmx;
	private String tmy;

	private String geojson;

	public String getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getInstYear() {
		return instYear;
	}
	public void setInstYear(String instYear) {
		this.instYear = instYear;
	}
	public String getInstMon() {
		return instMon;
	}
	public void setInstMon(String instMon) {
		this.instMon = instMon;
	}
	public String getInstDay() {
		return instDay;
	}
	public void setInstDay(String instDay) {
		this.instDay = instDay;
	}
	public String getEmd() {
		return emd;
	}
	public void setEmd(String emd) {
		this.emd = emd;
	}
	public String getBjd() {
		return bjd;
	}
	public void setBjd(String bjd) {
		this.bjd = bjd;
	}
	public String getSan() {
		return san;
	}
	public void setSan(String san) {
		this.san = san;
	}
	public String getJibun() {
		return jibun;
	}
	public void setJibun(String jibun) {
		this.jibun = jibun;
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
	public String getRegReqOne() {
		return regReqOne;
	}
	public void setRegReqOne(String regReqOne) {
		this.regReqOne = regReqOne;
	}
	public String getRegReqTwo() {
		return regReqTwo;
	}
	public void setRegReqTwo(String regReqTwo) {
		this.regReqTwo = regReqTwo;
	}
	public String getRegReq() {
		return regReq;
	}
	public void setRegReq(String regReq) {
		this.regReq = regReq;
	}
	public String getInstYn() {
		return instYn;
	}
	public void setInstYn(String instYn) {
		this.instYn = instYn;
	}
	public String getOvrpYn() {
		return ovrpYn;
	}
	public void setOvrpYn(String ovrpYn) {
		this.ovrpYn = ovrpYn;
	}
	public String getInstRes() {
		return instRes;
	}
	public void setInstRes(String instRes) {
		this.instRes = instRes;
	}
	public String getUserNm() {
		return userNm;
	}
	public void setUserNm(String userNm) {
		this.userNm = userNm;
	}
	public String getUserTell() {
		return userTell;
	}
	public void setUserTell(String userTell) {
		this.userTell = userTell;
	}
	public String getRegHow() {
		return regHow;
	}
	public void setRegHow(String regHow) {
		this.regHow = regHow;
	}
	public String getRmark() {
		return rmark;
	}
	public void setRmark(String rmark) {
		this.rmark = rmark;
	}
	public String getFieldInsp() {
		return fieldInsp;
	}
	public void setFieldInsp(String fieldInsp) {
		this.fieldInsp = fieldInsp;
	}
	public String getResDate() {
		return resDate;
	}
	public void setResDate(String resDate) {
		this.resDate = resDate;
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
	public String getGeojson() {
		return geojson;
	}
	public void setGeojson(String geojson) {
		this.geojson = geojson;
	}
	@Override
	public String toString() {
		return "CctvInstallVo [mgrSeq=" + mgrSeq + ", instYear=" + instYear + ", instMon=" + instMon + ", instDay="
				+ instDay + ", emd=" + emd + ", bjd=" + bjd + ", san=" + san + ", jibun=" + jibun + ", lon=" + lon
				+ ", lat=" + lat + ", regReqOne=" + regReqOne + ", regReqTwo=" + regReqTwo + ", regReq=" + regReq
				+ ", instYn=" + instYn + ", ovrpYn=" + ovrpYn + ", instRes=" + instRes + ", userNm=" + userNm
				+ ", userTell=" + userTell + ", regHow=" + regHow + ", rmark=" + rmark + ", fieldInsp=" + fieldInsp
				+ ", resDate=" + resDate + ", tmx=" + tmx + ", tmy=" + tmy + "]";
	}

}
