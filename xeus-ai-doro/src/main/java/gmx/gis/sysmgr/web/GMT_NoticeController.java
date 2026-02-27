package gmx.gis.sysmgr.web;

import gmx.gis.sysmgr.service.GMT_SysPropService;
import gmx.gis.sysmgr.service.GMT_NoticeService;
import gmx.gis.sysmgr.service.GMT_NoticeVo;
import gmx.gis.system.annotation.GMT_NoSession;
import gmx.gis.user.service.GMT_UserVo;
import gmx.gis.user.util.SHA;
import gmx.gis.util.code.GMT_DateUtil;
import gmx.gis.util.code.GMT_SystemParameter;
import gmx.gis.util.code.GMT_ValidInspector;

import java.beans.PropertyEditorSupport;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
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

/**
 * <pre>
 * 파일명 :  IpController.java
 * 설  명 :
 *
 *   공지사항 관리 컨트롤러 입니다.
 *
 *   <b>* 주의 *</b>
 *   Multipart 요청은 lucy-xss-filter 에서 제외됩니다.
 *   Multipart Filter 추가시, @ModelAttribute 로 데이터가 binding 되지 않는 버그가 존재하며,
 *   해당 버그는 추후 수정될 예정입니다.
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-06-16      이주영          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 15.
 * @version :  1.0
 * @see
 */
@Controller
@RequestMapping("/GMT_notice")
public class GMT_NoticeController {

	@Autowired private GMT_SysPropService param;

    @Autowired private GMT_NoticeService service;

	@Autowired private GMT_ColumnController col;

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
     * 공지사항 정보 뷰를 리턴합니다.
     *
	 * @param model
	 * @param session
	 * @return view
	 * @throws Exception
	 */
    @RequestMapping(value = "/getNoticeView.do")
    public String getNoticeView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.getList(map));
		model.addAttribute("count", service.getCount(map));
		model.addAttribute("column", col.getList());
		model.addAttribute("map", map);

    	return "/GMT/notice/noticeList";
	}

    /**
     * 공개 공지사항 정보 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getOpenNoticeView.do")
    public String getOpenNoticeView(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	map.put("table", "mt_notc_list");
    	map.put("schema", "xeus");
    	model.addAttribute("result", service.getList(map));
    	model.addAttribute("count", service.getCount(map));
    	model.addAttribute("column", col.getList());
    	model.addAttribute("map", map);

    	return "/GMT/notice/openNoticeView";
    }

    /**
     * 공지사항 갯수를 조회합니다.
     *
     * @return json
     * @throws Exception
     */
    @RequestMapping(value = "/getCount.json", method = RequestMethod.POST)
    public void getCount(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("count", service.getCount(map));

    }

    /**
	 * 공지사항 정보 리스트를 가져옵니다.
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

		model.addAttribute("result", service.getList(map));
		model.addAttribute("count", service.getCount(map));

	}

	/**
	 * 특정 공지사항 데이터를 가져옵니다.
	 *
	 * @param req
	 * @param res
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@GMT_NoSession
	@RequestMapping(value = "/getItem.json", method = RequestMethod.POST)
	public void getItem(Model model, HttpServletRequest req, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.getItem(map));

	}

	/**
	 * 공지사항을 삭제합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/del.json", method = RequestMethod.POST)
	public void del(Model model, HttpSession session, @RequestParam(required=true) HashMap<String, String> map) throws Exception {
		//삭제 전 신청정보 가져오기
	    HashMap<String, String> chkMap = new HashMap<String, String>();
        chkMap.put("mgrSeq", map.get("mgrSeq"));
        GMT_NoticeVo chkNotice = service.getItem(chkMap);
        //삭제
        boolean chkWork = service.del(map);
        model.addAttribute("result", chkWork);
        //삭제 성공시 이전에 업로드 됐던 파일을 삭제한다.
        if(chkWork && chkNotice.getAtchFilePath() != null && !"".equals(chkNotice.getAtchFilePath())){
            File file = new File(chkNotice.getAtchFilePath());
            if(file.exists()) try{ file.delete(); }catch(Exception e){}
        }
	}

	/**
	 * 공지사항을 추가합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/add.json", method = RequestMethod.POST)
	public void add(Model model, HttpSession session, @ModelAttribute @Valid GMT_NoticeVo vo, BindingResult br) throws Exception {

		String msg = GMT_ValidInspector.findError(br);

		if("pass".equals(msg)){

		    GMT_SystemParameter sysParam = new GMT_SystemParameter(param.getList(null));
		    HashMap<String, String> map = null;
	        map = sysParam.getParamMap();

	        String uploadPath = map.get("sys.upload_path");
		    String subDir = "notice";

			MultipartFile file = vo.getFile();
			if(file != null){
				if(GMT_ValidInspector.isPathAttack(file.getOriginalFilename())){
					model.addAttribute("error", "올바른 파일 이름이 아닙니다.\n특수문자를 제거해 주세요.");
					return;
				}else if(file.getOriginalFilename().length() > 30){
					model.addAttribute("error", "파일명은 30자 미만으로 업로드 할 수 있습니다.");
					return;
				}else{

					String fileNm = file.getOriginalFilename();
					String tempNm = GMT_DateUtil.getStrMilSec() + "_" + fileNm;
					//String fullPath = "D:\\Upload\\notice\\" + tempNm;
					String fullPath = uploadPath + subDir + "\\" + tempNm;

					File chkDir = new File(uploadPath + subDir);
                    if(!chkDir.isDirectory()){
                        try{ chkDir.mkdirs(); } catch (Exception e){}
                    }

					vo.setAtchFileNm(fileNm);
					vo.setAtchFilePath(fullPath);

					File realFile = new File(fullPath);
					file.transferTo(realFile);
				}
			}

			/*180508 이은규
			첨부파일이 존재하지 않아도 밑의 두 값은 들어가야 한다.*/
			vo.setWorkerId((String) session.getAttribute("userId"));
            vo.setLastMdfyDat(GMT_DateUtil.getStrSec());

			model.addAttribute("result", service.add(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 공지사항을 수정합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/edit.json", method = RequestMethod.POST)
	public void edit(Model model, HttpSession session, @ModelAttribute @Valid GMT_NoticeVo vo, BindingResult br) throws Exception {
		String msg = GMT_ValidInspector.findError(br);

		if("pass".equals(msg)){

		    HashMap<String, String> chkMap = new HashMap<String, String>();
		    chkMap.put("mgrSeq", vo.getMgrSeq());
            GMT_NoticeVo chkNotice = service.getItem(chkMap);

		    GMT_SystemParameter sysParam = new GMT_SystemParameter(param.getList(null));

		    HashMap<String, String> map = null;
            map = sysParam.getParamMap();

            String uploadPath = map.get("sys.upload_path");
            String subDir = "notice";
			MultipartFile file = vo.getFile();
			if(file != null){
				if(GMT_ValidInspector.isPathAttack(file.getOriginalFilename())){
					model.addAttribute("error", "올바른 파일 이름이 아닙니다.\n특수문자를 제거해 주세요.");
					return;
				}else if(file.getOriginalFilename().length() > 30){
					model.addAttribute("error", "파일명은 30자 미만으로 업로드 할 수 있습니다.");
					return;
				}else{
					vo.setLastMdfyDat(GMT_DateUtil.getStrSec());

					String fileNm = file.getOriginalFilename();
					String tempNm = GMT_DateUtil.getStrMilSec() + "_" + fileNm;
					String fullPath = uploadPath + subDir + "\\" + tempNm;

					File chkDir = new File(uploadPath + subDir);
                    if(!chkDir.isDirectory()){
                        try{ chkDir.mkdirs(); } catch (Exception e){}
                    }

					vo.setAtchFileNm(fileNm);
					vo.setAtchFilePath(fullPath);

					File realFile = new File(fullPath);
					file.transferTo(realFile);
				}
			}
			boolean chkWork = service.edit(vo);
			model.addAttribute("result", chkWork);
			//업데이트 성공시 이전에 업로드 됐던 파일을 삭제한다.
			if(chkWork && chkNotice.getAtchFilePath() != null && !"".equals(chkNotice.getAtchFilePath())){
                File beforeFile = new File(chkNotice.getAtchFilePath());
                if(beforeFile.exists()) try{ beforeFile.delete(); }catch(Exception e){}
            }
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 요청한 파일을 리턴합니다.
	 *
	 * @param req
	 * @param session
	 * @param res
	 * @param map
	 * @throws Exception
	 */
	@GMT_NoSession
	@RequestMapping("/getFile.json")
	public void getFiles(HttpServletRequest req, HttpServletResponse res, HttpSession session, Model model, @RequestParam HashMap<String, String> map) throws Exception {

		GMT_NoticeVo vo = service.getItem(map);

		if(vo == null){
			model.addAttribute("error", "파일이 존재하지 않습니다.");
		}else{
			String realFileName = vo.getAtchFileNm();
			String realFile = vo.getAtchFilePath();

			BufferedOutputStream out = null;
			InputStream in = null;
			String exceptionStr = "존재하지않는  파일을 요청하였거나, 사용자(" + req.getRemoteAddr() + ")가 파라미터 공격을 시도하였음 (파일주소 : " + realFile + ")";

			try {
				res.setContentType("application/octet-stream");
				res.setHeader("Content-Disposition", "inline;filename=" + new String(realFileName.getBytes("UTF-8"), "ISO-8859-1"));
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
			} catch (Exception e) {
				System.out.println(exceptionStr);
			} finally {
				if(out != null){ out.flush(); }
				if(out != null){ out.close(); }
				if(in != null){ in.close(); }
			}
		}

	}

}
