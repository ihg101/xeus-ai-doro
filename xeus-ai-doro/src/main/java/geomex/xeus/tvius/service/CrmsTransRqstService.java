package geomex.xeus.tvius.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import geomex.xeus.equipmgr.service.CableVo;
import geomex.xeus.util.code.DateUtil;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  CrmsTransRqstService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 16.      이은규          최초 생성
 * 2017. 10. 18.      이은규          기존 Tvius Service 기능 추가
 * 2018. 01. 11.      이은규          관리자 영상반출 상세보기용 메소드 추가
 * 2019. 03. 25.	  이은규		  최종공문확인 변경 메소드 추가, 공문 수정 메소드 추가
 * 2019. 03. 26.	  이은규		  공문번호 수정 메소드 추가
 * 2019. 07. 18.	  이은규		  반출 건 백업(public 스키마로 이동) 메소트 추가
 * 2019. 08. 27.	  이은규		 getList 메소드 추가
 *
 * </pre>
 *
 * @since  : 2017. 10. 16.
 * @version : 1.0
 * @see
 */
@Service("crmsTransRqstService")
public class CrmsTransRqstService extends EgovAbstractServiceImpl{
    @Resource(name="crmsTransRqstMapper")
    private CrmsTransRqstMapper mapper;

    /**
	 * 영상 신청 목록 갯수를 리턴합니다.
	 *
	 * @param map
	 * @return cnt
	 * @throws Exception
	 */
    public int getCount(HashMap<String, String> map) throws Exception {

        int cnt =  mapper.getCount(map);

        return cnt;
    }

    /**
	 * 영상 신청 목록을 조회합니다.
	 * 엑셀 조회 및 한 개의 신청 건수를 조회할때도 사용됩니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsTransRqstVo> getList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsTransRqstVo> list = (ArrayList<CrmsTransRqstVo>) mapper.getList(map);

        return list;
    }

    /**
	 * 영상 신청 단건을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public CrmsTransRqstVo getItem(HashMap<String, String> map) throws Exception {

        return mapper.getItem(map);


    }

    /**
     * 이미지 반출 목록을 조회합니다.
     *
     * @param map
     * @return list
     * @throws Exception
     */
    public ArrayList<CrmsImageVo> getImgList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsImageVo> list = (ArrayList<CrmsImageVo>) mapper.getImgList(map);

        return list;
    }

    /**
	 * 영상 반출 히트맵 데이터를 조회합니다.
	 *
	 * @param map
	 * @return rst
	 * @throws Exception
	 */
    public ArrayList<CrmsTransRqstVo> getHeatMap(HashMap<String, String> map) throws Exception {

    	return (ArrayList<CrmsTransRqstVo>) mapper.getHeatMap(map);
    }

    /**
	 * 영상 연장, 증거신청 조회용 데이터를 검색합니다.
	 * 신청번호, CCTV관리번호가 리턴됩니다.
	 *
	 *
	 * 현재 사용 안함.
	 *
	 *
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    /*public ArrayList<CrmsTransRqstVo> getRenewList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsTransRqstVo> list = (ArrayList<CrmsTransRqstVo>) mapper.getRenewList(map);

        return list;
    }*/

    /**
	 * 영상 신청 건수를 DB에 추가합니다.
	 * 신청일, 처리상태, 수령방법이 Vo에 추가됩니다.
	 *
	 * @param crmsTransRqstVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean add(CrmsTransRqstVo crmsTransRqstVo) throws Exception {
    	String nowTime = DateUtil.getStrSec();
    	crmsTransRqstVo.setReqstDat(nowTime);
    	crmsTransRqstVo.setRecvMthd("FD");
    	//긴급반출인 경우
    	if("13".equals(crmsTransRqstVo.getReqGbnCd())) {
	        crmsTransRqstVo.setProcStatCd("SA");
	        //181203 이은규 추가
	        //긴급반출 신청당시에는 신청자가 곧 승인자이므로 신청자아이디와 승인자아이디가 동일.
	        crmsTransRqstVo.setAcptUserId(crmsTransRqstVo.getReqstId());
	        //신청일과 승인일은 같을수밖에 없다.
    		crmsTransRqstVo.setAcptDat(nowTime);
    	}else
    	    crmsTransRqstVo.setProcStatCd("SW");

        int result =  mapper.add(crmsTransRqstVo);

        if(result >= 1){
			return true;
		}else{
			return false;
		}
    }

    /**
	 * 기존 영상 신청 정보를 수정합니다.
	 *
	 * @param crmsTransRqstVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean update(CrmsTransRqstVo crmsTransRqstVo) throws Exception {

        int result =  mapper.update(crmsTransRqstVo);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
     * 긴급반출 건을 일반반출로 전환합니다.
     *
     * @param crmsTransRqstVo
     * @return boolean
     * @throws Exception
     */
    public boolean updateUrgToUsual(HashMap<String, String> map) throws Exception {

        int result =  mapper.updateUrgToUsual(map);

        if(result >= 1){
            return true;
        }else{
            return false;
        }

    }

    /**
	 * 영상 신청 건의 처리상태를 수정합니다.
	 *
	 * @param map
	 * @return boolean
	 * @throws Exception
	 */
    public boolean updateProcStatCd(HashMap<String, String> map) throws Exception {

    	if(map.containsKey("acptUserId")) map.put("acptDat", DateUtil.getStrSec());

        int result =  mapper.updateProcStatCd(map);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 영상 신청 건의 활용결과를 수정합니다.
	 *
	 * @param map
	 * @return boolean
	 * @throws Exception
	 */
    public boolean updateUseRsCd(HashMap<String, String> map) throws Exception {

        int result =  mapper.updateUseRsCd(map);

        if(result == 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 영상 신청 건의 공문번호를 수정합니다.
	 *
	 * @param map
	 * @return boolean
	 * @throws Exception
	 */
    public boolean updateDocNo(HashMap<String, String> map) throws Exception {

        int result =  mapper.updateDocNo(map);

        if(result == 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 영상 신청 건의 신청내용을 수정합니다.
	 *
	 * @param map
	 * @return boolean
	 * @throws Exception
	 */
    public boolean updateReqstDetail(HashMap<String, String> map) throws Exception {

        int result =  mapper.updateReqstDetail(map);

        if(result == 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 영상 신청 건의 공문정보를 수정합니다.
	 *
	 * @param map
	 * @return boolean
	 * @throws Exception
	 */
    public boolean updateDocFileInfo(HashMap<String, String> map) throws Exception {

        int result =  mapper.updateDocFileInfo(map);

        if(result == 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 영상 신청 건의 최종공문확인값을 수정합니다.
	 *
	 * @param map
	 * @return boolean
	 * @throws Exception
	 */
    public boolean updateDocChngYn(HashMap<String, String> map) throws Exception {

        int result =  mapper.updateDocChngYn(map);

        if(result == 1){
			return true;
		}else{
			return false;
		}

    }

    /**
     * 영상 신청 정보를 삭제합니다.
     *
     * @param map
     * @return boolean
     * @throws Exception
     */
    public boolean del(HashMap<String, String> map) throws Exception {

        int result =  mapper.del(map);

        if(result >= 1){
            return true;
        }else{
            return false;
        }

    }

    /**
	 * 영상 신청 건수 처리상태를 조회합니다.
	 * 처리상태 별 카운트가 리턴됩니다.
	 *
	 * @param map
	 * @return rst
	 * @throws Exception
	 */
    public ArrayList<CrmsTransRqstVo> getStatCount(HashMap<String, String> map) throws Exception {

    	return (ArrayList<CrmsTransRqstVo>) mapper.getStatCount(map);

    }

    /**
	 * 활용결과 미입력 건수를 리턴합니다.
	 *
	 * @param map
	 * @return rst
	 * @throws Exception
	 */
    public ArrayList<CrmsTransRqstVo> getUseRstCount(HashMap<String, String> map) throws Exception {

    	return (ArrayList<CrmsTransRqstVo>) mapper.getUseRstCount(map);

    }

    /**
	 * 입력된 연도에 대한 반출 건수를 리턴합니다.
	 *
	 * @param map
	 * @return cnt
	 * @throws Exception
	 */
    public int getYearCount(HashMap<String, String> map) throws Exception {

    	int cnt = mapper.getYearCount(map);

        return cnt;

    }

    /**
     * 입력된 연도에 대한 반출 건수를 월별로 리턴합니다.
     *
     * @param map
     * @return cnt
     * @throws Exception
     */
    public ArrayList<CrmsTransRqstVo> getMonthCount(HashMap<String, String> map) throws Exception {

    	return (ArrayList<CrmsTransRqstVo>) mapper.getMonthCount(map);

    }

    /**
	 * 관리자 대시보드용 페이지 카운트를 리턴합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
    public ArrayList<CrmsTransRqstVo> getPageCnt(HashMap<String, String> map) throws Exception {

    	return (ArrayList<CrmsTransRqstVo>) mapper.getPageCnt(map);

    }

    /**
     * 관리자 영상반출 상세보기용 카운트를 리턴합니다.
     * 해당 사용자의 영상반출 건수정보가 리턴됩니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public ArrayList<CrmsTransRqstVo> getUserRqstStatCnt(HashMap<String, String> map) throws Exception {

        return (ArrayList<CrmsTransRqstVo>) mapper.getUserRqstStatCnt(map);

    }

    /**
	 * 반출 건 백업 결과를 리턴합니다.
	 *
	 * @param map
	 * @return cnt
	 * @throws Exception
	 */
    public boolean changeRqst(HashMap<String, String> map) throws Exception {

		//return ( (mapper.changeRqst(map) > 0) ? true : false);
    	int i = mapper.changeRqst(map);

    	//190722 이은규
    	//테이블 모두가 채워져 있는 경우가 아니면 0이 리턴될 때가 있음.
    	//sql 오류가 나지만 않으면 되기 때문에 0보다 큰 값으로 처리했음.
    	return ( (i >= 0) ? true : false);

    }

    public ArrayList<CrmsTransRqstVo> getUseRsSmsList(HashMap<String, String> map) throws Exception {

        return (ArrayList<CrmsTransRqstVo>) mapper.getUseRsSmsList(map);

    }

    public ArrayList<Integer> getReportRqstList(HashMap<String, String> map) throws Exception {
    	return (ArrayList<Integer>) mapper.getReportRqstList(map);
    }

}
