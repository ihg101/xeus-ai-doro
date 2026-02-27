package gmx.gis.sysmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  GMT_SysPropVo.java
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

public class GMT_SysPropVo {

	private String propKey;
	private String propNm;
	private String propValue;

	/////////////////////////////////////
	// 전체 목록 업데이트용 추가
	/////////////////////////////////////

    @Pattern(regexp = "^([0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9])$", message="투망모니터링 거리제한은 0~99999 까지 입력하실 수 있습니다.")
	@Size(min=0, max=5, message="투망모니터링 거리제한은 최대 5자 까지 입력하실 수 있습니다.")
    private String cctvNetDistLimit;

    @NotNull(message="치매노인갱신주기는 필수사항입니다.")
    @NotEmpty(message="치매노인갱신주기는 필수사항입니다.")
	@Pattern(regexp="^[0-9]*$", message="치매노인갱신주기는 숫자만 입력할 수 있습니다.")
	private String eventDementiaInterval;
    @NotNull(message="펌프장갱신주기는 필수사항입니다.")
    @NotEmpty(message="펌프장갱신주기는 필수사항입니다.")
	@Pattern(regexp="^[0-9]*$", message="펌프장갱신주기는 숫자만 입력할 수 있습니다.")
	private String eventPumpInterval;

    @NotNull(message="일강우량경고값은 필수사항입니다.")
    @NotEmpty(message="일강우량경고값은 필수사항입니다.")
	@Pattern(regexp="^[0-9]*$", message="일강우량경고값은 숫자만 입력할 수 있습니다.")
	private String eventPumpWarnRainday;
    @NotNull(message="시간강우량경고값은 필수사항입니다.")
    @NotEmpty(message="시간강우량경고값은 필수사항입니다.")
	@Pattern(regexp="^[0-9]*$", message="시간강우량경고값은 숫자만 입력할 수 있습니다.")
	private String eventPumpWarnRainhour;

    @NotNull(message="SMS발신자(회신)번호는 필수사항입니다.")
    @NotEmpty(message="SMS발신자(회신)번호는 필수사항입니다.")
	@Pattern(regexp="^[0-9]*$", message="SMS발신자(회신)번호는 숫자만 입력할 수 있습니다.")
    @Size(min=0, max=11, message="SMS발신자(회신)번호는 최대 11자 까지 입력하실 수 있습니다.")
	private String eventSmsCallbacknum;

    @NotNull(message="CPU사용률경고(%)는 필수사항입니다.")
    @NotEmpty(message="CPU사용률경고(%)는 필수사항입니다.")
	@Pattern(regexp="^[0-9]*$", message="CPU사용률경고(%)는 숫자만 입력할 수 있습니다.")
    @Size(min=0, max=3, message="CPU사용률경고(%)는 최대 3자 까지 입력하실 수 있습니다.")
	private String nmsCpuWarnValue;
    @NotNull(message="메모리사용률경고(%)는 필수사항입니다.")
    @NotEmpty(message="메모리사용률경고(%)는 필수사항입니다.")
	@Pattern(regexp="^[0-9]*$", message="메모리사용률경고(%)는 숫자만 입력할 수 있습니다.")
    @Size(min=0, max=3, message="메모리사용률경고(%)는 최대 3자 까지 입력하실 수 있습니다.")
	private String nmsMemWarnValue;
    @NotNull(message="LoRA 상태체트주기(초)는 필수사항입니다.")
    @NotEmpty(message="LoRA 상태체트주기(초)는 필수사항입니다.")
	@Pattern(regexp="^[0-9]*$", message="LoRA 상태체트주기(초)는 숫자만 입력할 수 있습니다.")
	private String nmsLoraStatusInterval;
    @NotNull(message="REP체크추기(초)는 필수사항입니다.")
    @NotEmpty(message="REP체크추기(초)는 필수사항입니다.")
	@Pattern(regexp="^[0-9]*$", message="REP체크추기(초)는 숫자만 입력할 수 있습니다.")
	private String nmsRepInterval;
    @NotNull(message="장비상태체크주기(초)는 필수사항입니다.")
    @NotEmpty(message="장비상태체크주기(초)는 필수사항입니다.")
	@Pattern(regexp="^[0-9]*$", message="장비상태체크주기(초)는 숫자만 입력할 수 있습니다.")
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

	@NotNull(message="반출영상 신청제한은 필수사항입니다.")
    @NotEmpty(message="반출영상 신청제한은 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="반출영상 신청제한은 1~99 까지 입력하실 수 있습니다.")
    @Size(min=0, max=2, message="반출영상 신청제한은 최대 2자 까지 입력하실 수 있습니다.")
	private String tviusRqstLockCnt;

	@NotNull(message="치매노인갱신여부는 필수사항입니다.")
    @NotEmpty(message="치매노인갱신여부는 필수사항입니다.")
    @Pattern(regexp = "^(Y|N)$", message="치매노인갱신여부의 형식이 올바르지 않습니다.")
	private String eventDementiaChk;
	@NotNull(message="펌프장갱신여부는 필수사항입니다.")
    @NotEmpty(message="펌프장갱신여부는 필수사항입니다.")
    @Pattern(regexp = "^(Y|N)$", message="펌프장갱신여부의 형식이 올바르지 않습니다.")
	private String eventPumpChk;
	@NotNull(message="LoRA-AP상태체크여부는 필수사항입니다.")
    @NotEmpty(message="LoRA-AP상태체크여부는 필수사항입니다.")
    @Pattern(regexp = "^(Y|N)$", message="LoRA-AP상태체크여부의 형식이 올바르지 않습니다.")
	private String nmsLoraApChk;
	@NotNull(message="LoRA CCTV상태체크여부는 필수사항입니다.")
    @NotEmpty(message="LoRA CCTV상태체크여부는 필수사항입니다.")
    @Pattern(regexp = "^(Y|N)$", message="LoRA CCTV상태체크여부의 형식이 올바르지 않습니다.")
	private String nmsLoraCctvChk;
	@NotNull(message="REP체크여부는 필수사항입니다.")
    @NotEmpty(message="REP체크여부는 필수사항입니다.")
    @Pattern(regexp = "^(Y|N)$", message="REP체크여부의 형식이 올바르지 않습니다.")
	private String nmsRepChk;
	@NotNull(message="장비상태체크여부는 필수사항입니다.")
    @NotEmpty(message="장비상태체크여부는 필수사항입니다.")
    @Pattern(regexp = "^(Y|N)$", message="장비상태체크여부의 형식이 올바르지 않습니다.")
	private String nmsStatusChk;
	@NotNull(message="동영상 미리보기는 필수사항입니다.")
    @NotEmpty(message="동영상 미리보기는 필수사항입니다.")
    @Pattern(regexp = "^(Y|N)$", message="동영상 미리보기의 형식이 올바르지 않습니다.")
	private String tviusPreviewAvi;
	@NotNull(message="사진 미리보기는 필수사항입니다.")
    @NotEmpty(message="사진 미리보기는 필수사항입니다.")
    @Pattern(regexp = "^(Y|N)$", message="사진 미리보기의 형식이 올바르지 않습니다.")
	private String tviusPreviewPhoto;

	/*
	@NotNull(message="관리자 SMS 전송 리스트는 필수사항입니다.")
	@NotEmpty(message="관리자 SMS 전송 리스트는 필수사항 입니다.")
	@Size(min=0, max=100, message="관리자 SMS 전송 리스트는 최대 100자 까지 입력하실 수 있습니다.")
	private String adminSmsList;

	@NotNull(message="반출영상 재생횟수는 필수사항입니다.")
    @NotEmpty(message="반출영상 재생횟수는 필수사항입니다.")
	@Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="반출영상 재생횟수는 1~99 까지 입력하실 수 있습니다.")
	@Size(min=0, max=2, message="반출영상 재생횟수는 최대 2자 까지 입력하실 수 있습니다.")
	private String aviPlayCnt;

	@NotNull(message="반출영상 재생기간은 필수사항입니다.")
    @NotEmpty(message="반출영상 재생기간은 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="반출영상 재생기간은 숫자만 입력하실 수 있습니다.")
    @Size(min=0, max=2, message="반출영상 재생기간은 최대 2자 까지 입력하실 수 있습니다.")
	private String aviPlayDat;

	@NotNull(message="미리보기 시간은 필수사항입니다.")
    @NotEmpty(message="미리보기 시간은 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|10)$", message="미리보기 시간은 1 이상 10 이하의 숫자로만 입력 가능합니다.")
    @Size(min=0, max=2, message="미리보기 시간은 최대 2자 까지 입력하실 수 있습니다.")
	private String aviPlayTime;

	@NotNull(message="동영상 미리보기는 필수사항입니다.")
    @NotEmpty(message="동영상 미리보기는 필수사항입니다.")
    @Pattern(regexp = "^(Y|N)$", message="동영상 미리보기의 형식이 올바르지 않습니다.")
	private String previewAvi;

	@NotNull(message="증거자료 신청은 필수사항입니다.")
    @NotEmpty(message="증거자료 신청은 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="증거자료 신청은 숫자만 입력하실 수 있습니다.")
    @Size(min=0, max=2, message="증거자료 신청은 최대 2자 까지 입력하실 수 있습니다.")
	private String eviPlayCnt;

	@NotNull(message="사용자 영상 다운로드 제한은 필수사항입니다.")
    @NotEmpty(message="사용자 영상 다운로드 제한은 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="사용자 영상 다운로드 제한은 숫자만 입력하실 수 있습니다.")
    @Size(min=0, max=2, message="사용자 영상 다운로드 제한은 최대 2자 까지 입력하실 수 있습니다.")
	private String fileDownCnt;

	@NotNull(message="만료일 알림 문자전송은 필수사항입니다.")
    @NotEmpty(message="만료일 알림 문자전송은 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|10)$", message="만료일 알림 문자전송은 10 이하의 숫자만 입력 가능합니다.")
    @Size(min=0, max=2, message="만료일 알림 문자전송은 최대 2자 까지 입력하실 수 있습니다.")
	private String lastSmsDat;

	@NotNull(message="로그인 재시도 제한은 필수사항입니다.")
    @NotEmpty(message="로그인 재시도 제한은 필수사항입니다.")
    @Pattern(regexp = "^([1-5])$", message="로그인 재시도 제한은 5 이하의 숫자만 입력 가능합니다.")
    @Size(min=0, max=1, message="로그인 재시도 제한은 최대 1자 까지 입력하실 수 있습니다.")
	private String loginLockCnt;

	@NotNull(message="마스킹 후 저장 경로는 필수사항입니다.")
    @NotEmpty(message="마스킹 후 저장 경로는 필수사항입니다.")
	private String maskingRouteAf;

	@NotNull(message="마스킹 전 저장 경로는 필수사항입니다.")
    @NotEmpty(message="마스킹 전 저장 경로는 필수사항입니다.")
	private String maskingRouteBf;

	private String maskingYn;

	@NotNull(message="사진 미리보기는 필수사항입니다.")
    @NotEmpty(message="사진 미리보기는 필수사항입니다.")
    @Pattern(regexp = "^(Y|N)$", message="사진 미리보기의 형식이 올바르지 않습니다.")
	private String previewPhoto;

	@NotNull(message="연장신청 재생횟수는 필수사항입니다.")
    @NotEmpty(message="연장신청 재생횟수는 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="연장신청 재생횟수는 1~99 까지 입력하실 수 있습니다.")
    @Size(min=0, max=2, message="연장신청 재생횟수는 최대 2자 까지 입력하실 수 있습니다.")
	private String renewPlayCnt;

	@NotNull(message="연장신청 재생기간은 필수사항입니다.")
    @NotEmpty(message="연장신청 재생기간은 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="연장신청 재생기간은 1~99 까지 입력하실 수 있습니다.")
    @Size(min=0, max=2, message="연장신청 재생기간은 최대 2자 까지 입력하실 수 있습니다.")
	private String renewPlayDat;

	@NotNull(message="반출영상 신청제한은 필수사항입니다.")
    @NotEmpty(message="반출영상 신청제한은 필수사항입니다.")
    @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message="반출영상 신청제한은 1~99 까지 입력하실 수 있습니다.")
    @Size(min=0, max=2, message="반출영상 신청제한은 최대 2자 까지 입력하실 수 있습니다.")
	private String rqstLockCnt;
	private String storagePath;
	private String uploadPath;

	private String evt112;
	private String evt119;
	private String evtDsc;

	@NotNull(message="투망모니터링 거리제한은 필수사항입니다.")
    @NotEmpty(message="투망모니터링 거리제한은 필수사항입니다.")
    @Pattern(regexp = "^([0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9])$", message="투망모니터링 거리제한은 0~99999 까지 입력하실 수 있습니다.")
	@Size(min=0, max=5, message="투망모니터링 거리제한은 최대 5자 까지 입력하실 수 있습니다.")
    private String cctvNetDistLimit;
	*/

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

	public String getEventDementiaInterval() {
		return eventDementiaInterval;
	}

	public void setEventDementiaInterval(String eventDementiaInterval) {
		this.eventDementiaInterval = eventDementiaInterval;
	}

	public String getEventPumpInterval() {
		return eventPumpInterval;
	}

	public void setEventPumpInterval(String eventPumpInterval) {
		this.eventPumpInterval = eventPumpInterval;
	}

	public String getEventPumpWarnRainday() {
		return eventPumpWarnRainday;
	}

	public void setEventPumpWarnRainday(String eventPumpWarnRainday) {
		this.eventPumpWarnRainday = eventPumpWarnRainday;
	}

	public String getEventPumpWarnRainhour() {
		return eventPumpWarnRainhour;
	}

	public void setEventPumpWarnRainhour(String eventPumpWarnRainhour) {
		this.eventPumpWarnRainhour = eventPumpWarnRainhour;
	}

	public String getEventSmsCallbacknum() {
		return eventSmsCallbacknum;
	}

	public void setEventSmsCallbacknum(String eventSmsCallbacknum) {
		this.eventSmsCallbacknum = eventSmsCallbacknum;
	}

	public String getNmsCpuWarnValue() {
		return nmsCpuWarnValue;
	}

	public void setNmsCpuWarnValue(String nmsCpuWarnValue) {
		this.nmsCpuWarnValue = nmsCpuWarnValue;
	}

	public String getNmsMemWarnValue() {
		return nmsMemWarnValue;
	}

	public void setNmsMemWarnValue(String nmsMemWarnValue) {
		this.nmsMemWarnValue = nmsMemWarnValue;
	}

	public String getNmsLoraStatusInterval() {
		return nmsLoraStatusInterval;
	}

	public void setNmsLoraStatusInterval(String nmsLoraStatusInterval) {
		this.nmsLoraStatusInterval = nmsLoraStatusInterval;
	}

	public String getNmsRepInterval() {
		return nmsRepInterval;
	}

	public void setNmsRepInterval(String nmsRepInterval) {
		this.nmsRepInterval = nmsRepInterval;
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

	public String getEventDementiaChk() {
		return eventDementiaChk;
	}

	public void setEventDementiaChk(String eventDementiaChk) {
		this.eventDementiaChk = eventDementiaChk;
	}

	public String getEventPumpChk() {
		return eventPumpChk;
	}

	public void setEventPumpChk(String eventPumpChk) {
		this.eventPumpChk = eventPumpChk;
	}

	public String getNmsLoraApChk() {
		return nmsLoraApChk;
	}

	public void setNmsLoraApChk(String nmsLoraApChk) {
		this.nmsLoraApChk = nmsLoraApChk;
	}

	public String getNmsLoraCctvChk() {
		return nmsLoraCctvChk;
	}

	public void setNmsLoraCctvChk(String nmsLoraCctvChk) {
		this.nmsLoraCctvChk = nmsLoraCctvChk;
	}

	public String getNmsRepChk() {
		return nmsRepChk;
	}

	public void setNmsRepChk(String nmsRepChk) {
		this.nmsRepChk = nmsRepChk;
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

}
