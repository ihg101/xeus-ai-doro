package geomex.xeus.smartcity.service;

public class EventHistVo {

	private String usvcOutbId;
	private String evtSvcNm;
	private String evtTyp;
	private String evtTypCd;
	private String msgTypCd;
	private String evtNm;
	private String evtCntn;
	private String outbPosNm;
	private String evtOutbDtm;
	private String outbPosx;
	private String outbPosy;
	private String evtClrDtm;
	private String evtProcCd;
	private String evtActnDtm;
	private String evtActnUsrid;
	private String evtActnCntn;
	private String testYn;
	private String evtJson;
	
	private String grpCde;
	private String grpNm;
	private String cdeCde;
	private String cdeNm;

	private String gid;
	private String wkt;
	private String tmx;
	private String tmy;
	private String targetGrp;
	private String targetId;
	private String evtState;
	private String type;

	private String emdKorNm;

	/**
	 * 181105 이은규
	 * 이벤트별 개수 저장용 변수
	 * 히트맵 조회시 사용된다.
	 */
	private String evtCnt;

	public String getGrpCde() {
        return grpCde;
    }
    public void setGrpCde(String grpCde) {
        this.grpCde = grpCde;
    }
    public String getGrpNm() {
        return grpNm;
    }
    public void setGrpNm(String grpNm) {
        this.grpNm = grpNm;
    }
    public String getCdeCde() {
        return cdeCde;
    }
    public void setCdeCde(String cdeCde) {
        this.cdeCde = cdeCde;
    }
    public String getCdeNm() {
        return cdeNm;
    }
    public void setCdeNm(String cdeNm) {
        this.cdeNm = cdeNm;
    }
	public String getUsvcOutbId() {
		return usvcOutbId;
	}
	public void setUsvcOutbId(String usvcOutbId) {
		this.usvcOutbId = usvcOutbId;
	}
	public String getEvtSvcNm() {
		return evtSvcNm;
	}
	public void setEvtSvcNm(String evtSvcNm) {
		this.evtSvcNm = evtSvcNm;
	}
	public String getEvtTyp() {
		return evtTyp;
	}
	public void setEvtTyp(String evtTyp) {
		this.evtTyp = evtTyp;
	}
	public String getEvtTypCd() {
		return evtTypCd;
	}
	public void setEvtTypCd(String evtTypCd) {
		this.evtTypCd = evtTypCd;
	}
	public String getMsgTypCd() {
		return msgTypCd;
	}
	public void setMsgTypCd(String msgTypCd) {
		this.msgTypCd = msgTypCd;
	}
	public String getEvtNm() {
		return evtNm;
	}
	public void setEvtNm(String evtNm) {
		this.evtNm = evtNm;
	}
	public String getEvtCntn() {
		return evtCntn;
	}
	public void setEvtCntn(String evtCntn) {
		this.evtCntn = evtCntn;
	}
	public String getOutbPosNm() {
		return outbPosNm;
	}
	public void setOutbPosNm(String outbPosNm) {
		this.outbPosNm = outbPosNm;
	}
	public String getEvtOutbDtm() {
		return evtOutbDtm;
	}
	public void setEvtOutbDtm(String evtOutbDtm) {
		this.evtOutbDtm = evtOutbDtm;
	}
	public String getOutbPosx() {
		return outbPosx;
	}
	public void setOutbPosx(String outbPosx) {
		this.outbPosx = outbPosx;
	}
	public String getOutbPosy() {
		return outbPosy;
	}
	public void setOutbPosy(String outbPosy) {
		this.outbPosy = outbPosy;
	}
	public String getEvtClrDtm() {
		return evtClrDtm;
	}
	public void setEvtClrDtm(String evtClrDtm) {
		this.evtClrDtm = evtClrDtm;
	}
	public String getEvtProcCd() {
		return evtProcCd;
	}
	public void setEvtProcCd(String evtProcCd) {
		this.evtProcCd = evtProcCd;
	}
	public String getEvtActnDtm() {
		return evtActnDtm;
	}
	public void setEvtActnDtm(String evtActnDtm) {
		this.evtActnDtm = evtActnDtm;
	}
	public String getEvtActnUsrid() {
		return evtActnUsrid;
	}
	public void setEvtActnUsrid(String evtActnUsrid) {
		this.evtActnUsrid = evtActnUsrid;
	}
	public String getEvtActnCntn() {
		return evtActnCntn;
	}
	public void setEvtActnCntn(String evtActnCntn) {
		this.evtActnCntn = evtActnCntn;
	}
	public String getTestYn() {
		return testYn;
	}
	public void setTestYn(String testYn) {
		this.testYn = testYn;
	}
	public String getEvtJson() {
		return evtJson;
	}
	public void setEvtJson(String evtJson) {
		this.evtJson = evtJson;
	}
	public String getGid() {
		return gid;
	}
	public void setGid(String gid) {
		this.gid = gid;
	}
	public String getWkt() {
		return wkt;
	}
	public void setWkt(String wkt) {
		this.wkt = wkt;
	}
	public String getTmx() {
		return tmx;
	}
	public void setTmx(String tmx) {
		this.tmx = tmx;
	}
	public String getTmy() {
		return tmy;
	}
	public void setTmy(String tmy) {
		this.tmy = tmy;
	}
	public String getTargetGrp() {
		return targetGrp;
	}
	public void setTargetGrp(String targetGrp) {
		this.targetGrp = targetGrp;
	}
	public String getTargetId() {
		return targetId;
	}
	public void setTargetId(String targetId) {
		this.targetId = targetId;
	}
	public String getEvtCnt() {
		return evtCnt;
	}
	public void setEvtCnt(String evtCnt) {
		this.evtCnt = evtCnt;
	}
	public String getEmdKorNm() {
		return emdKorNm;
	}
	public void setEmdKorNm(String emdKorNm) {
		this.emdKorNm = emdKorNm;
	}

	public String getEvtState() {
        return evtState;
    }
    public void setEvtState(String evtState) {
        this.evtState = evtState;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("EventHistVo [usvcOutbId=");
        builder.append(usvcOutbId);
        builder.append(", evtSvcNm=");
        builder.append(evtSvcNm);
        builder.append(", evtTyp=");
        builder.append(evtTyp);
        builder.append(", evtTypCd=");
        builder.append(evtTypCd);
        builder.append(", msgTypCd=");
        builder.append(msgTypCd);
        builder.append(", evtNm=");
        builder.append(evtNm);
        builder.append(", evtCntn=");
        builder.append(evtCntn);
        builder.append(", outbPosNm=");
        builder.append(outbPosNm);
        builder.append(", evtOutbDtm=");
        builder.append(evtOutbDtm);
        builder.append(", outbPosx=");
        builder.append(outbPosx);
        builder.append(", outbPosy=");
        builder.append(outbPosy);
        builder.append(", evtClrDtm=");
        builder.append(evtClrDtm);
        builder.append(", evtProcCd=");
        builder.append(evtProcCd);
        builder.append(", evtActnDtm=");
        builder.append(evtActnDtm);
        builder.append(", evtActnUsrid=");
        builder.append(evtActnUsrid);
        builder.append(", evtActnCntn=");
        builder.append(evtActnCntn);
        builder.append(", testYn=");
        builder.append(testYn);
        builder.append(", evtJson=");
        builder.append(evtJson);
        builder.append(", grpCde=");
        builder.append(grpCde);
        builder.append(", grpNm=");
        builder.append(grpNm);
        builder.append(", cdeCde=");
        builder.append(cdeCde);
        builder.append(", cdeNm=");
        builder.append(cdeNm);
        builder.append(", gid=");
        builder.append(gid);
        builder.append(", wkt=");
        builder.append(wkt);
        builder.append(", tmx=");
        builder.append(tmx);
        builder.append(", tmy=");
        builder.append(tmy);
        builder.append(", targetGrp=");
        builder.append(targetGrp);
        builder.append(", targetId=");
        builder.append(targetId);
        builder.append(", evtState=");
        builder.append(evtState);
        builder.append(", type=");
        builder.append(type);
        builder.append(", emdKorNm=");
        builder.append(emdKorNm);
        builder.append(", evtCnt=");
        builder.append(evtCnt);
        builder.append("]");
        return builder.toString();
    }
}
