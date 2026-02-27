package geomex.xeus.sysmgr.service;

/**
 * <pre>
 * 파일명 :  CodeVo.java
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
 * @since   :  2017. 7. 7.
 * @version :  1.0
 * @see
 */

public class LayerDescVo {

	private String mgrSeq;
	private String lyrId;
	private String lyrNm;
	private String grpNm;
	private String regDat;
	private String json;
	private String isUse;
	private String idx;

	public String getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getLyrId() {
		return lyrId;
	}
	public void setLyrId(String lyrId) {
		this.lyrId = lyrId;
	}
	public String getLyrNm() {
		return lyrNm;
	}
	public void setLyrNm(String lyrNm) {
		this.lyrNm = lyrNm;
	}
	public String getGrpNm() {
		return grpNm;
	}
	public void setGrpNm(String grpNm) {
		this.grpNm = grpNm;
	}
	public String getRegDat() {
		return regDat;
	}
	public void setRegDat(String regDat) {
		this.regDat = regDat;
	}
	public String getJson() {
		return json;
	}
	public void setJson(String json) {
		this.json = json;
	}
	public String getIsUse() {
		return isUse;
	}
	public void setIsUse(String isUse) {
		this.isUse = isUse;
	}
	public String getIdx() {
		return idx;
	}
	public void setIdx(String idx) {
		this.idx = idx;
	}
	@Override
	public String toString() {
		return "LayerDescVo [mgrSeq=" + mgrSeq + ", lyrId=" + lyrId + ", lyrNm=" + lyrNm + ", grpNm=" + grpNm
				+ ", regDat=" + regDat + ", json=" + json + ", isUse=" + isUse + ", idx=" + idx + "]";
	}

}
