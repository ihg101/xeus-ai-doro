package geomex.xeus.util.file;

import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.util.code.SystemParameter;
import geomex.xeus.util.code.ValidInspector;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * <pre>
 * 파일명 :  FileController.java
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
 * @since   :  2017. 7. 18.
 * @version :  1.0
 * @see
 */
@Controller
@RequestMapping("/file")
public class FileController {

    @Resource(name = "sysPropService")
    private SysPropService sysParamList;

	/**
	 * <pre>
	 * 요청한 파일을 리턴합니다.
	 * <pre>
	 *
	 * @author 이주영
	 *
	 * @param req
	 * @param session
	 * @param res
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping("/getFiles.json")
	public void getFiles(HttpServletRequest req, HttpServletResponse res, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {


	    SystemParameter sysParam = new SystemParameter(sysParamList.getList(null));
	    HashMap<String, String> paramMap = null;
	    paramMap = sysParam.getParamMap();
        String uploadPath = paramMap.get("sys.upload_path");

		String realFileName = map.get("realFileName");
		String realFile = uploadPath + "\\file\\" + realFileName;
		//String realFile = session.getServletContext().getRealPath("") + "\\file\\" + realFileName;

		BufferedOutputStream out = null;
		InputStream in = null;
		String exceptionStr = "존재하지않는  파일을 요청하였거나, 사용자(" + req.getRemoteAddr() + ")가 파라미터 공격을 시도하였음 (파일주소 : "+realFile+")";

		try {
			if(ValidInspector.isPathAttack(realFileName)){

			}else{
				res.setContentType("application/octet-stream");
				res.setHeader("Content-Disposition", "inline;filename=" + realFileName);
				File file = new File(realFile);
				if(file.exists()){
					in = new FileInputStream(file);
					out = new BufferedOutputStream(res.getOutputStream());
					int len;
					byte[] buf = new byte[1024];
					while ((len = in.read(buf)) > 0) {
						out.write(buf, 0, len);
					}
				}else{
					System.out.println(exceptionStr);
				}
			}
		} catch (Exception e) {
			System.out.println(exceptionStr);
		} finally {
			if(out != null){ out.flush(); }
			if(out != null){ out.close(); }
			if(in != null){ in.close(); }
		}

	}

}
