package geomex.xeus.tvius.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CrmsImageMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 10. 08.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2018. 10. 08.
 * @version : 1.0
 * @see
 */
@Mapper("crmsImageMapper")
public interface CrmsImageMapper{

	public int getCount(HashMap<String, String> map);

    public List<CrmsImageVo> getList(HashMap<String, String> map);

    public int add(CrmsImageVo crmsImageVo);

    public CrmsImageVo addAndGetItem(CrmsImageVo crmsImageVo);

    public int update(CrmsImageVo crmsImageVo);

    public int del(HashMap<String, String> map);

}