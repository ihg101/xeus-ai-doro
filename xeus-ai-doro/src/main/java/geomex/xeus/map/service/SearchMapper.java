package geomex.xeus.map.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  SearchDao.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 5. 29.      전우람          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 5. 29.
 * @version : 1.0
 * @see
 */
@Mapper("searchMapper")
public interface SearchMapper{

    public List<EmdVo> getEmdList();

    public List<LiVo> getLiList();

    public List<DoroVo> getRnList();

    public List<JibunSearchVo> getAddrSearchJibun(HashMap<String, String> map);

    public List<JibunSearchVo> getAddrSearchList(HashMap<String, String> map);

    public List<DoroSearchVo> getNewAddrSearchList(HashMap<String, String> map);

    public List<LocationVo> getLocation(HashMap<String, String> map);

    public String getCenterName(HashMap<String, String> map);

    public List<BuldVo> getBuldSearchList(HashMap<String, String> map);

}