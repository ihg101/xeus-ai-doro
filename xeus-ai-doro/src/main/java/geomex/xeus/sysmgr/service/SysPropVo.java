package geomex.xeus.sysmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  SysPropVo.java
 * 설  명 :
 *   SysProp 관련 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 26.      이은규          최초 생성
 * 2018. 01. 19.      이은규          전체 목록 업데이트용 vo 수정
 * 2019. 08. 06.	  이은규		  tvius >> sysmgr 패키지로 이동.
 *
 * </pre>
 *
 * @since : 2017. 10. 26.
 * @version : 1.0
 * @see
 */

public class SysPropVo {

	private String propKey;
	private String propNm;
	private String propValue;

	/////////////////////////////////////
	// 전체 목록 업데이트용 추가
	/////////////////////////////////////

//    @Pattern(regexp = "^([0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9])$", message="투망모니터링 거리제한은 0~99999 까지 입력하실 수 있습니다.")
//	@Size(min=0, max=5, message="투망모니터링 거리제한은 최대 5자 까지 입력하실 수 있습니다.")
    private String cctvNetDistLimit;

//    @NotNull(message="SMS발신자(회신)번호는 필수사항입니다.")
//    @NotEmpty(message="SMS발신자(회신)번호는 필수사항입니다.")
//	@Pattern(regexp="^[0-9]*$", message="SMS발신자(회신)번호는 숫자만 입력할 수 있습니다.")
//    @Size(min=0, max=11, message="SMS발신자(회신)번호는 최대 11자 까지 입력하실 수 있습니다.")
	private String eventSmsCallbacknum;

//    @NotNull(message="장비상태체크주기(초)는 필수사항입니다.")
//    @NotEmpty(message="장비상태체크주기(초)는 필수사항입니다.")
//	@Pattern(regexp="^[0-9]*$", message="장비상태체크주기(초)는 숫자만 입력할 수 있습니다.")
	private String nmsStatusInterval;

	@NotNull(message="로그인 재시도 제한은 필수사항입니다.")
    @NotEmpty(message="로그인 재시도 제한은 필수사항입니다.")
    @Pattern(regexp = "^([1-5])$", message="로그인 재시도 제한은 5 이하의 숫자만 입력 가능합니다.")
    @Size(min=0, max=1, message="로그인 재시도 제한은 최대 1자 까지 입력하실 수 있습니다.")
	private String sysLoginLockCnt;

	private String  tviusAdminSmsList;

	@NotNull(message="반출영상 재생횟수는 필수사항입니다.")
    @NotEmpty(message="반출영상 재생횟수는 필수사항입니다.")
	@Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="반출영상 재생횟수는 1~99 까지 입력하실 수 있습니다.")
	@Size(min=0, max=2, message="반출영상 재생횟수는 최대 2자 까지 입력하실 수 있습니다.")
	private String tviusAviPlayCnt;

	@NotNull(message="반출영상 재생기간은 필수사항입니다.")
    @NotEmpty(message="반출영상 재생기간은 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="반출영상 재생기간은 숫자만 입력하실 수 있습니다.")
    @Size(min=0, max=2, message="반출영상 재생기간은 최대 2자 까지 입력하실 수 있습니다.")
	private String tviusAviPlayDat;

	@NotNull(message="미리보기 시간은 필수사항입니다.")
    @NotEmpty(message="미리보기 시간은 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|10)$", message="미리보기 시간은 1 이상 10 이하의 숫자로만 입력 가능합니다.")
    @Size(min=0, max=2, message="미리보기 시간은 최대 2자 까지 입력하실 수 있습니다.")
	private String tviusAviPlayTime;

	@NotNull(message="증거자료 신청은 필수사항입니다.")
    @NotEmpty(message="증거자료 신청은 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="증거자료 신청은 숫자만 입력하실 수 있습니다.")
    @Size(min=0, max=2, message="증거자료 신청은 최대 2자 까지 입력하실 수 있습니다.")
	private String tviusEviPlayCnt;

	@NotNull(message="사용자 영상 다운로드 제한은 필수사항입니다.")
    @NotEmpty(message="사용자 영상 다운로드 제한은 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="사용자 영상 다운로드 제한은 숫자만 입력하실 수 있습니다.")
    @Size(min=0, max=2, message="사용자 영상 다운로드 제한은 최대 2자 까지 입력하실 수 있습니다.")
	private String tviusFileDownCnt;

	@NotNull(message="연장신청 재생횟수는 필수사항입니다.")
    @NotEmpty(message="연장신청 재생횟수는 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="연장신청 재생횟수는 1~99 까지 입력하실 수 있습니다.")
    @Size(min=0, max=2, message="연장신청 재생횟수는 최대 2자 까지 입력하실 수 있습니다.")
	private String tviusRenewPlayCnt;

	@NotNull(message="연장신청 재생기간은 필수사항입니다.")
    @NotEmpty(message="연장신청 재생기간은 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="연장신청 재생기간은 1~99 까지 입력하실 수 있습니다.")
    @Size(min=0, max=2, message="연장신청 재생기간은 최대 2자 까지 입력하실 수 있습니다.")
	private String tviusRenewPlayDat;

//	@NotNull(message="문자 반출 내용은 필수사항입니다.")
//    @NotEmpty(message="문자 반출 내용은 필수사항입니다.")
//    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="반출영상 신청제한은 1~99 까지 입력하실 수 있습니다.")
//    @Size(min=0, max=2, message="반출영상 신청제한은 최대 2자 까지 입력하실 수 있습니다.")
	private String tviusSmsAviCm;


//	@NotNull(message="문자 캡처 내용은 필수사항입니다.")
//    @NotEmpty(message="문자 캡처 내용은 필수사항입니다.")
//    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="반출영상 신청제한은 1~99 까지 입력하실 수 있습니다.")
//    @Size(min=0, max=2, message="반출영상 신청제한은 최대 2자 까지 입력하실 수 있습니다.")
	private String tviusSmsCaptureCm;

//	@NotNull(message="문자 열람 내용은 필수사항입니다.")
//    @NotEmpty(message="문자 열람 내용은 필수사항입니다.")
//    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="반출영상 신청제한은 1~99 까지 입력하실 수 있습니다.")
//    @Size(min=0, max=2, message="반출영상 신청제한은 최대 2자 까지 입력하실 수 있습니다.")
	private String tviusSmsPreviewCm;


//	@NotNull(message="문자 증거 내용은 필수사항입니다.")
//    @NotEmpty(message="문자 증거 내용은 필수사항입니다.")
//    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="반출영상 신청제한은 1~99 까지 입력하실 수 있습니다.")
//    @Size(min=0, max=2, message="반출영상 신청제한은 최대 2자 까지 입력하실 수 있습니다.")
	private String tviusSmsRenewCm;

	@NotNull(message="반출영상 신청제한은 필수사항입니다.")
    @NotEmpty(message="반출영상 신청제한은 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="반출영상 신청제한은 1~99 까지 입력하실 수 있습니다.")
    @Size(min=0, max=2, message="반출영상 신청제한은 최대 2자 까지 입력하실 수 있습니다.")
	private String tviusRqstLockCnt;

//	@NotNull(message="장비상태체크여부는 필수사항입니다.")
//    @NotEmpty(message="장비상태체크여부는 필수사항입니다.")
//    @Pattern(regexp = "^(Y|N)$", message="장비상태체크여부의 형식이 올바르지 않습니다.")
	private String nmsStatusChk;
//	@NotNull(message="동영상 미리보기는 필수사항입니다.")
//    @NotEmpty(message="동영상 미리보기는 필수사항입니다.")
//    @Pattern(regexp = "^(Y|N)$", message="동영상 미리보기의 형식이 올바르지 않습니다.")
	private String tviusPreviewAvi;
//	@NotNull(message="사진 미리보기는 필수사항입니다.")
//    @NotEmpty(message="사진 미리보기는 필수사항입니다.")
//    @Pattern(regexp = "^(Y|N)$", message="사진 미리보기의 형식이 올바르지 않습니다.")
	private String tviusPreviewPhoto;

	public String getPropKey() {
		return propKey;
	}

	public void setPropKey(String propKey) {
		this.propKey = propKey;
	}

	public String getPropNm() {
		return propNm;
	}

	public void setPropNm(String propNm) {
		this.propNm = propNm;
	}

	public String getPropValue() {
		return propValue;
	}

	public void setPropValue(String propValue) {
		this.propValue = propValue;
	}

	public String getCctvNetDistLimit() {
		return cctvNetDistLimit;
	}

	public void setCctvNetDistLimit(String cctvNetDistLimit) {
		this.cctvNetDistLimit = cctvNetDistLimit;
	}

	public String getEventSmsCallbacknum() {
		return eventSmsCallbacknum;
	}

	public void setEventSmsCallbacknum(String eventSmsCallbacknum) {
		this.eventSmsCallbacknum = eventSmsCallbacknum;
	}

	public String getNmsStatusInterval() {
		return nmsStatusInterval;
	}

	public void setNmsStatusInterval(String nmsStatusInterval) {
		this.nmsStatusInterval = nmsStatusInterval;
	}

	public String getSysLoginLockCnt() {
		return sysLoginLockCnt;
	}

	public void setSysLoginLockCnt(String sysLoginLockCnt) {
		this.sysLoginLockCnt = sysLoginLockCnt;
	}

	public String getTviusAdminSmsList() {
		return tviusAdminSmsList;
	}

	public void setTviusAdminSmsList(String tviusAdminSmsList) {
		this.tviusAdminSmsList = tviusAdminSmsList;
	}

	public String getTviusAviPlayCnt() {
		return tviusAviPlayCnt;
	}

	public void setTviusAviPlayCnt(String tviusAviPlayCnt) {
		this.tviusAviPlayCnt = tviusAviPlayCnt;
	}

	public String getTviusAviPlayDat() {
		return tviusAviPlayDat;
	}

	public void setTviusAviPlayDat(String tviusAviPlayDat) {
		this.tviusAviPlayDat = tviusAviPlayDat;
	}

	public String getTviusAviPlayTime() {
		return tviusAviPlayTime;
	}

	public void setTviusAviPlayTime(String tviusAviPlayTime) {
		this.tviusAviPlayTime = tviusAviPlayTime;
	}

	public String getTviusEviPlayCnt() {
		return tviusEviPlayCnt;
	}

	public void setTviusEviPlayCnt(String tviusEviPlayCnt) {
		this.tviusEviPlayCnt = tviusEviPlayCnt;
	}

	public String getTviusFileDownCnt() {
		return tviusFileDownCnt;
	}

	public void setTviusFileDownCnt(String tviusFileDownCnt) {
		this.tviusFileDownCnt = tviusFileDownCnt;
	}

	public String getTviusRenewPlayCnt() {
		return tviusRenewPlayCnt;
	}

	public void setTviusRenewPlayCnt(String tviusRenewPlayCnt) {
		this.tviusRenewPlayCnt = tviusRenewPlayCnt;
	}

	public String getTviusRenewPlayDat() {
		return tviusRenewPlayDat;
	}

	public void setTviusRenewPlayDat(String tviusRenewPlayDat) {
		this.tviusRenewPlayDat = tviusRenewPlayDat;
	}

	public String getTviusRqstLockCnt() {
		return tviusRqstLockCnt;
	}

	public void setTviusRqstLockCnt(String tviusRqstLockCnt) {
		this.tviusRqstLockCnt = tviusRqstLockCnt;
	}

	public String getNmsStatusChk() {
		return nmsStatusChk;
	}

	public void setNmsStatusChk(String nmsStatusChk) {
		this.nmsStatusChk = nmsStatusChk;
	}

	public String getTviusPreviewAvi() {
		return tviusPreviewAvi;
	}

	public void setTviusPreviewAvi(String tviusPreviewAvi) {
		this.tviusPreviewAvi = tviusPreviewAvi;
	}

	public String getTviusPreviewPhoto() {
		return tviusPreviewPhoto;
	}

	public void setTviusPreviewPhoto(String tviusPreviewPhoto) {
		this.tviusPreviewPhoto = tviusPreviewPhoto;
	}

	public String getTviusSmsAviCm() {
		return tviusSmsAviCm;
	}

	public void setTviusSmsAviCm(String tviusSmsAviCm) {
		this.tviusSmsAviCm = tviusSmsAviCm;
	}

	public String getTviusSmsCaptureCm() {
		return tviusSmsCaptureCm;
	}

	public void setTviusSmsCaptureCm(String tviusSmsCaptureCm) {
		this.tviusSmsCaptureCm = tviusSmsCaptureCm;
	}

	public String getTviusSmsPreviewCm() {
		return tviusSmsPreviewCm;
	}

	public void setTviusSmsPreviewCm(String tviusSmsPreviewCm) {
		this.tviusSmsPreviewCm = tviusSmsPreviewCm;
	}

	public String getTviusSmsRenewCm() {
		return tviusSmsRenewCm;
	}

	public void setTviusSmsRenewCm(String tviusSmsRenewCm) {
		this.tviusSmsRenewCm = tviusSmsRenewCm;
	}
}
