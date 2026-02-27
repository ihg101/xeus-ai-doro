package gmx.gis.util.code;

import java.util.ArrayList;
import java.util.HashMap;

import gmx.gis.sysmgr.service.GMT_SysPropVo;

public class GMT_SystemParameter {


    /*public String aviPlayCnt = "";      //영상재생횟수
    public String aviPlayDat = "";      //영상재생기간

    public String renewPlayCnt = "";    //연장신청재생횟수
    public String renewPlayDat = "";    //연장신청재생기간
    public String eviPlayCnt = "";      //증거신청재생횟수

    public String aviPlayTime = "";     //미리보기시간설정

    public String fileDownCnt = "";     //영상다운횟수제한
    public String loginLockCnt = "";
    public String rqstLockCnt = "";     //활용결과제한횟수

    public String previewAvi = "";      //미리보기권한
    public String previewPhoto = "";    //현장사진권한

    public String storagePath = "";     //영상저장경로
    public String uploadPath = "";      //첨부파일저장경로

    public String lastSmsDat = "";      //영상만료일알림설정
    public String adminSmsList = "";    //SMS전송리스트

    public String maskingYn = "";       //마스킹유무
    public String maskingRouteBf = "";  //마스킹전저장경로
    public String maskingRouteAf = "";  //마스킹후저장경로
*/
    private HashMap<String, String> paramMap = null;

    public GMT_SystemParameter(ArrayList<GMT_SysPropVo> parmaList){

        HashMap<String, String> map = new HashMap<String, String>();

        for(int i=0; i<parmaList.size(); i++){
            map.put(parmaList.get(i).getPropKey().trim(), parmaList.get(i).getPropValue().trim());
        }

        this.paramMap = map;
    }

    public HashMap<String, String> getParamMap() {
        return paramMap;
    }

    public void setParamMap(HashMap<String, String> paramMap) {
        this.paramMap = paramMap;
    }

    /**
     * 시스템 파라미터 테이블 리스트를 HashMap 형태로 변환한다.
     *
     * @param paramList
     * @return map
     */
    /*public static HashMap<String, String> convertParam(ArrayList<GMT_SysPropVo> parmaList){

        HashMap<String, String> map = new HashMap<String, String>();

        for(int i=0; i<parmaList.size(); i++){
            map.put(parmaList.get(i).getPropKey().trim(), parmaList.get(i).getPropValue().trim());
        }

        return map;

    }*/



    /*public String toString() {
        return "GMT_SystemParameter [aviPlayCnt=" + aviPlayCnt + ", aviPlayDat=" + aviPlayDat
            + ", renewPlayCnt=" + renewPlayCnt + ", renewPlayDat=" + renewPlayDat + ", eviPlayCnt=" + eviPlayCnt
            + ", aviPlayTime=" + aviPlayTime
            + ", fileDownCnt=" + fileDownCnt + ", loginLockCnt=" + loginLockCnt + ", rqstLockCnt=" + rqstLockCnt
            + ", previewAvi=" + previewAvi + ", previewPhoto=" + previewPhoto
            + ", storagePath=" + storagePath + ", uploadPath=" + uploadPath
            + ", lastSmsDat=" + lastSmsDat + ", adminSmsList=" + adminSmsList
            + ", maskingYn=" + maskingYn + ", maskingRouteBf=" + maskingRouteBf + ", maskingRouteAf=" + maskingRouteAf + "]";
    }*/

}
