package geomex.xeus.log.service;

/**
 * <pre>
 * 파일명 :  MonCctvLogVo.java
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

public class MonCctvLogVo {

	private String mgrSeq;
	private String userId;
	private String cctvMgrNo;
	private String useTyp;
	private String startDat;
	private String endDat;
	private String nonce;
	private String conIp;
	private String viewSize;
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
	 * @return the userId
	 */
	public String getuserId() {
		return userId;
	}
	/**
	 * @param userId the userId to set
	 */
	public void setuserId(String userId) {
		this.userId = userId;
	}

	public String getCctvMgrNo() {
		return cctvMgrNo;
	}
	public void setCctvMgrNo(String cctvMgrNo) {
		this.cctvMgrNo = cctvMgrNo;
	}
	public String getUseTyp() {
		return useTyp;
	}
	public void setUseTyp(String useTyp) {
		this.useTyp = useTyp;
	}
	public String getStartDat() {
		return startDat;
	}
	public void setStartDat(String startDat) {
		this.startDat = startDat;
	}
	public String getEndDat() {
		return endDat;
	}
	public void setEndDat(String endDat) {
		this.endDat = endDat;
	}
	public String getNonce() {
		return nonce;
	}
	public void setNonce(String nonce) {
		this.nonce = nonce;
	}
	public String getConIp() {
		return conIp;
	}
	public void setConIp(String conIp) {
		this.conIp = conIp;
	}
	public String getViewSize() {
		return viewSize;
	}
	public void setViewSize(String viewSize) {
		this.viewSize = viewSize;
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
        return "MonCctvLogVo [mgrSeq=" + mgrSeq + ", userId=" + userId + ", cctvMgrNo=" + cctvMgrNo + ", useTyp="
                + useTyp + ", startDat=" + startDat + ", endDat=" + endDat + ", nonce=" + nonce + ", conIp=" + conIp
                + ", viewSize=" + viewSize + ", userNm=" + userNm + ", departNm=" + departNm + "]";
    }




}
