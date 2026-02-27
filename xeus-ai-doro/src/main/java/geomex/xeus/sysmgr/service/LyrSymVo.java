package geomex.xeus.sysmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  LyrSymVo.java
 * 설  명 :
 *   Sym Desc Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 10. 24.      이은규          최초 생성
 *
 * </pre>
 *
 * @since : 2018. 10. 24.
 * @version : 1.0
 * @see
 */
public class LyrSymVo {

	/*mgr_seq serial NOT NULL, -- 관리순서번호
	lyr_nm character varying(20), -- 레이어명
	gbn_cd character varying(20), -- 구분코드
	sym_mgr_no character(10) NOT NULL, -- 심볼관리번호*/
	private String mgrSeq;
	private String lyrNm;
	private String gbnCd;
	private String symMgrNo;

	//심볼 정보
	private String symGbnCd;
	private String fileNm;
	private byte[] symBytes;

	public String getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getLyrNm() {
		return lyrNm;
	}
	public void setLyrNm(String lyrNm) {
		this.lyrNm = lyrNm;
	}
	public String getGbnCd() {
		return gbnCd;
	}
	public void setGbnCd(String gbnCd) {
		this.gbnCd = gbnCd;
	}
	public String getSymMgrNo() {
		return symMgrNo;
	}
	public void setSymMgrNo(String symMgrNo) {
		this.symMgrNo = symMgrNo;
	}
	public String getSymGbnCd() {
		return symGbnCd;
	}
	public void setSymGbnCd(String symGbnCd) {
		this.symGbnCd = symGbnCd;
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

}
