package geomex.xeus.excel.service;

import geomex.xeus.bigdata.service.CctvInstallVo;
import geomex.xeus.bigdata.service.CovidVo;

/**
 * Excel 컨버터에 필요한 유틸 모음.
 *
 * @author JSP_DEV
 *
 */
public class ExcelUtils {

	/**
	 * map 객체를 vo로 치환한다.
	 * - 서초구 전용.
	 * @param vo
	 * @param map
	 * @return
	 */
	public static CctvInstallVo setColToVo(CctvInstallVo vo, String col, String val){
		if("설치년도(4)".equals(col))   vo.setInstYear(val);
		if("설치월(2)".equals(col))		vo.setInstMon(val);
		if("설치일(2)".equals(col))		vo.setInstDay(val);
		if("행정동(5)".equals(col))		vo.setEmd(val);
		if("법정동(10)".equals(col))	vo.setBjd(val);
		if("산(1)".equals(col))			vo.setSan(val);
		if("지번주소(100)".equals(col)) vo.setJibun(val);
		if("경도".equals(col))			vo.setLon(val);
		if("위도".equals(col))			vo.setLat(val);
		if("요청사유1(7)".equals(col))  vo.setRegReqOne(val);
		if("요청사유2(7)".equals(col))  vo.setRegReqTwo(val);
		if("요청내용".equals(col))		vo.setRegReq(val);
		if("설치여부(4)".equals(col))   vo.setInstYn(val);
		if("중복여부(2)".equals(col))   vo.setOvrpYn(val);
		if("민원인(10)".equals(col))	vo.setUserNm(val);
		if("연락처(15)".equals(col))	vo.setUserTell(val);
		if("접수방법(8)".equals(col))   vo.setRegHow(val);
		if("특이사항".equals(col))		vo.setRmark(val);
		if("현장실사(100)".equals(col)) vo.setFieldInsp(val);
		if("처리일시(100)".equals(col)) vo.setResDate(val);

		return vo;
	}

	/**
	 * map 객체를 vo로 치환한다.
	 * - 서초구 전용.
	 * @param vo
	 * @param map
	 * @return
	 */
	public static CctvInstallVo setColToVo(CctvInstallVo vo, int idx, String val){
		if(idx ==  0) vo.setInstYear(val);
		if(idx ==  1) vo.setInstMon(val);
		if(idx ==  2) vo.setInstDay(val);
		if(idx ==  3) vo.setEmd(val);
		if(idx ==  4) vo.setBjd(val);
		if(idx ==  5) vo.setSan(val);
		if(idx ==  6) vo.setJibun(val);
		if(idx ==  7) vo.setLon(val);
		if(idx ==  8) vo.setLat(val);
		if(idx ==  9) vo.setRegReqOne(val);
		if(idx == 10) vo.setRegReqTwo(val);
		if(idx == 11) vo.setRegReq(val);
		if(idx == 12) vo.setInstYn(val);
		if(idx == 13) vo.setOvrpYn(val);
		if(idx == 14) vo.setUserNm(val);
		if(idx == 15) vo.setUserTell(val);
		if(idx == 16) vo.setRegHow(val);
		if(idx == 17) vo.setRmark(val);
		if(idx == 18) vo.setFieldInsp(val);
		if(idx == 19) vo.setResDate(val);

		return vo;
	}

	/**
	 * map 객체를 vo로 치환한다.
	 * - 서초구 전용.
	 * @param vo
	 * @param map
	 * @return
	 */
	public static CovidVo setColToVo(CovidVo vo, String col, String val){
		if("시작시간".equals(col))   vo.setStartDat(val);
		if("위도".equals(col))		vo.setLat(val);
		if("경도".equals(col))		vo.setLon(val);

		return vo;
	}

	public static CovidVo setColToVo(CovidVo vo, int idx, String val){
		if(idx ==  0){
			val = val.replaceAll(" ", "").replaceAll("-", "").replaceAll(":", "");
			if(val.length() > 14) val = val.substring(0, 14);
			vo.setStartDat(val);
		}
		if(idx ==  1) vo.setLat(val);
		if(idx ==  2) vo.setLon(val);

		return vo;
	}

	/**
	 * 파일확장자를 리턴한다.
	 *
	 * @param fileNm
	 * @return
	 */
	public static String getFileExt(String fileNm){

		return fileNm.substring( fileNm.lastIndexOf(".")+1, fileNm.length());
	}


}
