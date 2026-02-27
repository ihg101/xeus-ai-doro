package geomex.xeus.smartcity;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;

/**
 * <pre>
 * ===========================================================
 * 파일명 :  Response.java
 * 작성자 :  홍길동
 * 작성일 :  2018. 4. 10.
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
public class Response implements Cloneable {
    public static final int LENGTH = 102;

    public String STATUS = Code.NORMAL;   //(1) 0-정상, 1-에러
    public String MSG = "";               //(100) 뒷자리 공백
    public String END = Code.END_OF_DATA; //(1) ;

    public Response() {}

    public Response(String status, String msg) {
        this.STATUS = status;
        this.MSG = msg;
    }

    public Response(ByteBuffer buffer) throws Exception {
        this.STATUS = Utils.readString(buffer, 1);
        this.MSG = Utils.readString(buffer, 100);
        this.END = Utils.readString(buffer, 1);
    }

    public void write(ByteBuffer buffer) throws Exception {
        buffer.order(ByteOrder.BIG_ENDIAN);
        buffer.put(Utils.getUTFBytes(String.format("%1s", STATUS)));
        byte b[] = new byte[100];
        Utils.fillBytes(MSG, b); //한글 메시지를 100byte 배열에 채운다.
        buffer.put(b);
        buffer.put(Utils.getUTFBytes(String.format("%1s", END)));
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        Response res = new Response();
        res.STATUS = this.STATUS;
        res.MSG = this.MSG;
        res.END = this.END;
        return res;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(STATUS).append(MSG).append(END);
        return sb.toString();
    }
}
