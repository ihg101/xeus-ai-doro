package geomex.xeus.event112.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service
public class CctvPreviewService extends EgovAbstractServiceImpl {

	@Resource(name = "cctvPreviewMapper")
    private CctvPreviewMapper mapper;

	/**
	 * CctvPreview 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<CctvPreviewVo> getList(HashMap<String, String> map) throws Exception {

		ArrayList<CctvPreviewVo> list = (ArrayList<CctvPreviewVo>) mapper.getList(map);

		return list;
	}

	/**
	 * CctvPreview 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public CctvPreviewVo getItem(HashMap<String, String> map) throws Exception {

		CctvPreviewVo vo = mapper.getItem(map);

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
	public boolean add(CctvPreviewVo vo) throws Exception {

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
	public boolean edit(CctvPreviewVo vo) throws Exception {

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

	/**
	 * CctvPreview 공문 전송 여부를 수정합니다.
	 *
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public boolean editDocSendYn(HashMap<String, List<String>> map) throws Exception {

		int state = mapper.editDocSendYn(map);

		if(state >= 1){
			return true;
		}else{
			return false;
		}

	}

}
