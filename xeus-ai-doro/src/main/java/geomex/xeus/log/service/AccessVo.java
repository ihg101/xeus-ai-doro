package geomex.xeus.log.service;

/**
 * <pre>
 * 파일명 :  AccessVo.java
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

public class AccessVo {

	private String mgrSeq;
	private String usrId;
	private String authMgrNo;
	private String useTime;
	private String allowYn;
	private String connIp;
	private String rmark;
    private String userNm;
    private String departNm;

	/**
	 * @return the mgrSeq
	 */
	public String getMgrSeq() {
		return mgrSeq;
	}
	/**
	 * @param mgrSeq the mgrSeq to set
	 */
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	/**
	 * @return the usrId
	 */
	public String getUsrId() {
		return usrId;
	}
	/**
	 * @param usrId the usrId to set
	 */
	public void setUsrId(String usrId) {
		this.usrId = usrId;
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
	 * @return the useTime
	 */
	public String getUseTime() {
		return useTime;
	}
	/**
	 * @param useTime the useTime to set
	 */
	public void setUseTime(String useTime) {
		this.useTime = useTime;
	}
	/**
	 * @return the allowYn
	 */
	public String getAllowYn() {
		return allowYn;
	}
	/**
	 * @param allowYn the allowYn to set
	 */
	public void setAllowYn(String allowYn) {
		this.allowYn = allowYn;
	}
	/**
	 * @return the connIp
	 */
	public String getConnIp() {
		return connIp;
	}
	/**
	 * @param connIp the connIp to set
	 */
	public void setConnIp(String connIp) {
		this.connIp = connIp;
	}
	/**
	 * @return the rmark
	 */
	public String getRmark() {
		return rmark;
	}
	/**
	 * @param rmark the rmark to set
	 */
	public void setRmark(String rmark) {
		this.rmark = rmark;
	}

    public String getUserNm() {
        return userNm;
    }
    public void setUserNm(String userNm) {
        this.userNm = userNm;
    }
    public String getDepartNm() {
        return departNm;
    }
    public void setDepartNm(String departNm) {
        this.departNm = departNm;
    }

    @Override
    public String toString() {
        return "AccessVo [mgrSeq=" + mgrSeq + ", usrId=" + usrId + ", authMgrNo=" + authMgrNo + ", useTime=" + useTime
                + ", allowYn=" + allowYn + ", connIp=" + connIp + ", rmark=" + rmark + ", userNm=" + userNm
                + ", departNm=" + departNm + "]";
    }

}
