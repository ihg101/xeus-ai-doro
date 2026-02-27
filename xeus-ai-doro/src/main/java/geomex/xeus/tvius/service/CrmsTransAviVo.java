package geomex.xeus.tvius.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  CrmsTransAviVo.java
 * 설  명 :
 *   CrmaTransAvi 관련 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 18.      이은규          최초 생성
 * 2017. 11. 14.      이은규          연장신청 관련 VO 편집
 * 2017. 12. 19.      이은규          int, String 변수 size 어노테이션 제거
 * 2018. 01. 11.      이은규          renew테이블 횟수, 기간 추가
 * 2018. 01. 17.      이은규          관리대장 관련 컬럼 추가(열람용 cctv리스트, 신청근거)
 *
 * </pre>
 *
 * @since : 2017. 10. 18.
 * @version : 1.0
 * @see
 */

/**
 * @author User
 *
 */
/**
 * @author User
 *
 */
/**
 * @author User
 *
 */
/**
 * @author User
 *
 */
public class CrmsTransAviVo {

	@NotNull(message="반출영상파일관리번호는 필수사항 입니다.")
	@NotEmpty(message="반출영상파일관리번호는 필수사항 입니다.")
	@Size(min=0, max=32, message="반출영상파일관리번호는 최대 32자 까지 입력하실 수 있습니다.")
	private String mgrSeq;					//반출영상파일관리번호

	@NotNull(message="반출신청관리번호는 필수사항 입니다.")
	@NotEmpty(message="반출신청관리번호는 필수사항 입니다.")
	@Size(min=0, max=32, message="반출신청관리번호는 최대 32자 까지 입력하실 수 있습니다.")
	private String rqstMgrSeq;				//반출신청관리번호

	@NotNull(message="CCTV관리번호는 필수사항 입니다.")
	@NotEmpty(message="CCTV관리번호는 필수사항 입니다.")
	@Size(min=0, max=10, message="CCTV관리번호는 최대 10자 까지 입력하실 수 있습니다.")
	private String cctvMgrNo;				//CCTV관리번호

	private String secStDat;				//구간시작일시

	private String secEdDat;				//구간종료일시

	private int playLimitCnt;				//재생횟수제한

	private String playLimitDat;			//재생만료일시

	private String aviContsId;				//컨텐츠ID

	private String maskChk;					//마스킹여부

	private String hddSerial;				//신청PC HDD값

	private String macSerial;				//신청PC MAC고유값

	@Size(min=5, max=100, message="영상비밀번호는 5자 이상, 100자 이하로 입력해주세요.")
	@Pattern(regexp="([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])", message="영상비밀번호는 영문, 숫자, 특수문자가 모두 포함되어야 합니다.")
	private String expAviPw;				//영상비밀번호

	private String bakStatCd;				//백업 성공,실패 관련 코드

	// ////////////////////////////////////////////////////////////////

	private String vdwkFileSeq;				//파일순번

	private String vdwkFileNm;				//파일명

	private String vdwkDownCnt;				//다운로드수

	private String vdwkSecStDat;			//구간영상시작일시

	private String vdwkSecEdDat;			//구간영상종료일시

	private String vdwkWorkStatCd;			//작업진행상태코드

	private String vdwkWorkStatCdRelCdeNm;	//작업진행상태코드명

	private String vdwkShaCde;				//파일순번

	private String vdwkMd5Cde;				//파일순번
	// 비슷한게 위에 있음. 확인 요망
	// private String vdwkWorkSecStDat;
	// private String vdwkWorkSecEdDat;

	// ////////////////////////////////////////////////////////////////

	private String reqstId;					// 신청자ID

	private String reqstDat;				// 신청일시

	private String reqstResn;               // 신청근거

	private String reqstDetail;				// 신청내용

	private String docNo;					// 공문번호

	private String acptUserId;				// 승인자ID

	private String acptDat;					// 승인일시

	private String recvMthd;				// 수령방법

	private String useRsCd;					// 활용결과코드

	private String reqGbnCd;				// 신청구분코드

	private String crimeLoc;				// 사건장소

	// ////////////////////////////////////////////////////////////////

	private String crimeNm;					//범죄유형 코드명

	private String cctvLabel;				//CCTV명

	private String cctvNm;                  //CCTV명

	private String destAvi;					// 파기유무
	// 비슷한게 위에 있음. 확인 요망
	// private String cctvIdRelLabel;

	private String renewExtYn;				//연장신청 여부 확인

	private String renewEviYn;				//증거신청 여부 확인

	private String renewPlayLimitCnt;       //연장,증거 재생횟수제한

	private String renewPlayLimitDat;       //연장,증거 재생만료일시

	// ////////////////////////////////////////////////////////////////

	private String userNm;					//사용자명

	private String rankNm;					//부서명

	private String officeNm;				//소속명

	private String officeTelNo;

	private String acptUserInfo;

	private String rqstUserInfo;

	// ////////////////////////////////////////////////////////////////

	private String eviChk;					//증거신청 여부 확인용 변수

	private String fileList; // 관리대장에서 사용
	private String cctvList; // 관리대장에서 사용

	private String renewAcptYn; // 증거신청
	private String renewMgrSeq; // 증거신청
	private String renewAcptUserId; // 증거신청
	private String renewAcptDat; // 증거신청
	private String renewReqstDat; // 증거신청
	private String renewReqstResn; // 증거신청

	private String vdwkAviMgrSeq; // 증거신청
	private String aviPlayLimitDat;

	private String carInfo;
	private String smySendYn;
	private String videoSmy;

	public String getMgrSeq() {
		return mgrSeq;
	}

	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}

	public String getRqstMgrSeq() {
		return rqstMgrSeq;
	}

	public void setRqstMgrSeq(String rqstMgrSeq) {
		this.rqstMgrSeq = rqstMgrSeq;
	}

	public String getCctvMgrNo() {
		return cctvMgrNo;
	}

	public void setCctvMgrNo(String cctvMgrNo) {
		this.cctvMgrNo = cctvMgrNo;
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

	public int getPlayLimitCnt() {
		return playLimitCnt;
	}

	public void setPlayLimitCnt(int playLimitCnt) {
		this.playLimitCnt = playLimitCnt;
	}

	public String getPlayLimitDat() {
		return playLimitDat;
	}

	public void setPlayLimitDat(String playLimitDat) {
		this.playLimitDat = playLimitDat;
	}

	public String getAviContsId() {
		return aviContsId;
	}

	public void setAviContsId(String aviContsId) {
		this.aviContsId = aviContsId;
	}

	public String getMaskChk() {
		return maskChk;
	}

	public void setMaskChk(String maskChk) {
		this.maskChk = maskChk;
	}

	public String getHddSerial() {
		return hddSerial;
	}

	public void setHddSerial(String hddSerial) {
		this.hddSerial = hddSerial;
	}

	public String getMacSerial() {
		return macSerial;
	}

	public void setMacSerial(String macSerial) {
		this.macSerial = macSerial;
	}

	public String getExpAviPw() {
		return expAviPw;
	}

	public void setExpAviPw(String expAviPw) {
		this.expAviPw = expAviPw;
	}

	public String getBakStatCd() {
		return bakStatCd;
	}

	public void setBakStatCd(String bakStatCd) {
		this.bakStatCd = bakStatCd;
	}

	public String getVdwkFileSeq() {
		return vdwkFileSeq;
	}

	public void setVdwkFileSeq(String vdwkFileSeq) {
		this.vdwkFileSeq = vdwkFileSeq;
	}

	public String getVdwkFileNm() {
		return vdwkFileNm;
	}

	public void setVdwkFileNm(String vdwkFileNm) {
		this.vdwkFileNm = vdwkFileNm;
	}

	public String getVdwkDownCnt() {
		return vdwkDownCnt;
	}

	public void setVdwkDownCnt(String vdwkDownCnt) {
		this.vdwkDownCnt = vdwkDownCnt;
	}

	public String getVdwkSecStDat() {
		return vdwkSecStDat;
	}

	public void setVdwkSecStDat(String vdwkSecStDat) {
		this.vdwkSecStDat = vdwkSecStDat;
	}

	public String getVdwkSecEdDat() {
		return vdwkSecEdDat;
	}

	public void setVdwkSecEdDat(String vdwkSecEdDat) {
		this.vdwkSecEdDat = vdwkSecEdDat;
	}

	public String getVdwkWorkStatCd() {
		return vdwkWorkStatCd;
	}

	public void setVdwkWorkStatCd(String vdwkWorkStatCd) {
		this.vdwkWorkStatCd = vdwkWorkStatCd;
	}

	public String getVdwkWorkStatCdRelCdeNm() {
		return vdwkWorkStatCdRelCdeNm;
	}

	public void setVdwkWorkStatCdRelCdeNm(String vdwkWorkStatCdRelCdeNm) {
		this.vdwkWorkStatCdRelCdeNm = vdwkWorkStatCdRelCdeNm;
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

	public String getDocNo() {
		return docNo;
	}

	public void setDocNo(String docNo) {
		this.docNo = docNo;
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

	public String getCrimeLoc() {
		return crimeLoc;
	}

	public void setCrimeLoc(String crimeLoc) {
		this.crimeLoc = crimeLoc;
	}

	public String getCrimeNm() {
		return crimeNm;
	}

	public void setCrimeNm(String crimeNm) {
		this.crimeNm = crimeNm;
	}

	public String getOfficeNm() {
		return officeNm;
	}

	public void setOfficeNm(String officeNm) {
		this.officeNm = officeNm;
	}

	public String getCctvLabel() {
		return cctvLabel;
	}

	public void setCctvLabel(String cctvLabel) {
		this.cctvLabel = cctvLabel;
	}

	public String getCctvNm() {
        return cctvNm;
    }

    public void setCctvNm(String cctvNm) {
        this.cctvNm = cctvNm;
    }

    public String getDestAvi() {
		return destAvi;
	}

	public void setDestAvi(String destAvi) {
		this.destAvi = destAvi;
	}

	public String getRenewExtYn() {
		return renewExtYn;
	}

	public void setRenewExtYn(String renewExtYn) {
		this.renewExtYn = renewExtYn;
	}

	public String getRenewEviYn() {
		return renewEviYn;
	}

	public void setRenewEviYn(String renewEviYn) {
		this.renewEviYn = renewEviYn;
	}

	public String getRenewPlayLimitCnt() {
        return renewPlayLimitCnt;
    }

    public void setRenewPlayLimitCnt(String renewPlayLimitCnt) {
        this.renewPlayLimitCnt = renewPlayLimitCnt;
    }

    public String getRenewPlayLimitDat() {
        return renewPlayLimitDat;
    }

    public void setRenewPlayLimitDat(String renewPlayLimitDat) {
        this.renewPlayLimitDat = renewPlayLimitDat;
    }

    public String getUserNm() {
		return userNm;
	}

	public void setUserNm(String userNm) {
		this.userNm = userNm;
	}

	public String getRankNm() {
		return rankNm;
	}

	public void setRankNm(String rankNm) {
		this.rankNm = rankNm;
	}

	public String getOfficeTelNo() {
		return officeTelNo;
	}

	public void setOfficeTelNo(String officeTelNo) {
		this.officeTelNo = officeTelNo;
	}

	public String getAcptUserInfo() {
		return acptUserInfo;
	}

	public void setAcptUserInfo(String acptUserInfo) {
		this.acptUserInfo = acptUserInfo;
	}

	public String getRqstUserInfo() {
		return rqstUserInfo;
	}

	public void setRqstUserInfo(String rqstUserInfo) {
		this.rqstUserInfo = rqstUserInfo;
	}

	public String getEviChk() {
		return eviChk;
	}

	public void setEviChk(String eviChk) {
		this.eviChk = eviChk;
	}

	public String getFileList() {
		return fileList;
	}

	public void setFileList(String fileList) {
		this.fileList = fileList;
	}

    public String getCctvList() {
        return cctvList;
    }

    public void setCctvList(String cctvList) {
        this.cctvList = cctvList;
    }

	public String getRenewAcptYn() {
		return renewAcptYn;
	}

	public void setRenewAcptYn(String renewAcptYn) {
		this.renewAcptYn = renewAcptYn;
	}

	public String getRenewMgrSeq() {
		return renewMgrSeq;
	}

	public void setRenewMgrSeq(String renewMgrSeq) {
		this.renewMgrSeq = renewMgrSeq;
	}

	public String getRenewAcptUserId() {
		return renewAcptUserId;
	}

	public void setRenewAcptUserId(String renewAcptUserId) {
		this.renewAcptUserId = renewAcptUserId;
	}

	public String getRenewAcptDat() {
		return renewAcptDat;
	}

	public void setRenewAcptDat(String renewAcptDat) {
		this.renewAcptDat = renewAcptDat;
	}

	public String getRenewReqstDat() {
		return renewReqstDat;
	}

	public void setRenewReqstDat(String renewReqstDat) {
		this.renewReqstDat = renewReqstDat;
	}

	public String getRenewReqstResn() {
		return renewReqstResn;
	}

	public void setRenewReqstResn(String renewReqstResn) {
		this.renewReqstResn = renewReqstResn;
	}

	public String getVdwkAviMgrSeq() {
		return vdwkAviMgrSeq;
	}

	public void setVdwkAviMgrSeq(String vdwkAviMgrSeq) {
		this.vdwkAviMgrSeq = vdwkAviMgrSeq;
	}

	public String getAviPlayLimitDat() {
		return aviPlayLimitDat;
	}

	public void setAviPlayLimitDat(String aviPlayLimitDat) {
		this.aviPlayLimitDat = aviPlayLimitDat;
	}
	public String getVdwkShaCde() {
		return vdwkShaCde;
	}

	public void setVdwkShaCde(String vdwkShaCde) {
		this.vdwkShaCde = vdwkShaCde;
	}

	public String getVdwkMd5Cde() {
		return vdwkMd5Cde;
	}

	public void setVdwkMd5Cde(String vdwkMd5Cde) {
		this.vdwkMd5Cde = vdwkMd5Cde;
	}

	public String getCarInfo() {
		return carInfo;
	}

	public void setCarInfo(String carInfo) {
		this.carInfo = carInfo;
	}

	public String getSmySendYn() {
		return smySendYn;
	}

	public void setSmySendYn(String smySendYn) {
		this.smySendYn = smySendYn;
	}

	public String getVideoSmy() {
		return videoSmy;
	}

	public void setVideoSmy(String videoSmy) {
		this.videoSmy = videoSmy;
	}

	@Override
	public String toString() {
		return "CrmsTransAviVo [acptDat=" + acptDat + ", acptUserId=" + acptUserId + ", acptUserInfo=" + acptUserInfo
				+ ", aviContsId=" + aviContsId + ", aviPlayLimitDat=" + aviPlayLimitDat + ", bakStatCd=" + bakStatCd
				+ ", cctvLabel=" + cctvLabel + ", cctvList=" + cctvList + ", cctvMgrNo=" + cctvMgrNo + ", cctvNm="
				+ cctvNm + ", crimeLoc=" + crimeLoc + ", crimeNm=" + crimeNm + ", destAvi=" + destAvi + ", docNo="
				+ docNo + ", eviChk=" + eviChk + ", expAviPw=" + expAviPw + ", fileList=" + fileList + ", hddSerial="
				+ hddSerial + ", macSerial=" + macSerial + ", maskChk=" + maskChk + ", mgrSeq=" + mgrSeq + ", officeNm="
				+ officeNm + ", officeTelNo=" + officeTelNo + ", playLimitCnt=" + playLimitCnt + ", playLimitDat="
				+ playLimitDat + ", rankNm=" + rankNm + ", recvMthd=" + recvMthd + ", renewAcptDat=" + renewAcptDat
				+ ", renewAcptUserId=" + renewAcptUserId + ", renewAcptYn=" + renewAcptYn + ", renewEviYn=" + renewEviYn
				+ ", renewExtYn=" + renewExtYn + ", renewMgrSeq=" + renewMgrSeq + ", renewPlayLimitCnt="
				+ renewPlayLimitCnt + ", renewPlayLimitDat=" + renewPlayLimitDat + ", renewReqstDat=" + renewReqstDat
				+ ", renewReqstResn=" + renewReqstResn + ", reqGbnCd=" + reqGbnCd + ", reqstDat=" + reqstDat
				+ ", reqstDetail=" + reqstDetail + ", reqstId=" + reqstId + ", reqstResn=" + reqstResn + ", rqstMgrSeq="
				+ rqstMgrSeq + ", rqstUserInfo=" + rqstUserInfo + ", secEdDat=" + secEdDat + ", secStDat=" + secStDat
				+ ", userNm=" + userNm + ", useRsCd=" + useRsCd + ", vdwkAviMgrSeq=" + vdwkAviMgrSeq + ", vdwkDownCnt="
				+ vdwkDownCnt + ", vdwkFileNm=" + vdwkFileNm + ", vdwkFileSeq=" + vdwkFileSeq + ", vdwkMd5Cde="
				+ vdwkMd5Cde + ", vdwkSecEdDat=" + vdwkSecEdDat + ", vdwkSecStDat=" + vdwkSecStDat + ", vdwkShaCde="
				+ vdwkShaCde + ", vdwkWorkStatCd=" + vdwkWorkStatCd + ", vdwkWorkStatCdRelCdeNm="
				+ vdwkWorkStatCdRelCdeNm + "]";
	}





}
