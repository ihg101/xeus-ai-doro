package geomex.xeus.sysmgr.service;




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
public class SmsAuthVo {
	private String authGrpNo;
	private String userId;
	private String smsAuth;

	public String getAuthGrpNo() {
		return authGrpNo;
	}

	public void setAuthGrpNo(String authGrpNo) {
		this.authGrpNo = authGrpNo;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getSmsAuth() {
		return smsAuth;
	}

	public void setSmsAuth(String smsAuth) {
		this.smsAuth = smsAuth;
	}

	@Override
	public String toString() {
		return "SmsAuthVo [authGrpNo=" + authGrpNo + ", userId=" + userId + ", smsAuth=" + smsAuth + "]";
	}

}
