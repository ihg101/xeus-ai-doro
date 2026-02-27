package geomex.xeus.sysmgr.web;

import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.sysmgr.service.ImageService;
import geomex.xeus.sysmgr.service.ImageVo;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.SystemParameter;
import geomex.xeus.util.code.ValidInspector;

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

import org.springframework.stereotype.Controller;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.springframework.ui.Model;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 * 파일명 :  IpController.java
 * 설  명 :
 *   이미지 관리 컨트롤러 입니다.
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-06-16      이주영          최초 생성
 * 2017-11-03	   이은규		   add.json - 서브경로 파라미터로 받음
 * 								   getList 추가
 *
 * </pre>
 *
 * @since   :  2017. 6. 15.
 * @version :  1.0
 * @see
 */
@Controller
@RequestMapping("/image")
public class ImageController {

    @Resource(name = "sysPropService")
    private SysPropService param;

	@Resource(name = "imageService")
    private ImageService service;

	@Resource
	private Validator validator;


	@Resource(name="txManager")
    PlatformTransactionManager transactionManager;

	@InitBinder
	private void initBinder(WebDataBinder binder){
		binder.setValidator(this.validator);
	}

	/**
	 * 임지 저장 명칭으로 실제 파일을 찾은뒤, 기존 명칭으로 이미지를 리턴합니다.
	 *
	 * @param req
	 * @param session
	 * @param res
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping("/getImage.do")
	public void getImage(HttpServletRequest req, HttpSession session, HttpServletResponse res, @RequestParam HashMap<String, String> map) throws Exception {
		ImageVo vo = service.getItem(map);
		String realFileName = vo.getImgNm();
		String fileTmpName = vo.getImgPath();
		if(fileTmpName.endsWith("\\")){
			fileTmpName += vo.getFileNm();
		}else{
			fileTmpName += "\\" + vo.getFileNm();
		}

		//String realFile = session.getServletContext().getRealPath("/WEB-INF/") + "\\img\\" + fileTmpName;
		String realFile = fileTmpName;
		String exceptionStr = "존재하지않는  파일을 요청하였거나, 사용자(" + req.getRemoteAddr() + ")가 파라미터 공격을 시도하였음 (파일주소 : "+realFile+")";

		BufferedOutputStream out = null;
		InputStream in = null;

		try {
			if(ValidInspector.isPathAttack(realFileName)){
				System.out.println(exceptionStr);
			}else{
				res.setContentType("image/" + ValidInspector.getExtension(realFileName, false));
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

	/**
	 * 이미지 단건을 조회합니다.
	 *
	 * @param req
	 * @param session
	 * @param res
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping("/getItem.json")
	public void getItem(Model model, @RequestParam HashMap<String, String> map) throws Exception {
		model.addAttribute("result", service.getItem(map));

	}




	/**
	 * 이미지 리시트를 조회합니다.
	 *
	 * @param req
	 * @param session
	 * @param res
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping("/getList.json")
	public void getList(Model model, @RequestParam HashMap<String, String> map) throws Exception {
		model.addAttribute("result", service.getList(map));

	}


	/**
	 * 이미지를 삭제합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/del.json", method = RequestMethod.POST)
	public void del(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		ImageVo vo = service.getItem(map);
		if(vo == null){
			model.addAttribute("result", true);
		}else{
			String realFileName = vo.getImgNm();
			String fileTmpName = vo.getImgPath();
			if(fileTmpName.endsWith("\\")){
				fileTmpName += vo.getFileNm();
			}else{
				fileTmpName += "\\" + vo.getFileNm();
			}

			String realFile = fileTmpName;
			String exceptionStr = "존재하지않는  파일을 요청하였거나, 사용자(" + req.getRemoteAddr() + ")가 파라미터 공격을 시도하였음 (파일주소 : "+realFile+")";

			try {
				if(ValidInspector.isPathAttack(realFileName)){
					System.out.println(exceptionStr);
				}else{
					File file = new File(realFile);
					if(file.exists()){
						file.delete();
					}else{
						System.out.println(exceptionStr);
					}
				}
			} catch (Exception e) {
				System.out.println(exceptionStr);
			}

			model.addAttribute("result", service.del(map));
		}

	}


	/**
	 * 이미지를 삭제합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/delImgList.json", method = RequestMethod.POST)
	public void delImgList(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		TransactionStatus txStatus = transactionManager.getTransaction(new DefaultTransactionDefinition());

		String strList[] = map.get("mgrSeqStr").split(",");

		try{
			for(int i=0; i<strList.length; i++){
				HashMap<String, String> param = new HashMap<String, String>();
				param.put("mgrSeq", strList[i]);
				ImageVo vo = service.getItem(param);

				if(vo == null){
//				model.addAttribute("result", true);
				}else{
					String realFileName = vo.getImgNm();
					String fileTmpName = vo.getImgPath();
					if(fileTmpName.endsWith("\\")){
						fileTmpName += vo.getFileNm();
					}else{
						fileTmpName += "\\" + vo.getFileNm();
					}

					String realFile = fileTmpName;
					String exceptionStr = "존재하지않는  파일을 요청하였거나, 사용자(" + req.getRemoteAddr() + ")가 파라미터 공격을 시도하였음 (파일주소 : "+realFile+")";

					//먼저 asset_image의 row를 먼저 삭제하고, 물리적인 이미지 파일을 삭제한다.
					if(service.del(param)){
						try {
							if(ValidInspector.isPathAttack(realFileName)){
								System.out.println(exceptionStr);
							}else{
								File file = new File(realFile);
								if(file.exists()){
									file.delete();
								}else{
									System.out.println(exceptionStr);
								}
							}
						} catch (Exception e) {
							System.out.println(exceptionStr);
//							throw new Exception();
						}
					}
				}

			}

			model.addAttribute("result", true);
			transactionManager.commit(txStatus);
		}catch(Exception e){
			transactionManager.rollback(txStatus);
			model.addAttribute("error", "롤백처리 되었습니다.\n입력 데이터를 다시한번 확인해 주세요.");
			e.printStackTrace();
		}

	}


	/**
	 * 이미지를 추가합니다.<br>
	 * <b>단건 이미지만 추가할 경우 사용됩니다.</b>
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/add.json", method = RequestMethod.POST)
	public void add(Model model, HttpSession session, @RequestParam(value="k", required=true) String val,
	                								  @RequestParam(value="i", required=true) String idx,
	                								  @RequestParam(value="p", required=true) String sub,
	                								  @RequestParam(value="uploadImg", required=true) MultipartFile file) throws Exception {

		if(file.isEmpty()){
			model.addAttribute("error", "파일이 선택되지 않았습니다.");
		}else{
		    String splitData [] = file.getOriginalFilename().split("\\.");
            String type = "." + splitData[(splitData.length)-1];
			//String type = "." + file.getContentType().substring(file.getContentType().lastIndexOf("/") + 1);
			String extension = ValidInspector.getExtension(file.getOriginalFilename(), false);
			String realFileNm = DateUtil.getStrMilSec() + "-" + file.getOriginalFilename();
			//String path = session.getServletContext().getRealPath("/WEB-INF/") + "\\upload\\nms\\";
			//String path = session.getServletContext().getRealPath("/WEB-INF/") + sub;

			SystemParameter sysParam = new SystemParameter(param.getList(null));

			HashMap<String, String> map = null;
	        map = sysParam.getParamMap();

	        String path = map.get("sys.upload_path") + sub;

	        File chkDir = new File(path);
            if(!chkDir.isDirectory()){
                try{ chkDir.mkdirs(); } catch (Exception e){}
            }

			if("jpeg".equals(extension)) extension = "jpg";

			if(ValidInspector.isImageExtension(type)){

				ImageVo vo = new ImageVo();
				vo.setRefMgrNo(val);
				vo.setImgSeq(idx);
				vo.setImgGbnCd("11");
				vo.setImgFormat(extension);
				vo.setImgNm(file.getOriginalFilename());
				vo.setFileNm(realFileNm);
				vo.setImgPath(path);

				File img = new File(path + realFileNm);
				file.transferTo(img);

				model.addAttribute("result", service.add(vo));
			}else{
				model.addAttribute("error", "파일은 png, jpg, jpeg, gif 파일만 업로드 할 수 있습니다.");
			}
		}

	}


	/**
	 * 이미지를 추가합니다.<br>
	 * <b>단건 이미지만 추가할 경우 사용됩니다.</b>
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/addFeatureImg.json", method = RequestMethod.POST)
	public void addFeatureImg(Model model, HttpSession session,
													  @RequestParam(value="schemaNm", required=true) String schemaNm,
													  @RequestParam(value="tblId", required=true) String tblId,
													  @RequestParam(value="refMgrNo", required=true) String refMgrNo,
													  @RequestParam(value="imgSeq", required=true) String imgSeq,
	                								  @RequestParam(value="uploadFeatureImg", required=true) MultipartFile file) throws Exception {

		if(file.isEmpty()){
			model.addAttribute("error", "파일이 선택되지 않았습니다.");
		}else{
		    String splitData [] = file.getOriginalFilename().split("\\.");
            String type = "." + splitData[(splitData.length)-1];
			//String type = "." + file.getContentType().substring(file.getContentType().lastIndexOf("/") + 1);
			String extension = ValidInspector.getExtension(file.getOriginalFilename(), false);
			String realFileNm = DateUtil.getStrMilSec() + "-" + file.getOriginalFilename();
			//String path = session.getServletContext().getRealPath("/WEB-INF/") + "\\upload\\nms\\";
			//String path = session.getServletContext().getRealPath("/WEB-INF/") + sub;

			SystemParameter sysParam = new SystemParameter(param.getList(null));

			HashMap<String, String> map = null;
	        map = sysParam.getParamMap();


	        String path = map.get("sys.table_img_upload_path") + "\\"+schemaNm + "\\" + tblId + "\\";

	        File chkDir = new File(path);
            if(!chkDir.isDirectory()){
                try{ chkDir.mkdirs(); } catch (Exception e){}
            }

			if("jpeg".equals(extension)) extension = "jpg";

			if(ValidInspector.isImageExtension(type)){


				File img = new File(path + realFileNm);

				file.transferTo(img);

				ImageVo vo = new ImageVo();
				vo.setRefMgrNo(refMgrNo);
				vo.setImgSeq(imgSeq);
				vo.setImgGbnCd("11");
				vo.setImgFormat(extension);
				vo.setImgNm(file.getOriginalFilename());
				vo.setFileNm(realFileNm);
				vo.setImgPath(path);
				vo.setTblId(tblId);
				vo.setSchemaNm(schemaNm);

				HashMap<String, String> param = new HashMap<String, String>();
				param.put("schemaNm" , schemaNm);
				param.put("tblId" , tblId);
				param.put("refMgrNo" , refMgrNo);
				param.put("imgSeq" , imgSeq);

				ImageVo item = service.getItem(param);

				//insert
				if(item == null){
					model.addAttribute("result", service.add(vo));
				}//update
				else{
					File deleteImg = new File(item.getImgPath() + item.getFileNm());

					if( deleteImg.exists() ){
						deleteImg.delete();
					}

					vo.setMgrSeq(item.getMgrSeq());
					model.addAttribute("result", service.edit(vo));
				}

				model.addAttribute("imageVo", vo);

			}else{
				model.addAttribute("error", "파일은 png, jpg, jpeg, gif 파일만 업로드 할 수 있습니다.");
			}
		}

	}



	/**
	 * 이미지를 추가합니다.<br>
	 * <b>단건 이미지만 추가할 경우 사용됩니다.</b>
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/addFeatureImgList.json", method = RequestMethod.POST)
	public void addFeatureImgList(Model model, HttpSession session,
													  @RequestParam(value="schemaNm", required=true) String schemaNm,
													  @RequestParam(value="tblId", required=true) String tblId,
													  @RequestParam(value="refMgrNo", required=true) String refMgrNo,
													  @RequestParam(value="imgSeq", required=true) String imgSeq,
	                								  @RequestParam(value="uploadFeatureImg", required=true) List<MultipartFile> files) throws Exception {

		TransactionStatus txStatus = transactionManager.getTransaction(new DefaultTransactionDefinition());

		try{
			if(files.isEmpty()){
				throw new Exception("파일이 선택되지 않았습니다.");
			}else{
				List<ImageVo> imageVoList = new ArrayList<ImageVo> ();


				SystemParameter sysParam = new SystemParameter(param.getList(null));

				HashMap<String, String> map = null;
				map = sysParam.getParamMap();

				String path = map.get("sys.table_img_upload_path") + "\\"+schemaNm + "\\" + tblId + "\\";

				File chkDir = new File(path);
				if(!chkDir.isDirectory()){
					try{ chkDir.mkdirs(); } catch (Exception e){}
				}

				//asset_image가 전부 삭제되는 것을 방지한다
				if("".equals(refMgrNo) || "".equals(tblId) || "".equals(schemaNm)
					|| refMgrNo == null || tblId == null || schemaNm == null)
				{
					throw new Exception();
				}

				HashMap<String, String> imgParam = new HashMap<String, String>();
				imgParam.put("refMgrNo",refMgrNo);
				imgParam.put("imgGbnCd","11");
				imgParam.put("tblId",tblId);
				imgParam.put("schemaNm",schemaNm);


				service.del(imgParam);


				for(int i=0; i<files.size(); i++){

					String splitData [] = files.get(i).getOriginalFilename().split("\\.");
					String type = "." + splitData[(splitData.length)-1];
					String extension = ValidInspector.getExtension(files.get(i).getOriginalFilename(), false);
					String realFileNm = DateUtil.getStrMilSec() + "-" + files.get(i).getOriginalFilename();


					if("jpeg".equals(extension)) extension = "jpg";



					if(ValidInspector.isImageExtension(type)){


						File img = new File(path + realFileNm);

						files.get(i).transferTo(img);

						ImageVo vo = new ImageVo();
						vo.setRefMgrNo(refMgrNo);
						vo.setImgSeq(Integer.toString(i+1));
						vo.setImgGbnCd("11");
						vo.setImgFormat(extension);
						vo.setImgNm(files.get(i).getOriginalFilename());
						vo.setFileNm(realFileNm);
						vo.setImgPath(path);
						vo.setTblId(tblId);
						vo.setSchemaNm(schemaNm);

//						HashMap<String, String> param = new HashMap<String, String>();
//						param.put("schemaNm" , schemaNm);
//						param.put("tblId" , tblId);
//						param.put("refMgrNo" , refMgrNo);
//						param.put("imgSeq" , Integer.toString(i+1));
//
//						ImageVo item = service.getItem(param);
//
//						//insert
//						if(item != null){
//
//							File deleteImg = new File(item.getImgPath() + item.getFileNm());
//
//							if( deleteImg.exists() ){
//								deleteImg.delete();
//							}
//						}

						ImageVo one = service.add(vo);
						imageVoList.add(one);


					}else{
						throw new Exception("파일은 png, jpg, jpeg, gif 파일만 업로드 할 수 있습니다.");
					}


				}
				model.addAttribute("imageVoList", imageVoList);
			}
			transactionManager.commit(txStatus);
		}catch(Exception e){
			transactionManager.rollback(txStatus);
			if(e.getMessage() == null || e.getMessage().isEmpty() ){
				model.addAttribute("error", "롤백처리 되었습니다.\n입력 데이터를 다시한번 확인해 주세요.");
			}else{
				model.addAttribute("error", e.getMessage());
			}
			e.printStackTrace();
		}

	}


	/**
	 * 다중 이미지를 추가합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/addMultiple.json", method = RequestMethod.POST)
	public void addMultiple(Model model, HttpSession session, @RequestParam(value="k", required=true) String val,
	                                                          @RequestParam(value="p", required=true) String sub,
	                        								  @RequestParam(value="uploadImg", required=true) List<MultipartFile> files) throws Exception {

		if(files.isEmpty()){
			model.addAttribute("error", "파일이 선택되지 않았습니다.");
		}else{
			try{
				for(int i=0; i<files.size(); i++){
					MultipartFile file = files.get(i);
					String idx = "" + (i + 1);

					String splitData [] = file.getOriginalFilename().split("\\.");
		            String type = "." + splitData[(splitData.length)-1];
					//String type = "." + file.getContentType().substring(file.getContentType().lastIndexOf("/") + 1);
					String extension = ValidInspector.getExtension(file.getOriginalFilename(), false);
					String realFileNm = DateUtil.getStrMilSec() + "-" + file.getOriginalFilename();
					//String path = session.getServletContext().getRealPath("/WEB-INF/") + "\\upload\\nms\\";

					SystemParameter sysParam = new SystemParameter(param.getList(null));

					HashMap<String, String> map = null;
		            map = sysParam.getParamMap();

		            String path = map.get("sys.upload_path") + sub;

		            File chkDir = new File(path);
		            if(!chkDir.isDirectory()){
		                try{ chkDir.mkdirs(); } catch (Exception e){}
		            }

					if("jpeg".equals(extension)) extension = "jpg";

					if(ValidInspector.isImageExtension(type)){

						ImageVo vo = new ImageVo();
						vo.setRefMgrNo(val);
						vo.setImgSeq(idx);
						vo.setImgGbnCd("11");
						vo.setImgFormat(extension);
						vo.setImgNm(file.getOriginalFilename());
						vo.setFileNm(realFileNm);
						vo.setImgPath(path);

						File img = new File(path + realFileNm);
						file.transferTo(img);

						model.addAttribute("result", service.add(vo));
					}else{
						model.addAttribute("error", "파일은 png, jpg, jpeg, gif 파일만 업로드 할 수 있습니다.");
					}
				}
			}catch(Exception e){

			}finally{

			}
		}

	}

	/**
	 * 이미지 리스트를 불러옵니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getImgList.json")
	public void getImgList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.getList(map));

	}

	/**
     * 입력받은 파일명, 기존 명칭으로 이미지를 리턴합니다.
     *
     * @param req
     * @param session
     * @param res
     * @param map
     * @throws Exception
     */
    @RequestMapping("/getTourImage.do")
    public void getTourImage(HttpServletRequest req, HttpSession session, HttpServletResponse res, @RequestParam(value="mgrNo", required=true) String p,
                                                                                                   @RequestParam(value="fileNm", required=true) String n) throws Exception {

        //투어링 사진 저장 경로를 가져오기 위해 시스템 파라미터 가져오기.
        HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        String imgFile = sysMap.get("sys.upload_path") + "tour\\" + p + "\\" + n;
        String exceptionStr = "존재하지않는  파일을 요청하였거나, 사용자(" + req.getRemoteAddr() + ")가 파라미터 공격을 시도하였음 (경로, 파일명 : "+p+"/"+n+")";

        BufferedOutputStream out = null;
        InputStream in = null;

        try {
            if(ValidInspector.isPathAttack(p) || ValidInspector.isPathAttack(n)){
                System.out.println(exceptionStr);
            }else{
                res.setContentType("image/" + ValidInspector.getExtension(imgFile, false));
                res.setHeader("Content-Disposition", "inline;filename=" + imgFile);

                File file = new File(imgFile);
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

    /**
     * 입력받은 파일명, 기존 명칭으로 이미지를 리턴합니다.
     *
     * @param req
     * @param session
     * @param res
     * @param map
     * @throws Exception
     */
    @RequestMapping("/getCarImage.do")
    public void getCarImage(HttpServletRequest req, HttpServletResponse res, @RequestParam(value="fileNm", required=true) String n) throws Exception {

        //투어링 사진 저장 경로를 가져오기 위해 시스템 파라미터 가져오기.
        HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        String imgFile = sysMap.get("sys.upload_path") + "car\\" + n;
        String exceptionStr = "존재하지않는  파일을 요청하였거나, 사용자(" + req.getRemoteAddr() + ")가 파라미터 공격을 시도하였음 (경로, 파일명 : "+n+")";

        BufferedOutputStream out = null;
        InputStream in = null;
        File file = null;
        try {
            if(ValidInspector.isPathAttack(n)){
                System.out.println(exceptionStr);
            }else{
                res.setContentType("image/" + ValidInspector.getExtension(imgFile, false));
                res.setHeader("Content-Disposition", "inline;filename=" + imgFile);

                file = new File(imgFile);
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
            if(file != null)file.delete();
        }
    }

}
