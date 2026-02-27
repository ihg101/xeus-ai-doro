package geomex.xeus.tvius.service;

import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  CrmsTransRqstVo.java
 * 설  명 :
 *   CrmaTransRqst 관련 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 16.      이은규          최초 생성
 * 2017. 10. 18.	  이은규		  rqst컬럼 외 참조 필드 추가
 * 									  avi_cctv_mgr_id => avi_cctv_mgr_no로 변경
 * 2017. 11. 21.	  이은규		  잘못된 변수명, 게터, 세터 변경
 * 2017. 12. 05.	  이은규		  useRsCdNullChk 삭제
 * 2017. 12. 12.	  이은규		  validator용 어노테이션 적용
 * 2017. 12. 19.      이은규          int, String 변수 size 어노테이션 제거
 * 2018. 01. 11.      이은규          관리자 영상반출 상세보기용 컬럼 추가
 * 2018. 12. 03.	  이은규		  차량반출 정보 저장 컬럼 추가
 * 2019. 03. 24.	  이은규		  공문테이블 관리번호 컬럼 추가
 * 2019. 03. 25.	  이은규		  최종공문확인 변수 추가
 *
 * </pre>
 *
 * @since : 2017. 10. 16.
 * @version : 1.0
 * @see
 */

/**
 * @author User
 *
 */
public class CrmsTransRqstVo {

	/*
	 * private String liCd; private String liKorNm;
	 */

	@NotNull(message="반출신청관리번호는 필수사항 입니다.")
	@NotEmpty(message="반출신청관리번호는 필수사항 입니다.")
	@Size(min=0, max=32, message="반출신청관리번호는 최대 32자 까지 입력하실 수 있습니다.")
	private String mgrSeq;					// 반출신청관리번호

	private String reqstId;					// 신청자ID

	private String reqstDat;				// 신청일시

	private String reqstResn;				// 제공근거

	/*@NotNull(message="신청내용은 필수사항 입니다.")
	@NotEmpty(message="신청내용은 필수사항 입니다.")*/
	@Size(min=0, max=200, message="신청내용은 최대 200자 까지 입력하실 수 있습니다.")
	private String reqstDetail;				// 신청내용

	private String crimeTyp;				// 범죄유형

	@Size(min=0, max=30, message="공문번호는 최대 30자 까지 입력하실 수 있습니다.")
	private String docNo;					// 공문번호

	@Size(min=0, max=80, message="공문첨부파일명은 최대 80자 까지 입력하실 수 있습니다.")
	private String docFileNm;				// 공문첨부파일명

	@Size(min=0, max=100, message="공문파일경로는 최대 100자 까지 입력하실 수 있습니다.")
	private String docFilePath;				// 공문파일경로

	@Size(min=0, max=100, message="사건장소는 최대 100자 까지 입력하실 수 있습니다.")
	private String crimeLoc;				// 사건장소

	@Size(min=0, max=250, message="CCTV요청목록은 최대 250자 까지 입력하실 수 있습니다.")
	private String cctvList;				// CCTV요청목록

	private String procStatCd;				// 처리상태코드

	private String acptUserId;				// 승인자ID

	private String acptDat;					// 승인일시

	private String rejtTyp;					// 승인거절유형

	@Size(min=0, max=200, message="승인거절사유는 최대 200자 까지 입력하실 수 있습니다.")
	private String rejtResn;				// 승인거절사유

	private String fnshDat;					// 작업완료일시

	private String recvMthd;				// 수령방법

	private String useRsCd;					// 활용결과코드

	private String reqGbnCd;				// 신청구분코드

	private String carInfo;					// 차량반출정보

	private String docChngYn;				// 최종공문확인

	////////////////////////////////////////////////////////////////////////

	private String reqstIdRelCdeNm;			// 신청자명

	private String reqstResnRelCdeNm;		// 신청근거 코드명

	private String crimeTypRelCdeNm;		// 범죄유형 코드명

	private String procStatCdRelCdeNm;		// 처리상태 코드명

	private String acptUserIdRelCdeNm;		// 승인자명

	private String rejtTypRelCdeNm;			// 승인거절유형 코드명

	private String recvMthdRelCdeNm;		// 수령방법 코드명

	private String useRsCdRelCdeNm;			// 활용결과 코드명

	private String reqGbnCdRelCdeNm;		// 신청구분 코드명

	private String aviCctvMgrNo;			// 연관 AVI테이블 CCTVID

	private String cctvAnnox;				// CCTV X좌표 (히트맵용)

	private String cctvAnnoy;				// CCTV Y좌표 (히트맵용)

	private String cctvCount;				// CCTV 갯수 (히트맵용)

	private String cnt;						// 카운트 용 컬럼 (히트맵, 활용결과, 처리상태 등)

	///////////////////////////////////////////////////////////////////////

	//대시보드용 컬럼
	private int rqstCntSw;

	private int rqstCntSn;

	private int rqstCntRs;

	private int renewCntExt;

	private int renewCntEvi;

	private String usrIdRst;

	private int usrCnt;

	private int lockUsr;

	///////////////////////////////////////////////////////////////////////

	//관리자 영상반출 상세보기 용 컬럼
	private String totCnt;

	private String swCnt;

	private String nonCnt;

	///////////////////////////////////////////////////////////////////////

	//공문테이블 관리번호
	private String ofclMgrNo;

	private List<CrmsTransRqstVo> CrmsTransRqstList;

	// cilentIp 미사용
	// crimeCtgr -> reqGbnCd 로 변경되었음.

	private String videoSmy;

	private String useRsCnt;


	//////////////////////////////////////////////////////////////////
	//excel 양식 변경으로 인한 컬럼 추가
	private String secStDat;
	private String secEdDat;
	private String crimeAddr;
	private String cameraNum;
	private String folderNm;
	private String officeNm;
	private String userNm;
	private String mobileNum;
	private String deptNm;
	private String regNum;
	private String gwanhal;

	private String fileNm;
	private String fileCnt;

	private String rqstOfficeNm;
	private String rqstUserNm;
	private String rqstMobileNum;
	private String rqstDeptNm;

	private String imgCnt;
	private String imgNm;


	private String renewCnt;
	private String renewAcptYesCnt;
	private String renewAcptYn;
	////////////////////////////////////////////////////////////////
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

	public String getReqstDat() {
		return reqstDat;
	}

	public void setReqstDat(String reqstDat) {
		this.reqstDat = reqstDat;
	}

	public String getReqstResn() {
		return reqstResn;
	}

	public void setReqstResn(String reqstResn) {
		this.reqstResn = reqstResn;
	}

	public String getReqstDetail() {
		return reqstDetail;
	}

	public void setReqstDetail(String reqstDetail) {
		this.reqstDetail = reqstDetail;
	}

	public String getCrimeTyp() {
		return crimeTyp;
	}

	public void setCrimeTyp(String crimeTyp) {
		this.crimeTyp = crimeTyp;
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

	public String getCrimeLoc() {
		return crimeLoc;
	}

	public void setCrimeLoc(String crimeLoc) {
		this.crimeLoc = crimeLoc;
	}

	public String getCctvList() {
		return cctvList;
	}

	public void setCctvList(String cctvList) {
		this.cctvList = cctvList;
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

	public String getAcptDat() {
		return acptDat;
	}

	public void setAcptDat(String acptDat) {
		this.acptDat = acptDat;
	}

	public String getRejtTyp() {
		return rejtTyp;
	}

	public void setRejtTyp(String rejtTyp) {
		this.rejtTyp = rejtTyp;
	}

	public String getRejtResn() {
		return rejtResn;
	}

	public void setRejtResn(String rejtResn) {
		this.rejtResn = rejtResn;
	}

	public String getFnshDat() {
		return fnshDat;
	}

	public void setFnshDat(String fnshDat) {
		this.fnshDat = fnshDat;
	}

	public String getRecvMthd() {
		return recvMthd;
	}

	public void setRecvMthd(String recvMthd) {
		this.recvMthd = recvMthd;
	}

	public String getUseRsCd() {
		return useRsCd;
	}

	public void setUseRsCd(String useRsCd) {
		this.useRsCd = useRsCd;
	}

	public String getReqGbnCd() {
		return reqGbnCd;
	}

	public void setReqGbnCd(String reqGbnCd) {
		this.reqGbnCd = reqGbnCd;
	}

	////////////////////////////////////////////////////////////////////////

	public String getCarInfo() {
		return carInfo;
	}

	public void setCarInfo(String carInfo) {
		this.carInfo = carInfo;
	}

	public String getDocChngYn() {
		return docChngYn;
	}

	public void setDocChngYn(String docChngYn) {
		this.docChngYn = docChngYn;
	}

	public String getReqstIdRelCdeNm() {
		return reqstIdRelCdeNm;
	}

	public void setReqstIdRelCdeNm(String reqstIdRelCdeNm) {
		this.reqstIdRelCdeNm = reqstIdRelCdeNm;
	}

	public String getReqstResnRelCdeNm() {
		return reqstResnRelCdeNm;
	}

	public void setReqstResnRelCdeNm(String reqstResnRelCdeNm) {
		this.reqstResnRelCdeNm = reqstResnRelCdeNm;
	}

	public String getCrimeTypRelCdeNm() {
		return crimeTypRelCdeNm;
	}

	public void setCrimeTypRelCdeNm(String crimeTypRelCdeNm) {
		this.crimeTypRelCdeNm = crimeTypRelCdeNm;
	}

	public String getProcStatCdRelCdeNm() {
		return procStatCdRelCdeNm;
	}

	public void setProcStatCdRelCdeNm(String procStatCdRelCdeNm) {
		this.procStatCdRelCdeNm = procStatCdRelCdeNm;
	}

	public String getAcptUserIdRelCdeNm() {
		return acptUserIdRelCdeNm;
	}

	public void setAcptUserIdRelCdeNm(String acptUserIdRelCdeNm) {
		this.acptUserIdRelCdeNm = acptUserIdRelCdeNm;
	}

	public String getRejtTypRelCdeNm() {
		return rejtTypRelCdeNm;
	}

	public void setRejtTypRelCdeNm(String rejtTypRelCdeNm) {
		this.rejtTypRelCdeNm = rejtTypRelCdeNm;
	}

	public String getRecvMthdRelCdeNm() {
		return recvMthdRelCdeNm;
	}

	public void setRecvMthdRelCdeNm(String recvMthdRelCdeNm) {
		this.recvMthdRelCdeNm = recvMthdRelCdeNm;
	}

	public String getUseRsCdRelCdeNm() {
		return useRsCdRelCdeNm;
	}

	public void setUseRsCdRelCdeNm(String useRsCdRelCdeNm) {
		this.useRsCdRelCdeNm = useRsCdRelCdeNm;
	}

	public String getReqGbnCdRelCdeNm() {
		return reqGbnCdRelCdeNm;
	}

	public void setReqGbnCdRelCdeNm(String reqGbnCdRelCdeNm) {
		this.reqGbnCdRelCdeNm = reqGbnCdRelCdeNm;
	}

	public String getAviCctvMgrNo() {
		return aviCctvMgrNo;
	}

	public void setAviCctvMgrNo(String aviCctvMgrNo) {
		this.aviCctvMgrNo = aviCctvMgrNo;
	}

	public String getCctvAnnox() {
		return cctvAnnox;
	}

	public void setCctvAnnox(String cctvAnnox) {
		this.cctvAnnox = cctvAnnox;
	}

	public String getCctvAnnoy() {
		return cctvAnnoy;
	}

	public void setCctvAnnoy(String cctvAnnoy) {
		this.cctvAnnoy = cctvAnnoy;
	}

	public String getCctvCount() {
		return cctvCount;
	}

	public void setCctvCount(String cctvCount) {
		this.cctvCount = cctvCount;
	}

	public String getCnt() {
		return cnt;
	}

	public void setCnt(String cnt) {
		this.cnt = cnt;
	}

	public int getRqstCntSw() {
		return rqstCntSw;
	}

	public void setRqstCntSw(int rqstCntSw) {
		this.rqstCntSw = rqstCntSw;
	}

	public int getRqstCntSn() {
		return rqstCntSn;
	}

	public void setRqstCntSn(int rqstCntSn) {
		this.rqstCntSn = rqstCntSn;
	}

	public int getRqstCntRs() {
		return rqstCntRs;
	}

	public void setRqstCntRs(int rqstCntRs) {
		this.rqstCntRs = rqstCntRs;
	}

	public int getRenewCntExt() {
		return renewCntExt;
	}

	public void setRenewCntExt(int renewCntExt) {
		this.renewCntExt = renewCntExt;
	}

	public int getRenewCntEvi() {
		return renewCntEvi;
	}

	public void setRenewCntEvi(int renewCntEvi) {
		this.renewCntEvi = renewCntEvi;
	}

	public String getUsrIdRst() {
		return usrIdRst;
	}

	public void setUsrIdRst(String usrIdRst) {
		this.usrIdRst = usrIdRst;
	}

	public int getUsrCnt() {
		return usrCnt;
	}

	public void setUsrCnt(int usrCnt) {
		this.usrCnt = usrCnt;
	}

	public int getLockUsr() {
		return lockUsr;
	}

	public void setLockUsr(int lockUsr) {
		this.lockUsr = lockUsr;
	}

	public String getTotCnt() {
        return totCnt;
    }

    public void setTotCnt(String totCnt) {
        this.totCnt = totCnt;
    }

    public String getSwCnt() {
        return swCnt;
    }

    public void setSwCnt(String swCnt) {
        this.swCnt = swCnt;
    }

    public String getNonCnt() {
        return nonCnt;
    }

    public void setNonCnt(String nonCnt) {
        this.nonCnt = nonCnt;
    }

    public String getOfclMgrNo() {
		return ofclMgrNo;
	}

	public void setOfclMgrNo(String ofclMgrNo) {
		this.ofclMgrNo = ofclMgrNo;
	}

	public List<CrmsTransRqstVo> getCrmsTransRqstList() {
		return CrmsTransRqstList;
	}

	public void setCrmsTransRqstList(List<CrmsTransRqstVo> crmsTransRqstList) {
		CrmsTransRqstList = crmsTransRqstList;
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

	public String getCrimeAddr() {
		return crimeAddr;
	}

	public void setCrimeAddr(String crimeAddr) {
		this.crimeAddr = crimeAddr;
	}

	public String getCameraNum() {
		return cameraNum;
	}

	public void setCameraNum(String cameraNum) {
		this.cameraNum = cameraNum;
	}

	public String getFolderNm() {
		return folderNm;
	}

	public void setFolderNm(String folderNm) {
		this.folderNm = folderNm;
	}

	public String getOfficeNm() {
		return officeNm;
	}

	public void setOfficeNm(String officeNm) {
		this.officeNm = officeNm;
	}

	public String getUserNm() {
		return userNm;
	}

	public void setUserNm(String userNm) {
		this.userNm = userNm;
	}

	public String getMobileNum() {
		return mobileNum;
	}

	public void setMobileNum(String mobileNum) {
		this.mobileNum = mobileNum;
	}

	public String getDeptNm() {
		return deptNm;
	}

	public void setDeptNm(String deptNm) {
		this.deptNm = deptNm;
	}

	public String getRegNum() {
		return regNum;
	}

	public void setRegNum(String regNum) {
		this.regNum = regNum;
	}

	public String getGwanhal() {
		return gwanhal;
	}

	public void setGwanhal(String gwanhal) {
		this.gwanhal = gwanhal;
	}


	public String getFileNm() {
		return fileNm;
	}

	public void setFileNm(String fileNm) {
		this.fileNm = fileNm;
	}

	public String getFileCnt() {
		return fileCnt;
	}

	public void setFileCnt(String fileCnt) {
		this.fileCnt = fileCnt;
	}

	public String getRqstOfficeNm() {
		return rqstOfficeNm;
	}

	public void setRqstOfficeNm(String rqstOfficeNm) {
		this.rqstOfficeNm = rqstOfficeNm;
	}

	public String getRqstUserNm() {
		return rqstUserNm;
	}

	public void setRqstUserNm(String rqstUserNm) {
		this.rqstUserNm = rqstUserNm;
	}

	public String getRqstMobileNum() {
		return rqstMobileNum;
	}

	public void setRqstMobileNum(String rqstMobileNum) {
		this.rqstMobileNum = rqstMobileNum;
	}

	public String getRqstDeptNm() {
		return rqstDeptNm;
	}

	public void setRqstDeptNm(String rqstDeptNm) {
		this.rqstDeptNm = rqstDeptNm;
	}

	public String getImgCnt() {
		return imgCnt;
	}

	public void setImgCnt(String imgCnt) {
		this.imgCnt = imgCnt;
	}

	public String getImgNm() {
		return imgNm;
	}

	public void setImgNm(String imgNm) {
		this.imgNm = imgNm;
	}

	public String getRenewCnt() {
		return renewCnt;
	}

	public void setRenewCnt(String renewCnt) {
		this.renewCnt = renewCnt;
	}

	public String getRenewAcptYesCnt() {
		return renewAcptYesCnt;
	}

	public void setRenewAcptYesCnt(String renewAcptYesCnt) {
		this.renewAcptYesCnt = renewAcptYesCnt;
	}

	public String getRenewAcptYn() {
		return renewAcptYn;
	}

	public void setRenewAcptYn(String renewAcptYn) {
		this.renewAcptYn = renewAcptYn;
	}

	public String getVideoSmy() {
		return videoSmy;
	}

	public void setVideoSmy(String videoSmy) {
		this.videoSmy = videoSmy;
	}

	public String getUseRsCnt() {
		return useRsCnt;
	}

	public void setUseRsCnt(String useRsCnt) {
		this.useRsCnt = useRsCnt;
	}

	@Override
	public String toString() {
		return "CrmsTransRqstVo [mgrSeq=" + mgrSeq + ", reqstId=" + reqstId + ", reqstDat=" + reqstDat + ", reqstResn="
				+ reqstResn + ", reqstDetail=" + reqstDetail + ", crimeTyp=" + crimeTyp + ", docNo=" + docNo
				+ ", docFileNm=" + docFileNm + ", docFilePath=" + docFilePath + ", crimeLoc=" + crimeLoc + ", cctvList="
				+ cctvList + ", procStatCd=" + procStatCd + ", acptUserId=" + acptUserId + ", acptDat=" + acptDat
				+ ", rejtTyp=" + rejtTyp + ", rejtResn=" + rejtResn + ", fnshDat=" + fnshDat + ", recvMthd=" + recvMthd
				+ ", useRsCd=" + useRsCd + ", reqGbnCd=" + reqGbnCd + ", carInfo=" + carInfo + ", docChngYn="
				+ docChngYn + ", reqstIdRelCdeNm=" + reqstIdRelCdeNm + ", reqstResnRelCdeNm=" + reqstResnRelCdeNm
				+ ", crimeTypRelCdeNm=" + crimeTypRelCdeNm + ", procStatCdRelCdeNm=" + procStatCdRelCdeNm
				+ ", acptUserIdRelCdeNm=" + acptUserIdRelCdeNm + ", rejtTypRelCdeNm=" + rejtTypRelCdeNm
				+ ", recvMthdRelCdeNm=" + recvMthdRelCdeNm + ", useRsCdRelCdeNm=" + useRsCdRelCdeNm
				+ ", reqGbnCdRelCdeNm=" + reqGbnCdRelCdeNm + ", aviCctvMgrNo=" + aviCctvMgrNo + ", cctvAnnox="
				+ cctvAnnox + ", cctvAnnoy=" + cctvAnnoy + ", cctvCount=" + cctvCount + ", cnt=" + cnt + ", rqstCntSw="
				+ rqstCntSw + ", rqstCntSn=" + rqstCntSn + ", rqstCntRs=" + rqstCntRs + ", renewCntExt=" + renewCntExt
				+ ", renewCntEvi=" + renewCntEvi + ", usrIdRst=" + usrIdRst + ", usrCnt=" + usrCnt + ", lockUsr="
				+ lockUsr + ", totCnt=" + totCnt + ", swCnt=" + swCnt + ", nonCnt=" + nonCnt + ", ofclMgrNo="
				+ ofclMgrNo + ", CrmsTransRqstList=" + CrmsTransRqstList + ", secStDat=" + secStDat + ", secEdDat="
				+ secEdDat + ", crimeAddr=" + crimeAddr + ", cameraNum=" + cameraNum + ", folderNm=" + folderNm
				+ ", officeNm=" + officeNm + ", userNm=" + userNm + ", mobileNum=" + mobileNum + ", deptNm=" + deptNm
				+ ", regNum=" + regNum + ", gwanhal=" + gwanhal + ", fileNm=" + fileNm + ", fileCnt=" + fileCnt
				+ ", rqstOfficeNm=" + rqstOfficeNm + ", rqstUserNm=" + rqstUserNm + ", rqstMobileNum=" + rqstMobileNum
				+ ", rqstDeptNm=" + rqstDeptNm + ", imgCnt=" + imgCnt + ", imgNm=" + imgNm + ", renewCnt=" + renewCnt
				+ ", renewAcptYesCnt=" + renewAcptYesCnt + ", renewAcptYn=" + renewAcptYn + "]";
	}


}
