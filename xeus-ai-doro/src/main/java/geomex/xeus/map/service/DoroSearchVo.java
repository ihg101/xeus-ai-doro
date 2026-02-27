package geomex.xeus.map.service;

/**
 * <pre>
 * 파일명 :  DoroSearchVo.java
 * 설  명 :  
 *   도로명검색 결과를 가져오는 VO
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

public class DoroSearchVo {
    private String lnAddr; //지번주소
    private String rdSeLbl; //도로명+본부번
    private String gid; //gid
    /**
     * @return the lnAddr
     */
    public String getLnAddr() {
        return lnAddr;
    }
    /**
     * @param lnAddr the lnAddr to set
     */
    public void setLnAddr(String lnAddr) {
        this.lnAddr = lnAddr;
    }
    /**
     * @return the rdSeLbl
     */
    public String getRdSeLbl() {
        return rdSeLbl;
    }
    /**
     * @param rdSeLbl the rdSeLbl to set
     */
    public void setRdSeLbl(String rdSeLbl) {
        this.rdSeLbl = rdSeLbl;
    }
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
    
    
}
