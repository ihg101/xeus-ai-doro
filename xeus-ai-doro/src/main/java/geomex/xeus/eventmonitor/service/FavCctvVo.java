package geomex.xeus.eventmonitor.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  FavCctvVo.java
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
 * @since   :  2017. 12. 4.
 * @version :  1.0
 * @see
 */

public class FavCctvVo {

	private String mgrSeq;

	private String ownerId;

	@NotNull(message="제목은 필수사항 입니다.")
	@NotEmpty(message="제목은 필수사항 입니다.")
	@Size(min=0, max=50, message="제목은 최대 50자 까지 입력하실 수 있습니다.")
	private String titleNm;

	private String jsonTxt;

	private String colNum;

	private String chgDat;

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
	 * @return the ownerId
	 */
	public String getOwnerId() {
		return ownerId;
	}
	/**
	 * @param ownerId the ownerId to set
	 */
	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}
	/**
	 * @return the titleNm
	 */
	public String getTitleNm() {
		return titleNm;
	}
	/**
	 * @param titleNm the titleNm to set
	 */
	public void setTitleNm(String titleNm) {
		this.titleNm = titleNm;
	}
	/**
	 * @return the jsonTxt
	 */
	public String getJsonTxt() {
		return jsonTxt;
	}
	/**
	 * @param jsonTxt the jsonTxt to set
	 */
	public void setJsonTxt(String jsonTxt) {
		this.jsonTxt = jsonTxt;
	}
	/**
	 * @return the colNum
	 */
	public String getColNum() {
		return colNum;
	}
	/**
	 * @param colNum the colNum to set
	 */
	public void setColNum(String colNum) {
		this.colNum = colNum;
	}
	/**
	 * @return the chgDa
	 */
	public String getChgDat() {
		return chgDat;
	}
	/**
	 * @param chgDa the chgDa to set
	 */
	public void setChgDat(String chgDat) {
		this.chgDat = chgDat;
	}

}
