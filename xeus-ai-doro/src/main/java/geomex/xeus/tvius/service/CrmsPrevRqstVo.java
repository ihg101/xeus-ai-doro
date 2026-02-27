package geomex.xeus.tvius.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

public class CrmsPrevRqstVo {

	@NotNull(message="반출신청관리번호는 필수사항 입니다.")
	@NotEmpty(message="반출신청관리번호는 필수사항 입니다.")
	@Size(min=0, max=32, message="반출신청관리번호는 최대 32자 까지 입력하실 수 있습니다.")
	private String mgrSeq;

	private String reqstId;

	private String reqstDat;

	private String procStatCd;

	private String fnshDat;

	private String reqstIdRelCdeNam;

	private String procStatCdRelCdeNam;

	public String getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getReqstId() {
		return reqstId;
	}
	public void setReqstId(String reqstId) {
		this.reqstId = reqstId;
	}
	public String getReqstDat() {
		return reqstDat;
	}
	public void setReqstDat(String reqstDat) {
		this.reqstDat = reqstDat;
	}
	public String getProcStatCd() {
		return procStatCd;
	}
	public void setProcStatCd(String procStatCd) {
		this.procStatCd = procStatCd;
	}
	public String getFnshDat() {
		return fnshDat;
	}
	public void setFnshDat(String fnshDat) {
		this.fnshDat = fnshDat;
	}
	public String getReqstIdRelCdeNam() {
		return reqstIdRelCdeNam;
	}
	public void setReqstIdRelCdeNam(String reqstIdRelCdeNam) {
		this.reqstIdRelCdeNam = reqstIdRelCdeNam;
	}
	public String getProcStatCdRelCdeNam() {
		return procStatCdRelCdeNam;
	}
	public void setProcStatCdRelCdeNam(String procStatCdRelCdeNam) {
		this.procStatCdRelCdeNam = procStatCdRelCdeNam;
	}

}
