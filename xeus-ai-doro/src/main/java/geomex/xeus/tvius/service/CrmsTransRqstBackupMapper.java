package geomex.xeus.tvius.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CrmsTransRqstBackupMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2019. 07. 19.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2019. 07. 19.
 * @version : 1.0
 * @see
 */
@Mapper("crmsTransRqstBackupMapper")
public interface CrmsTransRqstBackupMapper{

	public int getCount(HashMap<String, String> map);

	public List<CrmsTransRqstVo> getList(HashMap<String, String> map);

}