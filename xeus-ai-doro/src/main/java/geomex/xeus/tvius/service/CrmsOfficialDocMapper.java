package geomex.xeus.tvius.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CrmsOfficialDocMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 12. 17.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2018. 12. 17.
 * @version : 1.0
 * @see
 */
@Mapper("crmsOfficialDocMapper")
public interface CrmsOfficialDocMapper{

    public List<CrmsOfficialDocVo> getList(HashMap<String, String> map);

    public CrmsOfficialDocVo getItem(HashMap<String, String> map);

    public int getCount(HashMap<String, String> map);

    //add랑 update는 필요없을것 같아 생략
    /*public int add(CrmsOfficialDocVo crmsOfficialDocVo);

    public int update(CrmsOfficialDocVo crmsOfficialDocVo);*/

    public int del(HashMap<String, String> map);

}