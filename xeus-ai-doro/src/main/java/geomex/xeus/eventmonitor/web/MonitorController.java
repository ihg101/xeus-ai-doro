package geomex.xeus.eventmonitor.web;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.ui.Model;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.equipmgr.service.CctvService;
import geomex.xeus.eventmonitor.service.UserTraceService;
import geomex.xeus.sysmgr.service.AuthService;
import geomex.xeus.sysmgr.service.ImageService;
import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.sysmgr.web.CodeCtrl;
import geomex.xeus.sysmgr.web.ColumnInfoController;
import geomex.xeus.tvius.util.FtpClient;
import geomex.xeus.user.service.UserService;
import geomex.xeus.util.code.SystemParameter;
import geomex.xeus.util.code.ValidInspector;

/**
 * <pre>
 * 파일명 :  MonitorController.java
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
 * @since   :  2017. 8. 25.
 * @version :  1.0
 * @see
 */
@Controller
@RequestMapping("/monitor")
public class MonitorController {

	@Resource(name = "userTraceService")
    private UserTraceService user;

	@Resource(name = "CctvService")
	private CctvService cctv;

	@Resource(name = "imageService")
	private ImageService image;

	@Resource(name = "userService")
	private UserService userService;

	@Resource(name = "authService")
	private AuthService authService;

	@Resource(name = "codeCtrl")
	private CodeCtrl code;

	@Resource
	private ColumnInfoController col;

	@Resource(name = "sysPropService")
    private SysPropService param;

	@Resource(name = "txManager")
    PlatformTransactionManager transactionManager;

	@Resource
	private Validator validator;

	@InitBinder
	private void initBinder(WebDataBinder binder){
		binder.setValidator(this.validator);
	}

	/* 모니터링 현황 */
    @RequestMapping(value = "/getMonitoringView.do")
    public String getMonitoringView(Model model) throws Exception {

    	model.addAttribute("cctv", cctv.getList(null));
    	model.addAttribute("user", userService.getList(null));
    	model.addAttribute("auth", authService.getAuthGrpList(null));

    	return "/eventMonitor/monitoringView";

    }

    /* FTP 이미지를 찾아 리턴합니다. */
    @RequestMapping(value = "/getFtpCarImg.do")
    public void getCarImg(Model model, HttpServletResponse res, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

    	/*{
		   "time":"20181010120000",
		   "cctvId":"1234567890",
		   "filenm":"V092-20181010-120000.jpg",
		   "driveid":"d",
		   "type":"체납",
		   "carnum":"26머3381",
		   "ftpPath":"d/V092/VMS/out/20181010/12/V092-20181010-120000.jpg",
		   "ftpIp":"10.1.73.58",
		   "ftpPort":"21",
		   "ftpUser":"geomex",
		   "ftpPwd":"password"
		}*/

    	// http://127.0.0.1:8080/xeus/monitor/getFtpCarImg.do?ftpIp=10.1.73.12&ftpPort=14147&ftpUser=test&ftpPwd=test&ftpPath=/test/test.txt&filenm=test.txt

    	String ftpIp = map.get("ftpIp");
    	String ftpPort = map.get("ftpPort");
    	String ftpUser = map.get("ftpUser");
    	String ftpPwd = map.get("ftpPwd");
    	/*String ftpPath = map.get("ftpPath");
    	String fileNm = map.get("filenm");*/
    	String ftpPath = URLEncoder.encode(map.get("ftpPath"), "UTF-8");
    	String fileNm = URLEncoder.encode(map.get("filenm"), "UTF-8");

    	FtpClient ftp = new FtpClient(ftpIp, Integer.parseInt(ftpPort), ftpUser, ftpPwd, "");
    	try {
			SystemParameter sysParam = new SystemParameter(param.getList(null));

			HashMap<String, String> folderMap = null;
			folderMap = sysParam.getParamMap();

			String carPath = folderMap.get("sys.download_path") + "car/";
			String fullPath = carPath + fileNm;

			File chkDir = new File(carPath);
			if(!chkDir.isDirectory()){
				try{ chkDir.mkdirs(); } catch (Exception e){}
			}

			BufferedOutputStream out = null;
			InputStream in = null;

			try {

				ftp.download(ftpPath, carPath, fileNm);

				File file = new File(fullPath);
				/*if(!file.exists()){
					if(!ftp.download(ftpPath, carPath, fileNm)){
						model.addAttribute("error", "FTP 서버에서 이미지를 가져올 수 없습니다.");
					}
				}*/

				if(file.exists()){
					res.setContentType("image/" + ValidInspector.getExtension(fileNm, false));
					res.setHeader("Content-Disposition", "inline;filename=" + fileNm);

					in = new FileInputStream(file);
					out = new BufferedOutputStream(res.getOutputStream());
					int len;
					byte[] buf = new byte[1024];
					while ((len = in.read(buf)) > 0) {
						out.write(buf, 0, len);
					}
				}
			} catch (Exception e) {
				model.addAttribute("error", "파일이 존재하지 않습니다.");
				e.printStackTrace();
			} finally {
				if(out != null){ out.flush(); }
				if(out != null){ out.close(); }
				if(in != null){ in.close(); }
			}
		} catch (Exception e) {
			model.addAttribute("error", "FTP 서버에서 이미지를 가져올 수 없습니다.");
			e.printStackTrace();
		}

    }
}
