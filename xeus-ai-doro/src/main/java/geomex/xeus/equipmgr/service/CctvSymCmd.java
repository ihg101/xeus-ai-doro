package geomex.xeus.equipmgr.service;

import geomex.xeus.XeusServiceException;

import java.util.HashMap;

import org.apache.commons.lang3.StringUtils;

import com.vividsolutions.jts.geom.Envelope;

/**
 * <pre>
 * 파일명 :  CctvSymCmd.java
 * 설  명 :  
 *   지도 표출용 CCTV정보 요청 클래스
 *   CCTV 심볼겹침시 대표 심볼을 보여주고 
 *   대표심볼 선택시 해당 위치에 중첩된 CCTV목록을 보여 줄 수 있도록 데이터를 가공하게 된다.
 * 
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-12-08      김경호          최초 생성
 *
 * </pre>
 *
 * @since : 2016. 12. 8.
 * @version : 1.0
 * @see
 */

public class CctvSymCmd {
    private int mapWidth; //지도크기
    private int mapHeight;

    private int symWidth; // 심볼 크기
    private int symHeight;

    private String epsg;
    private Envelope bbox;

    private String codes;

    public CctvSymCmd() {

    }

    /**
     * @return the mapWidth
     */
    public int getMapWidth() {
        return mapWidth;
    }

    /**
     * @return the mapHeight
     */
    public int getMapHeight() {
        return mapHeight;
    }

    /**
     * @return the symWidth
     */
    public int getSymWidth() {
        return symWidth;
    }

    /**
     * @return the symHeight
     */
    public int getSymHeight() {
        return symHeight;
    }

    /**
     * @return the epsg
     */
    public String getEpsg() {
        return epsg;
    }

    /**
     * @return the bbox
     */
    public Envelope getBbox() {
        return bbox;
    }

    public String getCodes() {
        return codes;
    }

    public void parseKvp(HashMap<String, String> kvp) throws XeusServiceException {
        this.epsg = kvp.get("EPSG");
        if (StringUtils.isBlank(epsg)) {
            throw new XeusServiceException("EPSG is Empty >> " + kvp);
        }

        this.codes = kvp.get("CODES");
        if (StringUtils.isBlank(codes)) {
            this.codes = null;
        }

        String widthString = kvp.get("MAP_WIDTH");
        if (StringUtils.isBlank(widthString)) {
            throw new XeusServiceException("MAP_WIDTH is Empty >> " + kvp);
        }
        String heightString = kvp.get("MAP_HEIGHT");
        if (StringUtils.isBlank(heightString)) {
            throw new XeusServiceException("MAP_HEIGHT is Empty >> " + kvp);
        }

        try {
            this.mapWidth = Integer.parseInt(StringUtils.trim(widthString));
            this.mapHeight = Integer.parseInt(StringUtils.trim(heightString));
        } catch (Exception e) {
            throw new XeusServiceException("MAP_WIDTH,MAP_HEIGHT is not Number >> " + kvp);
        }

        widthString = kvp.get("SYM_WIDTH");
        if (StringUtils.isBlank(widthString)) {
            throw new XeusServiceException("SYM_WIDTH is Empty >> " + kvp);
        }
        heightString = kvp.get("SYM_HEIGHT");
        if (StringUtils.isBlank(heightString)) {
            throw new XeusServiceException("SYM_HEIGHT is Empty >> " + kvp);
        }

        try {
            this.symWidth = Integer.parseInt(StringUtils.trim(widthString));
            this.symHeight = Integer.parseInt(StringUtils.trim(heightString));
        } catch (Exception e) {
            throw new XeusServiceException("SYM_WIDTH,SYM_HEIGHT is not Number >> " + kvp);
        }

        String boxstring[] = StringUtils.split(kvp.get("BBOX"), ",");
        if (boxstring.length != 4) {
            throw new XeusServiceException("BBOX must be set. 4 values >> " + kvp);
        }

        double minx = Double.NaN;
        double miny = Double.NaN;
        double maxx = Double.NaN;
        double maxy = Double.NaN;
        try {
            minx = Double.parseDouble(boxstring[0]);
            miny = Double.parseDouble(boxstring[1]);
            maxx = Double.parseDouble(boxstring[2]);
            maxy = Double.parseDouble(boxstring[3]);
        } catch (Exception e) {
            throw new XeusServiceException("BBOX must be a valid number >> " + kvp);
        }

        if (minx >= maxx) {
            throw new XeusServiceException("BBOX-minx must be lower than maxx >> " + kvp);
        }
        if (miny >= maxy) {
            throw new XeusServiceException("BBOX-miny must be lower than maxy >> " + kvp);
        }

        this.bbox = new Envelope(minx, maxx, miny, maxy);

    }

}
