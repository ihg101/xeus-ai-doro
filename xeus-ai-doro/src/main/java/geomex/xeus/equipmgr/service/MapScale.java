package geomex.xeus.equipmgr.service;

import com.vividsolutions.jts.geom.Envelope;

/**
 * <pre>
 * 파일명 :  MapScale.java
 * 설  명 :  
 *   화면좌표와 실좌표간 좌표 변환 클래스
 * 
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-12-09      김경호          최초 생성
 *
 * </pre>
 *
 * @since : 2016. 12. 9.
 * @version : 1.0
 * @see
 */

public class MapScale {
    public int mapWidth;
    public int mapHeight;

    private double screenScaleFactor = 0;
    public double fracScrScaleFactor = 0;

    public double mapCenterX = 0.0; // 화면 중심좌표, 실좌표
    public double mapCenterY = 0.0; // 화면 중심좌표, 실좌표
    // WMS 표준 명세에 의해 공통 픽셀 크기는 0.28mm x 0.28mm(밀리미터) 이다.
    //protected double pixelsPerCentiMeter = -1; // 1cm에 해당하는 픽셀사이즈 화면사이즈

    //public static final double STD_DPI = 72.0;

    public MapScale() {
        // WMS 표준 명세 공통 픽셀 크기는 0.28mm x 0.28mm(밀리미터) 이다.
        //pixelsPerCentiMeter = 28.346472;
    }

    //public MapScale(double dpi) {
    //    // 1cm = 37.795296 pixel;
    //    pixelsPerCentiMeter = dpi * 0.393701;
    //}

    public void init(Envelope env, int mapWidth, int mapHeight) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        screenScaleFactor = (env.getWidth() > env.getHeight())
            ? env.getWidth() / this.mapWidth
            : env.getHeight() / this.mapHeight;

        fracScrScaleFactor = 1 / this.screenScaleFactor;

        mapCenterX = env.getWidth() * 0.5 + env.getMinX();
        mapCenterY = env.getHeight() * 0.5 + env.getMinY();
    }

    public double toMapX(double x) {
        double dx = (mapCenterX - x) * fracScrScaleFactor;
        return mapWidth * 0.5 - dx;
    }

    public double toMapY(double y) {
        double dy = (mapCenterY - y) * fracScrScaleFactor;
        return mapHeight * 0.5 + dy;
    }

    public double toWorldX(double x) {
        double dx = (mapWidth * 0.5 - x) * screenScaleFactor;
        return mapCenterX - dx;
    }

    public double toWorldY(double y) {
        double dy = (mapHeight * 0.5 - y) * screenScaleFactor;
        return mapCenterY + dy;
    }

}
