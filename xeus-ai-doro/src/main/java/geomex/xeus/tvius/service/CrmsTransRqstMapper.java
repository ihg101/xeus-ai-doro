package geomex.xeus.tvius.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CrmsTransRqstMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 16.      이은규          최초 생성
 * 2017. 10. 18.	  이은규		  기존 Tvius Mapper 추가
 * 2017. 11. 17.	  이은규		  관리자 대시보드용 페이지 카운트 추가
 * 2018. 01. 11.      이은규          관리자 영상반출 상세보기용 메소드 추가
 * 2019. 03. 25.	  이은규		  최종공문확인 변경 메소드 추가, 공문 수정 메소드 추가
 * 2019. 03. 26.	  이은규		  공문번호 수정 메소드 추가
 * 2019. 07. 18.	  이은규		  반출 건 백업(public 스키마로 이동) 메소트 추가
 * 2019. 08. 27.	  이은규		 getItem 메소트 추가
 *
 * </pre>
 *
 * @since  : 2017. 10. 16.
 * @version : 1.0
 * @see
 */
@Mapper("crmsTransRqstMapper")
public interface CrmsTransRqstMapper{

	//DataSet 있을때 쓰는건데 없어도 될거같음.
	//public int getHeatCount(HashMap<String, String> map);

	public int getCount(HashMap<String, String> map);

	public List<CrmsTransRqstVo> getList(HashMap<String, String> map);

	public CrmsTransRqstVo getItem(HashMap<String, String> map);

	public List<CrmsImageVo> getImgList(HashMap<String, String> map);

	public List<CrmsTransRqstVo> getHeatMap(HashMap<String, String> map);

	//사용 안함.
    //public List<CrmsTransRqstVo> getRenewList(HashMap<String, String> map);

    //public List<CrmsTransRqstVo> getXls(HashMap<String, String> map);

    //public CrmsTransRqst getItem(JSONArray paramJSONArray);

    public int add(CrmsTransRqstVo CrmsTransRqstVo);

    //add랑 똑같음, 만들 필요 없음.
    //public int rqst(/*CrmsTransRqstVo paramCrmsTransRqst*/);

    public int update(CrmsTransRqstVo CrmsTransRqstVo);

    public int updateUrgToUsual(HashMap<String, String> map);

    public int updateProcStatCd(HashMap<String, String> map);

    public int updateUseRsCd(HashMap<String, String> map);

    public int updateDocNo(HashMap<String, String> map);

    public int updateReqstDetail(HashMap<String, String> map);

    public int updateDocFileInfo(HashMap<String, String> map);

    public int updateDocChngYn(HashMap<String, String> map);

    public int del(HashMap<String, String> map);

    public List<CrmsTransRqstVo> getStatCount(HashMap<String, String> map);

    public List<CrmsTransRqstVo> getUseRstCount(HashMap<String, String> map);

    public int getYearCount(HashMap<String, String> map);

    public List<CrmsTransRqstVo> getMonthCount(HashMap<String, String> map);

    public List<CrmsTransRqstVo> getPageCnt(HashMap<String, String> map);

    public List<CrmsTransRqstVo> getUserRqstStatCnt(HashMap<String, String> map);

    public int changeRqst(HashMap<String, String> map);

    public List<CrmsTransRqstVo> getUseRsSmsList(HashMap<String, String> map);

    public ArrayList<Integer> getReportRqstList(HashMap<String, String> map);

}