package gmx.gis.excel.web;



import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import gmx.gis.excel.service.GMT_ExcelService;
import gmx.gis.excel.util.GMT_ExcelUtil;
import gmx.gis.util.code.GMT_EtcUtil;

/**
 * @author 민동현
 *
 */
@Controller
@RequestMapping("/GMT_excel")
public class GMT_ExcelController {

	@Autowired private GMT_ExcelService excelService;

    @Resource
    private Validator validator;

    @InitBinder
    private void initBinder(WebDataBinder binder){
        binder.setValidator(this.validator);
    }

    /**
     * 1. 엑셀 파일을 읽어서 컬럼명을 반환한다
     * 2.스키마와 계정과 현재시간으로 테이블명을 생성해 반환한다
     *
     * @param model
     * @param session
     * @param file
     * @throws Exception
     */
    @RequestMapping(value = "/getExcelColumnList.json", method = RequestMethod.POST)
    public void getExcelColumnList(Model model, HttpSession session, @RequestParam HashMap<String, String> map,@RequestPart("file") MultipartFile file) throws Exception {

		 String userId = (String) session.getAttribute("userId");
		 if(userId == null){
    		 model.addAttribute("error", "세션이 없습니다. 다시 시도해주세요.");
    		 return;
		 }

		 HashMap<String,String> param = new HashMap<String,String>();
		 param.put("userId", userId);
		 param.put("schema", "excel");
		 try{
			 model.addAttribute("tableName", GMT_EtcUtil.getTableName(param));
		 }catch(Exception e){
			 model.addAttribute("error", "테이블 이름 생성 중 에러가 발생했습니다.");
			 return;
		 }
		 try{
			 model.addAttribute("excelColumnList", excelService.getExcelColumnList(file, map));
		 }catch(Exception e){
			 if("lonlatPolicyError".equals(e.getMessage())){
				 model.addAttribute("error", "**경위도**\n\n엑셀파일 1번째 행에 컬럼명이 있어야하며,\n엑셀파일 2번째 행부터는 데이터가 있어야합니다. \n\n 반드시\n 1번째 컬럼명은 annox 이어야하고, \n 1번째 컬럼은 경도 데이터가 있어야 합니다.\n 2번째 컬렴명은 annoy 이어야 하며, \n 2번째 컬럼은 위도 데이터가 있어야합니다.");
			 }
			 else if("addrPolicyError".equals(e.getMessage())){
				 model.addAttribute("error", "**주소**\n\n엑셀파일 1번째 행에 컬럼명이 있어야하며,\n엑셀파일 2번째 행부터는 데이터가 있어야합니다. \n\n 반드시\n \n 1번째 컬럼명은 addr 이어야하고, \n 1번째 컬럼은 주소 데이터가 있어야 합니다.");
			 }
			 else{
				 model.addAttribute("error", "엑셀파일은 xls,xlsx만 가능합니다.");
			 }
		 }
    }

    /**
     * 컬럼 정보,테이블 정보,엑셀파일을 받아서
     * 1. 공간정보테이블을 생성한다.
     * 2. 공간정보테이블에 데이터를 넣는다.
     * 3. gis_lyr_list에 해당 레이어 정보 row를 추가한다.
     *
     * @param model
     * @param map(컬럼 정보, 테이블 정보)
     * @param file
     * @throws Exception
     */
    @RequestMapping(value = "/uploadExcel.json", method = RequestMethod.POST)
    public void uploadExcel(Model model, HttpSession session, @RequestParam HashMap<String, String> map,@RequestPart("file") MultipartFile file) throws Exception {
    	 String userId = (String) session.getAttribute("userId");
		 if(userId == null){
	   		 model.addAttribute("result", "세션이 없습니다. 다시 시도해주세요.");
	   		 return;
		 }

    	map.put("userId", userId);
        String msg = GMT_ExcelUtil.findError(map);

        if("pass".equals(msg)){
            model.addAttribute("result", excelService.uploadExcel(map, file));
        }else{
            model.addAttribute("result", msg);
        }
    }

}
