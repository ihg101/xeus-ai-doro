package geomex.xeus.stat.web;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;
import java.util.TreeSet;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.ui.Model;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import egovframework.rte.fdl.property.EgovPropertyService;
import geomex.xeus.equipmgr.service.CctvService;
import geomex.xeus.map.service.GeometryService;
import geomex.xeus.map.service.SearchService;
import geomex.xeus.smartcity.service.EventHistService;
import geomex.xeus.stat.service.UsrStatService;
import geomex.xeus.stat.service.AssetStatService;
import geomex.xeus.stat.service.EvtCctvStatService;
import geomex.xeus.stat.service.MonEvtStatService;
import geomex.xeus.sysmgr.web.CodeCtrl;
import geomex.xeus.sysmgr.web.ColumnInfoController;
import geomex.xeus.tvius.service.CrmsTransRqstService;
import geomex.xeus.user.service.UserService;
import geomex.xeus.util.code.CodeConvertor;

/**
 * <pre>
 * 파일명 :  StatController.java
 * 설  명 :
 *   통계현황 컨트롤러 페이지
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-10-29      이은규          최초 생성
 *
 *
 * </pre>
 *
 * @since   :  2018. 10. 29.
 * @version :  1.0
 * @see
 */
@Controller
@RequestMapping("/stat")
public class StatController {

    @Resource(name = "CctvService")
    private CctvService cctv;

    @Resource(name = "codeCtrl")
    private CodeCtrl code;

    @Resource(name = "geometryService")
    private GeometryService geom;

    @Resource
    private ColumnInfoController col;

    @Resource(name = "txManager")
    PlatformTransactionManager transactionManager;

    @Resource(name = "userService")
    private UserService userService;

    @Resource(name = "usrStatService")
    private UsrStatService usrStatService;

    @Resource(name = "monEvtStatService")
    private MonEvtStatService monEvtStatService;

    @Resource(name = "assetStatService")
    private AssetStatService assetStatService;

    @Resource(name = "evtCctvStatService")
    private EvtCctvStatService evtCctvStatService;

    @Resource(name = "propService")
    private EgovPropertyService propService;

    @Resource(name = "eventHistService")
    private EventHistService eventHistService;

    @Resource(name = "searchService")
	private SearchService searchService;

    @Resource
    private Validator validator;

    @Resource(name = "crmsTransRqstService")
    private CrmsTransRqstService transRqst;

    @Resource(name = "eventHistService")
    private EventHistService histService;


    @InitBinder
    private void initBinder(WebDataBinder binder){
        binder.setValidator(this.validator);
        /*binder.registerCustomEditor(MultipartFile.class, new PropertyEditorSupport() {
            @Override
            public void setAsText(String text) {
                setValue(null);
            }
        });*/
    }

    /**
     * 사용자 기관별 접속통계 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUsrStatView.do")
    public String getUsrStatView(Model model) throws Exception {

        return "/stat/usrStatView";
    }

    /**
     * 사용자 연별 접속통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUsrYearStat.json")
    public void getUsrYearStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", usrStatService.getYearStat(map));
    }

    /**
     * 사용자 월별 접속통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUsrMonthStat.json")
    public void getUsrMonthStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", usrStatService.getMonthStat(map));
    }

    /**
     * 사용자 일별 접속통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUsrDayStat.json")
    public void getUsrDayStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", usrStatService.getDayStat(map));
    }

    /**
     * 사용자 기관별 연 접속통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUsrOrgzYearStat.json")
    public void getUsrOrgzYearStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", usrStatService.getOrgzYearStat(map));
    }

    /**
     * 사용자 기관별 월 접속통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUsrOrgzMonthStat.json")
    public void getUsrOrgzMonthStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", usrStatService.getOrgzMonthStat(map));
    }

    /**
     * 사용자 기관별 일 접속통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUsrOrgzDayStat.json")
    public void getUsrOrgzDayStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", usrStatService.getOrgzDayStat(map));
    }


    /**
     * 이벤트 모니터링 통계 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEvtStatView.do")
    public String getEvtStatView(Model model) throws Exception {

        return "/stat/evtStatView";
    }

    /**
     * 이벤트 모니터링 연별 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEvtYearStat.json")
    public void getEvtYearStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", monEvtStatService.getYearStat(map));
    }

    /**
     * 이벤트 모니터링 월별 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEvtMonthStat.json")
    public void getEvtMonthStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", monEvtStatService.getMonthStat(map));
    }

    /**
     * 이벤트 모니터링 일별 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEvtDayStat.json")
    public void getEvtDayStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", monEvtStatService.getDayStat(map));
    }

    /**
     * 이벤트 모니터링 이벤트 별 연 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEvtOrgzYearStat.json")
    public void getEvtTypYearStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", monEvtStatService.getOrgzYearStat(map));
    }

    /**
     * 이벤트 모니터링 이벤트 별 월 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEvtOrgzMonthStat.json")
    public void getEvtTypMonthStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", monEvtStatService.getOrgzMonthStat(map));
    }

    /**
     * 이벤트 모니터링 이벤트 별 일 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEvtOrgzDayStat.json")
    public void getEvtTypDayStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", monEvtStatService.getOrgzDayStat(map));
    }

    /**
     * 이벤트 모니터링 이벤트 별 일 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEvtOrgzDayCnt.json")
    public void getEvtOrgzDayCnt(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", monEvtStatService.getOrgzDayCnt(map));
    }

    /**
     * 이벤트 모니터링 이벤트 종류를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEvtList.json")
    public void getEvtList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", monEvtStatService.getEvtList(map));
    }

    /**
     * 장비 모니터링 통계 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEquipStatView.do")
    public String getEquipStatView(Model model) throws Exception {

        return "/stat/equipStatView";
    }

    /**
     * 장비 모니터링 연별 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getAssetYearStat.json")
    public void getAssetYearStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", assetStatService.getYearStat(map));
    }

    /**
     * 장비 모니터링 월별 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getAssetMonthStat.json")
    public void getAssetMonthStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", assetStatService.getMonthStat(map));
    }

    /**
     * 장비 모니터링 일별 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getAssetDayStat.json")
    public void getAssetDayStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", assetStatService.getDayStat(map));
    }

    /**
     * 장비별 연 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getAssetOrgzYearStat.json")
    public void getAssetOrgzYearStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", assetStatService.getOrgzYearStat(map));
    }

    /**
     * 장비별 월 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getAssetOrgzMonthStat.json")
    public void getAssetOrgzMonthStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", assetStatService.getOrgzMonthStat(map));
    }

    /**
     * 장비별 일 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getAssetOrgzDayCnt.json")
    public void getAssetOrgzDayCnt(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", assetStatService.getOrgzDayCnt(map));
    }

    /**
     * 장비별 일 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getAssetOrgzDayStat.json")
    public void getAssetOrgzDayStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", assetStatService.getOrgzDayStat(map));
    }

    /**
     * 장비 모니터링 장비 종류를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getAssetList.json")
    public void getAssetList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", assetStatService.getList(map));
    }

    /**
     * 이벤트별 CCTV 영상조회 통계 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getCctvStatView.do")
    public String getCctvStatView(Model model) throws Exception {

        return "/stat/cctvStatView";
    }

    /**
     * 이벤트별 CCTV 영상조회 연별 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEvtCctvYearStat.json")
    public void getEvtCctvYearStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", evtCctvStatService.getYearStat(map));
    }

    /**
     * 이벤트별 CCTV 영상조회 월별 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEvtCctvMonthStat.json")
    public void getEvtCctvMonthStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", evtCctvStatService.getMonthStat(map));
    }

    /**
     * 이벤트별 CCTV 영상조회 일별 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEvtCctvDayStat.json")
    public void getEvtCctvDayStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", evtCctvStatService.getDayStat(map));
    }

    /**
     * CCTV 히트맵 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getCctvHeatView.do")
    public String getCctvHeatView(Model model) throws Exception {

    	model.addAttribute("code", new CodeConvertor(code.getCdeList()));

        return "/stat/cctvHeatView";
    }




    /**
     * 이벤트그래프테이블 보기 페이지를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEventGraphTableView.do")
    public String getEventGraphTableView(Model model) throws Exception {
    	HashMap<String, String> map = null;

    	model.addAttribute("evtTypCdList", monEvtStatService.getDistinctEvtTypCd(map));
    	model.addAttribute("emdCdList", searchService.getEmdList());

        return "/stat/eventGraphTableView";
    }

    /**
     * 이벤트명으로 구분되는 통계를 리턴합니다
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEventStatByEvtNm.json")
    public void getEventStatByEvtNm(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", monEvtStatService.getEventStatByEvtNm(map));
    }

    /**
     * 이벤트명으로 구분되는 통계를 리턴합니다
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEventStatByEvtTypCdAndEvtNm.json")
    public void getEventStatByEvtTypCdAndEvtNm(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", monEvtStatService.getEventStatByEvtTypCdAndEvtNm(map));
    }

    /**
     * 이벤트명으로 구분되는 통계를 리턴합니다
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEventStatByEvtTypCd.json")
    public void getEventStatByEvtTypCd(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", monEvtStatService.getEventStatByEvtTypCd(map));
    }


    /**
     * 이벤트 모니터링 일별 통계를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getEventStatByEmdCd.json")
    public void getEventStatByEmdCd(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", monEvtStatService.getEventStatByEmdCd(map));
    }


    /**
     * 관리자 영상정보 신청현황 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/getDetailEventStatTableView.do")
    public String getDetailEventStatTableView(Model model, HttpSession session, @RequestParam HashMap<String, String> map ) throws Exception {


	    HashMap<String, String> param = (HashMap<String, String>)map.clone();
	    model.addAttribute("param", param);

        model.addAttribute("list", monEvtStatService.getList(map));
        model.addAttribute("count", monEvtStatService.getCount(map));

        return "/stat/detailEventStatTable";
    }


	/**
     * 관리자 영상정보 신청현황 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
	@RequestMapping(value = "/getDetailEventList.json")
	 public void getDetailEventList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", monEvtStatService.getList(map));
    }


}
