package geomex.xeus.map.service;

/**
 * <pre>
 * 파일명 :  LocationVo.java
 * 설  명 :  
 *   지번, 도로명 주소검색에서 위치를 가져오는 DB
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

public class LocationVo {
    private String center; //center좌표

    /**
     * @return the center
     */
    public String getCenter() {
        return center;
    }
    /**
     * @param center the center to set
     */
    public void setCenter(String center) {
        this.center = center;
    }
}
