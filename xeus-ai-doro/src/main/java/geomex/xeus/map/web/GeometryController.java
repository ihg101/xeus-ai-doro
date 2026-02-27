package geomex.xeus.map.web;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.map.service.GeometryService;
import geomex.xeus.sysmgr.service.ColumnInfoService;
import geomex.xeus.system.annotation.NoSession;

/**
 * <pre>
 * 파일명 :  GeometryController.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 11. 2.
 * @version :  1.0
 * @see
 */
@Controller
//@RequestMapping("/geom")
public class GeometryController {

	@Autowired
	private ColumnInfoService column;

	@Autowired
	private GeometryService service;

	/**
	 * Custom WFS 를 리턴합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "CustomWFS"/*, method = RequestMethod.POST*/)
	public void getWfs(HttpServletResponse res, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		res.setCharacterEncoding("UTF-8");
		res.setContentType("application/json");

		if(map.get("val") != null && !"".equals(map.get("val"))){
			String[] vals = map.get("val").split(",");
			for(int i=0; i<vals.length; i++){
				vals[i] = "'" + vals[i] + "'";
			}
			map.put("val", Arrays.toString(vals).replace("[", "").replace("]", ""));
		}

		if(map.get("reqGbn") != null && !"".equals(map.get("reqGbn"))){
            String[] vals = map.get("reqGbn").split(",");
            for(int i=0; i<vals.length; i++){
                vals[i] = "'" + vals[i] + "'";
            }
            map.put("reqGbn", Arrays.toString(vals).replace("[", "").replace("]", ""));
        }

		ArrayList<HashMap<String, String>> list = service.getWfs(map);

		StringBuilder sb = new StringBuilder();
        sb.append("{ \"type\": \"FeatureCollection\",");
        sb.append("\"features\": [");
        int cnt = 0;
        for(int i=0; i<list.size(); i++){
        	HashMap<String, String> hash = list.get(i);
        	Set <String> key = hash.keySet();
        	Iterator<String> itr = key.iterator();

        	if (cnt > 0) sb.append(",");
        	sb.append("{ \"type\": \"Feature\",");
        	sb.append("\"id\": \"" + map.get("tbl") + "." + String.valueOf(hash.get("_gid")) + "\",");
        	sb.append("\"geometry\":").append(hash.get("geojson")).append(",");
        	sb.append("\"properties\": {");

        	String propStr = "\"typename\":" + "\"" + map.get("tbl") + "\",";
        	while(itr.hasNext()){
        		String k = (String) itr.next();
        		if(!"geojson".equals(k) && !"_geometry".equals(k) && !"state_cd".equals(k) && !"evt_json".equals(k)){

        			if("asset_cctv_install".equals(map.get("tbl")) || "v_asset_cctv_not_install".equals(map.get("tbl"))){

        				if(!"reg_how".equals(k) && !"reg_req".equals(k) && !"jibun".equals(k) && !"rmark".equals(k) && !"res_date".equals(k) && !"field_insp".equals(k) && !"user_nm".equals(k) && !"user_tell".equals(k)){
        					propStr += "\"" + k + "\":" + "\"" + String.valueOf(hash.get(k)) + "\",";
        				}

        			}else if("asset_dust".equals(map.get("tbl"))){

        				if(!"eui".equals(k)){
        					propStr += "\"" + k + "\":" + "\"" + String.valueOf(hash.get(k)) + "\",";
        				}

        			}else{
        				propStr += "\"" + k + "\":" + "\"" + String.valueOf(hash.get(k)) + "\",";
        			}
        		}

        		if("state_cd".equals(k) && hash.get(k) != null && !"".equals(hash.get(k))){
        			String stateNm = "정상";
                    boolean isError = false;
                    if("12".equals(String.valueOf(hash.get(k)))){
                    	stateNm = "장애";
                    	isError = true;
                    }
                    propStr += "\"stateCd\":" + "\"" + stateNm + "\",";
                    propStr += "\"isError\":" + "\"" + isError + "\",";
        		}
        	}
        	sb.append(propStr.substring(0, propStr.length() - 1));

        	cnt++;
        	sb.append("}"); //properties end
        	sb.append("}");
        }
        sb.append("]");
        sb.append("}");

        res.getWriter().print(sb.toString());

	}

	/**
	 * Custom WFS 를 리턴합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "BigdataWFS"/*, method = RequestMethod.POST*/)
	public void getBigdataWfs(HttpServletResponse res, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		res.setCharacterEncoding("UTF-8");
		res.setContentType("application/json");

		if(map.get("val") != null && !"".equals(map.get("val"))){
			String[] vals = map.get("val").split(",");
			for(int i=0; i<vals.length; i++){
				vals[i] = "'" + vals[i] + "'";
			}
			map.put("val", Arrays.toString(vals).replace("[", "").replace("]", ""));
		}


		ArrayList<HashMap<String, String>> list = service.getBigdataWfs(map);

		StringBuilder sb = new StringBuilder();
		sb.append("{ \"type\": \"FeatureCollection\",");
		sb.append("\"features\": [");
		int cnt = 0;
		for(int i=0; i<list.size(); i++){
			HashMap<String, String> hash = list.get(i);
			Set <String> key = hash.keySet();
			Iterator<String> itr = key.iterator();

			if (cnt > 0) sb.append(",");
			sb.append("{ \"type\": \"Feature\",");
			sb.append("\"id\": \"" + map.get("tbl") + "." + String.valueOf(hash.get("_gid")) + "\",");
			sb.append("\"geometry\":").append(hash.get("geojson")).append(",");
			sb.append("\"properties\": {");

			String propStr = "\"typename\":" + "\"" + map.get("tbl") + "\",";
			while(itr.hasNext()){
				String k = (String) itr.next();
				if(!"geojson".equals(k) && !"_geometry".equals(k) && !"state_cd".equals(k) && !"evt_json".equals(k)){

					propStr += "\"" + k + "\":" + "\"" + String.valueOf(hash.get(k)) + "\",";
				}
			}
			sb.append(propStr.substring(0, propStr.length() - 1));

			cnt++;
			sb.append("}"); //properties end
			sb.append("}");
		}
		sb.append("]");
		sb.append("}");

		res.getWriter().print(sb.toString());

	}

	/**
	 * Custom WFS 를 리턴합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "CableWFS"/*, method = RequestMethod.POST*/)
	public void getCableWFS(HttpServletResponse res, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		res.setCharacterEncoding("UTF-8");
		res.setContentType("application/json");

		if(map.get("val") != null && !"".equals(map.get("val"))){
			String[] vals = map.get("val").split(",");
			for(int i=0; i<vals.length; i++){
				vals[i] = "'" + vals[i] + "'";
			}
			map.put("val", Arrays.toString(vals).replace("[", "").replace("]", ""));
		}

		if(map.get("themeMgrNo") != null && !"".equals(map.get("themeMgrNo"))){
            String[] vals = map.get("themeMgrNo").split(",");
            for(int i=0; i<vals.length; i++){
                vals[i] = "'" + vals[i] + "'";
            }
            map.put("themeMgrNo", Arrays.toString(vals).replace("[", "").replace("]", ""));
        }

		ArrayList<HashMap<String, String>> list = service.getCableWfs(map);

		StringBuilder sb = new StringBuilder();
        sb.append("{ \"type\": \"FeatureCollection\",");
        sb.append("\"features\": [");
        int cnt = 0;
        for(int i=0; i<list.size(); i++){
        	HashMap<String, String> hash = list.get(i);
        	Set <String> key = hash.keySet();
        	Iterator<String> itr = key.iterator();

        	if (cnt > 0) sb.append(",");
        	sb.append("{ \"type\": \"Feature\",");
        	sb.append("\"id\": \"" + map.get("tbl") + "." + String.valueOf(hash.get("_gid")) + "\",");
        	sb.append("\"geometry\":").append(hash.get("geojson")).append(",");
        	sb.append("\"properties\": {");

        	String propStr = "\"typename\":" + "\"" + map.get("tbl") + "\",";
        	while(itr.hasNext()){
        		String k = (String) itr.next();
        		if(!"geojson".equals(k) && !"_geometry".equals(k) && !"state_cd".equals(k) && !"evt_json".equals(k)){
    				propStr += "\"" + k + "\":" + "\"" + String.valueOf(hash.get(k)) + "\",";
        		}

        		if("state_cd".equals(k) && hash.get(k) != null && !"".equals(hash.get(k))){
        			String stateNm = "정상";
                    boolean isError = false;
                    if("12".equals(String.valueOf(hash.get(k)))){
                    	stateNm = "장애";
                    	isError = true;
                    }
                    propStr += "\"stateCd\":" + "\"" + stateNm + "\",";
                    propStr += "\"isError\":" + "\"" + isError + "\",";
        		}
        	}
        	sb.append(propStr.substring(0, propStr.length() - 1));

        	cnt++;
        	sb.append("}"); //properties end
        	sb.append("}");
        }
        sb.append("]");
        sb.append("}");

        res.getWriter().print(sb.toString());

	}

	/**
	 * 테이블의 데이터를 리턴합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "getLayerData.json"/*, method = RequestMethod.POST*/)
	public void getData(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.getData(map));
		model.addAttribute("count", service.getCount(map));
		model.addAttribute("column", column.getColumn(map));

	}

	/**
	 * 테이블의 Min, Max, Count데이터를 리턴합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "getMinMax.json"/*, method = RequestMethod.POST*/)
	public void getMinMax(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.getMinMax(map));
		model.addAttribute("column", column.getColumn(map));

	}

	/**
	 * 지점과의 가장 가까운 Preset CCTV 정보를 리턴합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "getPresetCCTV.json"/*, method = RequestMethod.POST*/)
	public void getPresetCCTV(HttpSession session, Model model, @RequestParam HashMap<String, String> map) throws Exception {

		ArrayList<HashMap<String, String>> list = service.getPresetCCTV(map);

		if(list.size() == 1){
			model.addAttribute("result", list.get(0));
		}else{
			model.addAttribute("result", false);
		}

	}

}
