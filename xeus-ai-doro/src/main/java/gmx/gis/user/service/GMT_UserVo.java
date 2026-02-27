package gmx.gis.user.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * <pre>
 * 파일명 :  GMT_UserVo.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-05-31      이주영          최초 생성
 * 2017-12-11	   이은규		   로그인 제한 횟수, 사용자 등록IP 추가
 * 2018-01-08      이은규          subDir 생성(업로드 경로 서브 폴더이름)
 *
 * </pre>
 *
 * @since   :  2017. 5. 31.
 * @version :  1.0
 * @see
 */

public class GMT_UserVo {

	@NotNull(message="아이디를 입력해 주세요.")
	@NotEmpty(message="아이디를 입력해 주세요.")
	@Size(min=2, max=30, message="아이디는 2자 이상, 30자 이하로 입력해주세요.")
	private String userId;

	@NotNull(message="사용자명을 입력해 주세요.")
	@NotEmpty(message="사용자명을 입력해 주세요.")
	@Size(min=1, max=30, message="사용자명은 최대 30자까지 입력 할 수 있습니다.")
	private String userNm;

	@NotNull(message="비밀번호를 입력해 주세요.")
	@NotEmpty(message="비밀번호를 입력해 주세요.")
	@Size(min=5, max=100, message="비밀번호는 5자 이상, 100자 이하로 입력해주세요.")
	@Pattern(regexp="([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])", message="비밀번호는 영문, 숫자, 특수문자가 모두 포함되어야 합니다.")
	private String userPwd;

	@NotNull(message="생년월일을 입력해 주세요.")
	@NotEmpty(message="생년월일을 입력해 주세요.")
	@Size(min=1, max=6, message="생년월일은 최대 6자까지 입력 할 수 있습니다.")
	@Pattern(regexp="^[0-9]*$", message="생년월일은 숫자만 입력할 수 있습니다.")
	private String birthDay;

	@NotNull(message="권한그룹을 선택해 주세요.")
	@NotEmpty(message="권한그룹을 선택해 주세요.")
	private String authGrpNo;

	@NotNull(message="소속기관을 선택해 주세요.")
	@NotEmpty(message="소속기관을 선택해 주세요.")
	private String orgMgrNo;

	@NotNull(message="사무실 번호를 입력해 주세요.")
	@NotEmpty(message="사무실 번호를 입력해 주세요.")
	@Size(min=1, max=30, message="사무실 번호는 최대 30자까지 입력 할 수 있습니다.")
	@Pattern(regexp="^[0-9]*$", message="사무실번호는 숫자만 입력할 수 있습니다.")
	private String telNum;

	@NotNull(message="이메일 주소를 입력해 주세요.")
	@NotEmpty(message="이메일 주소를 입력해 주세요.")
	@Size(min=0, max=50, message="이메일은 최대 50자까지 입력 할 수 있습니다.")
	@Email(message="올바른 이메일 형식이 아닙니다.")
	private String email;

	private String authStatCd;
	private String reqDat;
	private String acptDat;
	private String lockDat;
	private String exprDat;
	private String acptUserId;
	private String oathFileNm;
	private String oathFilePath;

	private String userIdOrNm;
	private String authGrpNm;
	private String orgNm;

	@NotNull(message="휴대전화 번호를 입력해 주세요.")
	@NotEmpty(message="휴대전화 번호를 입력해 주세요.")
	@Size(min=1, max=30, message="휴대전화 번호는 최대 30자까지 입력 할 수 있습니다.")
	@Pattern(regexp="^[0-9]*$", message="휴대전화 번호는 숫자만 입력할 수 있습니다.")
	private String mobileNum;

	@NotNull(message="부서명을 입력해 주세요.")
	@NotEmpty(message="부서명을 입력해 주세요.")
	@Size(min=1, max=50, message="부서명은 최대 50자까지 입력 할 수 있습니다.")
	private String departNm;

	@NotNull(message="직책을 입력해 주세요.")
	@NotEmpty(message="직책을 입력해 주세요.")
	@Size(min=1, max=30, message="직책은 최대 30자까지 입력 할 수 있습니다.")
	private String posNm;

	private String authAtmtCnt;

	@Pattern(regexp = "^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
        "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
        "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
        "([01]?\\d\\d?|2[0-4]\\d|25[0-5])$", message="IP 양식에 맞게 입력해 주세요.")
	private String authConnIp;

	private String subDir;

	private String boardInfo;

	private String age;
	private String count;

	//sms인증용 인증번호 변수
	private String accNo;

	private String outSign;
	private String outStream;

	@JsonIgnore
    private MultipartFile file;

	/**
	 * @return the userId
	 */
	public String getUserId() {
		return userId;
	}
	/**
	 * @param userId the userId to set
	 */
	public void setUserId(String userId) {
		this.userId = userId;
	}
	/**
	 * @return the userNm
	 */
	public String getUserNm() {
		return userNm;
	}
	/**
	 * @param userNm the userNm to set
	 */
	public void setUserNm(String userNm) {
		this.userNm = userNm;
	}
	/**
	 * @return the userPwd
	 */
	public String getUserPwd() {
		return userPwd;
	}
	/**
	 * @param userPwd the userPwd to set
	 */
	public void setUserPwd(String userPwd) {
		this.userPwd = userPwd;
	}
	/**
	 * @return the birthDay
	 */
	public String getBirthDay() {
		return birthDay;
	}
	/**
	 * @param birthDay the birthDay to set
	 */
	public void setBirthDay(String birthDay) {
		this.birthDay = birthDay;
	}
	/**
	 * @return the authGrpNo
	 */
	public String getAuthGrpNo() {
		return authGrpNo;
	}
	/**
	 * @param authGrpNo the authGrpNo to set
	 */
	public void setAuthGrpNo(String authGrpNo) {
		this.authGrpNo = authGrpNo;
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
	 * @return the telNum
	 */
	public String getTelNum() {
		return telNum;
	}
	/**
	 * @param telNum the telNum to set
	 */
	public void setTelNum(String telNum) {
		this.telNum = telNum;
	}
	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}
	/**
	 * @param email the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}
	/**
	 * @return the authStatCd
	 */
	public String getAuthStatCd() {
		return authStatCd;
	}
	/**
	 * @param authStatCd the authStatCd to set
	 */
	public void setAuthStatCd(String authStatCd) {
		this.authStatCd = authStatCd;
	}
	/**
	 * @return the reqDat
	 */
	public String getReqDat() {
		return reqDat;
	}
	/**
	 * @param reqDat the reqDat to set
	 */
	public void setReqDat(String reqDat) {
		this.reqDat = reqDat;
	}
	/**
	 * @return the acptDat
	 */
	public String getAcptDat() {
		return acptDat;
	}
	/**
	 * @param acptDat the acptDat to set
	 */
	public void setAcptDat(String acptDat) {
		this.acptDat = acptDat;
	}
	/**
	 * @return the lockDat
	 */
	public String getLockDat() {
		return lockDat;
	}
	/**
	 * @param lockDat the lockDat to set
	 */
	public void setLockDat(String lockDat) {
		this.lockDat = lockDat;
	}
	/**
	 * @return the exprDat
	 */
	public String getExprDat() {
		return exprDat;
	}
	/**
	 * @param exprDat the exprDat to set
	 */
	public void setExprDat(String exprDat) {
		this.exprDat = exprDat;
	}
	/**
	 * @return the acptUserId
	 */
	public String getAcptUserId() {
		return acptUserId;
	}
	/**
	 * @param acptUserId the acptUserId to set
	 */
	public void setAcptUserId(String acptUserId) {
		this.acptUserId = acptUserId;
	}
	/**
	 * @return the oathFileNm
	 */
	public String getOathFileNm() {
		return oathFileNm;
	}
	/**
	 * @param oathFileNm the oathFileNm to set
	 */
	public void setOathFileNm(String oathFileNm) {
		this.oathFileNm = oathFileNm;
	}
	/**
	 * @return the oathFilePath
	 */
	public String getOathFilePath() {
		return oathFilePath;
	}
	/**
	 * @param oathFilePath the oathFilePath to set
	 */
	public void setOathFilePath(String oathFilePath) {
		this.oathFilePath = oathFilePath;
	}
	/**
	 * @return the userIdOrNm
	 */
	public String getUserIdOrNm() {
		return userIdOrNm;
	}
	/**
	 * @param userIdOrNm the userIdOrNm to set
	 */
	public void setUserIdOrNm(String userIdOrNm) {
		this.userIdOrNm = userIdOrNm;
	}
	/**
	 * @return the authGrpNm
	 */
	public String getAuthGrpNm() {
		return authGrpNm;
	}
	/**
	 * @param authGrpNm the authGrpNm to set
	 */
	public void setAuthGrpNm(String authGrpNm) {
		this.authGrpNm = authGrpNm;
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
	/**
	 * @return the file
	 */
	public MultipartFile getFile() {
		return file;
	}
	/**
	 * @param file the file to set
	 */
	public void setFile(MultipartFile file) {
		this.file = file;
	}
	/**
	 * @return the mobileNum
	 */
	public String getMobileNum() {
		return mobileNum;
	}
	/**
	 * @param mobileNum the mobileNum to set
	 */
	public void setMobileNum(String mobileNum) {
		this.mobileNum = mobileNum;
	}
	/**
	 * @return the departNm
	 */
	public String getDepartNm() {
		return departNm;
	}
	/**
	 * @param departNm the departNm to set
	 */
	public void setDepartNm(String departNm) {
		this.departNm = departNm;
	}
	/**
	 * @return the posNm
	 */
	public String getPosNm() {
		return posNm;
	}
	/**
	 * @param posNm the posNm to set
	 */
	public void setPosNm(String posNm) {
		this.posNm = posNm;
	}
	/**
	 * @return the authAtmtCnt
	 */
	public String getAuthAtmtCnt() {
		return authAtmtCnt;
	}
	/**
	 * @param authAtmtCnt the authAtmtCnt to set
	 */
	public void setAuthAtmtCnt(String authAtmtCnt) {
		this.authAtmtCnt = authAtmtCnt;
	}
	/**
	 * @return the authConnIp
	 */
	public String getAuthConnIp() {
		return authConnIp;
	}
	/**
	 * @param authConnIp the authConnIp to set
	 */
	public void setAuthConnIp(String authConnIp) {
		this.authConnIp = authConnIp;
	}
	public String getSubDir() {
        return subDir;
    }
    public void setSubDir(String subDir) {
        this.subDir = subDir;
    }
    public String getBoardInfo() {
        return boardInfo;
    }
    public void setBoardInfo(String boardInfo) {
        this.boardInfo = boardInfo;
    }

    public String getAge() {
		return age;
	}
	public void setAge(String age) {
		this.age = age;
	}
	public String getCount() {
		return count;
	}
	public void setCount(String count) {
		this.count = count;
	}
	public String getAccNo() {
		return accNo;
	}
	public void setAccNo(String accNo) {
		this.accNo = accNo;
	}
	public String getOutSign() {
		return outSign;
	}
	public void setOutSign(String outSign) {
		this.outSign = outSign;
	}
	public String getOutStream() {
		return outStream;
	}
	public void setOutStream(String outStream) {
		this.outStream = outStream;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "GMT_UserVo [userId="
			+ userId + ", userNm=" + userNm + ", userPwd=" + userPwd + ", birthDay=" + birthDay + ", authGrpNo="
			+ authGrpNo + ", orgMgrNo=" + orgMgrNo + ", telNum=" + telNum + ", email=" + email + ", authStatCd="
			+ authStatCd + ", reqDat=" + reqDat + ", acptDat=" + acptDat + ", lockDat=" + lockDat + ", exprDat="
			+ exprDat + ", acptUserId=" + acptUserId + ", oathFileNm=" + oathFileNm + ", oathFilePath=" + oathFilePath
			+ ", userIdOrNm=" + userIdOrNm + ", authGrpNm=" + authGrpNm + ", orgNm=" + orgNm + ", authAtmtCnt="
			+ authAtmtCnt + ", authConnIp=" + authConnIp + ", subDir=" + subDir + ", boardInfo=" + boardInfo + "]";
	}

}
