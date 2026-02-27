package geomex.xeus.smartcity;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;

/**
 * <pre>
 * ===========================================================
 * 파일명 :  ExtHead.java
 * 작성자 :  홍길동
 * 작성일 :  2018. 4. 4.
 * 버전   :  1.0
 * 설명   :
 * 내/외부 유통용 헤더
 *
 * 수정이력
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 *
 * ===========================================================
 * </pre>
 */
public class ExtHead implements Cloneable {
    public static final int LENGTH = 36;

    public String MSG_TYP_CD = "";               // (3)메시지 타입코드 재난, 안심앱, 비상벨등, 코드정리 필요, ACK
    public String SND_SYS_CD = Code.SYS_119;     // (3)송신시스템 코드
    public String RCV_SYS_CD = Code.SYS_UCP;     // (3)수신시스템 코드
    public String MSG_EXCH_PTRN = "1";           // (1)메시지 교환 패턴 One-Way: 1, One-Way ACK: 2, ACK: 3
    public String BODY_TYPE = "01";              // (2)body type, 01(json), 02(xml)
    public String SND_DTM = "";                  //(14)발송일시
    public int DATA_LEN = 0;                     //(10)데이터 길이

    public ExtHead() {}

    public ExtHead(String typ, String snd, String rcv, String dtm) {
        this.MSG_TYP_CD = String.format("%3s", typ);
        this.SND_SYS_CD = String.format("%3s", snd);
        this.RCV_SYS_CD = String.format("%3s", rcv);
        this.SND_DTM = String.format("%14s", dtm);
    }

    public ExtHead(ByteBuffer buffer) throws Exception {
        this.MSG_TYP_CD = Utils.readString(buffer, 3);
        this.SND_SYS_CD = Utils.readString(buffer, 3);
        this.RCV_SYS_CD = Utils.readString(buffer, 3);
        this.MSG_EXCH_PTRN = Utils.readString(buffer, 1);
        this.BODY_TYPE = Utils.readString(buffer, 2);
        this.SND_DTM = Utils.readString(buffer, 14);
        String len = Utils.readString(buffer, 10);
        this.DATA_LEN = Integer.parseInt(len);
    }

    public void write(ByteBuffer buffer) throws Exception {
        buffer.order(ByteOrder.BIG_ENDIAN);
        buffer.put(Utils.getUTFBytes(String.format("%3s", MSG_TYP_CD)));
        buffer.put(Utils.getUTFBytes(String.format("%3s", SND_SYS_CD)));
        buffer.put(Utils.getUTFBytes(String.format("%3s", RCV_SYS_CD)));
        buffer.put(Utils.getUTFBytes(String.format("%1s", MSG_EXCH_PTRN)));
        buffer.put(Utils.getUTFBytes(String.format("%2s", BODY_TYPE)));
        buffer.put(Utils.getUTFBytes(String.format("%14s", SND_DTM)));
        buffer.put(Utils.getUTFBytes(String.format("%010d", DATA_LEN)));
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        ExtHead h = new ExtHead();
        h.MSG_TYP_CD = this.MSG_TYP_CD;
        h.SND_SYS_CD = this.SND_SYS_CD;
        h.RCV_SYS_CD = this.RCV_SYS_CD;
        h.MSG_EXCH_PTRN = this.MSG_EXCH_PTRN;
        h.BODY_TYPE = this.BODY_TYPE;
        h.SND_DTM = this.SND_DTM;
        h.DATA_LEN = this.DATA_LEN;
        return h;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("%3s", MSG_TYP_CD));
        sb.append(String.format("%3s", SND_SYS_CD));
        sb.append(String.format("%3s", RCV_SYS_CD));
        sb.append(String.format("%1s", MSG_EXCH_PTRN));
        sb.append(String.format("%2s", BODY_TYPE));
        sb.append(String.format("%14s", SND_DTM));
        sb.append(String.format("%010d", DATA_LEN));
        return sb.toString();
    }

    public static void main(String args[]) throws Exception {
        ExtHead h = new ExtHead();
        h.MSG_TYP_CD = "199";
        h.SND_SYS_CD = "119";
        h.RCV_SYS_CD = "UCP";
        h.MSG_EXCH_PTRN = "1";
        h.BODY_TYPE = "01";
        h.SND_DTM = "20180417151013";
        h.DATA_LEN = 100;
        //
        ByteBuffer buffer = ByteBuffer.allocate(ExtHead.LENGTH);
        h.write(buffer);
        //
    }
}
