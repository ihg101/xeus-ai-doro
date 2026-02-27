package geomex.xeus.sysmgr.service;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;
import org.springmodules.validation.bean.conf.loader.annotation.handler.RegExp;

/**
 * <pre>
 * 파일명 :  IpVo.java
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
 * @since   :  2017. 6. 15.
 * @version :  1.0
 * @see
 */
public class IpVo {

	private String mgrSeq;

	@NotNull(message="시작 IP를 입력해주세요.")
	@NotEmpty(message="시작 IP를 입력해주세요.")
	@RegExp(value="^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])$", message="IP 양식에 맞게 입력해 주세요.")
	private String startIpNo;

	private String endIpNo;

	@NotEmpty(message="사용기관명을 선택해주세요.")
	@NotNull(message="사용기관명을 선택해주세요.")
	private String orgMgrNo;

	private String workerId;

	private String lastMdfyDat;

	@NotEmpty(message="적용여부를 선택해주세요.")
	@NotNull(message="적용여부를 선택해주세요.")
	private String useYn;

	private String orgNm;

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
	/**
	 * @return the startIpNo
	 */
	public String getStartIpNo() {
		return startIpNo;
	}
	/**
	 * @param startIpNo the startIpNo to set
	 */
	public void setStartIpNo(String startIpNo) {
		this.startIpNo = startIpNo;
	}
	/**
	 * @return the endIpNo
	 */
	public String getEndIpNo() {
		return endIpNo;
	}
	/**
	 * @param endIpNo the endIpNo to set
	 */
	public void setEndIpNo(String endIpNo) {
		this.endIpNo = endIpNo;
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
	 * @return the lastMdfyDat
	 */
	public String getLastMdfyDat() {
		return lastMdfyDat;
	}
	/**
	 * @param lastMdfyDat the lastMdfyDat to set
	 */
	public void setLastMdfyDat(String lastMdfyDat) {
		this.lastMdfyDat = lastMdfyDat;
	}
	/**
	 * @return the useYn
	 */
	public String getUseYn() {
		return useYn;
	}
	/**
	 * @param useYn the useYn to set
	 */
	public void setUseYn(String useYn) {
		this.useYn = useYn;
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
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "IpVo [mgrSeq="
			+ mgrSeq + ", startIpNo=" + startIpNo + ", endIpNo=" + endIpNo + ", orgMgrNo=" + orgMgrNo + ", workerId="
			+ workerId + ", lastMdfyDat=" + lastMdfyDat + ", useYn=" + useYn + ", orgNm=" + orgNm + "]";
	}

}
