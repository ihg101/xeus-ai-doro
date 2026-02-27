package gmx.gis.layerTable.web;



import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import gmx.gis.layerTable.service.GMT_LayerTableService;
import gmx.gis.layerTable.util.GMT_LayerTableUtil;
import gmx.gis.sysmgr.service.GMT_ColumnService;
import gmx.gis.sysmgr.service.GMT_ColumnVo;
import gmx.gis.util.code.GMT_EtcUtil;

/**
 * @author 민동현
 *
 */
@Controller
@RequestMapping("/GMT_layerTable")
public class GMT_LayerTableController {

    @Autowired private GMT_LayerTableService layerTableService;

    @Autowired private GMT_ColumnService colSvc;

    /**
     * 	컬럼정보, 테이블정보를 받아서 신규레이어를 생성합니니다.
     *
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/createLayerTable.json", method = RequestMethod.POST)
    public void createLayerTable(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
    	String userId = (String) session.getAttribute("userId");
    	if(userId == null){
    		 model.addAttribute("result", "세션이 없습니다. 다시 시도해주세요.");
    		 return;
    	}

    	HashMap<String,String> param = new HashMap<String,String>();
    	param.put("userId", userId);
    	param.put("schema", "draw");

        map.put("userId", userId);

        map.put("tblNm", GMT_EtcUtil.getTableName(param));

        String msg = GMT_LayerTableUtil.findError(map);
        if("pass".equals(msg)){
            model.addAttribute("result", layerTableService.createLayerTable(map));
        }else{
            model.addAttribute("result", msg);
        }
    }

    /**
     * 필드 정보를 변경합니다
     *
     * @param model
     * @param session
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/alterFieldInfo.json", method = RequestMethod.POST)
    public void alterFieldInfo(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
    	String userId = (String) session.getAttribute("userId");
    	if(userId == null){
    		 model.addAttribute("result", "세션이 없습니다. 다시 시도해주세요.");
    		 return;
    	}
        map.put("userId", userId);
        map.put("table", map.get("tblNm"));

		ArrayList<GMT_ColumnVo> list = colSvc.getColumnInfo(map);

        String msg = GMT_LayerTableUtil.findColumnErrorAndFindColumnLenError(map,list);
        if("pass".equals(msg)){
            model.addAttribute("result", layerTableService.alterField(map));
        }else{
            model.addAttribute("result", msg);
        }
    }

    /**
     * 하나의 필드를 추가합니다
     *
     * @param model
     * @param session
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/addOneColumn.json", method = RequestMethod.POST)
    public void addOneColumn(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
    	String userId = (String) session.getAttribute("userId");
    	if(userId == null){
    		 model.addAttribute("result", "세션이 없습니다. 다시 시도해주세요.");
    		 return;
    	}
        map.put("userId", userId);
        map.put("table", map.get("tableName"));



        String msg = GMT_LayerTableUtil.findOneColumnError(map);
        if("pass".equals(msg)){
            model.addAttribute("result", layerTableService.addOneColumn(map));
        }else{
            model.addAttribute("result", msg);
        }
    }


    /**
     * 하나의 필드를 제거합니다
     *
     * @param model
     * @param session
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/deleteOneColumn.json", method = RequestMethod.POST)
    public void deleteOneColumn(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
    	String userId = (String) session.getAttribute("userId");
    	if(userId == null){
    		 model.addAttribute("result", "세션이 없습니다. 다시 시도해주세요.");
    		 return;
    	}

        model.addAttribute("result", layerTableService.deleteOneColumn(map));

    }

}
