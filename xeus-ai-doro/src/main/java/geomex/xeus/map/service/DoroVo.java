package geomex.xeus.map.service;

/**
 * <pre>
 * 파일명 :  DoroVo.java
 * 설  명 :  
 *   도로명리스트를 가져오는데 필요한 Vo
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

public class DoroVo {
    private String rn; //도로명
    private String rnCd; //도로명코드
    
    /**
     * @return the rn
     */
    public String getRn() {
        return rn;
    }
    /**
     * @param rn the rn to set
     */
    public void setRn(String rn) {
        this.rn = rn;
    }
    /**
     * @return the rnCd
     */
    public String getRnCd() {
        return rnCd;
    }
    /**
     * @param rnCd the rnCd to set
     */
    public void setRnCd(String rnCd) {
        this.rnCd = rnCd;
    }
}
