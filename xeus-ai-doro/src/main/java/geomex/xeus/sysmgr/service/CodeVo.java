package geomex.xeus.sysmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  CodeVo.java
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
 * @since   :  2017. 7. 7.
 * @version :  1.0
 * @see
 */

public class CodeVo {

    @NotNull(message="코드그룹코드는 필수사항 입니다.")
    @NotEmpty(message="코드그룹코드는 필수사항 입니다.")
    @Size(min=0, max=3, message="코드그룹코드는 최대 3자 까지 입력하실 수 있습니다.")
	private String grpCde;
    @Size(min=0, max=20, message="코드그룹명은 최대 20자 까지 입력하실 수 있습니다.")
	private String grpNm;
	@NotNull(message="코드는 필수사항 입니다.")
    @NotEmpty(message="코드는 필수사항 입니다.")
    @Size(min=0, max=2, message="코드는 최대 2자 까지 입력하실 수 있습니다.")
	private String cdeCde;
	@Size(min=0, max=255, message="코드명은 최대 255자 까지 입력하실 수 있습니다.")
	private String cdeNm;

	/**
	 * @return the grpCde
	 */
	public String getGrpCde() {
		return grpCde;
	}
	/**
	 * @param grpCde the grpCde to set
	 */
	public void setGrpCde(String grpCde) {
		this.grpCde = grpCde;
	}
	/**
	 * @return the grpNm
	 */
	public String getGrpNm() {
		return grpNm;
	}
	/**
	 * @param grpNm the grpNm to set
	 */
	public void setGrpNm(String grpNm) {
		this.grpNm = grpNm;
	}
	/**
	 * @return the cdeCde
	 */
	public String getCdeCde() {
		return cdeCde;
	}
	/**
	 * @param cdeCde the cdeCde to set
	 */
	public void setCdeCde(String cdeCde) {
		this.cdeCde = cdeCde;
	}
	/**
	 * @return the cdeNm
	 */
	public String getCdeNm() {
		return cdeNm;
	}
	/**
	 * @param cdeNm the cdeNm to set
	 */
	public void setCdeNm(String cdeNm) {
		this.cdeNm = cdeNm;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((cdeCde == null) ? 0 : cdeCde.hashCode());
		result = prime * result + ((cdeNm == null) ? 0 : cdeNm.hashCode());
		result = prime * result + ((grpCde == null) ? 0 : grpCde.hashCode());
		result = prime * result + ((grpNm == null) ? 0 : grpNm.hashCode());
		return result;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj) return true;
		if (obj == null) return false;
		if (getClass() != obj.getClass()) return false;
		CodeVo other = (CodeVo) obj;
		if (cdeCde == null) {
			if (other.cdeCde != null) return false;
		} else if (!cdeCde.equals(other.cdeCde)) return false;
		if (cdeNm == null) {
			if (other.cdeNm != null) return false;
		} else if (!cdeNm.equals(other.cdeNm)) return false;
		if (grpCde == null) {
			if (other.grpCde != null) return false;
		} else if (!grpCde.equals(other.grpCde)) return false;
		if (grpNm == null) {
			if (other.grpNm != null) return false;
		} else if (!grpNm.equals(other.grpNm)) return false;
		return true;
	}

}
