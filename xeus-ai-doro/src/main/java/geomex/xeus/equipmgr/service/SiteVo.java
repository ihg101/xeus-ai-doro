package geomex.xeus.equipmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  SiteVo.java
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
 * @since   :  2017. 8. 28.
 * @version :  1.0
 * @see
 */

public class SiteVo {

	private String mgrNo;

	@NotNull(message="관리기관은 필수사항 입니다.")
	@NotEmpty(message="관리기관은 필수사항 입니다.")
	private String orgMgrNo;

	private String repMgrNo;

	@Size(min=0, max=14, message="설치일자는 최대 14자 까지 입력하실 수 있습니다.")
	private String instDat;

	@NotNull(message="사이트명은 필수사항 입니다.")
	@NotEmpty(message="사이트명은 필수사항 입니다.")
	@Size(min=1, max=50, message="사이트명은 최대 50자 까지 입력하실 수 있습니다.")
	private String siteNm;

	private String pollGbnCd;

	private String instMgrNo;

	private String comMgrNo;

	@Size(min=0, max=10, message="통신회선번호는 최대 10자 까지 입력하실 수 있습니다.")
	private String comLineNo;

	@Size(min=0, max=6, message="통신개통일은 최대 6자 까지 입력하실 수 있습니다.")
	private String comOpenDat;

	@Size(min=0, max=6, message="통신약정만료일은 최대 6자 까지 입력하실 수 있습니다.")
	private String comExprDat;

	private String lineGbnCd;

	@Size(min=0, max=50, message="한전고객번호는 최대 50자 까지 입력하실 수 있습니다.")
	private String kepcoCustNo;

	@Size(min=0, max=255, message="위치설명은 최대 255자 까지 입력하실 수 있습니다.")
	private String locDesc;

	@Size(min=0, max=255, message="비고는 최대 255자 까지 입력하실 수 있습니다.")
	private String rmark;

	private String comMgrNm;
	private int cctvCnt;
	private int infCnt;
	private int acryCnt;

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
	 * @return the repMgrNo
	 */
	public String getRepMgrNo() {
		return repMgrNo;
	}
	/**
	 * @param repMgrNo the repMgrNo to set
	 */
	public void setRepMgrNo(String repMgrNo) {
		this.repMgrNo = repMgrNo;
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
	 * @return the siteNm
	 */
	public String getSiteNm() {
		return siteNm;
	}
	/**
	 * @param siteNm the siteNm to set
	 */
	public void setSiteNm(String siteNm) {
		this.siteNm = siteNm;
	}
	/**
	 * @return the pollGbnCd
	 */
	public String getPollGbnCd() {
		return pollGbnCd;
	}
	/**
	 * @param pollGbnCd the pollGbnCd to set
	 */
	public void setPollGbnCd(String pollGbnCd) {
		this.pollGbnCd = pollGbnCd;
	}
	/**
	 * @return the instMgrNo
	 */
	public String getInstMgrNo() {
		return instMgrNo;
	}
	/**
	 * @param instMgrNo the instMgrNo to set
	 */
	public void setInstMgrNo(String instMgrNo) {
		this.instMgrNo = instMgrNo;
	}
	/**
	 * @return the comMgrNo
	 */
	public String getComMgrNo() {
		return comMgrNo;
	}
	/**
	 * @param comMgrNo the comMgrNo to set
	 */
	public void setComMgrNo(String comMgrNo) {
		this.comMgrNo = comMgrNo;
	}
	/**
	 * @return the comLineNo
	 */
	public String getComLineNo() {
		return comLineNo;
	}
	/**
	 * @param comLineNo the comLineNo to set
	 */
	public void setComLineNo(String comLineNo) {
		this.comLineNo = comLineNo;
	}
	/**
	 * @return the comOpenDat
	 */
	public String getComOpenDat() {
		return comOpenDat;
	}
	/**
	 * @param comOpenDat the comOpenDat to set
	 */
	public void setComOpenDat(String comOpenDat) {
		this.comOpenDat = comOpenDat;
	}
	/**
	 * @return the comExprDat
	 */
	public String getComExprDat() {
		return comExprDat;
	}
	/**
	 * @param comExprDat the comExprDat to set
	 */
	public void setComExprDat(String comExprDat) {
		this.comExprDat = comExprDat;
	}
	/**
	 * @return the lineGbnCd
	 */
	public String getLineGbnCd() {
		return lineGbnCd;
	}
	/**
	 * @param lineGbnCd the lineGbnCd to set
	 */
	public void setLineGbnCd(String lineGbnCd) {
		this.lineGbnCd = lineGbnCd;
	}
	/**
	 * @return the kepcoCustNo
	 */
	public String getKepcoCustNo() {
		return kepcoCustNo;
	}
	/**
	 * @param kepcoCustNo the kepcoCustNo to set
	 */
	public void setKepcoCustNo(String kepcoCustNo) {
		this.kepcoCustNo = kepcoCustNo;
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
	 * @return the comMgrNm
	 */
	public String getComMgrNm() {
		return comMgrNm;
	}
	/**
	 * @param comMgrNm the comMgrNm to set
	 */
	public void setComMgrNm(String comMgrNm) {
		this.comMgrNm = comMgrNm;
	}
	/**
	 * @return the cctvCnt
	 */
	public int getCctvCnt() {
		return cctvCnt;
	}
	/**
	 * @param cctvCnt the cctvCnt to set
	 */
	public void setCctvCnt(int cctvCnt) {
		this.cctvCnt = cctvCnt;
	}
	/**
	 * @return the infCnt
	 */
	public int getInfCnt() {
		return infCnt;
	}
	/**
	 * @param infCnt the infCnt to set
	 */
	public void setInfCnt(int infCnt) {
		this.infCnt = infCnt;
	}
	/**
	 * @return the acryCnt
	 */
	public int getAcryCnt() {
		return acryCnt;
	}
	/**
	 * @param acryCnt the acryCnt to set
	 */
	public void setAcryCnt(int acryCnt) {
		this.acryCnt = acryCnt;
	}

}
