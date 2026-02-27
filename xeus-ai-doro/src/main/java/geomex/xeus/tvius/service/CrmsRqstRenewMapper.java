package geomex.xeus.tvius.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CrmsRqstRenewMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 11. 06.      이은규          최초 생성
 * 2017. 12. 06.	  이은규		  승인, 거절 파라미터 map으로 변경
 *
 * </pre>
 *
 * @since  : 2017. 11. 06.
 * @version : 1.0
 * @see
 */
@Mapper("crmsRqstRenewMapper")
public interface CrmsRqstRenewMapper {

	public int getCount(HashMap<String, String> map);

	public List<CrmsRqstRenewVo> getList(HashMap<String, String> map);

	//public List<CrmsRqstRenewVo> getMngList(HashMap<String, String> map);

	//public List<HashMap<String, Object>> getXls(QueryParam queryParam);

	public CrmsRqstRenewVo getItem(HashMap<String, String> map);

	public int add(CrmsRqstRenewVo CrmsRqstRenewVo);

	public int updateAcpt(HashMap<String, String> map);

	public int updateRejt(HashMap<String, String> map);

	public int del(HashMap<String, String> map);

	public HashMap<String, String> getStatCount(HashMap<String, String> map);

}
