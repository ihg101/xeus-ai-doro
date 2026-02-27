package geomex.xeus.smartcity.service;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 * <pre>
 * ===========================================================
 * 파일명 :  SituationListVo.java
 * 작성자 :  홍길동
 * 작성일 :  2018. 4. 18.
 * 버전   :  1.0
 * 설명   :
 * 클래스 설명을 쓰시오
 *
 * 수정이력
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 *
 * ===========================================================
 * </pre>
 */
public class SituationListVo {
    private String retCode = "200"; //500
    private String retMsg = "SUCCESS"; //FAILED
    private String retYmdHms = "";
    private int retCnt = 0;
    private List<SituationVo> retData = new ArrayList<SituationVo>();

    public SituationListVo() {
        //  retData.add(new SituationVo());
        //  retData.add(new SituationVo());
    }

    public String getRetCode() {
        return retCode;
    }

    public void setRetCode(String retCode) {
        this.retCode = retCode;
    }

    public String getRetMsg() {
        return retMsg;
    }

    public void setRetMsg(String retMsg) {
        this.retMsg = retMsg;
    }

    public String getRetYmdHms() {
        return retYmdHms;
    }

    public void setRetYmdHms(String retYmdHms) {
        this.retYmdHms = retYmdHms;
    }

    public int getRetCnt() {
        return retCnt;
    }

    public void setRetCnt(int retCnt) {
        this.retCnt = retCnt;
    }

    public List<SituationVo> getRetData() {
        return retData;
    }

    public void setRetData(List<SituationVo> retData) {
        this.retData = retData;
    }

    @Override
    public String toString() {
        return "SituationListVo [retCode="
            + retCode + ", retMsg=" + retMsg + ", retYmdHms=" + retYmdHms + ", retCnt=" + retCnt + ", retData="
            + retData + "]";
    }

    @SuppressWarnings("unchecked")
	public String json() {
        JSONObject jsonList = new JSONObject();
        jsonList.put("retCode", retCode);
        jsonList.put("retMsg", retMsg);
        jsonList.put("retYmdHms", retYmdHms);
        jsonList.put("retCnt", retCnt);
        //
        JSONArray array = new JSONArray();
        for (int x = 0; x < retCnt; x++) {
            array.add(retData.get(x).json());
        }
        jsonList.put("retData", array);

        //StringWriter writer = new StringWriter(8192);
        return jsonList.toString();
    }
}
