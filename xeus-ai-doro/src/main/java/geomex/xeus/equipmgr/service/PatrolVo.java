package geomex.xeus.equipmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

public class PatrolVo {

	private String ownerId;

	@NotNull(message="경로명은 필수사항 입니다.")
	@NotEmpty(message="경로명은 필수사항 입니다.")
	@Size(min=0, max=50, message="경로명은 최대 50자 까지 입력하실 수 있습니다.")
	private String titleNm;

	private String jsonTxt;

	private String colNum;

	private String intvlTime;

	private String srchRadius;

	private String cctvLimit;

	private String chgDat;

	private String gid;

	private String lng;

	private String lat;

	private String wkt;

	public String getOwnerId() {
		return ownerId;
	}
	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}
	public String getTitleNm() {
		return titleNm;
	}
	public void setTitleNm(String titleNm) {
		this.titleNm = titleNm;
	}
	public String getJsonTxt() {
		return jsonTxt;
	}
	public void setJsonTxt(String jsonTxt) {
		this.jsonTxt = jsonTxt;
	}
	public String getColNum() {
		return colNum;
	}
	public void setColNum(String colNum) {
		this.colNum = colNum;
	}
	public String getIntvlTime() {
		return intvlTime;
	}
	public void setIntvlTime(String intvlTime) {
		this.intvlTime = intvlTime;
	}
	public String getSrchRadius() {
		return srchRadius;
	}
	public void setSrchRadius(String srchRadius) {
		this.srchRadius = srchRadius;
	}
	public String getCctvLimit() {
		return cctvLimit;
	}
	public void setCctvLimit(String cctvLimit) {
		this.cctvLimit = cctvLimit;
	}
	public String getChgDat() {
		return chgDat;
	}
	public void setChgDat(String chgDat) {
		this.chgDat = chgDat;
	}
	public String getGid() {
		return gid;
	}
	public void setGid(String gid) {
		this.gid = gid;
	}
	public String getLng() {
		return lng;
	}
	public void setLng(String lng) {
		this.lng = lng;
	}
	public String getLat() {
		return lat;
	}
	public void setLat(String lat) {
		this.lat = lat;
	}
	public String getWkt() {
		return wkt;
	}
	public void setWkt(String wkt) {
		this.wkt = wkt;
	}

}
