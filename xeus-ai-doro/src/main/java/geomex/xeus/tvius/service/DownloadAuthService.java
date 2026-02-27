package geomex.xeus.tvius.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  DownloadAuthService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 11. 30.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 11. 30.
 * @version : 1.0
 * @see
 */
@Service("downloadAuthService")
public class DownloadAuthService {

	@Resource(name="downloadAuthMapper")
    private DownloadAuthMapper mapper;

	/**
	 * 영상 다운로드 권한을 조회한다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<DownloadAuthVo> getAuth(HashMap<String, String> map) throws Exception {

        ArrayList<DownloadAuthVo> list = (ArrayList<DownloadAuthVo>) mapper.getAuth(map);

        return list;
    }

    /**
	 * 미리보기 영상 다운로드 권한을 조회한다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<DownloadAuthVo> getAuthPrev(HashMap<String, String> map) throws Exception {

        ArrayList<DownloadAuthVo> list = (ArrayList<DownloadAuthVo>) mapper.getAuthPrev(map);

        return list;
    }

    /**
	 * 영상 다운로드 횟수를 변경합니다.
	 *
	 * @param map
	 * @return boolean
	 * @throws Exception
	 */
    public boolean upCount(HashMap<String, String> map) throws Exception {

        int result =  mapper.upCount(map);

        if(result == 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 미리보기 영상 다운로드 횟수를 변경합니다.
	 *
	 * @param map
	 * @return boolean
	 * @throws Exception
	 */
    public boolean upPrevCount(HashMap<String, String> map) throws Exception {

        int result =  mapper.upPrevCount(map);

        if(result == 1){
			return true;
		}else{
			return false;
		}

    }

}
