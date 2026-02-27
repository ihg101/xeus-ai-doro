package geomex.xeus.websocket.web;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import geomex.xeus.equipmgr.service.CctvService;
import geomex.xeus.equipmgr.service.VmsService;
import geomex.xeus.equipmgr.service.VmsVo;
import geomex.xeus.smartcity.service.EventHistService;
import geomex.xeus.smartcity.service.EventService;
import geomex.xeus.smartcity.service.EventWebSocketService;
import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.sysmgr.web.CodeCtrl;
import geomex.xeus.util.code.SystemParameter;

@Controller("xeusGateSocketController")
@RequestMapping("/xgc")
public class XeusGateSocketController {

	@Resource(name = "vmsService")
    private VmsService vs;

	@Resource(name = "sysPropService")
    private SysPropService param;

	@Resource(name = "codeCtrl")
	private CodeCtrl code;

	@Resource(name = "eventService")
	private EventService event;

	@Resource(name = "eventHistService")
	private EventHistService hist;

	@Resource(name = "eventWebSocketService")
	private EventWebSocketService socket;

	@Resource(name = "CctvService")
	private CctvService cctv;

    private String xeusEventChk = null;
    private String xeusEventGateUrl = null;
    private String xeusEventPlatformUrl = null;
    private String xeusEventFullUrl = null;

    private String vms_mgr_no = "";

	//@PostConstruct
	private void init() throws Exception{

		HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

		this.xeusEventChk = sysMap.get("xeus.event.chk");
		this.xeusEventGateUrl = sysMap.get("xeus.event.gate.url");
		this.xeusEventPlatformUrl = sysMap.get("xeus.event.platform.url");
		this.xeusEventFullUrl = sysMap.get("xeus.event.full.url");

		HashMap<String, String> vmsMap = new HashMap<String, String>();
		vmsMap.put("vmsTyp", "VURIX");
		VmsVo vmsVo = vs.getItem(vmsMap);

		vms_mgr_no = vmsVo.getMgrNo();

		if(xeusEventChk == null) xeusEventChk = "Y";
		if(xeusEventGateUrl == null) xeusEventGateUrl = "http://10.1.73.58:8080/xeus-gate/vurix/receiveEvent.json";
		if(xeusEventPlatformUrl == null) xeusEventPlatformUrl = "http://10.1.73.58:8080/xeus-gate/vurix/receiveEvent.json";

		String rqstEventUrl = xeusEventPlatformUrl+"?url=http://127.0.0.1:8080/xeus/xgc/receiveEvent.json?vmsMgrNo=" + vms_mgr_no;

		if(xeusEventChk.equals("Y")){
        	System.out.println(doRqstUrl(rqstEventUrl));
    	}
	}

	/**
	 * XEUS-GATE로 부터 이벤트를 수신받습니다.
	 *
	 * @param model
	 * @param session
	 * @param json
	 * @throws Exception
	 */
	@RequestMapping(value = {"/receiveEvent.json"})
	public void receiveEvent(Model model, HttpSession session, @RequestBody String json) throws Exception {

		socket.broadcast(json);

	}

	/**
	 * 해당 URL로 GET방식으로 요청을 보내고, 결과를 리턴합니다.
	 *
	 * @param rqstUrl
	 * @return
	 */
	public String doRqstUrl(String rqstUrl) {
		BufferedReader in = null;
        StringBuilder sb = new StringBuilder();
		try{
			URL obj = new URL(rqstUrl);

		    HttpURLConnection con = (HttpURLConnection)obj.openConnection();
		    con.setConnectTimeout(1000);
		    con.setRequestMethod("GET");
		    in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));

		    sb.setLength(0);
		    String line;
		    while((line = in.readLine()) != null) {
		        sb.append(line);
		    }

		}  catch(Exception e) {
			e.printStackTrace();
		} finally {
		    if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
		}

		return sb.toString();
	}

}
