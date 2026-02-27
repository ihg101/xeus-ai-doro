package geomex.xeus.tvius.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  CrmsOfficialDocVo.java
 * 설  명 :
 *   CrmsOfficialDoc 관련 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 12. 17.      이은규          최초 생성
 *
 * </pre>
 *
 * @since : 2018. 12. 17.
 * @version : 1.0
 * @see
 */

public class CrmsOfficialDocVo {

	/*mgr_seq int4 DEFAULT nextval('xeus.crms_official_doc_mgr_seq_seq'::regclass) NOT NULL,
	user_id varchar(30) COLLATE default,
	reg_dat char(14) COLLATE default,
	doc_file_nm varchar(30) COLLATE default,
	doc_file_path varchar(50) COLLATE default,
	doc_no varchar(30) COLLATE default,*/

	private String mgrSeq;
	private String userId;
	private String regDat;
	private String docFileNm;
	private String docFilePath;
	private String docNo;

	public String getMgrSeq() {
		return mgrSeq;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getRegDat() {
		return regDat;
	}
	public void setRegDat(String regDat) {
		this.regDat = regDat;
	}
	public String getDocFileNm() {
		return docFileNm;
	}
	public void setDocFileNm(String docFileNm) {
		this.docFileNm = docFileNm;
	}
	public String getDocFilePath() {
		return docFilePath;
	}
	public void setDocFilePath(String docFilePath) {
		this.docFilePath = docFilePath;
	}
	public String getDocNo() {
		return docNo;
	}
	public void setDocNo(String docNo) {
		this.docNo = docNo;
	}
}
