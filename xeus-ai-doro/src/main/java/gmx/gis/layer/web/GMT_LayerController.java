package gmx.gis.layer.web;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.system.annotation.NoSession;
import gmx.gis.geometry.service.GMT_GeometryService;
import gmx.gis.geometry.service.GMT_GeometryVo;
import gmx.gis.layer.service.GMT_LayerGroupService;
import gmx.gis.layer.service.GMT_LayerGroupVo;
import gmx.gis.layer.service.GMT_LayerImportService;
import gmx.gis.layer.service.GMT_LayerService;
import gmx.gis.layer.service.GMT_LayerStyleService;
import gmx.gis.layer.service.GMT_LayerThemeService;
import gmx.gis.layer.service.GMT_LayerVo;
import gmx.gis.layer.service.GMT_StyleVo;
import gmx.gis.sysmgr.service.GMT_AuthGrpVo;
import gmx.gis.sysmgr.service.GMT_AuthService;
import gmx.gis.sysmgr.service.GMT_ListHashMapVo;

/**
 *
 * <pre>
 * 레이어의 정보를 관리하는 컨트롤러 입니다.
 * </pre>
 *
 * @author 이주영
 *
 */
@Controller
@RequestMapping("/GMT_layer")
public class GMT_LayerController {

	@Autowired private GMT_LayerService svc;

	@Autowired private GMT_LayerGroupService group;

	@Autowired private GMT_LayerStyleService style;

	@Autowired private GMT_LayerThemeService theme;

	@Autowired private GMT_LayerImportService imprt;

	@Autowired private GMT_GeometryService geom;

	@Autowired private GMT_AuthService auth;

	/**
	 * 레이어의 전체 정보(소속 그룹, 기본 정보, 스타일, 주제도)를 검색합니다.
	 *
	 * 참고) 로그인 계정의 정보만 추출합니다.
	 *
	 * @param model
	 * @param mgrSeq
	 * @throws Exception
	 */
	@RequestMapping(value = "/getLayerInfo.json", method = RequestMethod.POST)
	public void getLayerInfo(Model model, HttpSession session, @RequestParam(required = false) String mgrSeq, @RequestParam(required = false) String tabName) throws Exception {
		String userId = (String) session.getAttribute("userId");
		if(userId == null) throw new Exception("Session is invalid.");

		ArrayList<GMT_GeometryVo> geomList = (ArrayList<GMT_GeometryVo>) geom.getList(null);
		HashMap<String, GMT_GeometryVo> keyGeomList = new HashMap<String, GMT_GeometryVo>();
		for(GMT_GeometryVo vo : geomList) keyGeomList.put(vo.getfTableName(), vo);

		model.addAttribute("geom", keyGeomList);
		model.addAttribute("group", group.getListExceptTempLyrGrp(null));
 		model.addAttribute("layer", svc.getLayerInfo(mgrSeq, userId, tabName, "t"));

	}

	/**
	 * 레이어의 전체 정보(소속 그룹, 기본 정보, 스타일, 주제도)를 검색합니다.
	 *
	 * 참고) 로그인 계정과 관계없이 추출합니다.
	 *
	 * @param model
	 * @param mgrSeq
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAllLayerInfo.json", method = RequestMethod.POST)
	public void getAllLayerInfo(Model model) throws Exception {
		ArrayList<GMT_GeometryVo> geomList = (ArrayList<GMT_GeometryVo>) geom.getList(null);
		HashMap<String, GMT_GeometryVo> keyGeomList = new HashMap<String, GMT_GeometryVo>();
		for(GMT_GeometryVo vo : geomList) keyGeomList.put(vo.getfTableName(), vo);

		model.addAttribute("geom", keyGeomList);
		model.addAttribute("group", group.getListExceptTempLyrGrp(null));
		model.addAttribute("layer", svc.getLayerInfo(null, null, null, "t"));

	}

	/**
	 * 서버에 등록된 레이어 목록을 검색합니다.
	 * 관리번호 또는 동록 Id를 이용하여 검색할 수 있습니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getLayerList.json", method = RequestMethod.POST)
	public void getLayerList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", svc.getList(map));

	}
	/**
	 * allLayer : 해당 그룹에 포함하는 모든 레이어
	 * authTrueLayer : 해당 그룹에 포함하는 접근권한이 있는 레이어
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getLayerListByAuth.json", method = RequestMethod.POST)
	public void getLayerListByAuth(Model model, @RequestParam HashMap<String, String> map) throws Exception {
		map.put("useYn", "t");
		model.addAttribute("authTrueLayer", svc.getLayerListByAuth(map));
		model.addAttribute("allLayer", svc.getList(map));
	}

	/**
	 * layerBySelectedGroup : 선택된 레이어 그룹에 있는 레이어 목록
	 * layerByTemporaryGroup : 임시레이어 그룹에 있는 레이어 목록
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getLayerListByGroup.json", method = RequestMethod.POST)
	public void getLayerListByGroup(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
		if("3".equals(map.get("grpMgrSeq"))){
			String userId = (String) session.getAttribute("userId");
			map.put("mkUser", userId);
		}
		map.put("useYn", "t");
		//해당 그룹의 레이어
		model.addAttribute("layerBySelectedGroup", svc.getList(map));
		//임시레이어
		map.remove("mkUser");
		map.put("grpMgrSeq","6");
		model.addAttribute("layerByTemporaryGroup", svc.getList(map));
	}



	/**
	 * 해당 계정으로 만든 나의 레이어를 반환합니다.
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getMyLayerListByAuth.json", method = RequestMethod.POST)
	public void getMyLayerListByAuth(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
		String userId = (String) map.get("userId");
		map.put("mkUser", userId);
		model.addAttribute("authTrueLayer", svc.getLayerListByAuth(map));
		model.addAttribute("allLayer", svc.getList(map));
	}
	/**
	 * 서버에 등록된 레이어 그룹 목록을 검색합니다.
	 * 관리번호 또는 동록 Id를 이용하여 검색할 수 있습니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getLayerGroupList.json", method = RequestMethod.POST)
	public void getLayerGroupList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", group.getList(map));

	}

	/**
	 * 서버에 등록된 스타일 목록을 검색합니다.
	 * 관리번호 또는 동록 Id를 이용하여 검색할 수 있습니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getLayerStyleList.json", method = RequestMethod.POST)
	public void getLayerStyleList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", style.getList(map));

	}

	/**
	 * 스타일을 적용합니다.
	 * 기본 스타일, 주제 등 스타일과 관련된 모든 항목을 저장합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/setStyle.json", method = RequestMethod.POST)
	public void setStyle(Model model, @ModelAttribute GMT_StyleVo styleVo) throws Exception {

		model.addAttribute("result", svc.setStyle(styleVo));

	}

	/**
	 * 레이어의 Z-Index 를 변경합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/setLayersIndex.json", method = RequestMethod.POST)
	public void setLayersIndex(Model model, @ModelAttribute GMT_ListHashMapVo vo) throws Exception {

		model.addAttribute("result", svc.setLayersIndex(vo.getKv()));
		model.addAttribute("listHashMapVo", null);

	}

	/**
	 * 레이어의 보이기 여부를 수정합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/setLayerVisible.json", method = RequestMethod.POST)
	public void setLayerVisible(Model model, @RequestParam(value = "k") String mgrSeq, @RequestParam boolean visibleYn) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("mgrSeq", mgrSeq);

		GMT_LayerVo vo = svc.getItem(map);
		if(vo != null){
			vo.setVisibleYn(visibleYn);

			model.addAttribute("result", svc.edit(vo));
		}else{
			model.addAttribute("error", "수정 대상 테이블이 존재하지 않습니다.");
		}

	}

	/**
	 * 레이어 그룹을 신규 생성합니다
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/addLayerGroup.json", method = RequestMethod.POST)
	public void addLayerGroup(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
		String userId = (String) session.getAttribute("userId");

		GMT_LayerGroupVo vo = new GMT_LayerGroupVo();
		vo.setGrpNm(map.get("grpNm"));
		vo.setMkUser(userId);
		model.addAttribute("result", group.add(vo));
	}

	/**
	 * 레이어 그룹을 수정합니다
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/editLayerGroupName.json", method = RequestMethod.POST)
	public void editLayerGroupName(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
		String userId = (String) session.getAttribute("userId");

		GMT_LayerGroupVo vo = new GMT_LayerGroupVo();
		vo.setGrpNm(map.get("grpNm"));
		vo.setMgrSeq(Integer.parseInt(map.get("mgrSeq")));
		model.addAttribute("result", group.edit(vo));
	}

	/**
	 * 레이어 그룹을 삭제합니다
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/delLayerGroup.json", method = RequestMethod.POST)
	public void delLayerGroup(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", group.del(map));
	}

	/**
	 * 레이어 그룹을 수정합니다
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	/**
	 * 레이어의 Z-Index 를 변경합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/setLayerGroupIndex.json", method = RequestMethod.POST)
	public void setLayerGroupIndex(Model model, @ModelAttribute GMT_ListHashMapVo vo) throws Exception {

		model.addAttribute("result", group.setLayerGroupIndex(vo.getKv()));

	}

	/**
	 * 레이어 를 수정합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/editLayerName.json", method = RequestMethod.POST)
	public void editLayerName(Model model, @RequestParam(value = "k") String mgrSeq, @RequestParam(value = "korNm") String lyrNm, @RequestParam boolean useYn) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("mgrSeq", mgrSeq);

		GMT_LayerVo vo = svc.getItem(map);
		if(vo != null){
			vo.setLyrNm(lyrNm);
			vo.setUseYn(useYn);

			model.addAttribute("result", svc.edit(vo));
		}else{
			model.addAttribute("error", "수정 대상 테이블이 존재하지 않습니다.");
		}

	}

	/**
	 * 해당 레이어의 그룹을 수정한다
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/editLayerGroup.json", method = RequestMethod.POST)
	public void editLayerGroup(Model model,  HttpSession session, @RequestParam(required=true) HashMap<String, String> map) throws Exception {
		HashMap<String, String> param = new HashMap<String, String>();




		String [] str = map.get("tblIdList").split(",");
		int grpMgrSeq = Integer.parseInt(map.get("grpMgrSeq"));

		for(int i=0; i<str.length; i++){
			param.put("tblId",str[i]);
			auth.delAuthLayerList(param);

			if(grpMgrSeq != 6){
				HashMap<String, String> param2 = new HashMap<String, String>();
				//레이어 권한 탭 여부
				param2.put("authData", "layerAuthTab");
				ArrayList<GMT_AuthGrpVo> list = auth.getAuthGrpList(param2);
				List<HashMap<String, Object>> paramList = new ArrayList<HashMap<String, Object>>();
				for(int j=0; j<list.size(); j++){
					GMT_AuthGrpVo obj = list.get(j);

					HashMap<String, Object> paramObj = new HashMap<String, Object>();
					paramObj.put("authGrpNo", obj.getAuthGrpNo());
					paramObj.put("tblId", str[i]);
					paramObj.put("lyrGrpMgrSeq", grpMgrSeq);
					paramObj.put("platformTabAuth", "layerAuthTab");

					paramList.add(paramObj);
				}
				auth.addAuthLayerListMultiple(paramList);
				//레이어권한이 있는 권한은 자동으로 해당 테이	블 권한 생성
			}

			GMT_LayerVo vo = svc.getItem(param);
			vo.setGrpMgrSeq(grpMgrSeq);
			svc.editGrpMgrSeq(vo);

		}
	}

	/**
	 * 레이어를 물리적으로 제거합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/removeLayer.json", method = RequestMethod.POST)
	public void removeLayer(Model model, @RequestParam(value = "k") String mgrSeq) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("mgrSeq", mgrSeq);

		GMT_LayerVo vo = svc.getItem(map);

		if(vo != null){
			boolean del = svc.del(map);
			map.put("tblId",vo.getTblId());
			auth.delAuthLayerList(map);
			if(del){
				map.put("schema", vo.getSchemNm());
				map.put("table", vo.getTblId());

				if(vo.getTblId().startsWith("v_")){
					model.addAttribute("result", svc.dropViewTable(map));
				}else{
					model.addAttribute("result", svc.dropTable(map));
				}
			}
		}else{
			model.addAttribute("error", "삭제 대상 테이블이 존재하지 않습니다.");
		}

	}

	/**
	 * 레이어를 Engine 에 등록합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/layerRegForEngine.json", method = RequestMethod.POST)
	public void layerRegForEngine(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		try {
			imprt.importLayer(map);
			model.addAttribute("result", true);
		} catch (Exception e) {
			model.addAttribute("result", false);
		}

	}

	/**
	 * 레이어를 모두 Engine 에 등록합니다.
	 * 수동으로 등록이 필요할 경우 이용합니다.
	 *
	 * 예) GIS Engine 재구동 후 등록이 필요한 경우.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "/initLayers.json")
	public void initLayers(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		try {
			geom.init();
			model.addAttribute("result", true);
		} catch (Exception e) {
			model.addAttribute("result", false);
		}

	}

}
