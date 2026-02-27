package geomex.xeus.tvius.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CrmsTransAviMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 18.      이은규          최초 생성
 * 2017. 12. 04.	  이은규		  관리자 DRM 수정용 기능 추가
 *
 * </pre>
 *
 * @since  : 2017. 10. 18.
 * @version : 1.0
 * @see
 */
@Mapper("crmsTransAviMapper")
public interface CrmsTransAviMapper{

	public int getCount(HashMap<String, String> map);

	public List<CrmsTransAviVo> getList(HashMap<String, String> map);

	public int getPrintCount(HashMap<String, String> map);

	public List<CrmsTransAviVo> getPrintList(HashMap<String, String> map);

	public int getExpDatCount(HashMap<String, String> map);

	public List<CrmsTransAviVo> getExpDatList(HashMap<String, String> map);

    public int add(CrmsTransAviVo CrmsTransAviVo);

    public int update(CrmsTransAviVo CrmsTransAviVo);

    public int editDrm(CrmsTransAviVo CrmsTransAviVo);

    public int del(HashMap<String, String> map);

    public int editAviInfo(HashMap<String, String> map);

}