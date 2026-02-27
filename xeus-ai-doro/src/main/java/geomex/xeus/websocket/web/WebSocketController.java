package geomex.xeus.websocket.web;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.RandomStringUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.openxmlformats.schemas.spreadsheetml.x2006.main.STSourceType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.itextpdf.text.log.SysoCounter;

import geomex.xeus.eocs.service.EocsService;
import geomex.xeus.eocs.service.EocsVO;
import geomex.xeus.equipmgr.service.CctvService;
import geomex.xeus.equipmgr.service.CctvVo;
import geomex.xeus.smartcity.Utils;
import geomex.xeus.smartcity.service.EventHistService;
import geomex.xeus.smartcity.service.EventHistVo;
import geomex.xeus.smartcity.service.EventService;
import geomex.xeus.smartcity.service.EventWebSocketService;
import geomex.xeus.smartcity.service.SessionWebSocketService;
import geomex.xeus.smartcity.service.TviusWebSocketService;
import geomex.xeus.system.annotation.NoSession;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.StrUtil;
import geomex.xeus.websocket.service.EventShareService;
import geomex.xeus.websocket.service.EventShareVo;

@Controller
@RequestMapping("/ws")
public class WebSocketController {

	@Resource(name = "eventService")
	private EventService event;

	@Resource(name = "eventHistService")
	private EventHistService hist;

	@Resource(name = "eventShareService")
	private EventShareService share;

	@Resource(name = "eventWebSocketService")
	private EventWebSocketService socket;

	@Resource(name = "sessionWebSocketService")
	private SessionWebSocketService sessionSocket;

	@Resource(name = "tviusWebSocketService")
	private TviusWebSocketService tviusSocket;
	
   @Resource(name = "CctvService")
    private CctvService cctvService;

   	@Resource(name = "eocsService")
   	private EocsService eocsService;
	
   	private ArrayList<EventShareVo> shareList;

	@PostConstruct
	private void init() throws Exception{

		//shareList = share.getList(null);

	}

	/**
	 * 이벤트를 관리(추가, 수정, 삭제)합니다.
	 *
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = {"/addEvent.json"})
	public void addEventJson(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> map, @RequestBody(required = false) String bodyJson) throws Exception {
	
	    EventHistVo vo = null;

		boolean isQueryString = false;
		boolean parseSuccess = false;
		boolean isBody = false;
		if(req.getHeader("Content-Type") != null && !"".equals(req.getHeader("Content-Type"))){
			isBody = req.getHeader("Content-Type").contains("application/json");
		}

		if(!isBody && map.containsKey("json")){
			try {
				vo = Utils.parseVo(map.get("json"));
				isQueryString = true;
				parseSuccess = true;
			} catch (Exception e) {
				isQueryString = false;
			}
		}

		if(isBody && bodyJson != null && !"".equals(bodyJson)){
			try {
				vo = Utils.parseVo(bodyJson);
				isQueryString = false;
				parseSuccess = true;
			} catch (Exception e) {
				isQueryString = true;
			}
		}

		if(!parseSuccess){
			try {
				vo = Utils.parseVo(bodyJson);
				isQueryString = false;
				parseSuccess = true;
			} catch (Exception e) {
				isQueryString = true;
			}
		}

		if(!parseSuccess){

			model.addAttribute("error", "Invalid Interface.");

		}else{

		    boolean isStart = true;
			
			/**
			 * 241031 이벤트 과부하 문제로 인하여 굴삭기 이벤트만 수신
			 * 2025.09.15 원우빈 추가 (태백)
			 * 006 - 블랙아이스
			 * 007 - 수막현상
			 * 008 - 싱크홀 
			 */
		    if ( !"004".equals(vo.getEvtTypCd())
                && !"006".equals(vo.getEvtTypCd())
                && !"007".equals(vo.getEvtTypCd())
                && !"002".equals(vo.getEvtTypCd())){
		        return;
		    }
			
			try {
				
				if ( "004".equals(vo.getEvtTypCd()) ){
					EocsVO eocsVo = null;
					
					try {
						eocsVo = eocsService.containsGis(vo.getOutbPosx(), vo.getOutbPosy());		
					} catch ( Exception ee) {}
					
					if ( eocsVo != null ) {
						return;
					}
					
				    //JSONParser parser = new JSONParser();
		    		//JSONObject jo = (JSONObject) parser.parse(vo.getEvtJson());
		    		//String contentString =eocsVo.getDist()+";;"+eocsVo.getStartLon() + ";;" + eocsVo.getStartLat();
		    		//jo.put("info", contentString);
		    		//vo.setEvtJson(jo.toJSONString());
				}
				
				HashMap<String, String> uSvcOutbId = new HashMap<String, String>();
				uSvcOutbId.put("uSvcOutbId", vo.getUsvcOutbId());
				ArrayList<EventHistVo> list = event.getList(uSvcOutbId);
				/* 이벤트 시작 */
				if(isStart){
					if(list.size() == 0){
						event.add(vo);
					}else{
						//소방 Key 겹칠경우 수정처리
						event.edit(vo);
					}
				}else{
					/* 수정이지만 신규이벤트일 경우 */
					if(list.size() == 0){
						if("40".equals(vo.getEvtProcCd())){
							vo.setEvtProcCd("10");
						}
						event.add(vo);
					}else{
						/* 이벤트 수정 */
						if("40".equals(vo.getEvtProcCd())){
							event.edit(vo);
							/* 이벤트 삭제 */
						}else{
							vo.setEvtActnUsrid((String) session.getAttribute("userId"));
							if("50".equals(vo.getEvtProcCd())) vo.setEvtClrDtm(DateUtil.getStrSec());
							if("90".equals(vo.getEvtProcCd())) vo.setEvtActnDtm(DateUtil.getStrSec());
							if("91".equals(vo.getEvtProcCd())) vo.setEvtActnDtm(DateUtil.getStrSec());

							event.del(uSvcOutbId);

							if(hist.getItem(uSvcOutbId) == null){
								hist.add(vo);
							}else{
								hist.edit(vo);
							}
						}
					}
				}
				
	            /**
                 * 2025.09.10 원우빈
                 * 굴삭기, 낙하물(2026.01.05 추가) 이벤트일 경우, 이벤트가 각 row의 반경안에 포함되있으면 
                 * 저장은 하지만, broadcast 안함.
                 * 같은 타입끼리만 비교 (002는 002끼리, 004는 004끼리)
                 **/
                if("004".equals(vo.getEvtTypCd()) || "002".equals(vo.getEvtTypCd())){
                    HashMap<String, String> asd = new HashMap<String,String>();
                    asd.put("lon",vo.getOutbPosx());
                    asd.put("lat",vo.getOutbPosy());
                    asd.put("usvcOutbId", vo.getUsvcOutbId());
                    asd.put("evtTypCd", vo.getEvtTypCd());
                    
                    int containResult = event.checkContain(asd).size();
                    
                    if(containResult == 0) {
                        String eventJson = Utils.setJson(vo);
                        socket.broadcast(eventJson);
                        
                      /*  if(shareList != null){
                            if(shareList.size() > 0){
                                for(int i=0; i<shareList.size(); i++){
                                    EventShareVo shareVo = shareList.get(i);
                                    if(shareVo.getEvtTypCd().equals(vo.getEvtTypCd())){
                                        shareVo.setJson(eventJson);
                                        
                                        if(isQueryString){
                                            this.sendEvent(shareVo, eventJson);
                                        }else{
                                            this.sendEventBody(shareVo, eventJson);
                                        }
                                    }
                                }
                            }
                        }*/
                    }  else {
                        //2025.10.15 원우빈 아래 두줄  log 테스트 용도임 지워야 됨
                        //String eventJson = Utils.setJson(vo);
                        //socket.broadcast(eventJson);
                        model.addAttribute("containResult", "해당 이벤트가 반경에 포함되어 있습니다.");
                    }
                } else {
                    String eventJson = Utils.setJson(vo);
                    socket.broadcast(eventJson);
                }
                
                model.addAttribute("result", true);
                model.addAttribute("uSvcOutbId", vo.getUsvcOutbId());
                model.addAttribute("statEvetNm", vo.getEvtNm());
                
            } catch (Exception e) {
                System.out.println(vo.toString());
                e.printStackTrace();
                model.addAttribute("error", "이벤트 저장중 문제가 발생하였습니다.");
                model.addAttribute("result", false);
            }

        }
    }

	/**
	 * 이벤트를 POST (Query String) 방식으로 전송합니다.
	 *
	 * @param vo
	 * @param json
	 * @throws Exception
	 */
	private void sendEvent(EventShareVo vo, String json) throws Exception{
		BufferedReader in = null;

    	try {
    		URL url = new URL(vo.getShareUrl());

    		StringBuilder postData = new StringBuilder();
    		postData.append(URLEncoder.encode("json", "UTF-8"));
    		postData.append('=');
    		postData.append(URLEncoder.encode(String.valueOf(json), "UTF-8"));

    		byte[] postDataBytes = postData.toString().getBytes("UTF-8");

    		HttpURLConnection conn = (HttpURLConnection)url.openConnection();
    		conn.setRequestMethod("POST");
    		conn.setDoOutput(true);
    		conn.getOutputStream().write(postDataBytes); // POST 호출

    		in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

    		StringBuilder sb = new StringBuilder();
    		String line;
    		while((line = in.readLine()) != null) {
    			sb.append(line);
    		}

    		vo.setSuccess("Y");
    		vo.setResVal(sb.toString());

    	} catch (Exception e) {
    		vo.setSuccess("N");
    		e.printStackTrace();
		} finally {
			share.add(vo);
			if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
		}
	}

	/**
	 * 이벤트를 POST (Request Body) 방식으로 전송합니다.
	 *
	 * @param vo
	 * @param json
	 * @throws Exception
	 */
	private void sendEventBody(EventShareVo vo, String json) throws Exception{
		BufferedReader in = null;

		try {
			URL url = new URL(vo.getShareUrl());

			HttpURLConnection conn = (HttpURLConnection)url.openConnection();
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Content-Type", "application/json");
			conn.setDoOutput(true);
			conn.getOutputStream().write(json.toString().getBytes("UTF-8")); // POST 호출

			in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

			StringBuilder sb = new StringBuilder();
			String line;
			while((line = in.readLine()) != null) {
				sb.append(line);
			}

			vo.setSuccess("Y");
			vo.setResVal(sb.toString());

		} catch (Exception e) {
			vo.setSuccess("N");
			e.printStackTrace();
		} finally {
			share.add(vo);
			if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
		}
	}

	/**
	 * 공지사항을 전달합니다.
	 *
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = {"/addAdminNotice.json"})
	public void addAdminNotice(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		try {
			sessionSocket.broadcast(map.get("json"));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 공유목록을 갱신합니다.
	 *
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = {"/updateShareList.json"})
	public void updateShareList(Model model) throws Exception {

		shareList = share.getList(null);

		model.addAttribute("shareList", shareList);

	}

	/**
     * CCTV Lock 상태를 전파합니다.
     *
     * @throws Exception
     */
	@Deprecated
    @RequestMapping(value = {"/lockOn.json", "/lockOff.json"})
    public void setLock(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

    	HashMap<String, String> param = new HashMap<String, String>();
    	param.put("statEvetTypCd", 		map.get("statEvetTypCd"));
    	param.put("statMsgTypCd", 		map.get("statMsgTypCd"));
    	param.put("outbPosNm", 			map.get("outbPosNm"));
    	param.put("statEvetNm", 		map.get("statEvetNm"));
    	param.put("statEvetClrDtm", 	map.get("statEvetClrDtm"));
    	param.put("statEvetCntn", 		map.get("statEvetCntn"));
    	param.put("statEvetType", 		map.get("statEvetType"));
    	param.put("outbPos", 			map.get("outbPos"));
    	param.put("x", 					map.get("x"));
    	param.put("y", 					map.get("y"));
    	param.put("statEvetOutbDtm", 	map.get("statEvetOutbDtm"));
    	param.put("statEvetActnCntn",	map.get("statEvetActnCntn"));
    	param.put("procSt", 			map.get("procSt"));
    	param.put("isTest", 			map.get("isTest"));
    	param.put("uSvcOutbId", 		map.get("uSvcOutbId"));
    	param.put("statEvetActnMn", 	map.get("statEvetActnMn"));
    	param.put("statEvetActnDtm", 	map.get("statEvetActnDtm"));
    	param.put("statEvetSvcTyp", 	map.get("statEvetSvcTyp"));
    	param.put("etcCntn", 			map.get("etcCntn"));

    	param.put("tmx", 				map.get("tmx"));
    	param.put("tmy", 				map.get("tmy"));

    	for(String key : param.keySet()){
    		param.replace(key, StrUtil.chkNull(param.get(key)));
    		if("uSvcOutbId".equals(key)){
    			if("".equals(param.get("uSvcOutbId"))){
    				param.replace("uSvcOutbId", RandomStringUtils.randomAlphanumeric(15));
    			}
    		}
    	}

    	EventHistVo vo = Utils.parseVo(Utils.setJson(param));

		String[] full_url = req.getRequestURI().split("/");
    	String url = full_url[full_url.length - 1];

    	if("lockOn.json".equals(url)){
    		event.add(vo);
    	}else if("lockOff.json".equals(url)){
    		event.del(param);
    		try {
    			hist.add(vo);
			} catch (Exception e) {

			}
    		//if(hist.getItem(param) == null) hist.add(vo);
    	}

    	socket.broadcast(Utils.setJson(param));
		model.addAttribute("result", true);
		model.addAttribute("uSvcOutbId", param.get("uSvcOutbId"));
		model.addAttribute("statEvetNm", param.get("statEvetNm"));
    }


	/**
	 * 실시간 반출 신청을 전달합니다
	 *
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = {"/noticeCrmsTransRqstToTviusMng.json"})
	public void noticeCrmsTransRqstToTviusMng(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		try {
			tviusSocket.broadcast(map.get("json"));
			model.addAttribute("result", true);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@NoSession
    @RequestMapping(value = "/getCctvList.json")
    public   ArrayList<CctvVo> getCctvList(@RequestParam ("vmsMgrNo") String vmsMgrNo) throws Exception {
        
        ArrayList<CctvVo> list = new ArrayList<>();
        HashMap<String, String> map = new HashMap<String, String>();
        
        map.put("vmsMgrNo", vmsMgrNo);
        
        list = cctvService.getSpecificList(map);
        
        return list;

    }

}
