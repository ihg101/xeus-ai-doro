package geomex.xeus.event112.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service
public class CctvPreviewDocService extends EgovAbstractServiceImpl {

	@Resource(name = "cctvPreviewDocMapper")
    private CctvPreviewDocMapper mapper;

	/**
	 * CctvPreview 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<CctvPreviewDocVo> getList(HashMap<String, String> map) throws Exception {

		ArrayList<CctvPreviewDocVo> list = (ArrayList<CctvPreviewDocVo>) mapper.getList(map);

		return list;
	}

	/**
	 * CctvPreview 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public CctvPreviewDocVo getItem(HashMap<String, String> map) throws Exception {

		CctvPreviewDocVo vo = mapper.getItem(map);

		return vo;
	}

	/**
	 * CctvPreview를 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * CctvPreview를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(CctvPreviewDocVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * CctvPreview를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(CctvPreviewDocVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * CctvPreview 수를 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int getCount(HashMap<String, String> map) throws Exception {

		int count = mapper.getCount(map);

		return count;

	}



}
