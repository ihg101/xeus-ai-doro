package geomex.xeus.sysmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * <pre>
 * 파일명 :  IpVo.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 15.
 * @version :  1.0
 * @see
 */
public class NoticeVo {

	private String mgrSeq;

	@NotNull(message="제목을 입력해주세요.")
	@NotEmpty(message="제목을 입력해주세요.")
	@Size(min=1, max=30, message="제목은 1자 이상, 50자 이하로 입력해주세요.")
	private String notcTitle;

	private String workerId;

	@NotNull(message="내용을 입력해주세요.")
	@NotEmpty(message="내용을 입력해주세요.")
	@Size(min=1, max=1000, message="내용은 1자 이상, 1000자 이하로 입력해주세요.")
	private String notcConts;

	private String lastMdfyDat;

	private String atchFileNm;

	private String atchFilePath;

	private String openType;

	@JsonIgnore
    private MultipartFile file;

	/**
	 * @return the mgrSeq
	 */
	public String getMgrSeq() {
		return mgrSeq;
	}

	/**
	 * @param mgrSeq the mgrSeq to set
	 */
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}

	/**
	 * @return the notcTitle
	 */
	public String getNotcTitle() {
		return notcTitle;
	}

	/**
	 * @param notcTitle the notcTitle to set
	 */
	public void setNotcTitle(String notcTitle) {
		this.notcTitle = notcTitle;
	}

	/**
	 * @return the workerId
	 */
	public String getWorkerId() {
		return workerId;
	}

	/**
	 * @param workerId the workerId to set
	 */
	public void setWorkerId(String workerId) {
		this.workerId = workerId;
	}

	/**
	 * @return the notcConts
	 */
	public String getNotcConts() {
		return notcConts;
	}

	/**
	 * @param notcConts the notcConts to set
	 */
	public void setNotcConts(String notcConts) {
		this.notcConts = notcConts;
	}

	/**
	 * @return the lastMdfyDat
	 */
	public String getLastMdfyDat() {
		return lastMdfyDat;
	}

	/**
	 * @param lastMdfyDat the lastMdfyDat to set
	 */
	public void setLastMdfyDat(String lastMdfyDat) {
		this.lastMdfyDat = lastMdfyDat;
	}

	/**
	 * @return the atchFileNm
	 */
	public String getAtchFileNm() {
		return atchFileNm;
	}

	/**
	 * @param atchFileNm the atchFileNm to set
	 */
	public void setAtchFileNm(String atchFileNm) {
		this.atchFileNm = atchFileNm;
	}

	/**
	 * @return the atchFilePath
	 */
	public String getAtchFilePath() {
		return atchFilePath;
	}

	/**
	 * @param atchFilePath the atchFilePath to set
	 */
	public void setAtchFilePath(String atchFilePath) {
		this.atchFilePath = atchFilePath;
	}

    /**
	 * @return the file
	 */
	public MultipartFile getFile() {
		return file;
	}

	/**
	 * @param file the file to set
	 */
	public void setFile(MultipartFile file) {
		this.file = file;
	}

	public String getOpenType() {
		return openType;
	}

	public void setOpenType(String openType) {
		this.openType = openType;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "NoticeVo [mgrSeq="
			+ mgrSeq + ", notcTitle=" + notcTitle + ", workerId=" + workerId + ", notcConts=" + notcConts
			+ ", lastMdfyDat=" + lastMdfyDat + ", atchFileNm=" + atchFileNm + ", atchFilePath=" + atchFilePath + "]";
	}


}
