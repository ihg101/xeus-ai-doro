package geomex.xeus.eventmonitor.service;

public class TraceVo {

    private String evtMgrNo;
    private String mgrSeq;
    private String stateCd;
    private String monUsrId;
    private String evtLat;
    private String evtLon;

    // Master Event
    private String eventTyp;
    private String recvDat;
    private String actionNote;
    private String closeCd;

    public String getEvtMgrNo() {
        return evtMgrNo;
    }
    public void setEvtMgrNo(String evtMgrNo) {
        this.evtMgrNo = evtMgrNo;
    }
    public String getMgrSeq() {
        return mgrSeq;
    }
    public void setMgrSeq(String mgrSeq) {
        this.mgrSeq = mgrSeq;
    }
    public String getStateCd() {
        return stateCd;
    }
    public void setStateCd(String stateCd) {
        this.stateCd = stateCd;
    }
    public String getMonUsrId() {
        return monUsrId;
    }
    public void setMonUsrId(String monUsrId) {
        this.monUsrId = monUsrId;
    }
    public String getEvtLat() {
        return evtLat;
    }
    public void setEvtLat(String evtLat) {
        this.evtLat = evtLat;
    }
    public String getEvtLon() {
        return evtLon;
    }
    public void setEvtLon(String evtLon) {
        this.evtLon = evtLon;
    }
    public String getEventTyp() {
        return eventTyp;
    }
    public void setEventTyp(String eventTyp) {
        this.eventTyp = eventTyp;
    }
    public String getRecvDat() {
        return recvDat;
    }
    public void setRecvDat(String recvDat) {
        this.recvDat = recvDat;
    }
    public String getActionNote() {
        return actionNote;
    }
    public void setActionNote(String actionNote) {
        this.actionNote = actionNote;
    }
    public String getCloseCd() {
        return closeCd;
    }
    public void setCloseCd(String closeCd) {
        this.closeCd = closeCd;
    }

}
