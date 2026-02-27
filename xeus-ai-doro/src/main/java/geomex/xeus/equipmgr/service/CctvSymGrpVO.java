package geomex.xeus.equipmgr.service;

import java.util.ArrayList;
import java.util.List;

import com.vividsolutions.jts.geom.Envelope;

/**
 * <pre>
 * 파일명 :  CctvLyrGrpVO.java
 * 설  명 :  
 *   클래스 설명을 쓰시오
 * 
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-12-14      김경호          최초 생성
 * 2017-11-13      김경호          명세 수정
 * </pre>
 *
 * @since : 2016. 12. 14.
 * @version : 1.0
 * @see
 */

public class CctvSymGrpVO {

    private double x; //symbol 위치 x
    private double y; //symbol 위치 y

    private String code; // symbol 코드

    private Envelope extent; // symbol 영역

    private List<CctvSymVO> overlaps; //동일 위치에 존재하는 CCTV목록

    public CctvSymGrpVO() {
        overlaps = new ArrayList<CctvSymVO>();
    }

    public CctvSymGrpVO(CctvSymVO cctv) {
        this();
        this.x = cctv.getX();
        this.y = cctv.getY();
        this.code = cctv.getGbnCd();
        this.extent = cctv.getExtent();
        this.overlaps.add(cctv);
    }

    public boolean overlaps(CctvSymVO other) {
        return extent.intersects(other.getExtent());
    }

    /**
     * @return the x
     */
    public double getX() {
        return x;
    }

    /**
     * @return the y
     */
    public double getY() {
        return y;
    }

    /**
     * @return the code
     */
    public String getCode() {
        return code;
    }

    /**
     * @param code the code to set
     */
    public void setCode(String code) {
        this.code = code;
    }

    public void addCCTV(CctvSymVO cctv) {
        overlaps.add(cctv);
    }

    public int getSize() {
        if (overlaps == null) return 0;
        return overlaps.size();
    }

    public List<CctvSymVO> getCCTVs() {
        return overlaps;
    }
}
