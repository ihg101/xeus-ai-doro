package geomex.xeus.tvius.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  CrmsTransWorkVo.java
 * 설  명 :
 *   CrmaTransWork 관련 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 06. 18.      이은규          최초 생성
 *
 * </pre>
 *
 * @since : 2018. 06. 18.
 * @version : 1.0
 * @see
 */

public class CrmsTransWorkVo {

    /*avi_mgr_seq numeric(32,0) NOT NULL, -- 반출영상파일관리번호
    rqst_mgr_seq numeric(32,0) NOT NULL, -- 반출신청관리번호
    file_seq numeric(4,0) NOT NULL, -- 파일순번
    file_nm;//character varying(50), -- 파일명
    down_cnt numeric(4,0), -- 다운로드수
    sec_st_dat;//character(14), -- 구간영상시작일시
    sec_ed_dat;//character(14), -- 구간영상종료일시
    bak_st_dat;//character(14), -- 백업시작일시
    bak_ed_dat;//character(14), -- 백업완료일시
    enc_st_dat;//character(14), -- 암호화시작일시
    enc_ed_dat;//character(14), -- 암호화완료일시
    mak_st_dat;//character(14), -- 마스킹시작일시
    mak_en_dat;//character(14), -- 마스킹종료일시
    work_stat_cd;//character(2), -- 작업진행상태코드
    work_rslt_msg;//character varying(250), -- 작업결과메세지
    reenc_yn;//character(1), -- 재암호화여부
    sha_cde;//character(64), -- SHA256값
    md5_cde;//character(32), -- MD5값*/

	@NotNull(message="반출영상파일관리번호는 필수사항 입니다.")
	@NotEmpty(message="반출영상파일관리번호는 필수사항 입니다.")
	@Size(min=0, max=32, message="반출영상파일관리번호는 최대 32자 까지 입력하실 수 있습니다.")
	private String aviMgrSeq;				//반출영상파일관리번호

	@NotNull(message="반출신청관리번호는 필수사항 입니다.")
	@NotEmpty(message="반출신청관리번호는 필수사항 입니다.")
	@Size(min=0, max=32, message="반출신청관리번호는 최대 32자 까지 입력하실 수 있습니다.")
	private String rqstMgrSeq;				//반출신청관리번호

	@NotNull(message="파일순번은 필수사항 입니다.")
    @NotEmpty(message="파일순번은 필수사항 입니다.")
    @Size(min=0, max=4, message="파일순번은 최대 4자 까지 입력하실 수 있습니다.")
	private String fileSeq;                 //파일순번

    private String fileNm;                  //character varying(50), -- 파일명
    private String downCnt;                 //numeric(4,0), -- 다운로드수
    private String secStDat;                //character(14), -- 구간영상시작일시
    private String secEdDat;                //character(14), -- 구간영상종료일시
    private String bakStDat;                //character(14), -- 백업시작일시
    private String bakEdDat;                //character(14), -- 백업완료일시
    private String encStDat;                //character(14), -- 암호화시작일시
    private String encEdDat;                //character(14), -- 암호화완료일시
    private String makStDat;                //character(14), -- 마스킹시작일시
    private String makEnDat;                //character(14), -- 마스킹종료일시
    private String workStatCd;              //character(2), -- 작업진행상태코드
    private String workRsltMsg;             //character varying(250), -- 작업결과메세지
    private String reencYn;                 //character(1), -- 재암호화여부
    private String shaCde;                  //character(64), -- Sha256값
    private String md5Cde;                  //character(32), -- Md5값

    private String cctvMgrNo;
    private String playLimitCnt;
    private String playLimitDat;
    private String reqstId;
    private String reqstDat;
    private String acptUserId;
    private String acptDat;
    private String cctvNm;
    private String modelNm;

    //해시코드 조회 인증서용
    private String uploadNm;
    private String uploadFileSize;

    public String getAviMgrSeq() {
        return aviMgrSeq;
    }
    public void setAviMgrSeq(String aviMgrSeq) {
        this.aviMgrSeq = aviMgrSeq;
    }
    public String getRqstMgrSeq() {
        return rqstMgrSeq;
    }
    public void setRqstMgrSeq(String rqstMgrSeq) {
        this.rqstMgrSeq = rqstMgrSeq;
    }
    public String getFileSeq() {
        return fileSeq;
    }
    public void setFileSeq(String fileSeq) {
        this.fileSeq = fileSeq;
    }
    public String getFileNm() {
        return fileNm;
    }
    public void setFileNm(String fileNm) {
        this.fileNm = fileNm;
    }
    public String getDownCnt() {
        return downCnt;
    }
    public void setDownCnt(String downCnt) {
        this.downCnt = downCnt;
    }
    public String getSecStDat() {
        return secStDat;
    }
    public void setSecStDat(String secStDat) {
        this.secStDat = secStDat;
    }
    public String getSecEdDat() {
        return secEdDat;
    }
    public void setSecEdDat(String secEdDat) {
        this.secEdDat = secEdDat;
    }
    public String getBakStDat() {
        return bakStDat;
    }
    public void setBakStDat(String bakStDat) {
        this.bakStDat = bakStDat;
    }
    public String getBakEdDat() {
        return bakEdDat;
    }
    public void setBakEdDat(String bakEdDat) {
        this.bakEdDat = bakEdDat;
    }
    public String getEncStDat() {
        return encStDat;
    }
    public void setEncStDat(String encStDat) {
        this.encStDat = encStDat;
    }
    public String getEncEdDat() {
        return encEdDat;
    }
    public void setEncEdDat(String encEdDat) {
        this.encEdDat = encEdDat;
    }
    public String getMakStDat() {
        return makStDat;
    }
    public void setMakStDat(String makStDat) {
        this.makStDat = makStDat;
    }
    public String getMakEnDat() {
        return makEnDat;
    }
    public void setMakEnDat(String makEnDat) {
        this.makEnDat = makEnDat;
    }
    public String getWorkStatCd() {
        return workStatCd;
    }
    public void setWorkStatCd(String workStatCd) {
        this.workStatCd = workStatCd;
    }
    public String getWorkRsltMsg() {
        return workRsltMsg;
    }
    public void setWorkRsltMsg(String workRsltMsg) {
        this.workRsltMsg = workRsltMsg;
    }
    public String getReencYn() {
        return reencYn;
    }
    public void setReencYn(String reencYn) {
        this.reencYn = reencYn;
    }
    public String getShaCde() {
        return shaCde;
    }
    public void setShaCde(String shaCde) {
        this.shaCde = shaCde;
    }
    public String getMd5Cde() {
        return md5Cde;
    }
    public void setMd5Cde(String md5Cde) {
        this.md5Cde = md5Cde;
    }
    public String getCctvMgrNo() {
        return cctvMgrNo;
    }
    public void setCctvMgrNo(String cctvMgrNo) {
        this.cctvMgrNo = cctvMgrNo;
    }
    public String getPlayLimitCnt() {
        return playLimitCnt;
    }
    public void setPlayLimitCnt(String playLimitCnt) {
        this.playLimitCnt = playLimitCnt;
    }
    public String getPlayLimitDat() {
        return playLimitDat;
    }
    public void setPlayLimitDat(String playLimitDat) {
        this.playLimitDat = playLimitDat;
    }
    public String getReqstId() {
        return reqstId;
    }
    public void setReqstId(String reqstId) {
        this.reqstId = reqstId;
    }
    public String getReqstDat() {
        return reqstDat;
    }
    public void setReqstDat(String reqstDat) {
        this.reqstDat = reqstDat;
    }
    public String getAcptUserId() {
        return acptUserId;
    }
    public void setAcptUserId(String acptUserId) {
        this.acptUserId = acptUserId;
    }
    public String getAcptDat() {
        return acptDat;
    }
    public void setAcptDat(String acptDat) {
        this.acptDat = acptDat;
    }
    public String getCctvNm() {
        return cctvNm;
    }
    public void setCctvNm(String cctvNm) {
        this.cctvNm = cctvNm;
    }
    public String getModelNm() {
        return modelNm;
    }
    public void setModelNm(String modelNm) {
        this.modelNm = modelNm;
    }
    public String getUploadNm() {
        return uploadNm;
    }
    public void setUploadNm(String uploadNm) {
        this.uploadNm = uploadNm;
    }
    public String getUploadFileSize() {
        return uploadFileSize;
    }
    public void setUploadFileSize(String uploadFileSize) {
        this.uploadFileSize = uploadFileSize;
    }
    public String toString(){
        return "aviMgrSeq : " + aviMgrSeq +
                "\r\nrqstMgrSeq : " + rqstMgrSeq +
                "\r\nfileSeq : " + fileSeq +
                "\r\nfileNm : " + fileNm +
                "\r\ndownCnt : " + downCnt +
                "\r\nsecStDat : " + secStDat +
                "\r\nsecEdDat : " + secEdDat +
                "\r\nbakStDat : " + bakStDat +
                "\r\nbakEdDat : " + bakEdDat +
                "\r\nencStDat : " + encStDat +
                "\r\nencEdDat : " + encEdDat +
                "\r\nmakStDat : " + makStDat +
                "\r\nmakEnDat : " + makEnDat +
                "\r\nworkStatCd : " + workStatCd +
                "\r\nworkRsltMsg : " + workRsltMsg +
                "\r\nreencYn : " + reencYn +
                "\r\nshaCde : " + shaCde +
                "\r\nmd5Cde : " + md5Cde +
                "\r\ncctvMgrNo : " + cctvMgrNo +
                "\r\nplayLimitCnt : " + playLimitCnt +
                "\r\nplayLimitDat : " + playLimitDat +
                "\r\nreqstId : " + reqstId +
                "\r\nreqstDat : " + reqstDat +
                "\r\nacptUserId : " + acptUserId +
                "\r\nacptDat : " + acptDat +
                "\r\nuploadNm : " + uploadNm +
                "\r\nuploadFileSize : " + uploadFileSize;
    }
}
