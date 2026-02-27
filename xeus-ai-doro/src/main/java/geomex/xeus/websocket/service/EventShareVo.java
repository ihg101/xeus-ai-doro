package geomex.xeus.websocket.service;

/**
 * <pre>
 * 파일명 :  UserVo.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-05-31      이주영          최초 생성
 * 2017-12-11	   이은규		   로그인 제한 횟수, 사용자 등록IP 추가
 * 2018-01-08      이은규          subDir 생성(업로드 경로 서브 폴더이름)
 *
 * </pre>
 *
 * @since   :  2017. 5. 31.
 * @version :  1.0
 * @see
 */

public class EventShareVo {

	private String mgrSeq;
	private String companyNm;
	private String evtTypCd;
	private String shareUrl;
	private String json;
	private String success;
	private String resVal;

	public String getMgrSeq() {
		return mgrSeq;
	}
	public String getCompanyNm() {
		return companyNm;
	}
	public String getEvtTypCd() {
		return evtTypCd;
	}
	public String getShareUrl() {
		return shareUrl;
	}
	public void setMgrSeq(String mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public void setCompanyNm(String companyNm) {
		this.companyNm = companyNm;
	}
	public void setEvtTypCd(String evtTypCd) {
		this.evtTypCd = evtTypCd;
	}
	public void setShareUrl(String shareUrl) {
		this.shareUrl = shareUrl;
	}
	public String getJson() {
		return json;
	}
	public String getSuccess() {
		return success;
	}
	public void setJson(String json) {
		this.json = json;
	}
	public void setSuccess(String success) {
		this.success = success;
	}
	public String getResVal() {
		return resVal;
	}
	public void setResVal(String resVal) {
		this.resVal = resVal;
	}

}
