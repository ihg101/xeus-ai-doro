package geomex.xeus.tvius.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CrmsImageRqstMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 10. 08.      이은규          최초 생성
 * 2019. 03. 27.	  이은규		  최종공문확인 변경 메소드 추가
 * 									  공문 수정 메소드 추가
 * 									  공문번호 수정 메소드 추가
 * 2019. 08. 27.	  이은규		 getItem 메소드 추가
 *
 * </pre>
 *
 * @since  : 2018. 10. 08.
 * @version : 1.0
 * @see
 */
@Mapper("crmsImageRqstMapper")
public interface CrmsImageRqstMapper{

	public int getCount(HashMap<String, String> map);

    public List<CrmsImageRqstVo> getList(HashMap<String, String> map);

    public CrmsImageRqstVo getItem(HashMap<String, String> map);

    public List<CrmsImageVo> getImgList(HashMap<String, String> map);

    public int add(CrmsImageRqstVo crmsImageRqstVo);

    public int update(CrmsImageRqstVo crmsImageRqstVo);

    public int del(HashMap<String, String> map);

    public int addJoin(CrmsImageRqstVo crmsImageRqstVo);

    public int delJoin(HashMap<String, String> map);

    public int updateProcStatCd(HashMap<String, String> map);

    public int updateDocNo(HashMap<String, String> map);

    public int updateDocFileInfo(HashMap<String, String> map);

    public int updateDocChngYn(HashMap<String, String> map);

}