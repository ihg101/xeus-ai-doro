package geomex.xeus.tvius.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  CrmsImageRqstVo.java
 * 설  명 :
 *   CrmsImageRqst 관련 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 10. 08.      이은규          최초 생성
 * 2019. 03. 25.	  이은규		  공문테이블 관리번호 컬럼 추가
 * 2019. 03. 27.	  이은규		  최종공문확인 변수 추가
 *
 * </pre>
 *
 * @since : 2018. 10. 08.
 * @version : 1.0
 * @see
 */

public class CrmsImageRqstVo {

    private String mgrSeq;
    private String reqstId;
    private String reqstUsrNm;
    private String reqstDat;
    @NotNull(message="신청내용은 필수사항 입니다.")
    @NotEmpty(message="신청내용은 필수사항 입니다.")
    @Size(min=0, max=200, message="신청내용은 최대 200자 까지 입력하실 수 있습니다.")
    private String reqstDetail;
    @NotNull(message="공문번호는 필수사항 입니다.")
    @NotEmpty(message="공문번호는 필수사항 입니다.")
    @Size(min=0, max=30, message="공문번호는 최대 30자 까지 입력하실 수 있습니다.")
    private String docNo;
    private String docFileNm;
    private String docFilePath;
    private String procStatCd;
    private String acptUserId;
    private String acptUsrNm;
    private String acptDat;
    private String rejtResn;
    private String docChngYn;

    ////////////////////////////
    //  반출 이미지 목록    ////
    ////////////////////////////
    private String imgMgrSeq;
    private String imgRegId;
    private String imgRegUsrNm;
    private String imgRegDat;
    private String imgDesc;
    private String imgNm;
    private String imgPath;

    /////////////////////
    //  조인 테이블용  //
    /////////////////////
    private String rqstMgrSeq;
    private String procStatCdRelCdeNm;

	/////////////////////////////
	//  공문테이블 관리번호  ////
	/////////////////////////////
	private String ofclMgrNo;

    public String getMgrSeq() {
        return mgrSeq;
    }
    public void setMgrSeq(String mgrSeq) {
        this.mgrSeq = mgrSeq;
    }
    public String getReqstId() {
        return reqstId;
    }
    public void setReqstId(String reqstId) {
        this.reqstId = reqstId;
    }
    public String getReqstUsrNm() {
        return reqstUsrNm;
    }
    public void setReqstUsrNm(String reqstUsrNm) {
        this.reqstUsrNm = reqstUsrNm;
    }
    public String getReqstDat() {
        return reqstDat;
    }
    public void setReqstDat(String reqstDat) {
        this.reqstDat = reqstDat;
    }
    public String getReqstDetail() {
        return reqstDetail;
    }
    public void setReqstDetail(String reqstDetail) {
        this.reqstDetail = reqstDetail;
    }
    public String getDocNo() {
        return docNo;
    }
    public void setDocNo(String docNo) {
        this.docNo = docNo;
    }
    public String getDocFileNm() {
        return docFileNm;
    }
    public void setDocFileNm(String docFileNm) {
        this.docFileNm = docFileNm;
    }
    public String getDocFilePath() {
        return docFilePath;
    }
    public void setDocFilePath(String docFilePath) {
        this.docFilePath = docFilePath;
    }
    public String getProcStatCd() {
        return procStatCd;
    }
    public void setProcStatCd(String procStatCd) {
        this.procStatCd = procStatCd;
    }
    public String getAcptUserId() {
        return acptUserId;
    }
    public void setAcptUserId(String acptUserId) {
        this.acptUserId = acptUserId;
    }
    public String getAcptUsrNm() {
        return acptUsrNm;
    }
    public void setAcptUsrNm(String acptUsrNm) {
        this.acptUsrNm = acptUsrNm;
    }
    public String getAcptDat() {
        return acptDat;
    }
    public void setAcptDat(String acptDat) {
        this.acptDat = acptDat;
    }
    public String getRejtResn() {
        return rejtResn;
    }
    public void setRejtResn(String rejtResn) {
        this.rejtResn = rejtResn;
    }
    public String getDocChngYn() {
		return docChngYn;
	}
	public void setDocChngYn(String docChngYn) {
		this.docChngYn = docChngYn;
	}
	public String getImgMgrSeq() {
        return imgMgrSeq;
    }
    public void setImgMgrSeq(String imgMgrSeq) {
        this.imgMgrSeq = imgMgrSeq;
    }
    public String getImgRegId() {
        return imgRegId;
    }
    public void setImgRegId(String imgRegId) {
        this.imgRegId = imgRegId;
    }
    public String getImgRegUsrNm() {
        return imgRegUsrNm;
    }
    public void setImgRegUsrNm(String imgRegUsrNm) {
        this.imgRegUsrNm = imgRegUsrNm;
    }
    public String getImgRegDat() {
        return imgRegDat;
    }
    public void setImgRegDat(String imgRegDat) {
        this.imgRegDat = imgRegDat;
    }
    public String getImgDesc() {
        return imgDesc;
    }
    public void setImgDesc(String imgDesc) {
        this.imgDesc = imgDesc;
    }
    public String getImgNm() {
        return imgNm;
    }
    public void setImgNm(String imgNm) {
        this.imgNm = imgNm;
    }
    public String getImgPath() {
        return imgPath;
    }
    public void setImgPath(String imgPath) {
        this.imgPath = imgPath;
    }
    public String getRqstMgrSeq() {
        return rqstMgrSeq;
    }
    public void setRqstMgrSeq(String rqstMgrSeq) {
        this.rqstMgrSeq = rqstMgrSeq;
    }
	public String getOfclMgrNo() {
		return ofclMgrNo;
	}
	public void setOfclMgrNo(String ofclMgrNo) {
		this.ofclMgrNo = ofclMgrNo;
	}
	public String getProcStatCdRelCdeNm() {
		return procStatCdRelCdeNm;
	}
	public void setProcStatCdRelCdeNm(String procStatCdRelCdeNm) {
		this.procStatCdRelCdeNm = procStatCdRelCdeNm;
	}
	@Override
	public String toString() {
		return "CrmsImageRqstVo [mgrSeq=" + mgrSeq + ", reqstId=" + reqstId + ", reqstUsrNm=" + reqstUsrNm
				+ ", reqstDat=" + reqstDat + ", reqstDetail=" + reqstDetail + ", docNo=" + docNo + ", docFileNm="
				+ docFileNm + ", docFilePath=" + docFilePath + ", procStatCd=" + procStatCd + ", acptUserId="
				+ acptUserId + ", acptUsrNm=" + acptUsrNm + ", acptDat=" + acptDat + ", rejtResn=" + rejtResn
				+ ", docChngYn=" + docChngYn + ", imgMgrSeq=" + imgMgrSeq + ", imgRegId=" + imgRegId + ", imgRegUsrNm="
				+ imgRegUsrNm + ", imgRegDat=" + imgRegDat + ", imgDesc=" + imgDesc + ", imgNm=" + imgNm + ", imgPath="
				+ imgPath + ", rqstMgrSeq=" + rqstMgrSeq + ", procStatCdRelCdeNm=" + procStatCdRelCdeNm + ", ofclMgrNo="
				+ ofclMgrNo + "]";
	}

}
