package geomex.xeus.tvius.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

public class CrmsPrevAviVo {

	@NotNull(message="반출영상파일관리번호는 필수사항 입니다.")
	@NotEmpty(message="반출영상파일관리번호는 필수사항 입니다.")
	@Size(min=0, max=32, message="반출영상파일관리번호는 최대 32자 까지 입력하실 수 있습니다.")
	private String mgrSeq;

	@NotNull(message="반출신청관리번호는 필수사항 입니다.")
	@NotEmpty(message="반출신청관리번호는 필수사항 입니다.")
	@Size(min=0, max=32, message="반출신청관리번호는 최대 32자 까지 입력하실 수 있습니다.")
	private String rqstMgrSeq;

	@NotNull(message="CCTV관리번호는 필수사항 입니다.")
	@NotEmpty(message="CCTV관리번호는 필수사항 입니다.")
	@Size(min=0, max=10, message="CCTV관리번호는 최대 10자 까지 입력하실 수 있습니다.")
	private String cctvMgrNo;

	private String secStDat;

	private String secEdDat;

	@Size(min=0, max=4, message="재생횟수제한은 최대 4자 까지 입력하실 수 있습니다.")
	private String playLimitCnt;

	private String playLimitDat;

	private String aviContsId;

	private String hddSerial;

	private String macSerial;

	@Size(min=5, max=100, message="영상비밀번호는 5자 이상, 100자 이하로 입력해주세요.")
	@Pattern(regexp="([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])", message="영상비밀번호는 영문, 숫자, 특수문자가 모두 포함되어야 합니다.")
	private String bakStatCd;

	////////////////////////////////////////

	private String vdwkFileSeq;

	private String vdwkFileNm;

	private String vdwkDownCnt;

	private String vdwkSecStDat;

	private String vdwkSecEdDat;

	private String vdwkWorkStatCd;

	private String vdwkWorkStatCdRelCdeNm;

	private String vdwkWorkRsltMsg;

	private String cctvNoRelLabel;

	public String getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getRqstMgrSeq() {
		return rqstMgrSeq;
	}
	public void setRqstMgrSeq(String rqstMgrSeq) {
		this.rqstMgrSeq = rqstMgrSeq;
	}
	public String getCctvMgrNo() {
		return cctvMgrNo;
	}
	public void setCctvMgrNo(String cctvMgrNo) {
		this.cctvMgrNo = cctvMgrNo;
	}
	public String getSecStDat() {
		return secStDat;
	}
	public void setSecStDat(String secStDat) {
		this.secStDat = secStDat;
	}
	public String getSecEdDat() {
		return secEdDat;
	}
	public void setSecEdDat(String secEdDat) {
		this.secEdDat = secEdDat;
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
	public String getAviContsId() {
		return aviContsId;
	}
	public void setAviContsId(String aviContsId) {
		this.aviContsId = aviContsId;
	}
	public String getHddSerial() {
		return hddSerial;
	}
	public void setHddSerial(String hddSerial) {
		this.hddSerial = hddSerial;
	}
	public String getMacSerial() {
		return macSerial;
	}
	public void setMacSerial(String macSerial) {
		this.macSerial = macSerial;
	}
	public String getBakStatCd() {
		return bakStatCd;
	}
	public void setBakStatCd(String bakStatCd) {
		this.bakStatCd = bakStatCd;
	}
	public String getVdwkFileSeq() {
		return vdwkFileSeq;
	}
	public void setVdwkFileSeq(String vdwkFileSeq) {
		this.vdwkFileSeq = vdwkFileSeq;
	}
	public String getVdwkFileNm() {
		return vdwkFileNm;
	}
	public void setVdwkFileNm(String vdwkFileNm) {
		this.vdwkFileNm = vdwkFileNm;
	}
	public String getVdwkDownCnt() {
		return vdwkDownCnt;
	}
	public void setVdwkDownCnt(String vdwkDownCnt) {
		this.vdwkDownCnt = vdwkDownCnt;
	}
	public String getVdwkSecStDat() {
		return vdwkSecStDat;
	}
	public void setVdwkSecStDat(String vdwkSecStDat) {
		this.vdwkSecStDat = vdwkSecStDat;
	}
	public String getVdwkSecEdDat() {
		return vdwkSecEdDat;
	}
	public void setVdwkSecEdDat(String vdwkSecEdDat) {
		this.vdwkSecEdDat = vdwkSecEdDat;
	}
	public String getVdwkWorkStatCd() {
		return vdwkWorkStatCd;
	}
	public void setVdwkWorkStatCd(String vdwkWorkStatCd) {
		this.vdwkWorkStatCd = vdwkWorkStatCd;
	}
	public String getVdwkWorkStatCdRelCdeNm() {
		return vdwkWorkStatCdRelCdeNm;
	}
	public void setVdwkWorkStatCdRelCdeNm(String vdwkWorkStatCdRelCdeNm) {
		this.vdwkWorkStatCdRelCdeNm = vdwkWorkStatCdRelCdeNm;
	}
	public String getVdwkWorkRsltMsg() {
		return vdwkWorkRsltMsg;
	}
	public void setVdwkWorkRsltMsg(String vdwkWorkRsltMsg) {
		this.vdwkWorkRsltMsg = vdwkWorkRsltMsg;
	}
	public String getCctvNoRelLabel() {
		return cctvNoRelLabel;
	}
	public void setCctvNoRelLabel(String cctvNoRelLabel) {
		this.cctvNoRelLabel = cctvNoRelLabel;
	}

}
