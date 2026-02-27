package geomex.xeus.bigdata.service;

/**
 * <pre>
 * 수정이력
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2019.01.07      김경호          설계 변경
 * ===========================================================
 * </pre>
 */
public class BigDataAnalyHistVo {
    private String mgrSeq;
    private String analyMgrSeq;
    private String analyDat;
    private String finishDat;
    private String analyState;
    private String resultTblNm;
    private String errorMsg;

    public String getMgrSeq() {
        return mgrSeq;
    }

    public void setMgrSeq(String mgrSeq) {
        this.mgrSeq = mgrSeq;
    }

    public String getAnalyMgrSeq() {
        return analyMgrSeq;
    }

    public void setAnalyMgrSeq(String analyMgrSeq) {
        this.analyMgrSeq = analyMgrSeq;
    }

    public String getAnalyDat() {
        return analyDat;
    }

    public void setAnalyDat(String analyDat) {
        this.analyDat = analyDat;
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

    public String getResultTblNm() {
        return resultTblNm;
    }

    public void setResultTblNm(String resultTblNm) {
        this.resultTblNm = resultTblNm;
    }

    public String getErrorMsg() {
        return errorMsg;
    }

    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }
}
