package geomex.xeus.event112.web;

import java.beans.PropertyEditorSupport;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import geomex.xeus.event112.service.CctvPreviewDocService;
import geomex.xeus.event112.service.CctvPreviewDocVo;
import geomex.xeus.event112.service.CctvPreviewService;
import geomex.xeus.event112.service.CctvPreviewVo;
import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.sysmgr.web.ColumnInfoController;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.SystemParameter;
import geomex.xeus.util.code.ValidInspector;

@Controller
@RequestMapping("/cctvPreviewDoc")
public class CctvPreviewDocController {

	@Resource(name = "sysPropService")
    private SysPropService param;

	@Resource
	CctvPreviewService preivew;

	@Resource
	CctvPreviewDocService doc;

	@Resource
	private ColumnInfoController col;

	@Resource
	private Validator validator;

	@InitBinder
	private void initBinder(WebDataBinder binder){
		binder.setValidator(this.validator);
		binder.registerCustomEditor(MultipartFile.class, new PropertyEditorSupport() {
			@Override
			public void setAsText(String text) {
				setValue(null);
			}
		});
	}

	/**
     * 선영상 재생목록 뷰를 리턴합니다.
     *
	 * @param model
	 * @param session
	 * @return view
	 * @throws Exception
	 */
    @RequestMapping(value = "/getView.do")
    public String getView(HttpSession session, Model model) throws Exception {

    	return "/previewDoc/docSendView";

	}

    /**
     * 공문 정보 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getDocView.do")
    public String getDocView(HttpSession session, Model model) throws Exception {

    	return "/previewDoc/docListView";

    }

    /**
     * 공문 갯수를 조회합니다.
     *
     * @return json
     * @throws Exception
     */
    @RequestMapping(value = "/getCount.json", method = RequestMethod.POST)
    public void getCount(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("count", doc.getCount(map));

    }

    /**
	 * 공문 정보 리스트를 가져옵니다.
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

		model.addAttribute("result", doc.getList(map));
		model.addAttribute("count", doc.getCount(map));

	}

	/**
	 * 특정 공문 데이터를 가져옵니다.
	 *
	 * @param req
	 * @param res
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getItem.json", method = RequestMethod.POST)
	public void getItem(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", doc.getItem(map));

	}

	/**
	 * 공문을 삭제합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/del.json", method = RequestMethod.POST)
	public void del(Model model, HttpSession session, @RequestParam(required=true) HashMap<String, String> map) throws Exception {

		model.addAttribute("result", doc.del(map));

	}

	/**
	 * Preview 공문을 추가합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/add.json", method = RequestMethod.POST)
	public void add(Model model, HttpSession session, @ModelAttribute @Valid CctvPreviewDocVo vo, BindingResult br) throws Exception {

		String[] ignoreField = {""};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			/*SystemParameter sysParam = new SystemParameter(param.getList(null));
		    HashMap<String, String> map = null;
	        map = sysParam.getParamMap();

	        String uploadPath = map.get("sys.upload_path");
		    String subDir = "previewDoc";

			MultipartFile file = vo.getFile();
			if(file != null){
				if(ValidInspector.isPathAttack(file.getOriginalFilename())){
					model.addAttribute("error", "올바른 파일 이름이 아닙니다.\n특수문자를 제거해 주세요.");
					return;
				}else if(file.getOriginalFilename().length() > 30){
					model.addAttribute("error", "파일명은 30자 미만으로 업로드 할 수 있습니다.");
					return;
				}else{

					String fileNm = file.getOriginalFilename();
					String tempNm = DateUtil.getStrMilSec() + "_" + fileNm;
					//String fullPath = "D:\\Upload\\notice\\" + tempNm;
					String fullPath = uploadPath + subDir + "\\" + tempNm;

					File chkDir = new File(uploadPath + subDir);
                    if(!chkDir.isDirectory()){
                        try{ chkDir.mkdirs(); } catch (Exception e){}
                    }

					vo.setFileNm(fileNm);
					vo.setFilePath(fullPath);
					vo.setRegDat(DateUtil.getStrSec());

					File realFile = new File(fullPath);
					file.transferTo(realFile);

					vo.setRegUserId((String) session.getAttribute("userId"));

					model.addAttribute("cctvPreviewDocVo", null);
					model.addAttribute("result", doc.add(vo));
				}
			}else{
				model.addAttribute("error", "공문 첨부는 필수사항입니다.");
			}*/

			SystemParameter sysParam = new SystemParameter(param.getList(null));
		    HashMap<String, String> map = null;
	        map = sysParam.getParamMap();

	        String uploadPath = map.get("sys.upload_path");
		    String subDir = "rqst";

			String fullPath = uploadPath + subDir + "\\" + vo.getFilePath();

			vo.setFilePath(fullPath);
			vo.setRegDat(DateUtil.getStrSec());
			vo.setRegUserId((String) session.getAttribute("userId"));

			model.addAttribute("cctvPreviewDocVo", null);
			model.addAttribute("result", doc.add(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * Preview 공문을 수정합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/edit.json", method = RequestMethod.POST)
	public void edit(Model model, HttpSession session, @ModelAttribute @Valid CctvPreviewDocVo vo, BindingResult br) throws Exception {

		String[] ignoreField = {""};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("mgrSeq", vo.getMgrSeq());
			map.put("recvUserId", vo.getRecvUserId());
			map.put("regDat", vo.getRegDat());

			if(doc.edit(vo)){
				model.addAttribute("result", true);
				model.addAttribute("item", doc.getItem(map));
				model.addAttribute("cctvPreviewDocVo", null);
			}
		}else{
			model.addAttribute("error", msg);
		}

	}

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

	    CctvPreviewDocVo vo = doc.getItem(map);

		BufferedOutputStream out = null;
		InputStream in = null;
		String exceptionStr = "존재하지않는 파일을 요청하였거나, 사용자(" + req.getRemoteAddr() + ")가 파라미터 공격을 시도하였음 (파일주소 : " + vo.getFilePath() + ")";

		try {
			res.setContentType("application/octet-stream");
			res.setHeader("Content-Disposition", "inline;filename=" + vo.getFileNm());

			File file = new File(vo.getFilePath());
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
		} catch (Exception e) {
			System.out.println(exceptionStr);
		} finally {
			if(out != null){ out.flush(); }
			if(out != null){ out.close(); }
			if(in != null){ in.close(); }
		}

	}


	/**
	 * Preview 공문 전송 여부를 수정합니다.
	 *
	 * @param model
	 * @param param
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/editDocSendYn.json", method = RequestMethod.POST)
	public void editDocSendYn(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		if(map.get("mgrSeq") != null && !"".equals(map.get("mgrSeq"))){
			/*String[] vals = map.get("mgrSeq").split(",");

			CctvPreviewVo vo = new CctvPreviewVo();
			ArrayList<String> mgrSeqList = new ArrayList<String>();
			for(int i=0; i<vals.length; i++){
				//vals[i] = "'" + vals[i] + "'";
				mgrSeqList.add(vals[i]);
			}

			map.put("mgrSeq", Arrays.toString(vals).replace("[", "").replace("]", ""));*/

			HashMap<String, List<String>> param = null;
			List<String> list = new ArrayList<String>();

			param = new HashMap<String, List<String>>();
			String[] arr = map.get("mgrSeq").split(",");
			for (int i = 0; i < arr.length; i++) {
				list.add(arr[i]);
			}
			param.put("mgrSeqList", list);

			model.addAttribute("result", preivew.editDocSendYn(param));
		}


	}

}
