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

public class BigDataLayerSetVo {

    private String mgrSeq;
    private String analyMgrSeq;
    private String layerId;
    private String layerNm;
    private String layerSeq;
    private String itemNm;
    //private String itemVal;
    private String weightVal;
    //private String impactM;
    //private String jibnYn;
    private String isExists;

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

    public String getLayerNm() {
        return layerNm;
    }

    public void setLayerNm(String layerNm) {
        this.layerNm = layerNm;
    }

    public String getLayerSeq() {
        return layerSeq;
    }

    public void setLayerSeq(String layerSeq) {
        this.layerSeq = layerSeq;
    }

    public String getItemNm() {
        return itemNm;
    }

    public void setItemNm(String itemNm) {
        this.itemNm = itemNm;
    }

    //	public String getItemVal() {
    //		return itemVal;
    //	}
    //	public void setItemVal(String itemVal) {
    //		this.itemVal = itemVal;
    //	}
    public String getWeightVal() {
        return weightVal;
    }

    public void setWeightVal(String weightVal) {
        this.weightVal = weightVal;
    }
    //	public String getImpactM() {
    //		return impactM;
    //	}
    //	public void setImpactM(String impactM) {
    //		this.impactM = impactM;
    //	}
    //	public String getJibnYn() {
    //		return jibnYn;
    //	}
    //	public void setJibnYn(String jibnYn) {
    //		this.jibnYn = jibnYn;
    //	}

	public String getIsExists() {
		return isExists;
	}

	public void setIsExists(String isExists) {
		this.isExists = isExists;
	}

	@Override
	public String toString() {
		return "BigDataLayerSetVo [mgrSeq=" + mgrSeq + ", analyMgrSeq=" + analyMgrSeq + ", layerId=" + layerId
				+ ", layerNm=" + layerNm + ", layerSeq=" + layerSeq + ", itemNm=" + itemNm + ", weightVal=" + weightVal
				+ "]";
	}

}
