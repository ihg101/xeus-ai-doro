package geomex.xeus.smartcity.service;

import org.json.simple.JSONObject;

/**
 * <pre>
 * ===========================================================
 * 파일명 :  FileIdVo.java
 * 작성자 :  홍길동
 * 작성일 :  2018. 4. 24.
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
public class FileIdVo {
    private String FILE_TYPE = "";
    private String FILE_ID = "";

    public FileIdVo() {}

    public FileIdVo(String id) {
        this.FILE_ID = id;
    }

    public String getFileId() {
        return FILE_ID;
    }

    public void setFileId(String file_id) {
        this.FILE_ID = file_id;
    }

    public String getFileType() {
        return FILE_TYPE;
    }

    public void setFileType(String file_tye) {
        this.FILE_TYPE = file_tye;
    }

    @SuppressWarnings("unchecked")
	public String json(){
        JSONObject json = new JSONObject();
        json.put("FILE_ID", FILE_ID);
        json.put("FILE_TYPE", FILE_TYPE);
        return json.toString();
    }

    @Override
    public String toString() {
        return "FileIdVo [FILE_TYPE=" + FILE_TYPE + ", FILE_ID=" + FILE_ID + "]";
    }

}
