package gmx.gis.sysmgr.service;

import java.io.Serializable;

/**
 * <pre>
 * 파일명 :  GMT_AuthVo.java
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

public class GMT_AuthVo implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 827558527585864759L;
	private String authMgrNo;
	private String authData;
	private String authNm;
	private String lastMdfyDat;
	private String authGbn;

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
	 * @return the authData
	 */
	public String getAuthData() {
		return authData;
	}
	/**
	 * @param authData the authData to set
	 */
	public void setAuthData(String authData) {
		this.authData = authData;
	}
	/**
	 * @return the authNm
	 */
	public String getAuthNm() {
		return authNm;
	}
	/**
	 * @param authNm the authNm to set
	 */
	public void setAuthNm(String authNm) {
		this.authNm = authNm;
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
	public String getAuthGbn() {
		return authGbn;
	}
	public void setAuthGbn(String authGbn) {
		this.authGbn = authGbn;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "GMT_AuthVo [authMgrNo="
			+ authMgrNo + ", authData=" + authData + ", authNm=" + authNm + ", lastMdfyDat=" + lastMdfyDat + ", authGbn=" + authGbn + "]";
	}

}
