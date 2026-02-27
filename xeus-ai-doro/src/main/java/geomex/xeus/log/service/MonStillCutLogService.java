package geomex.xeus.log.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  MonStillCutLogService.java
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
 * @since   :  2017. 6. 22.
 * @version :  1.0
 * @see
 */
@Service("monStillCutLogService")
public class MonStillCutLogService extends EgovAbstractServiceImpl {

	@Resource(name = "monStillCutLogMapper")
	private MonStillCutLogMapper mapper;

	/**
	 * 로그 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<MonStillCutLogVo> getList(HashMap<String, String> map) throws Exception {

		ArrayList<MonStillCutLogVo> list = (ArrayList<MonStillCutLogVo>) mapper.getList(map);

		return list;
	}

	/**
	 * 로그 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public MonStillCutLogVo getItem(HashMap<String, String> map) throws Exception {

		MonStillCutLogVo vo = mapper.getItem(map);

		return vo;
	}

	/**
	 * 로그 수를 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int getCount(HashMap<String, String> map) throws Exception {

		int count = mapper.getCount(map);

		return count;

	}

	/**
	 * 로그를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(MonStillCutLogVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

}
