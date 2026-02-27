package geomex.xeus.bigdata.service;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class BigDataAnalyWeightVo {

    private String mgrSeq;
    private String analyMgrSeq;
    private String layerId;   //테이블 명
    private String itemNm;
    private String minVal;  //사용안함 2018.12.31 김경호
    private String maxVal;  //사용안함 2018.12.31 김경호
    private String opeStr; //2018.12.31 김경호
    private String weightVal;
    private String impactM;

    @JsonIgnore
    private String tblNum;  //필요한가?? 2018.12.31 김경호

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

    public String getLayerId() {
        return layerId;
    }

    public void setLayerId(String layerId) {
        this.layerId = layerId;
    }

    public String getItemNm() {
        return itemNm;
    }

    public void setItemNm(String itemNm) {
        this.itemNm = itemNm;
    }

    public String getMinVal() {
        return minVal;
    }

    public void setMinVal(String minVal) {
        this.minVal = minVal;
    }

    public String getMaxVal() {
        return maxVal;
    }

    public void setMaxVal(String maxVal) {
        this.maxVal = maxVal;
    }

    public String getWeightVal() {
        return weightVal;
    }

    public void setWeightVal(String weightVal) {
        this.weightVal = weightVal;
    }

    public String getImpactM() {
        return impactM;
    }

    public void setImpactM(String impactM) {
        this.impactM = impactM;
    }

    public String getTblNum() {
        return tblNum;
    }

    public void setTblNum(String tblNum) {
        this.tblNum = tblNum;
    }

    public String getOpeStr() {
        return opeStr;
    }

    public void setOpeStr(String opeStr) {
        this.opeStr = opeStr;
    }

    @Override
    public String toString() {
        return "BigDataAnalyWeightVo [mgrSeq="
            + mgrSeq + ", analyMgrSeq=" + analyMgrSeq + ", layerId=" + layerId + ", itemNm=" + itemNm + ", opeStr="
            + opeStr + ", weightVal=" + weightVal + ", impactM=" + impactM + "]";
    }

}
