package geomex.xeus.tvius.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CrmsCctvStatMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 22.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 10. 22.
 * @version : 1.0
 * @see
 */
@Mapper("crmsCctvStatMapper")
public interface CrmsCctvStatMapper{

	public int getCount(HashMap<String, String> map);

	public List<CrmsCctvStatVo> getList(HashMap<String, String> map);

    public int add(CrmsCctvStatVo CrmsCctvStatVo);

    public int update(CrmsCctvStatVo CrmsCctvStatVo);

    public int del(HashMap<String, String> map);

}