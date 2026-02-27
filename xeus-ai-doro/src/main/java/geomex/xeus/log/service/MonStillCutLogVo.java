package geomex.xeus.log.service;

/**
 * <pre>
 * 파일명 :  MonCctvLogVo.java
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
 * @since   :  2017. 6. 22.
 * @version :  1.0
 * @see
 */

public class MonStillCutLogVo {

	private String mgrSeq;
	private String userId;
	private String cctvMgrNo;
	private String thumbImg;
	private String downDat;
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

	public String getCctvMgrNo() {
		return cctvMgrNo;
	}
	public void setCctvMgrNo(String cctvMgrNo) {
		this.cctvMgrNo = cctvMgrNo;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getThumbImg() {
		return thumbImg;
	}
	public void setThumbImg(String thumbImg) {
		this.thumbImg = thumbImg;
	}
	public String getDownDat() {
		return downDat;
	}
	public void setDownDat(String downDat) {
		this.downDat = downDat;
	}

	@Override
	public String toString() {
		return "MonStillCutLogVo [mgrSeq=" + mgrSeq + ", userId=" + userId + ", cctvMgrNo=" + cctvMgrNo + ", thumbImg="
				+ thumbImg + ", downDat=" + downDat + "]";
	}

}
