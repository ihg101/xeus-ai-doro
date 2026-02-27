package geomex.xeus.map.service;

/**
 * <pre>
 * 파일명 :  JibunSearchVo.java
 * 설  명 :
 *   지번검색 결과를 가져오는 VO
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 6. 12.      전우람          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 6. 12.
 * @version : 1.0
 * @see
 */

public class JibunSearchVo {
    private String emdName; //읍면동명
    private String pnu; //pnu
    private String jibun; //지번주소
    private String bldgNo; //도로명
    private String lon;
    private String lat;
    private String geometry;
    /**
     * @return the emdName
     */
    public String getEmdName() {
        return emdName;
    }
    /**
     * @param emdName the emdName to set
     */
    public void setEmdName(String emdName) {
        this.emdName = emdName;
    }
    /**
     * @return the pnu
     */
    public String getPnu() {
        return pnu;
    }
    /**
     * @param pnu the pnu to set
     */
    public void setPnu(String pnu) {
        this.pnu = pnu;
    }
    /**
     * @return the jibun
     */
    public String getJibun() {
        return jibun;
    }
    /**
     * @param jibun the jibun to set
     */
    public void setJibun(String jibun) {
        this.jibun = jibun;
    }
    /**
     * @return the bldgNo
     */
    public String getBldgNo() {
        return bldgNo;
    }
    /**
     * @param bldgNo the bldgNo to set
     */
    public void setBldgNo(String bldgNo) {
        this.bldgNo = bldgNo;
    }
	public String getGeometry() {
		return geometry;
	}
	public void setGeometry(String geometry) {
		this.geometry = geometry;
	}
	public String getLon() {
		return lon;
	}
	public void setLon(String lon) {
		this.lon = lon;
	}
	public String getLat() {
		return lat;
	}
	public void setLat(String lat) {
		this.lat = lat;
	}


}
