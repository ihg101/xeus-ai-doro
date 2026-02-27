package geomex.xeus.equipmgr.service;

import java.util.List;

import javax.validation.constraints.Size;

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

public class CableVo {

	@Size(min=0, max=10, message="시작시설관리번호는 최대 10자 까지 입력하실 수 있습니다.")
	private String stMgrNo;

	@Size(min=0, max=10, message="종료시설관리번호는 최대 10자 까지 입력하실 수 있습니다.")
	private String edMgrNo;

	@Size(min=0, max=2, message="논리, 물리 구분은 최대 2자 까지 입력하실 수 있습니다.")
	private String drwGbnCd;

	@Size(min=0, max=2, message="망구분은 최대 10자 까지 입력하실 수 있습니다.")
	private String netGbnCd;

	@Size(min=0, max=2, message="배선방식은 최대 10자 까지 입력하실 수 있습니다.")
	private String linkGbnCd;

	@Size(min=0, max=10, message="케이블 종류는 최대 10자 까지 입력하실 수 있습니다.")
	private String cableTyp;

	@Size(min=0, max=30, message="케이블명은 최대 30자 까지 입력하실 수 있습니다.")
	private String cableNm;

	@Size(min=0, max=7, message="선색상은 최대 7자 까지 입력하실 수 있습니다.")
	private String lineColor;

	private String lineWidth;

	private String ringNum;

	private String gid;

	private String lng;

	private String lat;

	private String wkt;

	private List<CableVo> CableList;

	/**
	 * @return the stMgrNo
	 */
	public String getStMgrNo() {
		return stMgrNo;
	}
	/**
	 * @param stMgrNo the stMgrNo to set
	 */
	public void setStMgrNo(String stMgrNo) {
		this.stMgrNo = stMgrNo;
	}
	/**
	 * @return the edMgrNo
	 */
	public String getEdMgrNo() {
		return edMgrNo;
	}
	/**
	 * @param edMgrNo the edMgrNo to set
	 */
	public void setEdMgrNo(String edMgrNo) {
		this.edMgrNo = edMgrNo;
	}
	/**
	 * @return the drwGbnCd
	 */
	public String getDrwGbnCd() {
		return drwGbnCd;
	}
	/**
	 * @param drwGbnCd the drwGbnCd to set
	 */
	public void setDrwGbnCd(String drwGbnCd) {
		this.drwGbnCd = drwGbnCd;
	}
	/**
	 * @return the netGbnCd
	 */
	public String getNetGbnCd() {
		return netGbnCd;
	}
	/**
	 * @param netGbnCd the netGbnCd to set
	 */
	public void setNetGbnCd(String netGbnCd) {
		this.netGbnCd = netGbnCd;
	}
	/**
	 * @return the linkGbnCd
	 */
	public String getLinkGbnCd() {
		return linkGbnCd;
	}
	/**
	 * @param linkGbnCd the linkGbnCd to set
	 */
	public void setLinkGbnCd(String linkGbnCd) {
		this.linkGbnCd = linkGbnCd;
	}
	/**
	 * @return the cableTyp
	 */
	public String getCableTyp() {
		return cableTyp;
	}
	/**
	 * @param cableTyp the cableTyp to set
	 */
	public void setCableTyp(String cableTyp) {
		this.cableTyp = cableTyp;
	}
	/**
	 * @return the cableNm
	 */
	public String getCableNm() {
		return cableNm;
	}
	/**
	 * @param cableNm the cableNm to set
	 */
	public void setCableNm(String cableNm) {
		this.cableNm = cableNm;
	}
	/**
	 * @return the lineColor
	 */
	public String getLineColor() {
		return lineColor;
	}
	/**
	 * @param lineColor the lineColor to set
	 */
	public void setLineColor(String lineColor) {
		this.lineColor = lineColor;
	}
	/**
	 * @return the lineWidth
	 */
	public String getLineWidth() {
		return lineWidth;
	}
	/**
	 * @param lineWidth the lineWidth to set
	 */
	public void setLineWidth(String lineWidth) {
		this.lineWidth = lineWidth;
	}
	/**
	 * @return the ringNum
	 */
	public String getRingNum() {
		return ringNum;
	}
	/**
	 * @param ringNum the ringNum to set
	 */
	public void setRingNum(String ringNum) {
		this.ringNum = ringNum;
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
	 * @return the wkt
	 */
	public String getWkt() {
		return wkt;
	}
	/**
	 * @param wkt the wkt to set
	 */
	public void setWkt(String wkt) {
		this.wkt = wkt;
	}
	/**
	 * @return the cableList
	 */
	public List<CableVo> getCableList() {
		return CableList;
	}
	/**
	 * @param cableList the cableList to set
	 */
	public void setCableList(List<CableVo> cableList) {
		CableList = cableList;
	}

}
