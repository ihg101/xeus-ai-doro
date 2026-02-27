package geomex.xeus.smartcity;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;
import java.util.ArrayList;
import java.util.GregorianCalendar;
import java.util.HashMap;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.util.StringUtils;

import com.itextpdf.text.log.SysoCounter;

import geomex.xeus.smartcity.service.EventHistVo;
import geomex.xeus.util.code.StrUtil;

/**
 * <pre>
 * ===========================================================
 * 파일명 :  Utils.java
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
public class Utils {

    public static String readString(ByteBuffer buffer, int len) throws UnsupportedEncodingException {
        byte b[] = new byte[len];
        buffer.get(b);
        return new String(b, "UTF-8");
    }

    /**
     * 세미콜론까지 byte 전체를 읽는다. 비효율적 임.. packet dump 필요시만 사용
     *
     * @param ins
     * @return
     * @throws IOException
     */
    public static byte[] readAll(InputStream ins) throws IOException {
        boolean readOK = false;
        ByteArrayOutputStream baos = new ByteArrayOutputStream(8192);
        try {
            while (!readOK) {
                byte data = (byte) ins.read();
                if (data == -1) {
                    throw new IOException("SockekChannel is Closed");
                } else if (data == Code.SEMICOLON) {
                    baos.write(data);
                    readOK = true;
                } else {
                    baos.write(data);
                }
            }
        } finally {
            IOUtils.closeQuietly(baos);
        }
        return baos.toByteArray();
    }

    //InputStream에서 RS구분자별로 구분하여 일고고 ;가 오면 종료. 사용말자...
    @Deprecated
    public static ArrayList<byte[]> read(InputStream ins) throws IOException {
        ArrayList<byte[]> items = new ArrayList<byte[]>(10);
        boolean readOK = false;
        //
        ByteArrayOutputStream baos = new ByteArrayOutputStream(8192);
        try {
            while (!readOK) {
                byte data = (byte) ins.read();
                if (data == -1) {
                    throw new IOException("SockekChannel is Closed");
                } else if (data == Code.SEMICOLON) {
                    readOK = true;
                } else if (data == 0x1E) {
                    // 한 항목을 다 읽었다.
                    items.add(baos.toByteArray());
                    baos.close();
                    baos = new ByteArrayOutputStream(8192);
                } else {
                    baos.write(data);
                }
            }
        } finally {
            IOUtils.closeQuietly(baos);
        }
        return items;
    }

    public static void read(SocketChannel sc, ByteBuffer buf) throws IOException {
        boolean readOK = false;
        while (!readOK) {
            int readBytes = sc.read(buf);
            if (readBytes < 0) {
                throw new IOException("SockekChannel is Closed");
            }
            if (!buf.hasRemaining()) {
                readOK = true;
            }
        }
    }

    public static String getDate() {
        return DateFormatUtils.format(new GregorianCalendar(), "yyyyMMddHHmmss");
    }

    public static String getRandomString(int num) {
        return RandomStringUtils.randomAlphanumeric(num);
    }

    //문자열 byte배열을 얻는다.
    public static byte[] getUTFBytes(String str) throws Exception {
        return str.getBytes("UTF-8");
    }

    //문자열을 tgt에 넣고 나머지를 공백으로 채운다.
    public static void fillBytes(String msg, byte[] tgt) throws Exception {
        byte msgBytes[] = msg.getBytes("UTF-8");
        System.arraycopy(msgBytes, 0, tgt, 0, msgBytes.length);
        for (int x = msgBytes.length; x < (tgt.length - msgBytes.length); x++) {
            tgt[x] = 0x20; //공백채우기
        }
    }

    /**
     * 문장 맨뒤 semicolon을 제거한다.
     *
     * @param str
     * @return
     */
    public static String removeENDStr(String str) {
        String after = str;
        int idx = after.lastIndexOf(Code.END_OF_DATA);

        if (idx > 0) {
            after = after.substring(0, after.lastIndexOf(Code.END_OF_DATA));
        }
        return after;
    }

    public static String array(String str) {
        String items[] = str.split("\\" + Code.ARRAY_SEPERATOR);
        if (items.length == 0) return str;
        return StringUtils.arrayToDelimitedString(items, ";");
    }

    /**
     * JSON 문자열을 Vo로 리턴합니다.
     *
     * @param json
     * @return
     */
    public static EventHistVo parseVo(String json){
    	EventHistVo vo = new EventHistVo();

    	JSONObject jo = null;
    	JSONParser parser = new JSONParser();
    	try {
			jo = (JSONObject) parser.parse(json);
		} catch (ParseException e) {
			System.out.println(">> Data Parse Error.");
			System.out.println(">> Retry Decoding & Parse.");
			System.out.println(json);
			try {
				try {
					jo = (JSONObject) parser.parse(URLDecoder.decode(json, "UTF-8"));
				} catch (UnsupportedEncodingException e1) {
					System.out.println(">> Data URLDecode Error.");
					e1.printStackTrace();
				}
			} catch (ParseException e1) {
				System.out.println(">> Retry Data Parse Error.");
				e1.printStackTrace();
			}
		}

		try {
		    
			vo.setUsvcOutbId(StrUtil.chkNull(String.valueOf(jo.get("uSvcOutbId"))));
			vo.setOutbPosNm(StrUtil.chkNull(String.valueOf(jo.get("outbPosNm"))));
			vo.setEvtSvcNm(StrUtil.chkNull(String.valueOf(jo.get("statEvetSvcTyp"))));
			vo.setEvtNm(StrUtil.chkNull(String.valueOf(jo.get("statEvetNm"))));
			vo.setEvtCntn(StrUtil.chkNull(String.valueOf(jo.get("statEvetCntn"))));

			JSONArray array = (JSONArray) jo.get("outbPos");
			JSONObject outb = (JSONObject) array.get(0);
			vo.setOutbPosx(StrUtil.chkNull(String.valueOf(outb.get("x"))));
			vo.setOutbPosy(StrUtil.chkNull(String.valueOf(outb.get("y"))));
			vo.setEvtOutbDtm(StrUtil.chkNull(String.valueOf(jo.get("statEvetOutbDtm"))));
			vo.setEvtClrDtm(StrUtil.chkNull(String.valueOf(jo.get("statEvetClrDtm"))));
			vo.setEvtProcCd(StrUtil.chkNull(String.valueOf(jo.get("procSt"))));
			vo.setEvtActnDtm(StrUtil.chkNull(String.valueOf(jo.get("statEvetActnDtm"))));
			vo.setEvtActnUsrid(StrUtil.chkNull(String.valueOf(jo.get("statEvetActnMn"))));
			vo.setEvtActnCntn(StrUtil.chkNull(String.valueOf(jo.get("statEvetActnCntn"))));
			vo.setEvtTyp(StrUtil.chkNull(String.valueOf(jo.get("statEvetType"))));
			vo.setEvtTypCd(StrUtil.chkNull(String.valueOf(jo.get("statEvetTypCd"))));
			vo.setTestYn(jsonSafe(jo.get("isTest")));
			vo.setMsgTypCd(jsonSafe(jo.get("statMsgTypCd")));
		     // 상태, 거리 초기값 추가
            String etcCntnStr = String.valueOf(jo.get("etcCntn"));
            JSONObject etcObj = (JSONObject) parser.parse(etcCntnStr);
            
            etcObj.put("state", "0");
            etcObj.put("dist", "0");
            jo.put("etcCntn", etcObj.toJSONString());
            
			vo.setEvtJson(StrUtil.chkNull(String.valueOf(jo.get("etcCntn"))));

			vo.setTmx(StrUtil.chkNull(String.valueOf(jo.get("tmx"))));
			vo.setTmy(StrUtil.chkNull(String.valueOf(jo.get("tmy"))));
			vo.setTargetGrp(StrUtil.chkNull(String.valueOf(jo.get("targetGrp"))));
			vo.setTargetId(StrUtil.chkNull(String.valueOf(jo.get("targetId"))));
			
			// 10 외에는 값이 안들어가서 강제로 주입 
			vo.setEvtProcCd("10");
			
			if("10".equals(vo.getEvtProcCd())){
				if("null".equals(vo.getUsvcOutbId()) || "".equals(vo.getUsvcOutbId()) || vo.getUsvcOutbId() == null){
					vo.setUsvcOutbId(RandomStringUtils.randomAlphanumeric(15));
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

    	return vo;
    }

    private static String jsonSafe(Object value) {
        if (value == null) return "";
        String s = value.toString();
        if ("null".equalsIgnoreCase(s)) return "";
        return s;
    }
    
    /**
     * HashMap 데이터를 JSON String 으로 리턴합니다.
     *
     * @param param
     * @return
     */
    public static String setJson(HashMap<String, String> param){

    	String JSON = "{"
			// 이벤트 타입 코드 (112, 119, DSC 등)
		+	"\"statEvetTypCd\" : \"" + StrUtil.chkNull(param.get("statEvetTypCd")) + "\","

			// 이벤트 메세지 타입 (전문구분코드 - 99로그인, 10사건정보, 20출동정보 등)
		+	"\"statMsgTypCd\" : \"" + StrUtil.chkNull(param.get("statMsgTypCd")) + "\","

			// 위치정보 명 – 예) 인천지하철 부평역
		+	"\"outbPosNm\" : \"" + StrUtil.chkNull(param.get("outbPosNm")) + "\","

			// 이벤트 명 – 예) 화재, 정전, 침수
		+	"\"statEvetNm\" : \"" + StrUtil.chkNull(param.get("statEvetNm")) + "\","

			// 이벤트 해제일시 입력 ex) "20171122131540889"
		+	"\"statEvetClrDtm\" : \"" + StrUtil.chkNull(param.get("statEvetClrDtm")) + "\","

			// 이벤트 접수 내용 – 화재 발생, 정전 발생, ㅇㅇ사거리 교통사고
		+	"\"statEvetCntn\" : \"" + StrUtil.chkNull(param.get("statEvetCntn")) + "\","

			// 이벤트 범주 - 예) 사회재난, 자연재난
		+	"\"statEvetType\" : \"" + StrUtil.chkNull(param.get("statEvetType")) + "\","

			// 좌표값 (배열이지만 단건만 등록.)
		+	"\"outbPos\" : [{\"x\":\"" + StrUtil.chkNull(param.get("x")) + "\",\"y\":\"" + StrUtil.chkNull(param.get("y")) + "\",\"z\":\"0\"}],"

			// 이벤트 발생일시
		+	"\"statEvetOutbDtm\" : \"" + StrUtil.chkNull(param.get("statEvetOutbDtm")) + "\","

			// 조치내용 또는 종료사유
		+	"\"statEvetActnCntn\" : \"" + StrUtil.chkNull(param.get("statEvetActnCntn")) + "\","

			// 이벤트 프로세스 코드 (10 발생 | 40 정보변경 | 50 해제 | 90 취소 | 91 종료)
		+	"\"procSt\" : \"" + StrUtil.chkNull(param.get("procSt")) + "\","

			// 모의 여부 (Y 모의 | N 실제)
		+	"\"isTest\" : \"" + StrUtil.chkNull(param.get("isTest")) + "\","

			// 이벤트 고유 ID
		+	"\"uSvcOutbId\" : \"" + StrUtil.chkNull(param.get("uSvcOutbId")) + "\","

			// 조치자
		+	"\"statEvetActnMn\" : \"" + StrUtil.chkNull(param.get("statEvetActnMn")) + "\","

			// 이벤트 조치일자 (조치 또는 종료시만 년월일시분초)
		+	"\"statEvetActnDtm\" : \"" + StrUtil.chkNull(param.get("statEvetActnDtm")) + "\","

			// 서비스명칭 - 예) 112긴급출동지원서비스
		+	"\"statEvetSvcTyp\" : \"" + StrUtil.chkNull(param.get("statEvetSvcTyp")) + "\","

			// TM X
		+	"\"tmx\" : \"" + StrUtil.chkNull(param.get("tmx")) + "\","

			// TM Y
		+	"\"tmy\" : \"" + StrUtil.chkNull(param.get("tmy")) + "\","

			// 수신 그룹
		+	"\"targetGrp\" : \"" + StrUtil.chkNull(param.get("targetGrp")) + "\","

			// 수신 사용자
		+	"\"targetId\" : \"" + StrUtil.chkNull(param.get("targetId")) + "\","

			// 주제별 상세 내용(원문)
		+	"\"etcCntn\" : " + param.get("etcCntn")

		+"}";

        return JSON;
    }

    /**
     * EventHistVo 데이터를 JSON String 으로 리턴합니다.
     *
     * @param param
     * @return
     * @throws ParseException
     */
    public static String setJson(EventHistVo vo) throws ParseException{

    	String targetGrp = "";
    	String targetId = "";
    	
    	if(vo.getEvtJson() != null && !"".equals(vo.getEvtJson())){
    		JSONParser parser = new JSONParser();
    		JSONObject jo = (JSONObject) parser.parse(vo.getEvtJson());
    		
    		targetGrp = StrUtil.chkNull(String.valueOf(jo.get("targetGrp")));
    		targetId = StrUtil.chkNull(String.valueOf(jo.get("targetId")));
    	}

    	if(targetGrp == null || "".equals(targetGrp) || "null".equals(targetGrp)){
    		if(vo.getTargetGrp() != null && !"".equals(vo.getTargetGrp())){
    			targetGrp = vo.getTargetGrp();
    		}
    	}

    	if(targetId == null || "".equals(targetId) || "null".equals(targetId)){
    		if(vo.getTargetId() != null && !"".equals(vo.getTargetId())){
    			targetId = vo.getTargetId();
    		}
    	}
    	// 이벤트 타입 변환
    /*	if(vo.getEvtTypCd().equals("001")) vo.setEvtTypCd("PORT"); 
    	if(vo.getEvtTypCd().equals("002")) vo.setEvtTypCd("NAK"); 
    	if(vo.getEvtTypCd().equals("003")) vo.setEvtTypCd("CORN"); 
    	if(vo.getEvtTypCd().equals("004")) vo.setEvtTypCd("GUL"); 
    	if(vo.getEvtTypCd().equals("005")) vo.setEvtTypCd("CRACK"); */
    	
    	String JSON = "{"
			// 이벤트 타입 코드 (112, 119, DSC 등)
			+	"\"statEvetTypCd\" : \"" + StrUtil.chkNull(vo.getEvtTypCd()) + "\","

			// 이벤트 메세지 타입 (전문구분코드 - 99로그인, 10사건정보, 20출동정보 등)
			+	"\"statMsgTypCd\" : \"" + StrUtil.chkNull(vo.getMsgTypCd()) + "\","

			// 위치정보 명 – 예) 인천지하철 부평역
			+	"\"outbPosNm\" : \"" + StrUtil.chkNull(vo.getOutbPosNm()) + "\","

			// 이벤트 명 – 예) 화재, 정전, 침수
			+	"\"statEvetNm\" : \"" + StrUtil.chkNull(vo.getEvtNm()) + "\","

			// 이벤트 해제일시 입력 ex) "20171122131540889"
			+	"\"statEvetClrDtm\" : \"" + StrUtil.chkNull(vo.getEvtClrDtm()) + "\","

			// 이벤트 접수 내용 – 화재 발생, 정전 발생, ㅇㅇ사거리 교통사고
			+	"\"statEvetCntn\" : \"" + StrUtil.chkNull(vo.getEvtCntn()) + "\","

			// 이벤트 범주 - 예) 사회재난, 자연재난
			+	"\"statEvetType\" : \"" + StrUtil.chkNull(vo.getEvtTyp()) + "\","

			// 좌표값 (배열이지만 단건만 등록.)
			+	"\"outbPos\" : [{\"x\":\"" + StrUtil.chkNull(vo.getOutbPosx()) + "\",\"y\":\"" + StrUtil.chkNull(vo.getOutbPosy()) + "\",\"z\":\"0\"}],"

			// 이벤트 발생일시
			+	"\"statEvetOutbDtm\" : \"" + StrUtil.chkNull(vo.getEvtOutbDtm()) + "\","

			// 조치내용 또는 종료사유
			+	"\"statEvetActnCntn\" : \"" + StrUtil.chkNull(vo.getEvtActnCntn()) + "\","

			// 이벤트 프로세스 코드 (10 발생 | 40 정보변경 | 50 해제 | 90 취소 | 91 종료)
			+	"\"procSt\" : \"" + StrUtil.chkNull(vo.getEvtProcCd()) + "\","

			// 모의 여부 (Y 모의 | N 실제)
			+	"\"isTest\" : \"" + StrUtil.chkNull(vo.getTestYn()) + "\","

			// 이벤트 고유 ID
			+	"\"uSvcOutbId\" : \"" + StrUtil.chkNull(vo.getUsvcOutbId()) + "\","

			// 조치자
			+	"\"statEvetActnMn\" : \"" + StrUtil.chkNull(vo.getEvtActnUsrid()) + "\","

			// 이벤트 조치일자 (조치 또는 종료시만 년월일시분초)
			+	"\"statEvetActnDtm\" : \"" + StrUtil.chkNull(vo.getEvtActnDtm()) + "\","

			// 서비스명칭 - 예) 112긴급출동지원서비스
			+	"\"statEvetSvcTyp\" : \"" + StrUtil.chkNull(vo.getEvtSvcNm()) + "\","

			// TM-X 좌표
			+	"\"tmx\" : \"" + StrUtil.chkNull(vo.getTmx()) + "\","

			// TM-Y 좌표
			+	"\"tmy\" : \"" + StrUtil.chkNull(vo.getTmy()) + "\","

			// 수신 그룹
			+	"\"targetGrp\" : \"" + targetGrp + "\","

			// 수신 그룹
			+	"\"targetId\" : \"" + targetId + "\","

			// 주제별 상세 내용(원문)
			+	"\"etcCntn\" : " + vo.getEvtJson()

			+"}";

    	return JSON;
    }

}
