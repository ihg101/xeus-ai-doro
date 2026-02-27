package gmx.gis.layer.service;

/**
 *
 * <pre>
 * 레이어의 기본 정보를 담당합니다.
 * 예) 테이블 정보, 제작자, z-index, 주제 사용 여부 등
 * </pre>
 *
 * @author 이주영
 *
 */
public class GMT_LayerVo {

	private int mgrSeq;
	private String schemNm;
	private String tblId;
	private String lyrNm;
	private String lyrTyp;
	private int grpMgrSeq;
	private boolean useYn;
	private double geoOffsetX;
	private double geoOffsetY;
	private String mkUser;
	private String mkDat;
	private int lyrZidx;
	private boolean visibleYn;
	private boolean thmUseYn;
	private boolean heatYn;
	private String minResolution;
	private String maxResolution;
	private String platformTabAuth;
	private String modYn;

	public int getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(int mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getSchemNm() {
		return schemNm;
	}
	public void setSchemNm(String schemNm) {
		this.schemNm = schemNm;
	}
	public String getTblId() {
		return tblId;
	}
	public void setTblId(String tblId) {
		this.tblId = tblId;
	}
	public String getLyrNm() {
		return lyrNm;
	}
	public void setLyrNm(String lyrNm) {
		this.lyrNm = lyrNm;
	}
	public String getLyrTyp() {
		return lyrTyp;
	}
	public void setLyrTyp(String lyrTyp) {
		this.lyrTyp = lyrTyp;
	}
	public int getGrpMgrSeq() {
		return grpMgrSeq;
	}
	public void setGrpMgrSeq(int grpMgrSeq) {
		this.grpMgrSeq = grpMgrSeq;
	}
	public boolean isUseYn() {
		return useYn;
	}
	public void setUseYn(boolean useYn) {
		this.useYn = useYn;
	}
	public double getGeoOffsetX() {
		return geoOffsetX;
	}
	public void setGeoOffsetX(double geoOffsetX) {
		this.geoOffsetX = geoOffsetX;
	}
	public double getGeoOffsetY() {
		return geoOffsetY;
	}
	public void setGeoOffsetY(double geoOffsetY) {
		this.geoOffsetY = geoOffsetY;
	}
	public String getMkUser() {
		return mkUser;
	}
	public void setMkUser(String mkUser) {
		this.mkUser = mkUser;
	}
	public String getMkDat() {
		return mkDat;
	}
	public void setMkDat(String mkDat) {
		this.mkDat = mkDat;
	}
	public int getLyrZidx() {
		return lyrZidx;
	}
	public void setLyrZidx(int lyrZidx) {
		this.lyrZidx = lyrZidx;
	}
	public boolean isVisibleYn() {
		return visibleYn;
	}
	public void setVisibleYn(boolean visibleYn) {
		this.visibleYn = visibleYn;
	}
	public boolean isThmUseYn() {
		return thmUseYn;
	}
	public void setThmUseYn(boolean thmUseYn) {
		this.thmUseYn = thmUseYn;
	}
	public boolean isHeatYn() {
		return heatYn;
	}
	public void setHeatYn(boolean heatYn) {
		this.heatYn = heatYn;
	}
	public String getMinResolution() {
		return minResolution;
	}
	public void setMinResolution(String minResolution) {
		this.minResolution = minResolution;
	}
	public String getMaxResolution() {
		return maxResolution;
	}
	public void setMaxResolution(String maxResolution) {
		this.maxResolution = maxResolution;
	}
	public String getPlatformTabAuth() {
		return platformTabAuth;
	}
	public void setPlatformTabAuth(String platformTabAuth) {
		this.platformTabAuth = platformTabAuth;
	}
	public String getModYn() {
		return modYn;
	}
	public void setModYn(String modYn) {
		this.modYn = modYn;
	}
	@Override
	public String toString() {
		return "GMT_LayerVo [mgrSeq=" + mgrSeq + ", schemNm=" + schemNm + ", tblId=" + tblId + ", lyrNm=" + lyrNm
				+ ", lyrTyp=" + lyrTyp + ", grpMgrSeq=" + grpMgrSeq + ", useYn=" + useYn + ", geoOffsetX=" + geoOffsetX
				+ ", geoOffsetY=" + geoOffsetY + ", mkUser=" + mkUser + ", mkDat=" + mkDat + ", lyrZidx=" + lyrZidx
				+ ", visibleYn=" + visibleYn + ", thmUseYn=" + thmUseYn + ", heatYn=" + heatYn + ", minResolution="
				+ minResolution + ", maxResolution=" + maxResolution + ", platformTabAuth=" + platformTabAuth
				+ ", modYn=" + modYn + "]";
	}


}
