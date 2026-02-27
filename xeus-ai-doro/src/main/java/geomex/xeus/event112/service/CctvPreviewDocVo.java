package geomex.xeus.event112.service;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class CctvPreviewDocVo {

	private String mgrSeq;
	private String regUserId;
	private String docGbnCd;
	private String docNum;
	private String fileNm;
	private String filePath;
	private String regDat;
	private String recvUserId;
	private String recvDat;
	private String docJson;

	@JsonIgnore
    private MultipartFile file;

	public String getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getRegUserId() {
		return regUserId;
	}
	public void setRegUserId(String regUserId) {
		this.regUserId = regUserId;
	}
	public String getDocGbnCd() {
		return docGbnCd;
	}
	public void setDocGbnCd(String docGbnCd) {
		this.docGbnCd = docGbnCd;
	}
	public String getDocNum() {
		return docNum;
	}
	public void setDocNum(String docNum) {
		this.docNum = docNum;
	}
	public String getFileNm() {
		return fileNm;
	}
	public void setFileNm(String fileNm) {
		this.fileNm = fileNm;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public String getRegDat() {
		return regDat;
	}
	public void setRegDat(String regDat) {
		this.regDat = regDat;
	}
	public String getRecvUserId() {
		return recvUserId;
	}
	public void setRecvUserId(String recvUserId) {
		this.recvUserId = recvUserId;
	}
	public String getRecvDat() {
		return recvDat;
	}
	public void setRecvDat(String recvDat) {
		this.recvDat = recvDat;
	}
	public String getDocJson() {
		return docJson;
	}
	public void setDocJson(String docJson) {
		this.docJson = docJson;
	}
	public MultipartFile getFile() {
		return file;
	}
	public void setFile(MultipartFile file) {
		this.file = file;
	}
	@Override
	public String toString() {
		return "CarPreviewDocController [mgrSeq=" + mgrSeq + ", regUserId=" + regUserId + ", docGbnCd=" + docGbnCd
				+ ", docNum=" + docNum + ", fileNm=" + fileNm + ", filePath=" + filePath + ", regDat=" + regDat
				+ ", recvUserId=" + recvUserId + ", recvDat=" + recvDat + ", docJson=" + docJson + "]";
	}

}
