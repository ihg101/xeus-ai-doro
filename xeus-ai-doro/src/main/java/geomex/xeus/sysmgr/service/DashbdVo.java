package geomex.xeus.sysmgr.service;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * <pre>
 * 파일명 :  dashbdVo.java
 * 설  명 :
 *   대시보드목록 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 11. 06.      이은규          최초 생성
 *
 * </pre>
 *
 * @since : 2018. 11. 06.
 * @version : 1.0
 * @see
 */
public class DashbdVo {

	/*"mgr_seq" int4 DEFAULT nextval('"xeus".mt_dashbd_list_mgr_seq_seq'::regclass) NOT NULL,
	"user_id" varchar(30) COLLATE "default" NOT NULL,
	"brd_title" varchar(200) COLLATE "default",
	"json_txt" text COLLATE "default",
	"mdfy_dat" char(14) COLLATE "default",*/

	private String mgrSeq;
	private String userId;
    @Size(min=0, max=200, message="제목은 최대 200자 까지 입력하실 수 있습니다.")
	private String brdTitle;
	private String jsonTxt;
	private String mdfyDat;

	private String wifiCnt;
	private String loraCnt;
	private String blackboxCnt;

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

	public String getBrdTitle() {
		return brdTitle;
	}

	public void setBrdTitle(String brdTitle) {
		this.brdTitle = brdTitle;
	}

	public String getJsonTxt() {
		return jsonTxt;
	}

	public void setJsonTxt(String jsonTxt) {
		this.jsonTxt = jsonTxt;
	}

	public String getMdfyDat() {
		return mdfyDat;
	}

	public void setMdfyDat(String mdfyDat) {
		this.mdfyDat = mdfyDat;
	}

	public String getWifiCnt() {
		return wifiCnt;
	}

	public void setWifiCnt(String wifiCnt) {
		this.wifiCnt = wifiCnt;
	}

	public String getLoraCnt() {
		return loraCnt;
	}

	public void setLoraCnt(String loraCnt) {
		this.loraCnt = loraCnt;
	}

	public String getBlackboxCnt() {
		return blackboxCnt;
	}

	public void setBlackboxCnt(String blackboxCnt) {
		this.blackboxCnt = blackboxCnt;
	}

	public String toString(){
        return "[mgrSeq : " + mgrSeq + " | userId : " + userId + " | brdTitle : " + brdTitle + " | jsonTxt : " + jsonTxt + " | mdfyDat : " + mdfyDat + "]";
    }

}
