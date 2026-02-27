package geomex.xeus.equipmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  HistoryVo.java
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
 * @since   :  2017. 9. 6.
 * @version :  1.0
 * @see
 */

public class HistoryVo {

	@NotNull(message="점검대상 관리번호는 필수사항 입니다.")
	@NotEmpty(message="점검대상 관리번호는 필수사항 입니다.")
	@Size(min=0, max=10, message="점검대상 관리번호는 최대 2자 까지 입력하실 수 있습니다.")
	private String faMgrNo;

	private String chkGbnCd;

	@Size(min=0, max=50, message="점검명은 최대 50자 까지 입력하실 수 있습니다.")
	private String chkNm;

	private String chkStatCd;

	@Size(min=0, max=14, message="등록일은 최대 14자 까지 입력하실 수 있습니다.")
	private String regDat;

	@Size(min=0, max=255, message="등록사유는 최대 255자 까지 입력하실 수 있습니다.")
	private String regRsn;

	private String regUserId;

	@Size(min=0, max=14, message="접수일은 최대 14자 까지 입력하실 수 있습니다.")
	private String reptDat;

	@Size(min=0, max=14, message="작업일은 최대 14자 까지 입력하실 수 있습니다.")
	private String workDat;

	@Size(min=0, max=30, message="작업자는 최대 30자 까지 입력하실 수 있습니다.")
	private String workerId;

	private String errTypCd;

	private String workTypCd;

	@Size(min=0, max=255, message="점검내용은 최대 255자 까지 입력하실 수 있습니다.")
	private String workDesc;

	private String cnclReqDat;

	@Size(min=0, max=100, message="취소요청 사유는 최대 100자 까지 입력하실 수 있습니다.")
	private String cnclResn;

	private String cnclRsltCd;

	private String cnclAcptId;

	private String cnclAcptDat;

	private String faNm;
	private String faType;

	/**
	 * @return the faMgrNo
	 */
	public String getFaMgrNo() {
		return faMgrNo;
	}
	/**
	 * @param faMgrNo the faMgrNo to set
	 */
	public void setFaMgrNo(String faMgrNo) {
		this.faMgrNo = faMgrNo;
	}
	/**
	 * @return the chkGbnCd
	 */
	public String getChkGbnCd() {
		return chkGbnCd;
	}
	/**
	 * @param chkGbnCd the chkGbnCd to set
	 */
	public void setChkGbnCd(String chkGbnCd) {
		this.chkGbnCd = chkGbnCd;
	}
	/**
	 * @return the chkNm
	 */
	public String getChkNm() {
		return chkNm;
	}
	/**
	 * @param chkNm the chkNm to set
	 */
	public void setChkNm(String chkNm) {
		this.chkNm = chkNm;
	}
	/**
	 * @return the chkStatCd
	 */
	public String getChkStatCd() {
		return chkStatCd;
	}
	/**
	 * @param chkStatCd the chkStatCd to set
	 */
	public void setChkStatCd(String chkStatCd) {
		this.chkStatCd = chkStatCd;
	}
	/**
	 * @return the regDat
	 */
	public String getRegDat() {
		return regDat;
	}
	/**
	 * @param regDat the regDat to set
	 */
	public void setRegDat(String regDat) {
		this.regDat = regDat;
	}
	/**
	 * @return the regRsn
	 */
	public String getRegRsn() {
		return regRsn;
	}
	/**
	 * @param regRsn the regRsn to set
	 */
	public void setRegRsn(String regRsn) {
		this.regRsn = regRsn;
	}
	/**
	 * @return the regUserId
	 */
	public String getRegUserId() {
		return regUserId;
	}
	/**
	 * @param regUserId the regUserId to set
	 */
	public void setRegUserId(String regUserId) {
		this.regUserId = regUserId;
	}
	/**
	 * @return the reptDat
	 */
	public String getReptDat() {
		return reptDat;
	}
	/**
	 * @param reptDat the reptDat to set
	 */
	public void setReptDat(String reptDat) {
		this.reptDat = reptDat;
	}
	/**
	 * @return the workDat
	 */
	public String getWorkDat() {
		return workDat;
	}
	/**
	 * @param workDat the workDat to set
	 */
	public void setWorkDat(String workDat) {
		this.workDat = workDat;
	}
	/**
	 * @return the workerId
	 */
	public String getWorkerId() {
		return workerId;
	}
	/**
	 * @param workerId the workerId to set
	 */
	public void setWorkerId(String workerId) {
		this.workerId = workerId;
	}
	/**
	 * @return the errTypCd
	 */
	public String getErrTypCd() {
		return errTypCd;
	}
	/**
	 * @param errTypCd the errTypCd to set
	 */
	public void setErrTypCd(String errTypCd) {
		this.errTypCd = errTypCd;
	}
	/**
	 * @return the workTypCd
	 */
	public String getWorkTypCd() {
		return workTypCd;
	}
	/**
	 * @param workTypCd the workTypCd to set
	 */
	public void setWorkTypCd(String workTypCd) {
		this.workTypCd = workTypCd;
	}
	/**
	 * @return the workDesc
	 */
	public String getWorkDesc() {
		return workDesc;
	}
	/**
	 * @param workDesc the workDesc to set
	 */
	public void setWorkDesc(String workDesc) {
		this.workDesc = workDesc;
	}
	/**
	 * @return the cnclReqDat
	 */
	public String getCnclReqDat() {
		return cnclReqDat;
	}
	/**
	 * @param cnclReqDat the cnclReqDat to set
	 */
	public void setCnclReqDat(String cnclReqDat) {
		this.cnclReqDat = cnclReqDat;
	}
	/**
	 * @return the cnclResn
	 */
	public String getCnclResn() {
		return cnclResn;
	}
	/**
	 * @param cnclResn the cnclResn to set
	 */
	public void setCnclResn(String cnclResn) {
		this.cnclResn = cnclResn;
	}
	/**
	 * @return the cnclRsltCd
	 */
	public String getCnclRsltCd() {
		return cnclRsltCd;
	}
	/**
	 * @param cnclRsltCd the cnclRsltCd to set
	 */
	public void setCnclRsltCd(String cnclRsltCd) {
		this.cnclRsltCd = cnclRsltCd;
	}
	/**
	 * @return the cnclAcptId
	 */
	public String getCnclAcptId() {
		return cnclAcptId;
	}
	/**
	 * @param cnclAcptId the cnclAcptId to set
	 */
	public void setCnclAcptId(String cnclAcptId) {
		this.cnclAcptId = cnclAcptId;
	}
	/**
	 * @return the cnclAcptDat
	 */
	public String getCnclAcptDat() {
		return cnclAcptDat;
	}
	/**
	 * @param cnclAcptDat the cnclAcptDat to set
	 */
	public void setCnclAcptDat(String cnclAcptDat) {
		this.cnclAcptDat = cnclAcptDat;
	}
	/**
	 * @return the faNm
	 */
	public String getFaNm() {
		return faNm;
	}
	/**
	 * @param faNm the faNm to set
	 */
	public void setFaNm(String faNm) {
		this.faNm = faNm;
	}
	/**
	 * @return the faType
	 */
	public String getFaType() {
		return faType;
	}
	/**
	 * @param faType the faType to set
	 */
	public void setFaType(String faType) {
		this.faType = faType;
	}
}
