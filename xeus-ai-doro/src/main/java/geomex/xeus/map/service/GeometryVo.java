package geomex.xeus.map.service;

/**
 * <pre>
 * 파일명 :  GeometryVo.java
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
 * @since   :  2017. 9. 5.
 * @version :  1.0
 * @see
 */

public class GeometryVo {

	private String gid;
	private String annoX;
	private String annoY;
	private String geometry;

	/**
	 * @return the gid
	 */
	public String getGid() {
		return gid;
	}
	/**
	 * @param gid the gid to set
	 */
	public void setGid(String gid) {
		this.gid = gid;
	}
	/**
	 * @return the annoX
	 */
	public String getAnnoX() {
		return annoX;
	}
	/**
	 * @param annoX the annoX to set
	 */
	public void setAnnoX(String annoX) {
		this.annoX = annoX;
	}
	/**
	 * @return the annoY
	 */
	public String getAnnoY() {
		return annoY;
	}
	/**
	 * @param annoY the annoY to set
	 */
	public void setAnnoY(String annoY) {
		this.annoY = annoY;
	}
	/**
	 * @return the geometry
	 */
	public String getGeometry() {
		return geometry;
	}
	/**
	 * @param geometry the geometry to set
	 */
	public void setGeometry(String geometry) {
		this.geometry = geometry;
	}

}
