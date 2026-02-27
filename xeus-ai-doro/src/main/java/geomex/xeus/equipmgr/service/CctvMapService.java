package geomex.xeus.equipmgr.service;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vividsolutions.jts.geom.Envelope;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  CctvMapService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-12-09      김경호          최초 생성
 *
 * </pre>
 *
 * @since : 2016. 12. 8.
 * @version : 1.0
 * @see
 */

@Service("cctvMapService")
public class CctvMapService extends EgovAbstractServiceImpl {

    @Resource(name = "cctvMapServiceMapper")
    CctvMapServiceMapper cctvMapServiceMapper;


    public String getSymbolGroupAsJSON(CctvSymCmd cmd, HashMap<String, String> kvp) throws Exception{
//        List<CctvSymGrpVO> cctvs = getSymbolGroup(cmd, kvp);
        StringWriter writer = new StringWriter(8192);
        /*final JSONBuilder jsonWriter = new JSONBuilder(writer);
        jsonWriter.object().key("type").value("FeatureCollection");
        jsonWriter.key("features");
        jsonWriter.array();

        if (cctvs == null || cctvs.isEmpty()) {
            jsonWriter.endArray(); // end features
            jsonWriter.key("totalFeatures").value(0);
            jsonWriter.endObject(); // end featurecollection
            writer.flush();
            return writer.toString();
        }

        for (CctvSymGrpVO symGrpVO : cctvs) {
            jsonWriter.object(); // feature start
            jsonWriter.key("type").value("Feature");
            jsonWriter.key("geometry");
            jsonWriter.object(); // geometry start
            jsonWriter.key("type").value("Point");
            jsonWriter.key("coordinates"); //기준 라벨 위치....
            jsonWriter.array();
            jsonWriter.value(symGrpVO.getX());
            jsonWriter.value(symGrpVO.getY());
            jsonWriter.endArray();
            jsonWriter.endObject(); // geometry end
            //
            jsonWriter.key("properties");
            jsonWriter.object(); // properties start
            jsonWriter.key("symCode").value(symGrpVO.getCode());
            jsonWriter.key("cctvSize").value(symGrpVO.getSize()); //

            jsonWriter.key("cctvList");
            jsonWriter.array();
            for (CctvSymVO laps : symGrpVO.getCCTVs()) {
                jsonWriter.object();
                jsonWriter.key("gid").value(laps.getGid());
                jsonWriter.key("mgrNo").value(laps.getMgrNo());
                jsonWriter.key("cctvNm").value(laps.getCctvNm());
                //jsonWriter.key("labelTxt").value(laps.getLabelTxt());
                jsonWriter.key("deviceId").value(laps.getDeviceId());
                jsonWriter.key("channelNo").value(laps.getChannelNo());
                jsonWriter.key("gbnCd").value(laps.getGbnCd());
                jsonWriter.key("gbnTxt").value(laps.getGbnTxt());
                jsonWriter.key("angle").value(laps.getAngle());

                String stateNm = "정상";
                boolean isError = false;
                if(laps.getStateCd() != null && "12".equals(laps.getStateCd())){
                	stateNm = "장애";
                	isError = true;
                }
                jsonWriter.key("stateCd").value(stateNm);
                jsonWriter.key("isError").value(isError);

                jsonWriter.endObject();
            }
            jsonWriter.endArray();

            jsonWriter.endObject(); // properties end
            //
            jsonWriter.endObject(); // feature end
        } //jfor

        jsonWriter.endArray(); // features array end
        jsonWriter.endObject(); //featureCollection end

        writer.flush();*/

        return writer.toString();
    }

    public List<CctvSymGrpVO> getSymbolGroup(CctvSymCmd cmd, HashMap<String, String> kvp) throws Exception {
        Envelope env = cmd.getBbox();

        int mapWidth = cmd.getMapWidth();
        int mapHeight = cmd.getMapHeight();
        //
        int symWidth = cmd.getSymWidth();
        int symHeight = cmd.getSymHeight();

        String extent = makeExtent(env, cmd.getEpsg());
        MapScale mapScale = new MapScale();
        mapScale.init(env, mapWidth, mapHeight);

        //처리결과 저장용
        //CctvSymbolResponse response = new CctvSymbolResponse();
        List<CctvSymGrpVO> cctvs = new ArrayList<CctvSymGrpVO>();
        //
        //DB에서 화면영역에 포함되는 CCTV목록을 얻는다.
        String admNm = kvp.get("admNm");
        String emdCd = kvp.get("emdCd");
        String orgMgrNo = kvp.get("orgMgrNo");
        String gbnCd = kvp.get("gbnCd");
        String cctvNm = kvp.get("cctvNm");
        List<CctvSymVO> dbLists = cctvMapServiceMapper.selectExtent(extent, cmd.getCodes(), admNm, emdCd, orgMgrNo, gbnCd, cctvNm);

        for (CctvSymVO cctv : dbLists) {
            //겹침처리용 Envelope를 계산한다.
            cctv.setExtent(calcExtent(cctv.getX(), cctv.getY(), symWidth, symHeight, mapScale));
            boolean intersect = false;

            for (CctvSymGrpVO symVo : cctvs) {
                if (symVo.overlaps(cctv)) {
                    symVo.addCCTV(cctv);

                    int cnt = symVo.getSize(); //default로 한개 있다.
                    if (cnt >= 10) {
                        symVo.setCode("XX"); //겹침용 라벨이다.
                    } else {
                        symVo.setCode("X" + cnt); //겹침용 라벨이다.
                    }
                    intersect = true;
                    break;
                }
            }
            //겹치는 cctv가 없으면 추가한다.
            if (!intersect) {
                CctvSymGrpVO symVo = new CctvSymGrpVO(cctv);
                //if("12".equals(cctv.getStateCd())) symVo.setCode("98");
                cctvs.add(symVo);
            }
        }

        return cctvs;
    }

    //화면에서 심볼이 차지하는 영역 BBOX를 계산한다.
    private Envelope calcExtent(double px, double py, int symWidth, int symHeight, MapScale scale) {
        double cx = scale.toMapX(px);
        double cy = scale.toMapY(py);
        //겹치는 수준을 조절하기 위하여 bbox영역을 좀더 줄인다.
        int minx = (int) (cx - symWidth / 4d);
        int maxx = (int) (cx + symWidth / 4d);
        int miny = (int) (cy - symHeight / 4d);
        int maxy = (int) (cy + symHeight / 4d);
        return new Envelope(minx, maxx, miny, maxy);
    }

    // Extent를 PostGIS WKT형식으로 변환한다.
    private String makeExtent(Envelope bbox, String epsg) {
        StringBuilder sb = new StringBuilder();
        sb.append("\'SRID=").append(epsg).append(";POLYGON((");
        sb.append(bbox.getMinX()).append(" ").append(bbox.getMinY()).append(",");
        sb.append(bbox.getMinX()).append(" ").append(bbox.getMaxY()).append(",");
        sb.append(bbox.getMaxX()).append(" ").append(bbox.getMaxY()).append(",");
        sb.append(bbox.getMaxX()).append(" ").append(bbox.getMinY()).append(",");
        sb.append(bbox.getMinX()).append(" ").append(bbox.getMinY());
        sb.append("))\'::geometry");
        return sb.toString();
    }
}
