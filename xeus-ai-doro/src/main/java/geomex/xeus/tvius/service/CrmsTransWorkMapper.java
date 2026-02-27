package geomex.xeus.tvius.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CrmsTransWorkMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 06. 18.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2018. 06. 18.
 * @version : 1.0
 * @see
 */
@Mapper("crmsTransWorkMapper")
public interface CrmsTransWorkMapper{

	public int getCount(HashMap<String, String> map);

	public List<CrmsTransWorkVo> getList(HashMap<String, String> map);

	public CrmsTransWorkVo getItem(HashMap<String, String> map);

	public List<CrmsTransWorkVo> getDelListByUseRsCd(HashMap<String, String> map);

    public int add(CrmsTransWorkVo CrmsTransWorkVo);

    public int edit(CrmsTransWorkVo CrmsTransWorkVo);

    public int del(HashMap<String, String> map);

    public int editWorkInfo(HashMap<String, String> map);

}