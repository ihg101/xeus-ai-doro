package geomex.xeus.tvius.carservice;

/**
 * <pre>
 * 파일명 :  CrmsCarSchVo.java
 * 설  명 :
 *   차량검색 관련 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 *
 *
 * </pre>
 *
 * @since : 2018. 10. 01.
 * @version : 1.0
 * @see
 */
public class CrmsCarSchVo {
	private String lprSeq; // 등로순번
	private String cctvNo; // 카메라 ID
	private String carLicenseNo; // 차량번호
	private String carImgFileNm; // 차량사진파일명
	private String lprSvrNo; // FTP서버에 저장되어있는 원본파일명
	private String carImgPathNm; // FTP 드라이브명

	public String getLprSeq() {
		return lprSeq;
	}
	public void setLprSeq(String lprSeq) {
		this.lprSeq = lprSeq;
	}
	public String getCctvNo() {
		return cctvNo;
	}
	public void setCctvNo(String cctvNo) {
		this.cctvNo = cctvNo;
	}
	public String getCarLicenseNo() {
		return carLicenseNo;
	}
	public void setCarLicenseNo(String carLicenseNo) {
		this.carLicenseNo = carLicenseNo;
	}
	public String getCarImgFileNm() {
		return carImgFileNm;
	}
	public void setCarImgFileNm(String carImgFileNm) {
		this.carImgFileNm = carImgFileNm;
	}
	public String getLprSvrNo() {
		return lprSvrNo;
	}
	public void setLprSvrNo(String lprSvrNo) {
		this.lprSvrNo = lprSvrNo;
	}
	public String getCarImgPathNm() {
		return carImgPathNm;
	}
	public void setCarImgPathNm(String carImgPathNm) {
		this.carImgPathNm = carImgPathNm;
	}

	@Override
	public String toString() {
		return "CrmsCarSchVo [lprSeq=" + lprSeq + ", cctvNo=" + cctvNo + ", carLicenseNo=" + carLicenseNo
				+ ", carImgFileNm=" + carImgFileNm + ", lprSvrNo=" + lprSvrNo + ", carImgPathNm=" + carImgPathNm + "]";
	}

}
