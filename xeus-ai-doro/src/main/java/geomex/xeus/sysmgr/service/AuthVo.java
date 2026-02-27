package geomex.xeus.sysmgr.service;

/**
 * <pre>
 * 파일명 :  AuthVo.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 * 2019-01-07	   이은규		   권한구분 추가
 *
 * </pre>
 *
 * @since   :  2017. 6. 22.
 * @version :  1.0
 * @see
 */

public class AuthVo {

	private String authMgrNo;
	private String authData;
	private String authNm;
	private String lastMdfyDat;
	private String authGbn;
	private String parentAuthNm;

	public String getAuthMgrNo() {
		return authMgrNo;
	}
	public String getAuthData() {
		return authData;
	}
	public String getAuthNm() {
		return authNm;
	}
	public String getLastMdfyDat() {
		return lastMdfyDat;
	}
	public String getAuthGbn() {
		return authGbn;
	}
	public String getParentAuthNm() {
		return parentAuthNm;
	}
	public void setAuthMgrNo(String authMgrNo) {
		this.authMgrNo = authMgrNo;
	}
	public void setAuthData(String authData) {
		this.authData = authData;
	}
	public void setAuthNm(String authNm) {
		this.authNm = authNm;
	}
	public void setLastMdfyDat(String lastMdfyDat) {
		this.lastMdfyDat = lastMdfyDat;
	}
	public void setAuthGbn(String authGbn) {
		this.authGbn = authGbn;
	}
	public void setParentAuthNm(String parentAuthNm) {
		this.parentAuthNm = parentAuthNm;
	}

}
