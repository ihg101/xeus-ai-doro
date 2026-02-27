package geomex.xeus.dashboard.web;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.bigdata.service.BigDataAnalyzeService;
import geomex.xeus.dashboard.service.BoardVo;
import geomex.xeus.equipmgr.service.InfraService;
import geomex.xeus.equipmgr.service.StatusService;
import geomex.xeus.log.service.AccessService;
import geomex.xeus.smartcity.service.EventHistService;
import geomex.xeus.stat.service.AssetStatService;
import geomex.xeus.stat.service.EvtCctvStatService;
import geomex.xeus.sysmgr.service.DashbdService;
import geomex.xeus.sysmgr.service.DashbdVo;
import geomex.xeus.tvius.service.CrmsTransRqstService;
import geomex.xeus.user.service.UserService;
import geomex.xeus.user.service.UserVo;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.ValidInspector;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;

/**
 * <pre>
 * 파일명 :  BoardController.java
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
 * @since   :  2017. 12. 7.
 * @version :  1.0
 * @see
 */
@Controller
@RequestMapping("/board")
public class BoardController {

	@Resource(name = "dashbdService")
    private DashbdService dashbd;

	@Resource(name = "crmsTransRqstService")
	private CrmsTransRqstService transRqst;

	@Resource(name = "accessService")
    private AccessService acesService;

	@Resource(name = "userService")
    private UserService userService;

	@Resource(name = "statusService")
    private StatusService status;

	@Resource(name = "infraService")
    private InfraService infra;

	@Resource(name = "eventHistService")
    private EventHistService eventHistService;

	@Resource(name = "bigDataAnalyzeService")
	private BigDataAnalyzeService bigDataAnalyzeService;

	@Resource(name = "evtCctvStatService")
	private EvtCctvStatService evtCctvStatService;

	@Resource(name = "assetStatService")
	private AssetStatService assetStatService;

	/**
	 * 메인 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/view.do")
	public String getBoardView(Model model) throws Exception {

		return "/board/map";

	}

	/**
	 * 영상반출 현황을 리턴합니다.
	 * @param model
	 * @throws Exception
	 */
	@RequestMapping("/getYearCount.json")
	public void getYearCount(Model model) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("year", DateUtil.getStrYear());

		model.addAttribute("result", transRqst.getMonthCount(map));

	}

	/**
     * 전체 통계 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping("/getTotalStatsView.do")
    public String getTotalStatsView(Model model) throws Exception {

        return "/board/totalStatsView";

    }

	/**
     * 전체 통계 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
	@RequestMapping("/getTotalStatsView.json")
    public void getTotalStatsTest(Model model, @RequestParam HashMap<String, String> map) throws Exception {

	    String boardInfo = "";

	    if(map.containsKey("userId")){
	        UserVo userVo = userService.getItem(map.get("userId"));
	        if(userVo != null) boardInfo = userVo.getBoardInfo();
	    }

	    ArrayList<BoardVo> list = new ArrayList<BoardVo>();
	    BoardVo vo = new BoardVo();

	    String today = DateUtil.getStrDay();
        String startDat = today + "000000";
        String endDat = today + "235959";
        HashMap<String, String> dateMap = new HashMap<String, String>();
        dateMap.put("startDat", startDat);
        dateMap.put("endDat", endDat);


	    if(boardInfo != null && !"".equals(boardInfo)){
	        JSONParser parser = new JSONParser(JSONParser.MODE_JSON_SIMPLE);
	        JSONArray arr = (JSONArray) parser.parse(boardInfo);


	        for (int i = 0; i < arr.size(); i++) {
	            JSONObject row = (JSONObject)arr.get(i);

	            list.add(setBoardVo(""
	                                , String.valueOf(row.get("x"))
	                                , String.valueOf(row.get("y"))
	                                , String.valueOf(row.get("width"))
	                                , String.valueOf(row.get("height"))
	                                , String.valueOf(row.get("type"))
	                                , String.valueOf(row.get("id"))
	                                , ""
	                                , ""));
	        }
	        /**
	        {"x":1,"y":2,"width":1,"height":1,"type":"text","title":"오늘 로그인 수","content":"342","id":"SignCnt","target":"signCnt"},
			{"x":3,"y":0,"width":2,"height":2,"type":"text","title":"오늘 분석된 데이터","content":"56","id":"TodayAnalysCnt","target":"todayAnalysCnt"},
			{"x":2,"y":2,"width":1,"height":1,"type":"text","title":"총 사용자","content":"567","id":"UsrCnt","target":"usrCnt"},
			{"x":0,"y":3,"width":1,"height":1,"type":"text","title":"습도","content":"70%","id":"Hum","target":"hum"},
			{"x":0,"y":2,"width":1,"height":1,"type":"text","title":"풍량","content":"1m/s","id":"Wind","target":"wind"},
			{"x":0,"y":5,"width":2,"height":1,"type":"text","title":"오늘 발생된 이벤트","content":"26","id":"TodayEventCnt","target":"todayEventCnt"},
			{"x":0,"y":0,"width":3,"height":2,"type":"chart","title":"온도","content":"","id":"GaugeChart","target":"temp"},
			{"x":1,"y":3,"width":1,"height":1,"type":"text","title":"자외선","content":"주의","id":"Uv","target":"uv"},
			{"x":5,"y":0,"width":3,"height":3,"type":"chart","title":"차트","content":"","id":"AgeBarChart","target":"ageBarChart"},
			{"x":8,"y":0,"width":4,"height":3,"type":"chart","title":"차트","content":"","id":"TimeLineChart","target":"timeBarChart"},
			{"x":0,"y":4,"width":1,"height":1,"type":"text","title":"미세먼지","content":"보통","id":"Dust","target":"dust"},
			{"x":1,"y":4,"width":1,"height":1,"type":"text","title":"초 미세먼지","content":"보통","id":"UltraDust","target":"ultraDust"},
			{"x":8,"y":3,"width":4,"height":3,"type":"chart","title":"차트","content":"","id":"EventLineChart","target":"eventChart"},
			{"x":3,"y":2,"width":2,"height":1,"type":"text","title":"오늘 반출된 영상","content":"31","id":"TodayTviusCnt","target":"todayTviusCnt"},
			{"x":5,"y":3,"width":3,"height":3,"type":"map","title":"CCTV 분포도","content":"","id":"CctvHitMap","target":"cctvHitMap"},
			{"x":2,"y":3,"width":3,"height":3,"type":"map","title":"실시간 이벤트","content":"","id":"EventMap","target":"eventMap"}
			*/
	        for (int i = list.size()-1; i >= 0; i--) {
	            vo = list.get(i);
	            String id = vo.getId();
	            if("TodayEventCnt".equals(id)){
                    ArrayList<HashMap<String, String>> todayEvtCntList = eventHistService.getStatByType(dateMap);
                    vo.setTitle("당일 이벤트 발생 수");
                    vo.setTarget("");
                    if(todayEvtCntList != null){
                        JSONArray jsonArr = new JSONArray();
                        for(int j=0; j<todayEvtCntList.size(); j++){
                            HashMap<String, String> item = todayEvtCntList.get(j);
                            JSONObject obj = new JSONObject(item);
                            jsonArr.add(obj);
                        }
                        vo.setContent(jsonArr.toJSONString());
                    } else {
                        vo.setContent("");
                    }
	            } else if("UsrCnt".equals(id)){
	                HashMap<String, String> usrMap = new HashMap<String, String>();
	                usrMap.put("discardChk","Y");
	                int usrCnt = userService.getCount(usrMap);
	                vo.setTitle("사용자 수");
	                vo.setTarget("");
	                vo.setContent(Integer.toString(usrCnt));
	            } else if("SignCnt".equals(id)){
	                int todayAcesCnt = acesService.getTodayAcesCount(dateMap);
	                vo.setTitle("오늘 로그인 수");
	                vo.setTarget("");
	                vo.setContent(Integer.toString(todayAcesCnt));
	            } else if("TodayTviusCnt".equals(id)){
	                int rqstCnt = transRqst.getCount(dateMap);
	                vo.setTitle("오늘 영상반출 수");
	                vo.setTarget("");
	                vo.setContent(Integer.toString(rqstCnt));
	            } else if("ObstacleCnt".equals(id)){
	                int trblAssetCnt = status.getCount(null);
	                vo.setTitle("장애 장비 수");
	                vo.setTarget("");
	                vo.setContent(Integer.toString(trblAssetCnt));
	            } else if("TimeLineChart".equals(id)){
	                HashMap<String, String> todayAcesByTimeMap = acesService.getTodayAcesByTime(dateMap);
                    vo.setTitle("시간대별 플랫폼 접속 현황");
                    vo.setTarget("");
                    if(todayAcesByTimeMap != null){
                        JSONObject json = new JSONObject(todayAcesByTimeMap);
                        vo.setContent(json.toJSONString());
                    } else {
                        vo.setContent("");
                    }
                }

	            list.remove(i);
                list.add(vo);
	        }
	    } else {
	        ArrayList<HashMap<String, String>> todayEvtCntList = eventHistService.getStatByType(dateMap);
	        vo = new BoardVo();
            vo = setBoardVo("당일 이벤트 발생 수", "1", "1", "3", "2", "chart", "TodayEventCnt", "yellow", "");
            if(todayEvtCntList != null){
                JSONArray jsonArr = new JSONArray();
                for(int j=0; j<todayEvtCntList.size(); j++){
                    HashMap<String, String> item = todayEvtCntList.get(j);
                    JSONObject obj = new JSONObject(item);
                    jsonArr.add(obj);
                }
                vo.setContent(jsonArr.toJSONString());
            } else {
                vo.setContent("");
            }
            list.add(vo);

	        // 사용자 수, 폐기상태 사용자도 카운트할지 생각해 봐야 함.
	        HashMap<String, String> usrMap = new HashMap<String, String>();
	        usrMap.put("discardChk","Y");
	        int usrCnt = userService.getCount(usrMap);
	        vo = new BoardVo();
	        vo = setBoardVo("사용자 수", "1", "1", "3", "2", "text", "UsrCnt", "yellow", "");
	        vo.setContent(Integer.toString(usrCnt));
	        list.add(vo);

	        // 오늘 로그인 수
	        int todayAcesCnt = acesService.getTodayAcesCount(dateMap);
	        vo = new BoardVo();
	        vo = setBoardVo("당일 로그인 수", "1", "1", "3", "2", "text", "SignCnt", "yellow", "");
	        vo.setContent(Integer.toString(todayAcesCnt));
	        list.add(vo);

	        // 오늘 문제차량 발생 수, 추후 추가
	        // 오늘 영상반출 수
	        int rqstCnt = transRqst.getCount(dateMap);
	        vo = new BoardVo();
	        vo = setBoardVo("당일 영상반출 수", "1", "1", "3", "2", "text", "TodayTviusCnt", "yellow", "");
	        vo.setContent(Integer.toString(rqstCnt));
	        list.add(vo);

	        // 전체 장비 수
	        //CCTV, NMS
	        // 장애 장비 수, 정상이 아닌 장비만( <> '11'), stateCd 파라미터가 없으면 알아서 처리함.
	        int trblAssetCnt = status.getCount(null);
	        vo = new BoardVo();
	        vo = setBoardVo("장애 장비 수", "1", "1", "3", "2", "text", "trblAssetCnt", "yellow", "");
	        vo.setContent(Integer.toString(trblAssetCnt));
	        list.add(vo);

	        //당일 시간대별 플랫폼 접속 현황
	        HashMap<String, String> todayAcesByTimeMap = acesService.getTodayAcesByTime(dateMap);
            vo = new BoardVo();
            vo = setBoardVo("시간대별 플랫폼 접속 현황", "1", "1", "3", "2", "chart", "TimeLineChart", "yellow", "");
            if(todayAcesByTimeMap != null){
                JSONObject json = new JSONObject(todayAcesByTimeMap);
                vo.setContent(json.toJSONString());
            } else {
                vo.setContent("");
            }
            list.add(vo);
	    }

	    model.addAttribute("result", list);

    }

    /**
     * 이벤트 통계 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping("/getEventStatsView.do")
    public String getEventStatsView(Model model) throws Exception {

        return "/board/eventStatsView";

    }

    /**
     * 레이어 통계 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping("/getLayerStatsView.do")
    public String getLayerStatsView(Model model) throws Exception {

        return "/board/layerStatsView";

    }

    public BoardVo setBoardVo(String title, String x, String y, String width, String height, String type, String id, String color, String target){

        BoardVo vo = new BoardVo();

        /*String content = "";
        content += "{";
        content += "    \"chart\": {";
        content += "        \"type\": typeParam";//line, column
        content += "    },";
        content += "    \"title\": {";
        content += "        \"text\": titleParam";//'시간대별 앱 실행 현황'
        content += "    },";
        content += "    \"subtitle: {\"";
        content += "        \"text\": subtitleParam";//' '
        content += "    },";
        content += "    \"credits\": {";
        content += "        \"enabled\": \"false\"";
        content += "    },";
        content += "    \"tooltip\": {";
        content += "        \"pointFormat\": \"<b>{point.y}명</b>\"";
        content += "    },";
        content += "    \"xAxis\": {";
        content += "        \"categories\": xAxisParam},";//['00시', '01시', '02시']
        content += "    \"yAxis\": {";
        content += "        \"title\": {";
        content += "            \"enabled\": \"false\"";
        content += "        }";
        content += "    },";
        content += "    \"plotOptions\": {";
        content += "        \"line\": {";
        content += "            \"dataLabels\": {";
        content += "                \"enabled\": \"false\"";
        content += "            },";
        content += "            \"enableMouseTracking\": \"true\"";
        content += "        }";
        content += "    },";
        content += "    \"series\": seriesParam";//data
        content += "}";*/

        //content = content.replace("typeParam", "\"line\"");

        vo.setTitle(title);
        vo.setX(x);
        vo.setY(y);
        vo.setWidth(width);
        vo.setHeight(height);
        vo.setType(type);//type
        vo.setId(id);//id
        vo.setColor(color);//색상
        vo.setTarget(target);
        /*if("chart".equals(type))
        vo.setContent(content.replace("titleParam", "\""+title+"\""));*/

        return vo;
    }

	/**
	 * 대시보드목록을 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getDashbdList.json")
	public void getTotalStatsView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", dashbd.getList(map));

	}

	/**
	 * 대시보드목록을 수정합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/editDashbdList.json")
	public void editDashbdList(Model model, @ModelAttribute @Valid DashbdVo vo, BindingResult br) throws Exception {

		vo.setMdfyDat(DateUtil.getStrSec());

		String[] ignoreField = {""};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
        	model.addAttribute("result", dashbd.edit(vo));
        }else{
            model.addAttribute("error", msg);
        }
	}

	/**
	 * 대시보드목록을 추가합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/addDashbdList.json")
	public void addDashbdList(Model model, HttpSession session, @ModelAttribute @Valid DashbdVo vo, BindingResult br) throws Exception {

		vo.setMdfyDat(DateUtil.getStrSec());
		vo.setUserId((String)session.getAttribute("userId"));

		String[] ignoreField = {""};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
        	model.addAttribute("result", dashbd.add(vo));
        }else{
            model.addAttribute("error", msg);
        }
	}

	/**
	 * 대시보드목록을 삭제합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/delDashbdList.json")
	public void delDashbdList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", dashbd.del(map));
	}

	/**
	 * 오늘 로그인 수를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getAccessCnt.json")
	public void getAccessCnt(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", acesService.getCount(map));
	}

	/**
	 * 오늘 반출된 영상 수를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getRqstCnt.json")
	public void getRqstCnt(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", transRqst.getCount(map));
	}

	/**
	 * 총 사용자 수를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getAllUserCnt.json")
	public void getAllUserCnt(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", userService.getCount(map));
	}

	/**
	 * 오늘 발생된 이벤트 수를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getEvtCnt.json")
	public void getEvtCnt(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", eventHistService.getCount(map));
	}

	/**
	 * 오늘 분석된 데이터 수를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getAnalyCnt.json")
	public void getAnalyCnt(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", bigDataAnalyzeService.getCount(map));
	}

	/**
	 * 네트워크장비 가동률을 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getNetwkOperatingRate.json")
	public void getNetwkOperatingRate(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("count", infra.getCount(map));
		model.addAttribute("rate", dashbd.getNetwkOperatingRate(map));
	}

	/**
	 * 네트워크장비 가동률을 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getEquipCnt.json")
	public void getEquipCnt(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", dashbd.getEquipCnt(map));
	}

	/**
	 * 연령대별 현황 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getAgeStat.json")
	public void getAgeStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", userService.getAgeStat(map));
	}

	/**
	 * 시간대별 접속 현황을 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getTodayAcesByTime.json")
	public void getTodayAcesByTime(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", acesService.getTodayAcesByTime(map));
	}

	/**
	 * 시간대별 CCTV 조회 현황을 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getTodayCctvByTime.json")
	public void getTodayCctvByTime(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", evtCctvStatService.getTodayCctvByTime(map));
	}

}
