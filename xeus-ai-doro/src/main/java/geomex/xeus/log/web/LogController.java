package geomex.xeus.log.web;

import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.equipmgr.service.StatusHistService;
import geomex.xeus.log.service.AccessService;
import geomex.xeus.log.service.AssetLogService;
import geomex.xeus.log.service.LogStatService;
import geomex.xeus.log.service.MonCctvLogService;
import geomex.xeus.log.service.MonPrevLogService;
import geomex.xeus.log.service.MonStillCutLogService;
import geomex.xeus.log.service.MsgLogService;
import geomex.xeus.log.service.MsgLogVo;
import geomex.xeus.map.service.GeometryService;
import geomex.xeus.map.service.SearchService;
import geomex.xeus.smartcity.service.EventHistService;
import geomex.xeus.sysmgr.service.AuthLogService;
import geomex.xeus.sysmgr.service.OrganizationService;
import geomex.xeus.sysmgr.web.CodeCtrl;
import geomex.xeus.sysmgr.web.ColumnInfoController;
import geomex.xeus.system.annotation.NoSession;
import geomex.xeus.tvius.service.CrmsRqstRenewService;
import geomex.xeus.tvius.service.CrmsTransRqstService;
import geomex.xeus.util.code.ValidInspector;

/**
 * <pre>
 * 파일명 :  LogController.java
 * 설  명 :
 *   로그 관련 컨트롤러
 *   로그 관리 목록
 *      스마트 플랫폼 5대 연계 서비스 이력
 *      SMS 전송 이력
 *      시설물 관리 이력
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-04-18      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 04. 18.
 * @version :  1.0
 * @see
 */
@Controller
@RequestMapping("/log")
public class LogController {

	@Resource(name = "codeCtrl")
	private CodeCtrl code;

	@Resource(name = "eventHistService")
    private EventHistService evtHistlog;

	@Resource(name = "msgLogService")
    private MsgLogService msgLog;

	@Resource(name = "assetLogService")
    private AssetLogService assetLog;

	@Resource(name = "accessService")
    private AccessService access;

	@Resource(name = "logStatService")
    private LogStatService logStat;

	@Resource(name = "geometryService")
	private GeometryService geom;

	@Resource(name = "searchService")
	private SearchService bjd;

	@Resource(name = "organizationService")
	private OrganizationService orgz;

	@Resource(name = "crmsTransRqstService")
	private CrmsTransRqstService rqstLog;

	@Resource(name = "crmsRqstRenewService")
	private CrmsRqstRenewService rqstRenew;

	@Resource(name = "authLogService")
	private AuthLogService authLog;

	@Resource(name = "monCctvLogService")
	private  MonCctvLogService monCctv;

	@Resource(name = "monPrevLogService")
	private  MonPrevLogService monPrev;

	@Resource(name = "statusHistService")
	private  StatusHistService statusHist;

	@Resource(name = "monStillCutLogService")
	private  MonStillCutLogService stillcut;

	@Resource
	private ColumnInfoController col;

	@Resource(name = "txManager")
    PlatformTransactionManager transactionManager;

	@Resource
	private Validator validator;

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
     * 이벤트공유 로그 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getMonEvtShareLogView.do", method = RequestMethod.POST)
    public String getMonEvtShareLogView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", evtHistlog.getList(map));
        model.addAttribute("count", evtHistlog.getCount(map));
        model.addAttribute("column", col.getList());
        model.addAttribute("map", map);

        return "/log/monEvtShareLogView";

    }

    /*
     * SMS 전송 로그
     */

    /**
     * SMS 전송 로그 정보 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getMsgLogView.do")
    public String getMsgHistView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", msgLog.getList(map));
        model.addAttribute("count", msgLog.getCount(map));
        model.addAttribute("column", col.getList());
        model.addAttribute("map", map);

        return "/log/msgLogView";
    }

    /**
     * SMS 전송 로그 리스트를 가져옵니다.
     *
     * @param req
     * @param res
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getList.json", method = RequestMethod.POST)
    public void getList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", msgLog.getList(map));
        model.addAttribute("count", msgLog.getCount(map));

    }

    /**
     * SMS 전송 로그 단건을 조회합니다.
     *
     * @param req
     * @param res
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/getItem.json", method = RequestMethod.POST)
    public void getItem(Model model, HttpServletRequest req, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", msgLog.getItem(map));

    }

    /**
     * SMS 전송 로그을 삭제합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/del.json", method = RequestMethod.POST)
    public void del(Model model, HttpSession session, @RequestParam(required=true) HashMap<String, String> map) throws Exception {

        model.addAttribute("result", msgLog.del(map));

    }

    /**
     * SMS 전송 로그을 추가합니다.
     *
     * @param model
     * @param param
     * @param br
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/add.json", method = RequestMethod.POST)
    public void add(Model model, HttpSession session, @ModelAttribute @Valid MsgLogVo vo, BindingResult br) throws Exception {

        String msg = ValidInspector.findError(br);

        if("pass".equals(msg)){
            model.addAttribute("result", msgLog.add(vo));
        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * SMS 전송 로그를 수정합니다.
     *
     * @param model
     * @param param
     * @param br
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/edit.json", method = RequestMethod.POST)
    public void edit(Model model, HttpSession session, @ModelAttribute @Valid MsgLogVo vo, BindingResult br) throws Exception {

        String msg = ValidInspector.findError(br);

        if("pass".equals(msg)){
            model.addAttribute("result", msgLog.edit(vo));
        }else{
            model.addAttribute("error", msg);
        }

    }



    /*
     * 시설물 관리 로그
     */

    /**
     * 시설물 관리 로그 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getAssetLogView.do")
    public String getAssetLogView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", assetLog.getList(map));
        model.addAttribute("count", assetLog.getCount(map));
        model.addAttribute("column", col.getList());
        model.addAttribute("map", map);

        return "/log/assetLogView";
    }


    /*
     * 접근이력관리 관리 로그
     */

    /**
     * 접근이력관리 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getAccessView.do")
    public String getAccessView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", access.getList(map));
        model.addAttribute("count", access.getCount(map));
        model.addAttribute("column", col.getList());
        model.addAttribute("map", map);

        return "/log/accessLogView";
    }

    /**
     * 권한설정 로그 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getAuthSetLogView.do")
    public String getAuthSetLogView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", authLog.getList(map));
        model.addAttribute("count", authLog.getCount(map));
        model.addAttribute("column", col.getList());
        model.addAttribute("map", map);

        return "/log/authSetLogView";
    }

    /**
     * 영상조회 로그 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getMonCctvLogView.do")
    public String getMonCctvLogView(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	String userId=map.get("usrId");
    	map.put("userId", userId);
        model.addAttribute("result", monCctv.getList(map));
        model.addAttribute("count", monCctv.getCount(map));
        model.addAttribute("column", col.getList());
        model.addAttribute("map", map);

        return "/log/monCctvLogView";
    }

    /**
     * 선영상조회 로그 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getMonPrevLogView.do")
    public String getMonPrevView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", monPrev.getList(map));
        model.addAttribute("count", monPrev.getCount(map));
        model.addAttribute("column", col.getList());
        model.addAttribute("map", map);

        return "/log/monPrevLogView";
    }

    /**
     * 이상상태 로그 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getAssetStatusLogView.do")
    public String getAssetStatusLogView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", statusHist.getList(map));
        model.addAttribute("count", statusHist.getCount(map));
        model.addAttribute("column", col.getList());
        model.addAttribute("map", map);

        return "/log/assetStatusLogView";
    }

    /**
     * CCTV 스틸컷 로그 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getStillCutLogView.do")
    public String getMonStillCutLogView(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	String userId=map.get("usrId");
    	map.put("userId", userId);

        model.addAttribute("result", stillcut.getList(map));
        model.addAttribute("count", stillcut.getCount(map));
        model.addAttribute("column", col.getList());
        model.addAttribute("map", map);

        return "/log/monStillCutLogView";
    }

    /**
     * 영상반출신청 로그 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getCrmsRqstLogView.do")
    public String getCrmsRqstLogView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", rqstLog.getList(map));
        model.addAttribute("count", rqstLog.getCount(map));
        model.addAttribute("column", col.getList());
        model.addAttribute("map", map);

        return "/log/crmsRqstLogView";
    }

    /**
     * 연장신청 로그 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getCrmsRenewLogView.do")
    public String getCrmsRenewLogView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", rqstRenew.getList(map));
        model.addAttribute("count", rqstRenew.getCount(map));
        model.addAttribute("column", col.getList());
        model.addAttribute("map", map);

        return "/log/crmsRenewLogView";
    }

    /**
     * 증거자료신청 로그 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getCrmsRenewEviLogView.do")
    public String getCrmsRenewEviLogView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", rqstRenew.getList(map));
        model.addAttribute("count", rqstRenew.getCount(map));
        model.addAttribute("column", col.getList());
        model.addAttribute("map", map);

        return "/log/crmsRenewEviLogView";
    }

    /**
     * 열람신청 로그 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getCrmsRqstReadingLogView.do")
    public String getCrmsRqstReadingLogView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", rqstLog.getList(map));
        model.addAttribute("count", rqstLog.getCount(map));
        model.addAttribute("column", col.getList());
        model.addAttribute("map", map);

        return "/log/crmsRqstReadingLogView";
    }

    /**
     * 차량영상반출로그 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getCrmsRqstCarLogView.do")
    public String getCrmsRqstCarLogView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", rqstLog.getList(map));
        model.addAttribute("count", rqstLog.getCount(map));
        model.addAttribute("column", col.getList());
        model.addAttribute("map", map);

        return "/log/crmsRqstCarLogView";
    }

    /**
     * 로그를 엑셀 형식으로 내보냅니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    /*@RequestMapping(value = "getLogAsExcel.do", method = RequestMethod.POST)
    public String getExcel(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        String view = null;

        if (map.get("excel").equals("Asset")){
            model.addAttribute("map", map);
            model.addAttribute("list", assetLog.getList(map));
            view = "/log/xls/xlsAsset";

        } else if (map.get("excel").equals("112")){
            model.addAttribute("map", map);
            model.addAttribute("list", if112Log.getList(map));
            view = "/log/xls/xls112";

        } else if (map.get("excel").equals("112Json")){
            model.addAttribute("map", map);
            model.addAttribute("list", if112JsonLog.getList(map));
            view = "/log/xls/xls112Json";

        } else if (map.get("excel").equals("119")){
            model.addAttribute("map", map);
            model.addAttribute("list", if119Log.getList(map));
            view = "/log/xls/xls119";

        } else if (map.get("excel").equals("Dsc")){
            model.addAttribute("map", map);
            model.addAttribute("list", ifDscLog.getList(map));
            view = "/log/xls/xlsDsc";

        } else if (map.get("excel").equals("Evt")){
            model.addAttribute("map", map);
            model.addAttribute("list", ifEvtLog.getList(map));
            view = "/log/xls/xlsEvt";

        } else if (map.get("excel").equals("Msg")){
            model.addAttribute("map", map);
            model.addAttribute("list", msgLog.getList(map));
            view = "/log/xls/xlsMsg";

        } else if (map.get("excel").equals("Access")){
            model.addAttribute("map", map);
            model.addAttribute("list", access.getList(map));
            view = "/log/xls/xlsAccess";

        }

        model.addAttribute("column", col.getList());

        return view;

    }*/

    /**
     * 로그를 엑셀 형식으로 내보냅니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "getLogAsExcel.do", method = RequestMethod.POST)
    public String getExcel(Model model, @RequestParam HashMap<String, String> map) throws Exception {
        String view = null;

        if (map.get("excel").equals("Asset")){
            model.addAttribute("map", map);
            model.addAttribute("list", assetLog.getList(map));
            view = "/log/xls/xlsAsset";

        } else if (map.get("excel").equals("Msg")){
            model.addAttribute("map", map);
            model.addAttribute("list", msgLog.getList(map));
            view = "/log/xls/xlsMsg";

        } else if (map.get("excel").equals("Access")){
            model.addAttribute("map", map);
            model.addAttribute("list", access.getList(map));
            view = "/log/xls/xlsAccess";

        } else if (map.get("excel").equals("CctvLog")){
            model.addAttribute("map", map);
            model.addAttribute("list", monCctv.getList(map));
            view = "/log/xls/xlsCctvLog";

        } else if (map.get("excel").equals("PrevCctv")){
            model.addAttribute("map", map);
            model.addAttribute("list", monPrev.getList(map));
            view = "/log/xls/xlsPrevCctv";

        } else if (map.get("excel").equals("AssetStatus")){
            model.addAttribute("map", map);
            model.addAttribute("list", statusHist.getList(map));
            view = "/log/xls/xlsAssetStatus";

        } else if (map.get("excel").equals("StillCut")){
            model.addAttribute("map", map);
            model.addAttribute("list", stillcut.getList(map));
            view = "/log/xls/xlsStillCut";

        } else if (map.get("excel").equals("EvtShare")){
            model.addAttribute("map", map);
            model.addAttribute("list", evtHistlog.getList(map));
            view = "/log/xls/xlsEvtShare";

        } else if (map.get("excel").equals("Rqst")){
            model.addAttribute("map", map);
            model.addAttribute("list", rqstLog.getList(map));
            view = "/log/xls/xlsRqst";

        } else if (map.get("excel").equals("Renew")){
            model.addAttribute("map", map);
            model.addAttribute("list", rqstRenew.getList(map));
            view = "/log/xls/xlsRenew";

        } else if (map.get("excel").equals("RenewEvi")){
            model.addAttribute("map", map);
            model.addAttribute("list", rqstRenew.getList(map));
            view = "/log/xls/xlsRenewEvi";

        } else if (map.get("excel").equals("RqstReading")){
            model.addAttribute("map", map);
            model.addAttribute("list", rqstLog.getList(map));
            view = "/log/xls/xlsRqstReading";

        } else if (map.get("excel").equals("RqstCar")){
            model.addAttribute("map", map);
            model.addAttribute("list", rqstLog.getList(map));
            view = "/log/xls/xlsRqstCar";
        } else if (map.get("excel").equals("AuthSetLog")){
            model.addAttribute("map", map);
            model.addAttribute("list", authLog.getList(map));
            view = "/log/xls/xlsAuthLogSet";
        }

        model.addAttribute("column", col.getList());

        return view;
    }

    /**
     * 112 로그 통계 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/get112LogStatView.do")
    public String get112LogStatView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("112", logStat.get112List(map));
        model.addAttribute("map", map);

        return "/log/stat/112LogStatView";
    }

    /**
     * 119 로그 통계 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/get119LogStatView.do")
    public String get119LogStatView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("119", logStat.get119List(map));
        model.addAttribute("map", map);

        return "/log/stat/119LogStatView";
    }

    /**
     * 사회적약자 로그 통계 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getDscLogStatView.do")
    public String getDscLogStatView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("dsc", logStat.getDscList(map));
        model.addAttribute("map", map);

        return "/log/stat/dscLogStatView";
    }

    /**
     * 112 긴급영상지원 로그 통계 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getEs112LogStatView.do")
    public String getEs112LogStatView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("es112", logStat.getEs112List(map));
        model.addAttribute("map", map);

        return "/log/stat/es112LogStatView";
    }

    /**
     * 로그조회 탑 메뉴 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getTopMenuView.do")
    public String getTopMenuView(Model model) throws Exception {

        return "/log/topMenuView";
    }

}
