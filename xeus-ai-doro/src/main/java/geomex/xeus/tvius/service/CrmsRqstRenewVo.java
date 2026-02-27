package geomex.xeus.tvius.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

public class CrmsRqstRenewVo {

	@NotNull(message="연장신청관리번호를 입력하여 주십시오.")
	@NotEmpty(message="연장신청관리번호를 입력하여 주십시오.")
	@Size(min=0, max=32, message="연장신청관리번호는 최대 32자까지 입력 할 수 있습니다.")
	private String mgrSeq;					//연장신청관리번호

	@NotNull(message="반출영상파일관리번호를 입력하여 주십시오.")
	@NotEmpty(message="반출영상파일관리번호를 입력하여 주십시오.")
	@Size(min=0, max=32, message="반출영상파일관리번호는 최대 32자까지 입력 할 수 있습니다.")
	private String aviMgrSeq;					//반출영상파일관리번호

	@NotNull(message="반출신청관리번호를 입력하여 주십시오.")
	@NotEmpty(message="반출신청관리번호를 입력하여 주십시오.")
	@Size(min=0, max=32, message="반출신청관리번호는 최대 32자까지 입력 할 수 있습니다.")
	private String rqstMgrSeq;				//반출신청관리번호

	@NotNull(message="파일순번을 입력하여 주십시오.")
	@NotEmpty(message="파일순번을 입력하여 주십시오.")
	@Size(min=0, max=4, message="파일순번은 최대 4자까지 입력 할 수 있습니다.")
	private String fileSeq;					//파일순번

	private String renewTyp;				//연장신청구분

	private String reqstDat;				//신청일시

	@Size(min=0, max=250, message="신청사유는 최대 250자까지 입력 할 수 있습니다.")
	private String reqstResn;				//신청사유

	private String acptDat;					//승인일시

	private String acptUserId;				//승인자id

	private String acptYn;					//승인여부

	@Size(min=0, max=250, message="승인거절사유는 최대 250자까지 입력 할 수 있습니다.")
	private String rejtResn;				//승인거절사유

	@Size(min=0, max=4, message="재생횟수는 최대 4자까지 입력 할 수 있습니다.")
	private String playLimitCnt;				//재생횟수

	@Size(min=0, max=14, message="재생기간은 최대 14자까지 입력 할 수 있습니다.")
	private String playLimitDat;			//재생기간


	/////////////////////////////////////////////rqstCrimeTypRelCdeNm

	private String renewTypRelCdeNm;		//연장신청 구분 코드명
	private String acptUserIdRelUserNm;		//승인자명
	private String acptYnRelCdeNm;			//승인여부 구분 코드명
	private String rqstReqstId;				//신청자 ID
	private String rqstReqstIdRelCdeNm;		//신청자 ID
	private String rqstCrimeTyp;			//신청 유형 구분 코드
	//private String rqstReqstIdRelCdeNm;		//신청rqst_reqst_id_rel_cde_nm
	private String rqstCrimeTypRelCdeNm;	//신청 유형 구분 코드명
	private String aviCctvMgrNo;			//CCTV 관리 번호
	private String aviPlayLimitCnt;			//재생 횟수
	private String aviPlayLimitDat;			//재생 만료일
	private String workFileNm;				//영상 서버 저장 파일명
	private String cctvNoRelLabel;			//CCTV명
	private String reqGbnCd;				//신청건 신청구분 코드

	public String getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getAviMgrSeq() {
		return aviMgrSeq;
	}
	public void setAviMgrSeq(String aviMgrSeq) {
		this.aviMgrSeq = aviMgrSeq;
	}
	public String getRqstMgrSeq() {
		return rqstMgrSeq;
	}
	public void setRqstMgrSeq(String rqstMgrSeq) {
		this.rqstMgrSeq = rqstMgrSeq;
	}
	public String getFileSeq() {
		return fileSeq;
	}
	public void setFileSeq(String fileSeq) {
		this.fileSeq = fileSeq;
	}
	public String getRenewTyp() {
		return renewTyp;
	}
	public void setRenewTyp(String renewTyp) {
		this.renewTyp = renewTyp;
	}
	public String getReqstDat() {
		return reqstDat;
	}
	public void setReqstDat(String reqstDat) {
		this.reqstDat = reqstDat;
	}
	public String getReqstResn() {
		return reqstResn;
	}
	public void setReqstResn(String reqstResn) {
		this.reqstResn = reqstResn;
	}
	public String getAcptDat() {
		return acptDat;
	}
	public void setAcptDat(String acptDat) {
		this.acptDat = acptDat;
	}
	public String getAcptUserId() {
		return acptUserId;
	}
	public void setAcptUserId(String acptUserId) {
		this.acptUserId = acptUserId;
	}
	public String getAcptYn() {
		return acptYn;
	}
	public void setAcptYn(String acptYn) {
		this.acptYn = acptYn;
	}
	public String getRejtResn() {
		return rejtResn;
	}
	public void setRejtResn(String rejtResn) {
		this.rejtResn = rejtResn;
	}
	public String getPlayLimitCnt() {
		return playLimitCnt;
	}
	public void setPlayLimitCnt(String playLimitCnt) {
		this.playLimitCnt = playLimitCnt;
	}
	public String getPlayLimitDat() {
		return playLimitDat;
	}
	public void setPlayLimitDat(String playLimitDat) {
		this.playLimitDat = playLimitDat;
	}
	public String getRenewTypRelCdeNm() {
		return renewTypRelCdeNm;
	}
	public void setRenewTypRelCdeNm(String renewTypRelCdeNm) {
		this.renewTypRelCdeNm = renewTypRelCdeNm;
	}
	public String getAcptUserIdRelUserNm() {
		return acptUserIdRelUserNm;
	}
	public void setAcptUserIdRelUserNm(String acptUserIdRelUserNm) {
		this.acptUserIdRelUserNm = acptUserIdRelUserNm;
	}
	public String getAcptYnRelCdeNm() {
		return acptYnRelCdeNm;
	}
	public void setAcptYnRelCdeNm(String acptYnRelCdeNm) {
		this.acptYnRelCdeNm = acptYnRelCdeNm;
	}
	public String getRqstReqstId() {
		return rqstReqstId;
	}
	public void setRqstReqstId(String rqstReqstId) {
		this.rqstReqstId = rqstReqstId;
	}
	public String getRqstReqstIdRelCdeNm() {
		return rqstReqstIdRelCdeNm;
	}
	public void setRqstReqstIdRelCdeNm(String rqstReqstIdRelCdeNm) {
		this.rqstReqstIdRelCdeNm = rqstReqstIdRelCdeNm;
	}
	public String getRqstCrimeTyp() {
		return rqstCrimeTyp;
	}
	public void setRqstCrimeTyp(String rqstCrimeTyp) {
		this.rqstCrimeTyp = rqstCrimeTyp;
	}
	public String getRqstCrimeTypRelCdeNm() {
		return rqstCrimeTypRelCdeNm;
	}
	public void setRqstCrimeTypRelCdeNm(String rqstCrimeTypRelCdeNm) {
		this.rqstCrimeTypRelCdeNm = rqstCrimeTypRelCdeNm;
	}
	public String getAviCctvMgrNo() {
		return aviCctvMgrNo;
	}
	public void setAviCctvMgrNo(String aviCctvMgrNo) {
		this.aviCctvMgrNo = aviCctvMgrNo;
	}
	public String getAviPlayLimitCnt() {
		return aviPlayLimitCnt;
	}
	public void setAviPlayLimitCnt(String aviPlayLimitCnt) {
		this.aviPlayLimitCnt = aviPlayLimitCnt;
	}
	public String getAviPlayLimitDat() {
		return aviPlayLimitDat;
	}
	public void setAviPlayLimitDat(String aviPlayLimitDat) {
		this.aviPlayLimitDat = aviPlayLimitDat;
	}
	public String getWorkFileNm() {
		return workFileNm;
	}
	public void setWorkFileNm(String workFileNm) {
		this.workFileNm = workFileNm;
	}
	public String getCctvNoRelLabel() {
		return cctvNoRelLabel;
	}
	public void setCctvNoRelLabel(String cctvNoRelLabel) {
		this.cctvNoRelLabel = cctvNoRelLabel;
	}
	public String getReqGbnCd() {
		return reqGbnCd;
	}
	public void setReqGbnCd(String reqGbnCd) {
		this.reqGbnCd = reqGbnCd;
	}

}
