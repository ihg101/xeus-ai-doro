package geomex.xeus.tvius.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  CrmsCctvStatVo.java
 * 설  명 :
 *   CrmsCctvStat 관련 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 22.      이은규          최초 생성
 *
 * </pre>
 *
 * @since : 2017. 10. 22.
 * @version : 1.0
 * @see
 */

public class CrmsCctvStatVo {

	private String mgrSeq;

	@NotNull(message="CCTV관리번호는 필수사항 입니다.")
	@NotEmpty(message="CCTV관리번호는 필수사항 입니다.")
	@Size(min=0, max=10, message="CCTV관리번호는 최대 10자 까지 입력하실 수 있습니다.")
	private String cctvMgrNo;

	private String startDat;

	private String endDat;

	private String statData;

	private String validYn;


	public String getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getCctvMgrNo() {
		return cctvMgrNo;
	}
	public void setCctvMgrNo(String cctvMgrNo) {
		this.cctvMgrNo = cctvMgrNo;
	}
	public String getStartDat() {
		return startDat;
	}
	public void setStartDat(String startDat) {
		this.startDat = startDat;
	}
	public String getEndDat() {
		return endDat;
	}
	public void setEndDat(String endDat) {
		this.endDat = endDat;
	}
	public String getStatData() {
		return statData;
	}
	public void setStatData(String statData) {
		this.statData = statData;
	}
	public String getValidYn() {
		return validYn;
	}
	public void setValidYn(String validYn) {
		this.validYn = validYn;
	}

}
