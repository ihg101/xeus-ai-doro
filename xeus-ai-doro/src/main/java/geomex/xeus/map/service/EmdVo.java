package geomex.xeus.map.service;

/**
 * <pre>
 * 파일명 :  EmdVo.java
 * 설  명 :  
 *   읍면동리스트를 가져오는데 필요한 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 5. 29.      전우람          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 5. 29.
 * @version : 1.0
 * @see
 */

public class EmdVo {
    private String emdCd;
    private String emdKorNm;

    /**
     * @return the emdCd
     */
    public String getEmdCd() {
        return emdCd;
    }
    /**
     * @param emdCd the emdCd to set
     */
    public void setEmdCd(String emdCd) {
        this.emdCd = emdCd;
    }
    /**
     * @return the emdKorNm
     */
    public String getEmdKorNm() {
        return emdKorNm;
    }
    /**
     * @param emdKorNm the emdKorNm to set
     */
    public void setEmdKorNm(String emdKorNm) {
        this.emdKorNm = emdKorNm;
    }
}
