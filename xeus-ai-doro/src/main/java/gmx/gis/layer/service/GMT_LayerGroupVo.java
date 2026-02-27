package gmx.gis.layer.service;

/**
 *
 * <pre>
 * 레이어의 그룹 정보를 담당합니다.
 * </pre>
 *
 * @author 이주영
 *
 */
public class GMT_LayerGroupVo {

	private int mgrSeq;
	private String grpNm;
	private int grpZidx;
	private String mkUser;
	private String mkDat;

	public int getMgrSeq() {
		return mgrSeq;
	}
	public String getGrpNm() {
		return grpNm;
	}
	public int getGrpZidx() {
		return grpZidx;
	}
	public String getMkUser() {
		return mkUser;
	}
	public String getMkDat() {
		return mkDat;
	}
	public void setMgrSeq(int mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public void setGrpNm(String grpNm) {
		this.grpNm = grpNm;
	}
	public void setGrpZidx(int grpZidx) {
		this.grpZidx = grpZidx;
	}
	public void setMkUser(String mkUser) {
		this.mkUser = mkUser;
	}
	public void setMkDat(String mkDat) {
		this.mkDat = mkDat;
	}
	@Override
	public String toString() {
		return "GMT_LayerGroupVo [mgrSeq=" + mgrSeq + ", grpNm=" + grpNm + ", grpZidx=" + grpZidx + ", mkUser=" + mkUser
				+ ", mkDat=" + mkDat + "]";
	}


}
