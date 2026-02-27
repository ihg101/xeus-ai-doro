package geomex.xeus.map.service;

/**
 * <pre>
 * 파일명 :  LiVo.java
 * 설  명 :  
 *   리리스트를 가져오는데 필요한 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 5. 31.      전우람          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 5. 31.
 * @version : 1.0
 * @see
 */

public class LiVo {
    
    private String liCd;
    private String liKorNm;

    /**
     * @return the liCd
     */
    public String getLiCd() {
        return liCd;
    }
    /**
     * @param liCd the liCd to set
     */
    public void setLiCd(String liCd) {
        this.liCd = liCd;
    }
    /**
     * @return the liKorNm
     */
    public String getLiKorNm() {
        return liKorNm;
    }
    /**
     * @param liKorNm the liKorNm to set
     */
    public void setLiKorNm(String liKorNm) {
        this.liKorNm = liKorNm;
    }
}
