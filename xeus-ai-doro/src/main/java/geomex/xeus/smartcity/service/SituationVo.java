package geomex.xeus.smartcity.service;

import java.util.ArrayList;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 * <pre>
 * ===========================================================
 * 파일명 :  SituationVo.java
 * 작성자 :  홍길동
 * 작성일 :  2018. 4. 18.
 * 버전   :  1.0
 * 설명   :
 * getSituationList 응답 json용
 *
 * 수정이력
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 *
 * ===========================================================
 * </pre>
 */
public class SituationVo {
    //private String retYmdHms=""; //접수처리일시(수집해가는 시간)
    private String RECEPT_YMD="";//접수일자
    private String EVT_OCR_NO="";//접수번호(발생번호)
    private String MTMDA_PRCS_STATE="";//처리상태(요청,등록,접수요청,처리완료)
    private String TITLE="";     //제목
    private String IMG_START_YMD_HMS="";//영상시작시각,년-월-일 시:분:초
    private String IMG_END_YMD_HMS="";//영상종료시각,년-월-일 시:분:초
    private String POINT_X="";//경도
    private String POINT_Y="";//위도
    private String ADRES_NM="";//위치주소
    private String CONTS="";//내용
    private String RECEPT_NM="";//접수담당자
    private String RECEPT_TELNO="";//접수담당자 연락처
    private int imageSetCnt=0;//이미지건수
    private ArrayList<FileIdVo> imageSet = new ArrayList<FileIdVo>(); //파일ID

    public SituationVo() {

    }

    //public String getRetYmdHms() {
    //    return retYmdHms;
    //}

    //public void setRetYmdHms(String retYmdHms) {
    //    this.retYmdHms = retYmdHms;
    //}

    public String getReceptYmd() {
        return RECEPT_YMD;
    }

    public void setReceptYmd(String recept_ymd) {
        this.RECEPT_YMD = recept_ymd;
    }

    public String getEvtOcrNo() {
        return EVT_OCR_NO;
    }

    public void setEvtOcrNo(String evt_ocr_no) {
        this.EVT_OCR_NO = evt_ocr_no;
    }

    public String getMtmdaPrcsState() {
        return MTMDA_PRCS_STATE;
    }

    public void setMtmdaPrcsState(String prcs_state) {
        this.MTMDA_PRCS_STATE = prcs_state;
    }

    public String getTitle() {
        return TITLE;
    }

    public void setTitle(String title) {
        this.TITLE = title;
    }

    public String getImgStartYmdHms() {
        return IMG_START_YMD_HMS;
    }

    public void setImgStartYmdHms(String img_start_ymd_hms) {
        this.IMG_START_YMD_HMS = img_start_ymd_hms;
    }

    public String getImgEndYmdHms() {
        return IMG_END_YMD_HMS;
    }

    public void setImgEndYmdHms(String img_end_ymd_hms) {
        this.IMG_END_YMD_HMS = img_end_ymd_hms;
    }

    public String getPointX() {
        return POINT_X;
    }

    public void setPointX(String point_x) {
        this.POINT_X = point_x;
    }

    public String getPointY() {
        return POINT_Y;
    }

    public void setPointY(String point_y) {
        this.POINT_Y = point_y;
    }

    public String getAdresNm() {
        return ADRES_NM;
    }

    public void setAdresNm(String adres_nm) {
        this.ADRES_NM = adres_nm;
    }

    public String getConts() {
        return CONTS;
    }

    public void setConts(String conts) {
        this.CONTS = conts;
    }

    public String getReceptNm() {
        return RECEPT_NM;
    }

    public void setReceptNm(String recept_nm) {
        this.RECEPT_NM = recept_nm;
    }

    public String getReceptTelno() {
        return RECEPT_TELNO;
    }

    public void setReceptTelno(String recept_telno) {
        this.RECEPT_TELNO = recept_telno;
    }

    public int getImageSetCnt() {
        return imageSetCnt;
    }

    public void setImageSetCnt(int imageSetCnt) {
        this.imageSetCnt = imageSetCnt;
    }

    public ArrayList<FileIdVo> getImageSet() {
        return imageSet;
    }

    public void setImageSet(ArrayList<FileIdVo> set) {
        this.imageSet = set;
    }

    @SuppressWarnings("unchecked")
	public String json(){
        JSONObject json = new JSONObject();
        json.put("RECEPT_YMD", RECEPT_YMD);
        json.put("EVT_OCR_NO", EVT_OCR_NO);
        json.put("MTMDA_PRCS_STATE", MTMDA_PRCS_STATE);
        json.put("TITLE", TITLE);
        json.put("IMG_START_YMD_HMS", IMG_START_YMD_HMS);
        json.put("IMG_END_YMD_HMS", IMG_END_YMD_HMS);
        json.put("POINT_X", POINT_X);
        json.put("POINT_Y", POINT_Y);
        json.put("ADRES_NM", ADRES_NM);
        json.put("CONTS", CONTS);
        json.put("RECEPT_NM", RECEPT_NM);
        json.put("RECEPT_TELNO", RECEPT_TELNO);
        json.put("imageSetCnt", imageSetCnt);

        JSONArray array = new JSONArray();
        for(int x = 0 ;x < imageSetCnt; x++){
            array.add(imageSet.get(x).json());
        }
        json.put("imageSet", array);

       return json.toString();
    }

    @Override
    public String toString() {
        return "SituationVo ["
            + ", RECEPT_YMD=" + RECEPT_YMD + ", EVT_OCR_NO=" + EVT_OCR_NO + ", MTMDA_PRCS_STATE=" + MTMDA_PRCS_STATE
            + ", TITLE=" + TITLE + ", IMG_START_YMD_HMS=" + IMG_START_YMD_HMS + ", IMG_END_YMD_HMS=" + IMG_END_YMD_HMS
            + ", POINT_X=" + POINT_X + ", POINT_Y=" + POINT_Y + ", ADRES_NM=" + ADRES_NM + ", CONTS=" + CONTS
            + ", RECEPT_NM=" + RECEPT_NM + ", RECEPT_TELNO=" + RECEPT_TELNO + ", imageSetCnt=" + imageSetCnt
            + ", imageSet=" + imageSet + "]";
    }

}
