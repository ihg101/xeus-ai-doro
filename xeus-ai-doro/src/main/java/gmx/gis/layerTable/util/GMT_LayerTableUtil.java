package gmx.gis.layerTable.util;



import java.util.ArrayList;
import java.util.HashMap;


import gmx.gis.sysmgr.service.GMT_ColumnVo;

/**
 * @author 민동현
 *
 */
public class GMT_LayerTableUtil {

	/**
	 * 데이터 유효성 검사를 합니다
	 *
	 * @param map
	 * @return
	 */
	public static String findError(HashMap<String, String> map) {
		String result="pass";
		try{
			//테이블 정보 유효성 체크
			if(!"pass".equals(validateTableInfo(map))){
				result=validateTableInfo(map);
			}
			//컬럼 정보 유효성 체크
			if(!"pass".equals(validateColumnInfo(map,1))){
				result=validateColumnInfo(map,1);
			}
		}catch(Exception e){
			e.printStackTrace();
			result="데이터 유효성 검사 중 서버에서 오류가 발생했습니다.";
		}
		return result;
	}


	/**
	 * 테이릅 정보 데이터 유효성 검사를 합니다
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	private static String validateTableInfo(HashMap<String, String> map) throws Exception {
//		String tblNm=map.get("tblNm");
	    String tblKrNm=map.get("tblKrNm");
	    String lyrTyp=map.get("lyrTyp");
	    String colCnt=map.get("colCnt");

	    String msg="pass";

//		if(!"pass".equals(validateTblNm(tblNm))){
//			msg=validateTblNm(tblNm);
//		}
		if(!"pass".equals(validateTblKrNm(tblKrNm))){
			msg=validateTblKrNm(tblKrNm);
		}
		else if(!"pass".equals(validateLyrTyp(lyrTyp))){
			msg= validateLyrTyp(lyrTyp);
		}
		else if(!"pass".equals(validateColCnt(colCnt))){
			msg=validateColCnt(colCnt);
		}
	    return msg;
	}


//	private static String validateTblNm(String tblNm) {
//		String msg="pass";
//
//		if(tblNm==null || "".equals(tblNm)){
//			msg="테이블 영문 명칭을 입력해주세요.";
//		}
//		else if(isSpecialCharactersExceptUnderBar(tblNm)){
//			msg="테이블 영문 명칭에 _(언더바)를 제외한 특수문자는 사용할 수 없습니다.";
//		}
//
//		return msg;
//	}

	private static String validateTblKrNm(String tblKrNm) {
		String msg="pass";

		if(tblKrNm==null || "".equals(tblKrNm)){
			msg="테이블 한글 명칭을 입력해주세요.";
		}

		return msg;
	}
	private static String validateLyrTyp(String lyrTyp) {
		String msg="pass";

		if(lyrTyp==null || "".equals(lyrTyp)){
			msg="공간정보 타입을 선택해주세요.";
		}
		else if(!"line".equals(lyrTyp)&&!"point".equals(lyrTyp)&&!"polygon".equals(lyrTyp)){
			msg="공간정보 타입은 포인트(점),라인(선),폴리곤(면)만 가능합니다.";
		}

		return msg;
	}
	private static String validateColCnt(String colCnt) {
		String msg="pass";

		if(colCnt==null || "".equals(colCnt)){
			msg="데이터 유효성 검사 중 서버에서 오류가 발생했습니다.";
		}
		else if(Integer.parseInt(colCnt)<=2){
			msg="위도,경도 외의 1개이상의 필드가 필요합니다.";
		}

		return msg;
	}

	/**
	 * 컬럼정보 데이터 유효성 검사를 합니다
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	private static String validateColumnInfo(HashMap<String, String> map,int n) throws Exception {
		String result="pass";
		int colCnt=Integer.parseInt(map.get("colCnt"));

		for(int i=2; i<colCnt; i++){
			String colNm=map.get("colNm"+i);
			String colKrNm=map.get("colKrNm"+i);
			String colType=map.get("colType"+i);
			String colLen=map.get("colLen"+i);

			String msg=validateColInfo(colNm,colKrNm, colType, colLen);
			if(!"pass".equals(msg)){
				result=(i+n)+"번째 row의 "+msg;
				break;
			}
		}
		return result;
	}


	private static String validateColInfo(String colNm, String colKrNm, String colType, String colLen) throws Exception {

		String msg="pass";

		if(!"pass".equals(validateColNm(colNm))){
			msg=validateColNm(colNm);
		}
		else if(!"pass".equals(validateColKrNm(colKrNm))){
			msg=validateColKrNm(colKrNm);
		}
		else if(!"pass".equals(validateColType(colType))){
			msg= validateColType(colType);
		}
		else if(!"pass".equals(validateColLen(colType,colLen))){
			msg=validateColLen(colType,colLen);
		}

		return msg;
	}


	private static String validateColNm(String colNm) {
		String msg="pass";

		if(colNm==null || "".equals(colNm)){
			msg="필드 영문명을 입력해주세요.";
		}
		else if(isSpecialCharactersExceptUnderBar(colNm)){
			msg="필드 영문명에 _(언더바)를 제외한 특수문자는 사용할 수 없습니다.";
		}

		return msg;
	}


	private static String validateColKrNm(String colKrNm) {
		String msg="pass";

		if(colKrNm==null || "".equals(colKrNm)){
			msg="필드 한글명을 입력해주세요.";
		}

		return msg;
	}

	private static String validateColType(String colType) {
		String msg="pass";

		if(colType==null || "".equals(colType)){
			msg="필드 타입을 선택해주세요.";
		}

		return msg;
	}
	private static String validateColLen(String colType, String colLen) {
		String msg="pass";

		if("text".equals(colType)){
			msg="pass";
		}
		else if((colLen==null || "".equals(colLen)) && "integer".equals(colType)){
			msg="pass";
		}
		else if((colLen==null || "".equals(colLen)) && "character varying".equals(colType)){
			msg="pass";
		}
		else if(colLen==null || "".equals(colLen)){
			msg="필드 길이를 입력해주세요.";
		}
		else if(!"pass".equals(isOutOfRange(colType,colLen))){
			msg=isOutOfRange(colType,colLen);
		}
		else if(!"pass".equals(isOutOfRangeOfDecimalPoint(colLen))){
			msg=isOutOfRangeOfDecimalPoint(colLen);
		}
		return msg;
	}

	private static String isOutOfRange(String colType, String colLen) {
		String result="pass";
		String list[]=colLen.split(",");
		int num=Integer.parseInt(list[0]);
		if("varchar".equals(colType)){
			if(num<=0 || num>=10485761){
				result="varchar 자료형의 길이는 최소 1이상, 최대 10485760 이하여야합니다";
			}
		}
		else if( "numeric".equals(colType)){
			if(num<=0 || num>=1001){
				result="numeric 자료형의 길이는 최소 1이상, 최대 1000 이하여야합니다";
			}
		}
		return result;
	}
	private static String isOutOfRangeOfDecimalPoint(String colLen) {
		String result="pass";
		try{
			if(colLen.contains(",")){
				String list[]=colLen.split(",");
				if(Integer.parseInt(list[0])<Integer.parseInt(list[1])){
					result="소수점이 더 클 순 없습니다.";
				}
			}
		}catch(Exception e){
			result="데이터 유효성 검사 중 서버에서 오류가 발생했습니다.";
		}
		return result;
	}
//	private static boolean isInteger(String s) {
//		try {
//			Integer.parseInt(s);
//	        return true;
//	    } catch(Exception e) {
//	    	return false;
//	    }
//	}
//	private static boolean isDouble(String s) {
//		try {
//			Double.parseDouble(s);
//	        return true;
//	    } catch(NumberFormatException e) {
//	    	return false;
//	    }
//	}

	private static boolean isSpecialCharactersExceptUnderBar(String str) {
		boolean result;
		if(str.contains("_")){
			String exceptUnderbar=str.replace("_", "");
			result = !exceptUnderbar.matches ("[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힝]*");
		}else{
			result = !str.matches ("[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힝]*");
		}

		return result;
	}

	/**
	 * 데이터 유효성 검사를 합니다(컬럼에러, 컬럼길이 에러)
	 *
	 * @param map
	 * @param list
	 * @return
	 */
	public static String findColumnErrorAndFindColumnLenError(HashMap<String, String> map, ArrayList<GMT_ColumnVo> list) {
		String result="pass";
		try{
			//컬럼 정보 유효성 체크
			if(!"pass".equals(validateColumnInfo(map,-1))){
				result=validateColumnInfo(map,-1);
			}
			if(!"pass".equals(validateAllColumnLen(map,list))){
				result=validateAllColumnLen(map,list);
			}
		}catch(Exception e){
			e.printStackTrace();
			result="데이터 유효성 검사 중 서버에서 오류가 발생했습니다.";
		}
		return result;
	}
	/**
	 * 컬럼 길이가 기존보다 작은 지 검사한다
	 *
	 * @param map
	 * @param list
	 * @return
	 * @throws Exception
	 */
	private static String validateAllColumnLen(HashMap<String, String> map, ArrayList<GMT_ColumnVo> list) throws Exception {
		String result="pass";
		int colCnt=Integer.parseInt(map.get("colCnt"));

		for(int i=2; i<colCnt; i++){
			String msg=validateOneColumnLen(map,list,i);
			if(!"pass".equals(msg)){
				result=(i-1)+"번째 row의 "+msg;
				break;
			}
		}
		return result;
	}


	private static String validateOneColumnLen(HashMap<String, String> map, ArrayList<GMT_ColumnVo> list, int i) throws Exception {
		String msg="pass";

		String colUid=map.get("colUid"+i);

		for(int j=0; j<list.size(); j++){
			//현재 컬럼을 찾는다
			if(list.get(j).getColUid().equals(colUid)){
				if("character varying".equals(list.get(j).getDataType())){




					//character varying 타입 필드의 길이를 0으로 수정할 때
					if("".equals(map.get("colLen"+i)) || map.get("colLen"+i) == null){
						continue;
					}
					//기존 character varying 타입의 길이가 0일 때
					if("".equals(list.get(j).getStringSize()) || list.get(j).getStringSize() == null){
						if("".equals(map.get("colLen"+i)) || map.get("colLen"+i) == null){
							continue;
						}
						//기존 character varying이 0이면, 필드 길이 수정 불가능
						else{
							msg="필드 타입이 character varying이고 필드 길이가 0입니다. 해당 필드 수정이 불가합니다.";
							break;
						}
					}


					int colLen=Integer.parseInt(map.get("colLen"+i));

					if(Integer.parseInt(list.get(j).getStringSize())>colLen){
						msg="필드 길이는 기존 컬럼길이인 "+Integer.parseInt(list.get(j).getStringSize())+" 보다 큰 것만 가능합니다.";
					}
				}
				else if("numeric".equals(list.get(j).getDataType())){
					int colLen=Integer.parseInt((String) map.get("colLen"+i).split(",")[0]);

					if((list.get(j).getNumericPrecision())>colLen){
						msg="필드 길이는 기존 컬럼길이인 "+(list.get(j).getNumericPrecision())+" 보다 큰 것만 가능합니다.";
					}
				}
			}
		}

		return msg;
	}


	/**
	 * 데이터 유효성 검사를 합니다(컬럼 한개)
	 *
	 * @param map
	 * @param list
	 * @return
	 */
	public static String findOneColumnError(HashMap<String, String> map) {
		String result="pass";

		String colNm=map.get("colNm");
		String colKrNm=map.get("colKrNm");
		String colType=map.get("colType");
		String colLen=map.get("colLen");

		try{
			//컬럼 정보 유효성 체크
			if(!"pass".equals(validateColInfo(colNm,colKrNm, colType, colLen))){
				result=validateColInfo(colNm,colKrNm, colType, colLen);
			}

		}catch(Exception e){
			e.printStackTrace();
			result="데이터 유효성 검사 중 서버에서 오류가 발생했습니다.";
		}
		return result;
	}


}