package geomex.xeus.sysmgr.service;

import java.util.Arrays;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  SymDescVo.java
 * 설  명 :
 *   Sym Desc Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 10. 23.      이은규          최초 생성
 *
 * </pre>
 *
 * @since : 2018. 10. 23.
 * @version : 1.0
 * @see
 */
public class SymDescVo {

	/*mgr_no character(10) NOT NULL, -- 심볼관리번호
	gbn_cd character(2), -- 심볼종류
	file_nm character varying(100), -- 파일명
	sym_bytes bytea, -- 이미지데이터*/
	private String mgrNo;
	private String gbnCd;
	private String fileNm;
	private byte[] symBytes;

	public String getMgrNo() {
		return mgrNo;
	}
	public void setMgrNo(String mgrNo) {
		this.mgrNo = mgrNo;
	}
	public String getGbnCd() {
		return gbnCd;
	}
	public void setGbnCd(String gbnCd) {
		this.gbnCd = gbnCd;
	}
	public String getFileNm() {
		return fileNm;
	}
	public void setFileNm(String fileNm) {
		this.fileNm = fileNm;
	}
	public byte[] getSymBytes() {
		return symBytes;
	}
	public void setSymBytes(byte[] symBytes) {
		this.symBytes = symBytes;
	}
	@Override
	public String toString() {
		return "SymDescVo [mgrNo=" + mgrNo + ", gbnCd=" + gbnCd + ", fileNm=" + fileNm + ", symBytes="
				+ Arrays.toString(symBytes) + "]";
	}

}
