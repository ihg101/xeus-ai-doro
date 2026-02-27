package gmx.gis.sysmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  GMT_OrganizationVo.java
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
 * @since   :  2017. 7. 7.
 * @version :  1.0
 * @see
 */

public class GMT_OrganizationVo {

	private String orgMgrNo;

	@NotNull(message="기관구분을 선택해 주세요.")
	@NotEmpty(message="기관구분을 선택해 주세요.")
	private String orgGbnCd;

	@NotNull(message="기관명을 입력해 주세요.")
	@NotEmpty(message="기관명을 입력해 주세요.")
	private String orgNm;
	private String telNum;
	private String chrgNm;
	private String rmark;
	private String upMgrNo;

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
	 * @return the orgGbnCd
	 */
	public String getOrgGbnCd() {
		return orgGbnCd;
	}
	/**
	 * @param orgGbnCd the orgGbnCd to set
	 */
	public void setOrgGbnCd(String orgGbnCd) {
		this.orgGbnCd = orgGbnCd;
	}
	/**
	 * @return the orgNm
	 */
	public String getOrgNm() {
		return orgNm;
	}
	/**
	 * @param orgNm the orgNm to set
	 */
	public void setOrgNm(String orgNm) {
		this.orgNm = orgNm;
	}
	/**
	 * @return the telNum
	 */
	public String getTelNum() {
		return telNum;
	}
	/**
	 * @param telNum the telNum to set
	 */
	public void setTelNum(String telNum) {
		this.telNum = telNum;
	}
	/**
	 * @return the chrgNm
	 */
	public String getChrgNm() {
		return chrgNm;
	}
	/**
	 * @param chrgNm the chrgNm to set
	 */
	public void setChrgNm(String chrgNm) {
		this.chrgNm = chrgNm;
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
	 * @return the upMgrNo
	 */
	public String getUpMgrNo() {
		return upMgrNo;
	}
	/**
	 * @param upMgrNo the upMgrNo to set
	 */
	public void setUpMgrNo(String upMgrNo) {
		this.upMgrNo = upMgrNo;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "GMT_OrganizationVo [orgMgrNo="
			+ orgMgrNo + ", orgGbnCd=" + orgGbnCd + ", orgNm=" + orgNm + ", telNum=" + telNum + ", chrgNm=" + chrgNm
			+ ", rmark=" + rmark + ", upMgrNo=" + upMgrNo + "]";
	}

}
