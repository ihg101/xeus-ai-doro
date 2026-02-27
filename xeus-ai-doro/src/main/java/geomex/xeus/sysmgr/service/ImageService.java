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
 *   이미지관리 서비스
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
@Service("imageService")
public class ImageService extends EgovAbstractServiceImpl {

	@Resource(name = "imageMapper")
    private ImageMapper mapper;

	/**
	 * 이미지 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<ImageVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<ImageVo>) mapper.getList(map);

	}

	/**
	 * 이미지 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ImageVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);

	}

	/**
	 * 이미지를 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);

		if(state > 0){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 이미지를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public ImageVo add(ImageVo vo) throws Exception {

		return mapper.add(vo);

	}

	/**
	 * 이미지를 추가합니다.
	 * 추가 후 생성된 mgrSeq를 리턴받습니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public ImageVo addAndGetKey(ImageVo vo) throws Exception {

		mapper.addAndGetKey(vo);

		return vo;
	}

	/**
	 * 이미지를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(ImageVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state > 0){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 이미지 수를 조회합니다.
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
