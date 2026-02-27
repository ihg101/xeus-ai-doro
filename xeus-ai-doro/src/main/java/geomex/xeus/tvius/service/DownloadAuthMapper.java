package geomex.xeus.tvius.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  DownloadAuthMapper.java
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
@Mapper("downloadAuthMapper")
public interface DownloadAuthMapper {

    public List<DownloadAuthVo> getAuth(HashMap<String, String> map);

    public List<DownloadAuthVo> getAuthPrev(HashMap<String, String> map);

    public int upCount(HashMap<String, String> map);

    public int upPrevCount(HashMap<String, String> map);

}
