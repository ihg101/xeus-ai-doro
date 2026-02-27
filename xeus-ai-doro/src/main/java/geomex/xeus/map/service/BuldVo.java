package geomex.xeus.map.service;

/**
 * <pre>
 * 파일명 :  BuldVo.java
 * 설  명 :
 *   건물명검색 결과를 가져오는 VO
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2019. 2. 1.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2019. 2. 1.
 * @version : 1.0
 * @see
 */

public class BuldVo {

	private String buldNm;
	private String annox;
	private String annoy;

	public String getBuldNm() {
		return buldNm;
	}
	public void setBuldNm(String buldNm) {
		this.buldNm = buldNm;
	}
	public String getAnnox() {
		return annox;
	}
	public void setAnnox(String annox) {
		this.annox = annox;
	}
	public String getAnnoy() {
		return annoy;
	}
	public void setAnnoy(String annoy) {
		this.annoy = annoy;
	}

}
