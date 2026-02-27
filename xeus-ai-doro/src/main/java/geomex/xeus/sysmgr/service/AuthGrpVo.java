package geomex.xeus.sysmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  AuthGrpVo.java
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
 * @since   :  2017. 6. 22.
 * @version :  1.0
 * @see
 */

public class AuthGrpVo {

	private String authGrpNo;

	@Size(min=1, max=50, message="그룹명은 50자 이하로 입력해주세요.")
	@NotEmpty(message="그룹명을 입력해 주세요.")
	@NotNull(message="그룹명을 입력해 주세요.")
	private String authGrpNm;
	private String authMgrNo;
	private String lastMdfyDat;
	private String authData;

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
	 * @return the authMgrNo
	 */
	public String getAuthMgrNo() {
		return authMgrNo;
	}
	/**
	 * @param authMgrNo the authMgrNo to set
	 */
	public void setAuthMgrNo(String authMgrNo) {
		this.authMgrNo = authMgrNo;
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
	public String getAuthData() {
		return authData;
	}
	public void setAuthData(String authData) {
		this.authData = authData;
	}
	@Override
	public String toString() {
		return "AuthGrpVo [authGrpNo=" + authGrpNo + ", authGrpNm=" + authGrpNm + ", authMgrNo=" + authMgrNo
				+ ", lastMdfyDat=" + lastMdfyDat + ", authData=" + authData + "]";
	}

}
