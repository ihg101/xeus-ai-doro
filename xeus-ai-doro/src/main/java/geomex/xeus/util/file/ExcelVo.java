package geomex.xeus.util.file;

@Deprecated
public class ExcelVo {

	private String layerId;
	private String colNm;
	private String colVal;
	private String pnu;
	private String jibun;
	private String doro;
	private String lng;
	private String lat;
	private Boolean isPoint;
	private Boolean isError;

	public String getLayerId() {
		return layerId;
	}
	public void setLayerId(String layerId) {
		this.layerId = layerId;
	}
	public String getColNm() {
		return colNm;
	}
	public void setColNm(String colNm) {
		this.colNm = colNm;
	}
	public String getColVal() {
		return colVal;
	}
	public void setColVal(String colVal) {
		this.colVal = colVal;
	}
	public String getPnu() {
		return pnu;
	}
	public void setPnu(String pnu) {
		this.pnu = pnu;
	}
	public String getJibun() {
		return jibun;
	}
	public void setJibun(String jibun) {
		this.jibun = jibun;
	}
	public String getDoro() {
		return doro;
	}
	public void setDoro(String doro) {
		this.doro = doro;
	}
	public String getLng() {
		return lng;
	}
	public void setLng(String lng) {
		this.lng = lng;
	}
	public String getLat() {
		return lat;
	}
	public void setLat(String lat) {
		this.lat = lat;
	}
	public Boolean getIsPoint() {
		return isPoint;
	}
	public void setIsPoint(Boolean isPoint) {
		this.isPoint = isPoint;
	}
	public Boolean getIsError() {
		return isError;
	}
	public void setIsError(Boolean isError) {
		this.isError = isError;
	}

}
