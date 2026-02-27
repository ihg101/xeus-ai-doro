package geomex.xeus.smartcity;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;

/**
 * <pre>
 * ===========================================================
 * 파일명 :  Head.java
 * 작성자 :  홍길동
 * 작성일 :  2018. 4. 4.
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
public class Head implements Cloneable {
    public static final int LENGTH = 48;

    public String MSG_TYP_CD = Code.MSG_LOGIN;   // (2)전문구분코드
    public String STA_TYP_CD = Code.STAT_LOGIN;  // (2)진행구분코드
    public String MSG_STA_DTM = "";              //(14)메시지구분 일시, 로그인 일시

    public String SND_SYS_CD = Code.SYS_119;     // (3)송신시스템 코드
    public String RCV_SYS_CD = Code.SYS_UCP;     // (3)수신시스템 코드
    public String SND_DTM = "";                  //(14)발송일시
    public int DATA_LEN = 0;                     //(10)데이터 길이

    public Head() {}

    public Head(ByteBuffer buffer) throws Exception {
        this.MSG_TYP_CD = Utils.readString(buffer, 2);
        this.STA_TYP_CD = Utils.readString(buffer, 2);
        this.MSG_STA_DTM = Utils.readString(buffer, 14);
        this.SND_SYS_CD = Utils.readString(buffer, 3);
        this.RCV_SYS_CD = Utils.readString(buffer, 3);
        this.SND_DTM = Utils.readString(buffer, 14);
        String len = Utils.readString(buffer, 10);
        this.DATA_LEN = Integer.parseInt(len);
    }

    public void write(ByteBuffer buffer) throws Exception {
        buffer.order(ByteOrder.BIG_ENDIAN);
        buffer.put(Utils.getUTFBytes(String.format("%2s", MSG_TYP_CD)));
        buffer.put(Utils.getUTFBytes(String.format("%2s", STA_TYP_CD)));
        buffer.put(Utils.getUTFBytes(String.format("%14s", MSG_STA_DTM)));
        buffer.put(Utils.getUTFBytes(String.format("%3s", SND_SYS_CD)));
        buffer.put(Utils.getUTFBytes(String.format("%3s", RCV_SYS_CD)));
        buffer.put(Utils.getUTFBytes(String.format("%14s", SND_DTM)));
        buffer.put(Utils.getUTFBytes(String.format("%010d", DATA_LEN)));
    }

    //    public String asText() {
    //        return toString();
    //    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("%2s", MSG_TYP_CD));
        sb.append(String.format("%2s", STA_TYP_CD));
        sb.append(String.format("%14s", MSG_STA_DTM));
        sb.append(String.format("%3s", SND_SYS_CD));
        sb.append(String.format("%3s", RCV_SYS_CD));
        sb.append(String.format("%14s", SND_DTM));
        sb.append(String.format("%010d", DATA_LEN));
        return sb.toString();
    }

    public static void main(String args[]) throws Exception{
        Head h = new Head();
        h.MSG_TYP_CD = "99";
        h.STA_TYP_CD = "99";
        h.MSG_STA_DTM ="20180417150413";
        h.SND_SYS_CD ="119";
        h.RCV_SYS_CD ="UCP";
        h.SND_DTM = "20180417151013";
        h.DATA_LEN= 100;
        //
        ByteBuffer buffer = ByteBuffer.allocate(Head.LENGTH);
        h.write(buffer);
        //
    }
}
