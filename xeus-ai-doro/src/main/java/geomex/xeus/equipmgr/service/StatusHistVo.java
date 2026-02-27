package geomex.xeus.equipmgr.service;

/**
 * <pre>
 * 파일명 :  StatusHistVo.java
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
 * @since   :  2017. 8. 29.
 * @version :  1.0
 * @see
 */

public class StatusHistVo {

	private String mgrSeq;
	private String assetMgrNo;
	private String stateCd;
	private String stateCpu;
	private String stateMem;
	private String stateJson;
	private String recvDat;


	public String getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getAssetMgrNo() {
		return assetMgrNo;
	}
	public void setAssetMgrNo(String assetMgrNo) {
		this.assetMgrNo = assetMgrNo;
	}
	public String getStateCd() {
		return stateCd;
	}
	public void setStateCd(String stateCd) {
		this.stateCd = stateCd;
	}
	public String getStateCpu() {
		return stateCpu;
	}
	public void setStateCpu(String stateCpu) {
		this.stateCpu = stateCpu;
	}
	public String getStateMem() {
		return stateMem;
	}
	public void setStateMem(String stateMem) {
		this.stateMem = stateMem;
	}
	public String getStateJson() {
		return stateJson;
	}
	public void setStateJson(String stateJson) {
		this.stateJson = stateJson;
	}
	public String getRecvDat() {
		return recvDat;
	}
	public void setRecvDat(String recvDat) {
		this.recvDat = recvDat;
	}

	@Override
	public String toString() {
		return "StatusHistVo [mgrSeq=" + mgrSeq + ", assetMgrNo=" + assetMgrNo + ", stateCd=" + stateCd + ", stateCpu="
				+ stateCpu + ", stateMem=" + stateMem + ", stateJson=" + stateJson + ", recvDat=" + recvDat + "]";
	}
}
