package geomex.xeus.log.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  AssetLogService.java
 * 설  명 :
 *   시설물 관리 로그 서비스
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-04-18      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 04. 18.
 * @version :  1.0
 * @see
 */
@Service("assetLogService")
public class AssetLogService extends EgovAbstractServiceImpl {

	@Resource(name = "assetLogMapper")
    private AssetLogMapper mapper;

	/**
	 * 시설물 관리 로그 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<AssetLogVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<AssetLogVo>) mapper.getList(map);
	}

	/**
	 * 시설물 관리 로그 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public AssetLogVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);
	}

	/**
     * 시설물 관리 로그 수를 조회합니다.
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
	 * 시설물 관리 로그를 삭제합니다.
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
	 * 시설물 관리 로그를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(AssetLogVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 시설물 관리 로그를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(AssetLogVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

}
