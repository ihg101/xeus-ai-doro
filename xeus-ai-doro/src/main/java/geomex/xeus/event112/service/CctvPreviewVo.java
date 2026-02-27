package geomex.xeus.event112.service;

import java.util.ArrayList;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class CctvPreviewVo {

	private String mgrSeq;
	private String reqUserId;
	private String reqResn;
	private String acciNum;
	private String cctvMgrNo;
	private String reqDat;
	private String acptNm;
	private String docSendYn;

	private String cctvNm;
	private String tmx;
	private String tmy;

	private ArrayList<String> mgrSeqList;

	public String getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getReqUserId() {
		return reqUserId;
	}
	public void setReqUserId(String reqUserId) {
		this.reqUserId = reqUserId;
	}
	public String getReqResn() {
		return reqResn;
	}
	public void setReqResn(String reqResn) {
		this.reqResn = reqResn;
	}
	public String getAcciNum() {
		return acciNum;
	}
	public void setAcciNum(String acciNum) {
		this.acciNum = acciNum;
	}
	public String getCctvMgrNo() {
		return cctvMgrNo;
	}
	public void setCctvMgrNo(String cctvMgrNo) {
		this.cctvMgrNo = cctvMgrNo;
	}
	public String getReqDat() {
		return reqDat;
	}
	public void setReqDat(String reqDat) {
		this.reqDat = reqDat;
	}
	public String getAcptNm() {
		return acptNm;
	}
	public void setAcptNm(String acptNm) {
		this.acptNm = acptNm;
	}
	public String getDocSendYn() {
		return docSendYn;
	}
	public void setDocSendYn(String docSendYn) {
		this.docSendYn = docSendYn;
	}
	public String getCctvNm() {
		return cctvNm;
	}
	public void setCctvNm(String cctvNm) {
		this.cctvNm = cctvNm;
	}
	public String getTmx() {
		return tmx;
	}
	public void setTmx(String tmx) {
		this.tmx = tmx;
	}
	public String getTmy() {
		return tmy;
	}
	public void setTmy(String tmy) {
		this.tmy = tmy;
	}
	public ArrayList<String> getMgrSeqList() {
		return mgrSeqList;
	}
	public void setMgrSeqList(ArrayList<String> mgrSeqList) {
		this.mgrSeqList = mgrSeqList;
	}
	@Override
	public String toString() {
		return "CctvPreviewVo [mgrSeq=" + mgrSeq + ", reqUserId=" + reqUserId + ", reqResn=" + reqResn + ", acciNum="
				+ acciNum + ", cctvMgrNo=" + cctvMgrNo + ", reqDat=" + reqDat + ", acptNm=" + acptNm + ", cctvNm="
				+ cctvNm + ", tmx=" + tmx + ", tmy=" + tmy + "]";
	}

}
