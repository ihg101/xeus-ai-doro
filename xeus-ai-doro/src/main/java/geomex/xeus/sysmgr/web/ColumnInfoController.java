package geomex.xeus.sysmgr.web;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.sysmgr.service.ColumnInfoService;
import geomex.xeus.sysmgr.service.ColumnInfoVo;
import geomex.xeus.system.annotation.NoSession;

/**
 * <pre>
 * 파일명 :  ColumnController.java
 * 설  명 :
 *
 *   테이블의 컬럼명을 조회하는 컨트롤러 입니다.
 *   View 에서 사용하기 위해 제작되었습니다.
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 27.
 * @version :  1.0
 * @see
 */
@Controller
@RequestMapping("/columnInfo")
public class ColumnInfoController {

	private ArrayList<ColumnInfoVo> list;

	@Resource(name = "columnInfoService")
	private ColumnInfoService service;

	@PostConstruct
	private void init() throws Exception {
		this.refresh();
	}

	@NoSession
	@RequestMapping(value = "/refresh")
	public void refresh() throws Exception {
		list = service.getList();
	}

	public ArrayList<ColumnInfoVo> getList() {
		return list;
	}

	@NoSession
	@RequestMapping(value = "/getList.json")
	public void getList(Model model) {

		model.addAttribute("result", this.list);

	}

	@NoSession
	@RequestMapping(value = "/getColumn.json")
	public void getColumn(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.getColumn(map));

	}

}
