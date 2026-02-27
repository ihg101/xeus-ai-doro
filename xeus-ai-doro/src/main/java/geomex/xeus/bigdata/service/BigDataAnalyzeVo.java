package geomex.xeus.bigdata.service;

/**
 * <pre>
 * 수정이력
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018.12.31      김경호          설계 변경
 * ===========================================================
 * </pre>
 */
public class BigDataAnalyzeVo {

    private String mgrSeq;
    private String userId;
    private String analyNm;
    private String analyPlan;
    private String rqstDat;
    private String analyDat;
    private String finishDat;
    private String analyState;

    public String getMgrSeq() {
        return mgrSeq;
    }

    public void setMgrSeq(String mgrSeq) {
        this.mgrSeq = mgrSeq;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getAnalyNm() {
        return analyNm;
    }

    public void setAnalyNm(String analyNm) {
        this.analyNm = analyNm;
    }

    public String getAnalyDat() {
        return analyDat;
    }

    public void setAnalyDat(String analyDat) {
        this.analyDat = analyDat;
    }

    public String getAnalyPlan() {
        return analyPlan;
    }

    public void setAnalyPlan(String analyPlan) {
        this.analyPlan = analyPlan;
    }

    public String getFinishDat() {
        return finishDat;
    }

    public void setFinishDat(String finishDat) {
        this.finishDat = finishDat;
    }

    public String getAnalyState() {
        return analyState;
    }

    public void setAnalyState(String analyState) {
        this.analyState = analyState;
    }

    public String getRqstDat() {
        return rqstDat;
    }

    public void setRqstDat(String rqstDat) {
        this.rqstDat = rqstDat;
    }

    @Override
    public String toString() {
        return "BigDataAnalyzeVo [mgrSeq="
            + mgrSeq + ", userId=" + userId + ", analyNm=" + analyNm + ", analyPlan=" + analyPlan + ", rqstDat="
            + rqstDat + ", analyDat=" + analyDat + ", finishDat=" + finishDat + ", analyState=" + analyState + "]";
    }
}
