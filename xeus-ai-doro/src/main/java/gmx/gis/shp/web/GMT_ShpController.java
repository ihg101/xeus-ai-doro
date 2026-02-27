package gmx.gis.shp.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import gmx.gis.shp.service.GMT_ShpService;


/**
*
* <pre>
* shp 파일 업로드 및 shp<->DB 기능을 수행합니다.
* </pre>
*
* @author 장대건
*
*/
@Controller
@RequestMapping("/GMT_shp")
public class GMT_ShpController {

	@Autowired
	private GMT_ShpService shpService;

	/**
	 *
	 * @param session
	 * @param model
	 * @param multipartHttpServletRequest
	 * @throws IllegalStateException
	 * @throws Exception
	 */
	@RequestMapping(value = "/importShpFile.json")
	public void importShpFile(Model model, HttpSession session, @RequestParam List<MultipartFile> file,
																@RequestParam String USER_ID,
																@RequestParam String srcSRID,
																@RequestParam String tgtDbSchema,
																@RequestParam(required = false, defaultValue = "사용자 업로드 Shp 레이어") String layerNm) throws IllegalStateException, Exception {
		String msg = shpService.shpToStorage(file, USER_ID, srcSRID, tgtDbSchema, layerNm);

		model.addAttribute("result", msg);
	}

	/**
	 *
	 * @param session
	 * @param model
	 * @param multipartHttpServletRequest
	 * @throws IllegalStateException
	 * @throws Exception
	 */
	@RequestMapping(value = "/dbToShp.json")
	public void dbToShp(HttpServletRequest request, HttpServletResponse response, @RequestParam HashMap<String, String> map) throws Exception {
		String exportShema = map.get("schema");
		String exportTbl = map.get("tbl");
		String tgtSRID = map.get("tgtSRID");
		String layerNm = map.get("nm");

		File downFile = shpService.dbToReProjectedShp(exportShema, exportTbl, tgtSRID);

		// 파일명 지정
		response.setContentType("application/octer-stream");
		response.setHeader("Content-Transfer-Encoding", "binary;");
		//response.setHeader("Content-Disposition", "attachment; filename=\"" + downFile.getName() + "\"");
		//TODO 이주영 > 레이어 명칭으로 파일명 채택
		response.setHeader("Content-Disposition", "attachment;filename=" + new String(layerNm.getBytes("UTF-8"), "ISO-8859-1") + ".zip");

		OutputStream out = response.getOutputStream();
		FileInputStream fis = null;
		try {
			fis = new FileInputStream(downFile);
			FileCopyUtils.copy(fis, out);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (fis != null) {
				try {
					fis.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}

			if (out != null) {
				out.flush();
			}

			shpService.emptyExportStorage();
		}

	}

}
