package geomex.xeus.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  ColumnService.java
 * 설  명 :
 *
 *   테이블의 컬럼명칭을 조회하는 서비스 입니다.
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
@Service("columnInfoService")
public class ColumnInfoService extends EgovAbstractServiceImpl {

	@Resource(name = "columnInfoMapper")
    private ColumnInfoMapper mapper;

	public ArrayList<ColumnInfoVo> getList() throws Exception {

		ArrayList<ColumnInfoVo> list = (ArrayList<ColumnInfoVo>) mapper.getList();

		return list;
	}

	public ArrayList<ColumnInfoVo> getColumn(HashMap<String, String> map) throws Exception {

		return (ArrayList<ColumnInfoVo>) mapper.getColumn(map);

	}

}
