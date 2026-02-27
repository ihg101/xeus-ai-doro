package geomex.xeus.log.service;

/**
 * <pre>
 * 파일명 :  MonPrevLogVo.java
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

public class MonPrevLogVo {

	private String mgrSeq;
	private String reqUserId;
	private String reqResn;
	private String acciNum;
	private String cctvMgrNo;
	private String reqDat;
	private String acptNm;
	public String getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getReqUserId() {
		return reqUserId;
	}
	public void setReqUserId(String reqUserId) {
		this.reqUserId = reqUserId;
	}
	public String getReqResn() {
		return reqResn;
	}
	public void setReqResn(String reqResn) {
		this.reqResn = reqResn;
	}
	public String getAcciNum() {
		return acciNum;
	}
	public void setAcciNum(String acciNum) {
		this.acciNum = acciNum;
	}
	public String getCctvMgrNo() {
		return cctvMgrNo;
	}
	public void setCctvMgrNo(String cctvMgrNo) {
		this.cctvMgrNo = cctvMgrNo;
	}
	public String getReqDat() {
		return reqDat;
	}
	public void setReqDat(String reqDat) {
		this.reqDat = reqDat;
	}
	public String getAcptNm() {
		return acptNm;
	}
	public void setAcptNm(String acptNm) {
		this.acptNm = acptNm;
	}

	@Override
	public String toString() {
		return "MonPrevLogVo [mgrSeq=" + mgrSeq + ", reqUserId=" + reqUserId + ", reqResn=" + reqResn + ", acciNum="
				+ acciNum + ", cctvMgrNo=" + cctvMgrNo + ", reqDat=" + reqDat + ", acptNm=" + acptNm + "]";
	}

}
