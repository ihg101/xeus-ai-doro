package geomex.xeus.bigdata.web;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import geomex.xeus.bigdata.service.CovidService;
import geomex.xeus.bigdata.service.CovidVo;
import geomex.xeus.excel.service.ExcelUtils;
import geomex.xeus.excel.service.XSSFRead;
import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.SystemParameter;
import geomex.xeus.util.code.ValidInspector;

@Controller
@RequestMapping("/covid")
public class CovidController {

    @Resource(name = "covidService")
    private CovidService service;

    @Resource(name = "sysPropService")
    private SysPropService param;

    @Resource(name = "txManager")
    PlatformTransactionManager transactionManager;

    @Resource
    private Validator validator;

    @InitBinder
    private void initBinder(WebDataBinder binder) {
        binder.setValidator(this.validator);
    }

    /**
     * COVID 이동 동선 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getCovidSearchView.do")
    public String getCovidSearchView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	return "/covid/searchView";

    }

    /**
     * CCTV 민원 결과 엑셀을 추가합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/addCovidExcel.json", method = RequestMethod.POST)
    public void addCovidExcel(Model model, HttpSession session, @RequestPart("file") MultipartFile file) throws Exception {

    	if (file == null) {
            model.addAttribute("error", "파일이 선택되지 않았습니다.");
        } else {
            try {

            	String userId = (String) session.getAttribute("userId");
                String splitData[] = file.getOriginalFilename().split("\\.");
                String type = "." + splitData[(splitData.length) - 1];
                String realFileNm = DateUtil.getStrMilSec() + "-" + file.getOriginalFilename();

                SystemParameter sysParam = new SystemParameter(param.getList(null));

                HashMap<String, String> map = null;
                map = sysParam.getParamMap();

                String path = map.get("sys.upload_path") + "covid" + "/" + userId;

                File chkDir = new File(path);
                if (!chkDir.isDirectory()) {
                    try {
                        chkDir.mkdirs();
                    } catch (Exception e) {}
                }

                if (ValidInspector.isBigDataExtension(type)) {

                    String fullPath = path + "/" + realFileNm;
                    File xlx = new File(fullPath);
                    file.transferTo(xlx);

                    ArrayList<CovidVo> result = new ArrayList<CovidVo>();

					if(ExcelUtils.getFileExt(xlx.getName()).equals("xlsx")){
						result = new XSSFRead(xlx).getCovidData("Sheet1");
					}else{
						model.addAttribute("error", "xlsx 확장만 업로드 할 수 있습니다.");
					}/*else{
						result = new HSSFRead(xlx).getCovidData("Sheet1");
					}*/

					if(result.size() == 0){
						model.addAttribute("error", "추가 할 데이터가 존재하지 않습니다.");
					}else{
						TransactionStatus txStatus = transactionManager.getTransaction(new DefaultTransactionDefinition());

						try {
							model.addAttribute("result", service.addExcel(result));
							model.addAttribute("list", result);
							transactionManager.commit(txStatus);
						} catch (Exception e) {
							transactionManager.rollback(txStatus);
							model.addAttribute("error", "롤백처리 되었습니다.\n데이터(위치정보, 문자길이 등)를 확인해주세요.");
							e.printStackTrace();
						}
					}

                } else {
                    model.addAttribute("error", "파일은 엑셀 파일만 업로드 할 수 있습니다.");
                }
            } catch (Exception e) {
            	model.addAttribute("error", "파일 분석중 문제가 발생하였습니다.");
                e.printStackTrace();
            }
        }

    }

}
