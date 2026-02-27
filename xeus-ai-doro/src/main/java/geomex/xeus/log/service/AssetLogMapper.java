package geomex.xeus.log.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  AssetLogMapper.java
 * 설  명 :
 *   시설물 관리 로그 Mapper
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-04-18      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 04. 18.
 * @version :  1.0
 * @see
 */
@Mapper("assetLogMapper")
public interface AssetLogMapper {

	public List<AssetLogVo> getList(HashMap<String, String> map);

	public AssetLogVo getItem(HashMap<String, String> map);

	public int getCount(HashMap<String, String> map);

	public int del(HashMap<String, String> map);

	public int add(AssetLogVo vo);

	public int edit(AssetLogVo vo);

}
