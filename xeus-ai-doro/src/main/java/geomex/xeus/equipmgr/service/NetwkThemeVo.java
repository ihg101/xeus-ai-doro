package geomex.xeus.equipmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  NetwkVo.java
 * 설  명 :
 *   네트워크망 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2019-01-30      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2019. 1. 30.
 * @version :  1.0
 * @see
 */

public class NetwkThemeVo {

	/*mgr_no serial NOT NULL, -- 관리번호
	net_gbn_cd character(2), -- 망구분코드
	net_nm character varying(100), -- 망이름
	ring_no character varying(20), -- 링번호
	cable_typ character varying(100), -- 케이블종류
	line_color character varying(12), -- 라인색상*/

	private String mgrNo;
	private String netGbnCd;
	@NotNull(message="테마명은 필수사항 입니다.")
	@NotEmpty(message="테마명은 필수사항 입니다.")
	@Size(min=0, max=100, message="테마명은 최대 100자 까지 입력하실 수 있습니다.")
	private String themeNm;
	@Size(min=0, max=20, message="링번호는 최대 20자 까지 입력하실 수 있습니다.")
	private String ringNo;
	@NotNull(message="케이블종류는 필수사항 입니다.")
	@NotEmpty(message="케이블종류는 필수사항 입니다.")
	private String cableTyp;
	private String lineColor;
	private String linkGbnCd;

	public String getMgrNo() {
		return mgrNo;
	}
	public void setMgrNo(String mgrNo) {
		this.mgrNo = mgrNo;
	}
	public String getNetGbnCd() {
		return netGbnCd;
	}
	public void setNetGbnCd(String netGbnCd) {
		this.netGbnCd = netGbnCd;
	}
	public String getThemeNm() {
		return themeNm;
	}
	public void setThemeNm(String themeNm) {
		this.themeNm = themeNm;
	}
	public String getRingNo() {
		return ringNo;
	}
	public void setRingNo(String ringNo) {
		this.ringNo = ringNo;
	}
	public String getCableTyp() {
		return cableTyp;
	}
	public void setCableTyp(String cableTyp) {
		this.cableTyp = cableTyp;
	}
	public String getLineColor() {
		return lineColor;
	}
	public void setLineColor(String lineColor) {
		this.lineColor = lineColor;
	}
	public String getLinkGbnCd() {
		return linkGbnCd;
	}
	public void setLinkGbnCd(String linkGbnCd) {
		this.linkGbnCd = linkGbnCd;
	}

}
