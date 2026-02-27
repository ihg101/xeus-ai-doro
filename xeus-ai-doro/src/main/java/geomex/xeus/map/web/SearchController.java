package geomex.xeus.map.web;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import egovframework.rte.fdl.property.EgovPropertyService;
import geomex.xeus.map.service.BuldVo;
import geomex.xeus.map.service.DoroSearchVo;
import geomex.xeus.map.service.JibunSearchVo;
import geomex.xeus.map.service.LocationVo;
import geomex.xeus.map.service.SearchService;

/**
 * <pre>
 * 파일명 :  SearchController.java
 * 설  명 :
 *   검색 관련 컨트롤러
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 5. 29.      전우람          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 5. 29.
 * @version : 1.0
 * @see
 */
@Controller
@RequestMapping(value = "/search")
public class SearchController {

    @Resource
    private SearchService service;

    @Resource(name = "propService")
    private EgovPropertyService propService;

    private String searchLi;

    @PostConstruct
    public void initIt() throws Exception {
        this.searchLi = "N";
        if("Y".equals(propService.getString("sys.search.li"))) this.searchLi = "Y";
    }

    /**
     * 검색 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getSearchView.do")
    public String getSearchView(Model model) throws Exception {

        model.addAttribute("liChk", searchLi);
    	model.addAttribute("emdList", service.getEmdList());
    	model.addAttribute("liList", service.getLiList());
    	model.addAttribute("rnList", service.getRnList());

    	return "/search/searchView";
    }

    /**
     * 주소검색 view 리턴, kais_emd_as, kais_li_as, kais_manage_ls에서 각 코드, 이름을 가져옴
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getAddrView.do")
    public String getAddrView(Model model) throws Exception {

        model.addAttribute("emdList", service.getEmdList());
        model.addAttribute("liList", service.getLiList());
        model.addAttribute("rnList", service.getRnList());

        return "/search/addrSearch";

    }

    /**
     * 통합검색 view 리턴
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getApiView.do")
    public String getApiView() throws Exception {

        return "/search/apiSearch";
    }

    /**
     * 좌표검색 view 리턴
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getLocationView.do")
    public String getLocationView() throws Exception {

        return "/search/locationSearch";
    }

    /**
     * 지번검색, SQL문으로 검색결과를 받아옴
     *
     * map의 pnu는 검색파라미터로 만든것, model에 pnu는 DB에서 검색결과로 나온것.
     *
     * @param model - emdName, pnu, jibun, bldgNo - 결과
     * @param map - bjdCd, bon, bu, emdCd, liCd, pnu, san - 파라미터
     * @throws Exception
     */
    @RequestMapping(value = "/getAddrSearchList.json")
    public void getAddrSearchList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        ArrayList<JibunSearchVo> list = service.getAddrSearchList(map);
        model.addAttribute("result", list);

    }

    /**
     * 도로명검색, SQL문으로 검색결과를 받아옴
     *
     * @param model - lnAddr, rdSeLbl, gid - 결과
     * @param map - bon, bu, rnCd - 파라미터
     * @throws Exception
     */
    @RequestMapping(value = "/getNewAddrSearchList.json")
    public void getNewAddrSearchList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        ArrayList<DoroSearchVo> list = service.getNewAddrSearchList(map);
        model.addAttribute("result", list);

    }

    /**
     * 지번검색, 도로명검색의 위치값을 가져옴
     * 지번검색 - pnu로 cbnd에서 검색
     * 도로명검색 - gid로 v_kais_buld_as에서 검색
     * map의 text는 지도에 표시될 text, 여기서 사용X
     * key는 "pnu" or "gid"
     *
     * @param model - center - 결과
     * @param map - key, text, val - 파라미터
     * @throws Exception
     */
    @RequestMapping(value = "/getLocation.json")
    public void getLocation(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        if(map.get("key") == null || map.get("key") == "" || map.get("val") == null || map.get("val") == ""){
            model.addAttribute("error", "위치가 존재하지 않습니다.");
        }else{
            ArrayList<LocationVo> list = service.getLocation(map);
            model.addAttribute("result", list);
        }
    }

    /**
     * 지도의 중앙 좌표값을 사용하여 해당 좌표의 주소를 가져옴 - 임시 위치, 추후 map관련쪽으로 이동
     * DB - sig, emd, li에서 각각 명칭과, li의 geometry 사용
     *
     * @param model - String(addr) - 결과
     * @param map - float8(map의 getCenter()[0]값), float8(map의 getCenter()[1]값) - 파라미터
     * @throws Exception
     */
    @RequestMapping(value = "/getCenterName.json")
    public void getCenterName(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        String nm = service.getCenterName(map);
        model.addAttribute("result", nm);

    }

    /**
     * 건물명검색, SQL문으로 검색결과를 받아옴
     *
     * @param model - buldNm, annoX, annoY - 결과
     * @param map - buldNm - 파라미터
     * @throws Exception
     */
    @RequestMapping(value = "/getBuldSearchList.json")
    public void getBuldSearchList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        ArrayList<BuldVo> list = service.getBuldSearchList(map);
        model.addAttribute("result", list);

    }

}
