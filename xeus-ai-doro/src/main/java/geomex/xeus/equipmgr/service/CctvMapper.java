package geomex.xeus.equipmgr.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  StatusMapper.java
 * 설  명 :
 *   상태 관리 Mapper
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-06-16      이주영          최초 생성
 * 2018-03-23      이은규          투망모니터링용 추가
 *
 * </pre>
 *
 * @since   :  2017. 6. 15.
 * @version :  1.0
 * @see
 */
@Mapper("CctvMapper")
public interface CctvMapper {

	public int getCount(HashMap<String, String> map);

	public List<CctvVo> getList(HashMap<String, String> map);

	public CctvVo getItem(HashMap<String, String> map);

	public CctvVo makeGeometry(HashMap<String, String> map);

	public CctvVo getNetItem(HashMap<String, String> map);

	public CctvVo getBoundingExtent(HashMap<String, List<String>> map);

	public List<CctvVo> getCntOfGbnCd(HashMap<String, String> map);

	public CctvVo getRTSP(HashMap<String, String> map);

	public int del(HashMap<String, String> map);

	public int add(CctvVo vo);

	public int edit(CctvVo vo);

	public int init();

	public CctvVo getVmsItem(HashMap<String, String> map);

	public List<CctvVo> getGbnNm(HashMap<String, String> map);

	public int syncCctv(HashMap<String, String> map);

	public int addAll(CctvVo vo);

    public int delAll(HashMap<String, String> map);
    
    public List<CctvVo> getSpecificList(HashMap<String, String> map);
}
