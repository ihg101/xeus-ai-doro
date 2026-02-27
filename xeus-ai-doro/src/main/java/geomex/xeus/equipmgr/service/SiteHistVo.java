package geomex.xeus.equipmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  SiteVo.java
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
 * @since   :  2017. 8. 28.
 * @version :  1.0
 * @see
 */

public class SiteHistVo {

	private String mgrSeq;

	@Size(min=0, max=6, message="이력일자는 최대 6자 까지 입력하실 수 있습니다.")
	private String histDat;

	private String histGbnCd;

	private String writerId;

	@Size(min=0, max=255, message="이력내용은 최대 255자 까지 입력하실 수 있습니다.")
	private String histNote;

	@NotNull(message="사이트 관리번호는 필수사항 입니다.")
	@NotEmpty(message="사이트 관리번호는 필수사항 입니다.")
	private String mgrNo;

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
	 * @return the histDat
	 */
	public String getHistDat() {
		return histDat;
	}
	/**
	 * @param histDat the histDat to set
	 */
	public void setHistDat(String histDat) {
		this.histDat = histDat;
	}
	/**
	 * @return the histGbnCd
	 */
	public String getHistGbnCd() {
		return histGbnCd;
	}
	/**
	 * @param histGbnCd the histGbnCd to set
	 */
	public void setHistGbnCd(String histGbnCd) {
		this.histGbnCd = histGbnCd;
	}
	/**
	 * @return the writerId
	 */
	public String getWriterId() {
		return writerId;
	}
	/**
	 * @param writerId the writerId to set
	 */
	public void setWriterId(String writerId) {
		this.writerId = writerId;
	}
	/**
	 * @return the histNote
	 */
	public String getHistNote() {
		return histNote;
	}
	/**
	 * @param histNote the histNote to set
	 */
	public void setHistNote(String histNote) {
		this.histNote = histNote;
	}
	/**
	 * @return the mgrNo
	 */
	public String getMgrNo() {
		return mgrNo;
	}
	/**
	 * @param mgrNo the mgrNo to set
	 */
	public void setMgrNo(String mgrNo) {
		this.mgrNo = mgrNo;
	}

}
