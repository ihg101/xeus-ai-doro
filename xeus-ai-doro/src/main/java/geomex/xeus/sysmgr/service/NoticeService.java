package geomex.xeus.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  IpService.java
 * 설  명 :
 *   IP관리 서비스
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-06-16      이주영          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 15.
 * @version :  1.0
 * @see
 */
@Service("noticeService")
public class NoticeService extends EgovAbstractServiceImpl {

	@Resource(name = "noticeMapper")
    private NoticeMapper mapper;

	/**
	 * 공지사항 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<NoticeVo> getList(HashMap<String, String> map) throws Exception {

		ArrayList<NoticeVo> list = (ArrayList<NoticeVo>) mapper.getList(map);

		return list;
	}

	/**
	 * 공지사항 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public NoticeVo getItem(HashMap<String, String> map) throws Exception {

		NoticeVo vo = mapper.getItem(map);

		return vo;
	}

	/**
	 * 공지사항을 삭제합니다.
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
	 * 공지사항을 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(NoticeVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 공지사항을 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(NoticeVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 공지사항 수를 조회합니다.
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
