package geomex.xeus.equipmgr.service;


import javax.validation.constraints.Size;

import org.springmodules.validation.bean.conf.loader.annotation.handler.NotEmpty;
import org.springmodules.validation.bean.conf.loader.annotation.handler.NotNull;

/**
 * <pre>
 * 파일명 :  AcsryVo.java
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
 * @since   :  2017. 8. 30.
 * @version :  1.0
 * @see
 */

public class AcsryVo {

	private String mgrNo;

	@Size(min=0, max=6, message="관리기관번호는 최대 6자 까지 입력하실 수 있습니다.")
	private String orgMgrNo;

	@NotNull(message="사이트 관리번호는 필수사항입니다.")
	@NotEmpty(message="사이트 관리번호는 필수사항입니다.")
	private String siteMgrNo;

	@Size(min=0, max=14, message="설치일자는 최대 14자 까지 입력하실 수 있습니다.")
	private String instDat;

	@Size(min=0, max=2, message="시설구분은 최대 2자 까지 입력하실 수 있습니다.")
	private String fclGbnCd;

	@NotNull(message="부속시설물명은 필수사항입니다.")
	@NotEmpty(message="부속시설물명은 필수사항입니다.")
	@Size(min=0, max=50, message="부속시설물명은 최대 50자 까지 입력하실 수 있습니다.")
	private String atchdFclNm;

	@Size(min=0, max=50, message="제조사명은 최대 50자 까지 입력하실 수 있습니다.")
	private String makerNm;

	@Size(min=0, max=50, message="규격은 최대 50자 까지 입력하실 수 있습니다.")
	private String prdtSpec;

	@Size(min=0, max=255, message="비고 입력은 최대 255자 까지 입력하실 수 있습니다.")
	private String rmark;

	private String fileNm;
	private String mgrSeq;

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
	 * @return the siteMgrNo
	 */
	public String getSiteMgrNo() {
		return siteMgrNo;
	}
	/**
	 * @param siteMgrNo the siteMgrNo to set
	 */
	public void setSiteMgrNo(String siteMgrNo) {
		this.siteMgrNo = siteMgrNo;
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
	 * @return the fclGbnCd
	 */
	public String getFclGbnCd() {
		return fclGbnCd;
	}
	/**
	 * @param fclGbnCd the fclGbnCd to set
	 */
	public void setFclGbnCd(String fclGbnCd) {
		this.fclGbnCd = fclGbnCd;
	}
	/**
	 * @return the atchdFclNm
	 */
	public String getAtchdFclNm() {
		return atchdFclNm;
	}
	/**
	 * @param atchdFclNm the atchdFclNm to set
	 */
	public void setAtchdFclNm(String atchdFclNm) {
		this.atchdFclNm = atchdFclNm;
	}
	/**
	 * @return the makerNm
	 */
	public String getMakerNm() {
		return makerNm;
	}
	/**
	 * @param makerNm the makerNm to set
	 */
	public void setMakerNm(String makerNm) {
		this.makerNm = makerNm;
	}
	/**
	 * @return the prdtSpec
	 */
	public String getPrdtSpec() {
		return prdtSpec;
	}
	/**
	 * @param prdtSpec the prdtSpec to set
	 */
	public void setPrdtSpec(String prdtSpec) {
		this.prdtSpec = prdtSpec;
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
	 * @return the fileNm
	 */
	public String getFileNm() {
		return fileNm;
	}
	/**
	 * @param fileNm the fileNm to set
	 */
	public void setFileNm(String fileNm) {
		this.fileNm = fileNm;
	}
	/**
	 * @return the mgrSeq
	 */
	public String getMgrSeq() {
		return mgrSeq;
	}
	/**
	 * @param mgrSeq the mgrSeq to set
	 */
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}

}
