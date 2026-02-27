package geomex.xeus.sysmgr.web;

import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import org.springframework.web.multipart.MultipartFile;

import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.sysmgr.service.LyrSymService;
import geomex.xeus.sysmgr.service.LyrSymVo;
import geomex.xeus.sysmgr.service.SymDescService;
import geomex.xeus.sysmgr.service.SymDescVo;
import geomex.xeus.util.code.CodeConvertor;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.ValidInspector;


/**
 * <pre>
 * 파일명 :  SymDescController.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-06-29      이은규          최초 생성
 *
 * </pre>
 *
 * @since : 2016. 12. 13.
 * @version : 1.0
 * @see
 */

@RequestMapping("/sym")
@Controller("symDescController")
public class SymDescController {

    private Logger logger = LoggerFactory.getLogger(SymDescController.class);

    @Resource(name = "symDescService")
    private SymDescService symDescService;

    @Resource(name = "lyrSymService")
    private LyrSymService lyrSymService;

    @Resource(name = "sysPropService")
    private SysPropService param;

	@Resource
	private ColumnInfoController col;

	@Resource(name = "txManager")
    PlatformTransactionManager transactionManager;

	@Resource
	private Validator validator;

	@InitBinder
	private void initBinder(WebDataBinder binder){
		binder.setValidator(this.validator);
	}

	/**
     * 심볼을 추가합니다.
     *
     * @param model
     * @throws Exception
     */
    @RequestMapping(value = "/addDesc.json", method = RequestMethod.POST)
    public void addDesc(Model model, @RequestParam(value="p", required=true) String gbn,
            					 @RequestParam(value="uploadImg", required=true) MultipartFile file) throws Exception {

    	if(file.isEmpty()){
            model.addAttribute("error", "파일이 선택되지 않았습니다.");
        }else{
        	String [] splitFileNm = file.getOriginalFilename().split("\\.");
            String extension = splitFileNm[splitFileNm.length-1];

            if("png".equals(extension)){
            	BufferedImage bImage = null;
            	ByteArrayOutputStream bos = null;
            	try{
            		//File file = new File("D:/2.gif");
            		File convFile = new File(file.getOriginalFilename());
            	    convFile.createNewFile();
            	    FileOutputStream fos = new FileOutputStream(convFile);
            	    fos.write(file.getBytes());
            	    fos.close();

                	bImage = ImageIO.read(convFile);
                    bos = new ByteArrayOutputStream();
                    ImageIO.write(bImage, extension, bos );
                    byte [] data = bos.toByteArray();
                    SymDescVo symDescVo = new SymDescVo();
                    symDescVo.setGbnCd(gbn);
                    symDescVo.setFileNm(file.getOriginalFilename());
                	symDescVo.setSymBytes(data);

                	model.addAttribute("result", symDescService.add(symDescVo));
            	} catch(Exception e){
            		e.printStackTrace();
            	} finally{
            		if(bImage != null ) try{bImage.flush();}catch(Exception e){}
            		if(bos != null ) try{bos.flush();}catch(Exception e){}
            		if(bos != null ) try{bos.close();}catch(Exception e){}
            	}
            } else {
            	model.addAttribute("error", "파일은 png 파일만 업로드 할 수 있습니다.");
            }
        }
    }

    /**
     * 심볼 목록을 리턴합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    /*@RequestMapping(value = "/getList.json", method = RequestMethod.POST)
    public void getList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", symDescService.getList(map));

    }*/

    /**
     * 심볼을 삭제합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/delDesc.json", method = RequestMethod.POST)
    public void delDesc(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	HashMap<String, String> chkUse = new HashMap<String, String>();
    	chkUse.put("symMgrNo", map.get("mgrNo"));
    	if(lyrSymService.getCount(chkUse) == 0){
    		model.addAttribute("result", symDescService.del(map));
    	} else {
    		model.addAttribute("error", "현재 사용되고 있는 심볼은 삭제할 수 없습니다.");
    	}

    }

    /**
     * 심볼 목록을 리턴합니다.
     *
     * @param model
     * @param map
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/getDescList.json", method = RequestMethod.POST)
    public void getDescList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", symDescService.getList(map));

    }



    /**
     * 선택된 심볼을 가져옵니다.
     * DB bytea 컬럼에 저장된 데이터를 이미지로 변환하여 제공합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getSymbol.do")
    public void getSymbol(Model model, HttpServletResponse res, @RequestParam HashMap<String, String> map) throws Exception {
    	ByteArrayInputStream bis = null;
    	BufferedOutputStream out = null;
    	try {
    		SymDescVo symDescVo = symDescService.getItem(map);
    		String fileNm = DateUtil.getStrMilSec() + "-" + symDescVo.getFileNm();
            res.setContentType("image/" + ValidInspector.getExtension(fileNm, false));
            res.setHeader("Content-Disposition", "inline;filename=" + fileNm);

            bis = new ByteArrayInputStream(symDescVo.getSymBytes());
            out = new BufferedOutputStream(res.getOutputStream());
            int len;
            byte[] buf = new byte[1024];
            while ((len = bis.read(buf)) > 0) {
                out.write(buf, 0, len);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
        	if(bis != null) try{ bis.close(); }catch(Exception e){}
            if(out != null) try{ out.flush(); }catch(Exception e){}
            if(out != null) try{ out.close(); }catch(Exception e){}
        }
    }






    /**
     * getItem
     *
     * @param model
     * @throws Exception
     */
    /*@RequestMapping(value = "/getItem.json", method = RequestMethod.POST)
    public void getItem(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	BufferedImage bImage = null;
    	ByteArrayInputStream bis = null;
    	try{
        	SymDescVo symDescVo = symDescService.getItem(map);

        	bis = new ByteArrayInputStream(symDescVo.getSymBytes());
            bImage = ImageIO.read(bis);
            ImageIO.write(bImage, "gif", new File("D:/output.gif") );
    	} catch(Exception e){
    		e.printStackTrace();
    	} finally{
    		if(bImage != null ) try{bImage.flush();}catch(Exception e){}
    		if(bis != null ) try{bis.close();}catch(Exception e){}
    	}
    }*/

    /**
     * test
     *
     * @param model
     * @throws Exception
     */
    /*@RequestMapping(value = "/test.json", method = RequestMethod.POST)
    public void test(Model model) throws Exception {

    	try{
    		BufferedImage bImage = ImageIO.read(new File("D:/if_Arrow Up_58463.png"));
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ImageIO.write(bImage, "png", bos );
            byte [] data = bos.toByteArray();

            ByteArrayInputStream bis = new ByteArrayInputStream(data);
            BufferedImage bImage2 = ImageIO.read(bis);
            ImageIO.write(bImage2, "png", new File("D:/output.png") );

    	} catch(Exception e){
    		e.printStackTrace();
    	}
    }*/

    /**
     * 레이어 심볼 정보를 추가합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/addLyrSym.json", method = RequestMethod.POST)
    public void addLyrSym(Model model, @ModelAttribute @Valid LyrSymVo vo, BindingResult br) throws Exception {

    	String[] ignoreField = {""};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
        	model.addAttribute("result", lyrSymService.add(vo));
        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * 레이어 심볼 정보 단건을 조회합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/getLyrSymItem.json", method = RequestMethod.POST)
    public void getLyrSymItem(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", lyrSymService.getItem(map));

    }

    /**
     * 레이어 심볼 정보 목록을 리턴합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/getLyrSymList.json", method = RequestMethod.POST)
    public void getLyrSymList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", lyrSymService.getList(map));

    }

    /**
     * 레이어 심볼 정보를 수정합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/editLyrSym.json", method = RequestMethod.POST)
    public void editLyrSym(Model model, @ModelAttribute @Valid LyrSymVo vo, BindingResult br) throws Exception {

    	String[] ignoreField = {""};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
        	model.addAttribute("result", lyrSymService.edit(vo));
        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * 레이어 심볼 정보를 삭제합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/delLyrSym.json", method = RequestMethod.POST)
    public void delLyrSym(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", lyrSymService.del(map));

    }

}
