package gmx.gis.util.code;

import java.util.ArrayList;
import java.util.HashMap;

import gmx.gis.sysmgr.service.GMT_CodeVo;

/**
 *
* <pre>
* 파일명 :  GMT_CodeConvertor.java
* 설  명 :
*   클래스 설명을 쓰시오
*
* == 개정이력(Modification Information) ==
* 수정일          수정자          수정내용
* ----------      -----------     ---------------------------
* 2016-02-01      홍길동          최초 생성
*
* </pre>
*
* @since   :  2017. 3. 23.
* @version :  1.0
* @see
 */
public class GMT_CodeConvertor {

	private ArrayList<GMT_CodeVo> cde;
	private int cdeSize;

	public GMT_CodeConvertor(ArrayList<GMT_CodeVo> cde) {
		this.cde = cde;
		this.cdeSize = cde.size();
	}


	/**
	 * <pre>
	 * 코드명으로 한글명을 찾아 리턴합니다.
	 * </pre>
	 * @param code - 코드명
	 * @return str - 코드한글명
	 */
	public String convertCodeToName(String code){
		String str = "";

		if(!"".equals(code) && code != null){
			for(int i=0; i<cdeSize; i++){
				if(cde.get(i).getCdeCde().trim().equals(code.trim())){
					str = cde.get(i).getCdeNm().trim();
				}
			}
		}else{
			str = "";
		}

		return str;
	}

	/**
	 * <pre>
	 * 코드명으로 한글명을 찾아 리턴합니다.
	 * </pre>
	 * @param group - 그룹코드
	 * @param code - 코드명
	 * @return str - 코드한글명
	 */
	public String convertCodeToName(String group, String code){
		String str = "";

		if(!"".equals(code) && code != null && !"".equals(group) && group != null){
			for(int i=0; i<cdeSize; i++){
				if(cde.get(i).getGrpCde().trim().equals(group.trim()) && cde.get(i).getCdeCde().trim().equals(code.trim())){
					str = cde.get(i).getCdeNm().trim();
				}
			}
		}else{
			str = "";
		}

		return str;
	}

	/**
	 * <pre>
	 * 한글명으로 코드명을 찾아 리턴합니다.
	 * </pre>
	 * @param name - 코드한글명
	 * @return str - 코드명
	 */
	public String convertNameToCde(String name){
		String str = "";

		if(!"".equals(name) && name != null){
			for(int i=0; i<cdeSize; i++){
				if(cde.get(i).getCdeNm().trim().equals(name.trim())){
					str = cde.get(i).getCdeCde().trim();
				}
			}
		}else{
			str = "";
		}

		return str;
	}

	/**
	 * <pre>
	 * 코드명으로 한글명 상세를 찾아 리턴합니다.
	 * </pre>
	 * @param code - 코드명
	 * @return str - 코드한글명 상세
	 */
	public String convertCodeToAllName(String code){
		String str = "";

		if(!"".equals(code) && code != null){
			for(int i=0; i<cdeSize; i++){
				if(cde.get(i).getCdeCde().trim().equals(code.trim())){
					str = cde.get(i).getCdeNm().trim();
				}
			}
		}else{
			str = "";
		}

		return str;
	}

	/**
	 * <pre>
	 * 코드그룹명에 해당하는 모든 코드를 리턴합니다.
	 * </pre>
	 * @param cde_grp - 코드그룹명
	 * @return HashMap<String, String> - 코드명 & 한글명
	 */
	public HashMap<String, String> convertCodeGrpToAllCde(String cde_grp){
		HashMap<String, String> map = null;

		if(!"".equals(cde_grp) && cde_grp != null){

			map = new HashMap<String, String>();

			for(int i=0; i<cdeSize; i++){
				if(cde.get(i).getGrpCde().trim().equals(cde_grp.trim())){
					map.put(cde.get(i).getCdeCde().trim(), cde.get(i).getCdeNm().trim());
				}
			}
		}

		return map;
	}

	/**
	 * <pre>
	 * 코드그룹명에 해당하는 모든 코드 설명을 리턴합니다.
	 * </pre>
	 * @param cde_grp - 코드그룹명
	 * @return HashMap<String, String> - 코드명 & 코드설명
	 */
	public HashMap<String, String> convertCodeGrpToAllCdeDsc(String cde_grp){
		HashMap<String, String> map = null;

		if(!"".equals(cde_grp) && cde_grp != null){

			map = new HashMap<String, String>();

			for(int i=0; i<cdeSize; i++){
				if(cde.get(i).getGrpCde().trim().equals(cde_grp.trim())){
					map.put(cde.get(i).getCdeCde().trim(), cde.get(i).getCdeNm().trim());
				}
			}
		}

		return map;
	}

}
