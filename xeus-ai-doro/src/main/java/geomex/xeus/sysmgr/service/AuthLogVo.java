package geomex.xeus.sysmgr.service;

/**
 * <pre>
 * 파일명 :  AuthLogVo.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-10-17      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 10. 17.
 * @version :  1.0
 * @see
 */

public class AuthLogVo {

    private String mgrSeq;
    private String usrId;
    private String workerId;
    private String beforeAuthData;
    private String beforeAuthNm;
    private String afterAuthData;
    private String afterAuthNm;
    private String chgDat;

	public String getMgrSeq() {
        return mgrSeq;
    }

    public void setMgrSeq(String mgrSeq) {
        this.mgrSeq = mgrSeq;
    }

    public String getUsrId() {
        return usrId;
    }

    public void setUsrId(String usrId) {
        this.usrId = usrId;
    }

    public String getWorkerId() {
        return workerId;
    }

    public void setWorkerId(String workerId) {
        this.workerId = workerId;
    }

    public String getBeforeAuthData() {
        return beforeAuthData;
    }

    public void setBeforeAuthData(String beforeAuthData) {
        this.beforeAuthData = beforeAuthData;
    }

    public String getBeforeAuthNm() {
        return beforeAuthNm;
    }

    public void setBeforeAuthNm(String beforeAuthNm) {
        this.beforeAuthNm = beforeAuthNm;
    }

    public String getAfterAuthData() {
        return afterAuthData;
    }

    public void setAfterAuthData(String afterAuthData) {
        this.afterAuthData = afterAuthData;
    }

    public String getAfterAuthNm() {
        return afterAuthNm;
    }

    public void setAfterAuthNm(String afterAuthNm) {
        this.afterAuthNm = afterAuthNm;
    }

    public String getChgDat() {
        return chgDat;
    }

    public void setChgDat(String chgDat) {
        this.chgDat = chgDat;
    }

    @Override
	public String toString() {
		return "AuthLogVo [mgrSeq=" + mgrSeq + ", usrId=" + usrId + ", workerId=" + workerId
	                    + ", beforeAuthData=" + beforeAuthData + ", afterAuthData=" + afterAuthData + ", chgDat=" + chgDat + "]";
	}

}
