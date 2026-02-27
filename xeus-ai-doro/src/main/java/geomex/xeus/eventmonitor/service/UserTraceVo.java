package geomex.xeus.eventmonitor.service;

public class UserTraceVo {

    private String userId;
    private String userNm;
    private String mobileNum;
    private String birthYear;
    private String grdnNm;
    private String grdnMobile;
    private String monYn;

    // Trace Evt
    private String stateCd;

    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getUserNm() {
        return userNm;
    }
    public void setUserNm(String userNm) {
        this.userNm = userNm;
    }
    public String getMobileNum() {
        return mobileNum;
    }
    public void setMobileNum(String mobileNum) {
        this.mobileNum = mobileNum;
    }
    public String getBirthYear() {
        return birthYear;
    }
    public void setBirthYear(String birthYear) {
        this.birthYear = birthYear;
    }
    public String getGrdnNm() {
        return grdnNm;
    }
    public void setGrdnNm(String grdnNm) {
        this.grdnNm = grdnNm;
    }
    public String getGrdnMobile() {
        return grdnMobile;
    }
    public void setGrdnMobile(String grdnMobile) {
        this.grdnMobile = grdnMobile;
    }
    public String getMonYn() {
        return monYn;
    }
    public void setMonYn(String monYn) {
        this.monYn = monYn;
    }
    public String getStateCd() {
        return stateCd;
    }
    public void setStateCd(String stateCd) {
        this.stateCd = stateCd;
    }

}
