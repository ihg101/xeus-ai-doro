package geomex.xeus.sysmgr.service;

/**
 * <pre>
 * 파일명 :  ImageVo.java
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
 * @since   :  2017. 9. 26.
 * @version :  1.0
 * @see
 */

public class ImageVo {

	private String mgrSeq;
	private String refMgrNo;
	private String imgSeq;
	private String imgGbnCd;
	private String imgFormat;
	private String imgNm;
	private String fileNm;
	private String imgPath;
	private String tblId;
	private String schemaNm;


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
	 * @return the refMgrNo
	 */
	public String getRefMgrNo() {
		return refMgrNo;
	}
	/**
	 * @param refMgrNo the refMgrNo to set
	 */
	public void setRefMgrNo(String refMgrNo) {
		this.refMgrNo = refMgrNo;
	}
	/**
	 * @return the imgSeq
	 */
	public String getImgSeq() {
		return imgSeq;
	}
	/**
	 * @param imgSeq the imgSeq to set
	 */
	public void setImgSeq(String imgSeq) {
		this.imgSeq = imgSeq;
	}
	/**
	 * @return the imgGbnCd
	 */
	public String getImgGbnCd() {
		return imgGbnCd;
	}
	/**
	 * @param imgGbnCd the imgGbnCd to set
	 */
	public void setImgGbnCd(String imgGbnCd) {
		this.imgGbnCd = imgGbnCd;
	}
	/**
	 * @return the imgFormat
	 */
	public String getImgFormat() {
		return imgFormat;
	}
	/**
	 * @param imgFormat the imgFormat to set
	 */
	public void setImgFormat(String imgFormat) {
		this.imgFormat = imgFormat;
	}
	/**
	 * @return the imgNm
	 */
	public String getImgNm() {
		return imgNm;
	}
	/**
	 * @param imgNm the imgNm to set
	 */
	public void setImgNm(String imgNm) {
		this.imgNm = imgNm;
	}
	/**
	 * @return the fileNm
	 */
	public String getFileNm() {
		return fileNm;
	}
	/**
	 * @param fileNm the fileNm to set
	 */
	public void setFileNm(String fileNm) {
		this.fileNm = fileNm;
	}
	/**
	 * @return the imgPath
	 */
	public String getImgPath() {
		return imgPath;
	}
	/**
	 * @param imgPath the imgPath to set
	 */
	public void setImgPath(String imgPath) {
		this.imgPath = imgPath;
	}


	public String getTblId() {
		return tblId;
	}
	public void setTblId(String tblId) {
		this.tblId = tblId;
	}


	public String getSchemaNm() {
		return schemaNm;
	}
	public void setSchemaNm(String schemaNm) {
		this.schemaNm = schemaNm;
	}

	@Override
	public String toString() {
		return "ImageVo [mgrSeq=" + mgrSeq + ", refMgrNo=" + refMgrNo + ", imgSeq=" + imgSeq + ", imgGbnCd=" + imgGbnCd
				+ ", imgFormat=" + imgFormat + ", imgNm=" + imgNm + ", fileNm=" + fileNm + ", imgPath=" + imgPath
				+ ", tblId=" + tblId + ", schemaNm=" + schemaNm + "]";
	}



}
