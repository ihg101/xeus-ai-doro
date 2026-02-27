package geomex.xeus.equipmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  CctvModelVo.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일                           수정자                         수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01       홍길동                          최초 생성
 * 2018-09-13       이은규                         테이블 수정으로 인한 작업
 *
 * </pre>
 *
 * @since   :  2017. 9. 15.
 * @version :  1.0
 * @see
 */

public class CctvModelVo {

	private String mgrNo;

	@NotNull(message="모델명은 필수사항 입니다.")
	@NotEmpty(message="모델명은 필수사항 입니다.")
	@Size(min=0, max=100, message="모델명은 최대 100자 까지 입력하실 수 있습니다.")
	private String modelNm;

	@Size(min=0, max=100, message="제조사명은 최대 100자 까지 입력하실 수 있습니다.")
	private String makerNm;

	@Size(min=0, max=255, message="상세설명은 최대 255자 까지 입력하실 수 있습니다.")
	private String modelDesc;

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

	/**
	 * @return the modelNm
	 */
	public String getModelNm() {
		return modelNm;
	}

	/**
	 * @param modelNm the modelNm to set
	 */
	public void setModelNm(String modelNm) {
		this.modelNm = modelNm;
	}

	/**
	 * @return the makerNm
	 */
	public String getMakerNm() {
		return makerNm;
	}

	/**
	 * @param makerNm the makerNm to set
	 */
	public void setMakerNm(String makerNm) {
		this.makerNm = makerNm;
	}

    public String getModelDesc() {
        return modelDesc;
    }

    public void setModelDesc(String modelDesc) {
        this.modelDesc = modelDesc;
    }

	@Override
	public String toString() {
		return "CctvModelVo [mgrNo=" + mgrNo + ", modelNm=" + modelNm + ", makerNm=" + makerNm + ", modelDesc="
				+ modelDesc + "]";
	}


}
