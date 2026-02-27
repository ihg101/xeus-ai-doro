package gmx.gis.user.service;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  GMT_UserMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 * 2019-04-01	   이은규		   서약서 수정 메소드 추가
 *
 * </pre>
 *
 * @since   :  2017. 5. 31.
 * @version :  1.0
 * @see
 */
@Mapper
public interface GMT_UserMapper {

	public int getCount(HashMap<String, String> map);


	public List<GMT_UserVo> getList(HashMap<String, String> map);


	public GMT_UserVo getItem(HashMap<String, String> map);


	public List<GMT_UserVo> getAgeStat(HashMap<String, String> map);


	public int del(HashMap<String, String> map);


	public int add(GMT_UserVo vo);


	public int edit(GMT_UserVo vo);


	public int editBoardInfo(HashMap<String, String> map);

	public int editPassword(HashMap<String, String> map);

	public int editPasswordAdmin(HashMap<String, String> map);

	public int editAuthAtmtCnt(HashMap<String, String> map);

	public int editPledge(HashMap<String, String> map);

}
