package gmx.gis.util.code;

import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Random;

/**
*
* <pre>
* <b>History:</b>
* 장대건, 2020. 09. 22 최초 작성
* String 관련 Util 함수입니다.
* </pre>
*
* @author 장대건
*
*/
public class GMT_StrUtil {

	/**
     * Null인경우 공백문자열을 반환한다.
     *
     * @param str
     * @return String
     */
    public static String chkNull(String str) {
        if (str == null) return "";
        return str;
    }

    /**
     * 문자열이 null 이거나 length ==0 인지를 체크한다.
     *
     * @param str 체크할 문자열
     * @return true : str == null or str.length() == 0 <br>
     *         false : other case
     */
    public static boolean isEmpty(String str) {
        if (str == null || str.trim().length() == 0) {
            return true;
        }
        return false;
    }

    /**
     * 문자열 배열에 특정 문자가 있는지 체크한다.
     *
     * @author 장대건
     * @param strArr : String 배열
     * @param tgtStr : 체크할 문자
     * @return true : 문자열에 특정 문자가 있을 시 <br>
     *         false : other case
     */
    public static boolean isStrOnArray(String[] strArr, String tgtStr) {
    	if(strArr.length == 0) return false;

		for (String str : strArr) {
			if (str.equals(tgtStr)) {
				return true;
			}
		}
		return false;
    }

    /**
     * 문자열 배열에 특정 문자가 있는지 체크한다. (대소문자 구별x)
     *
     * @author 장대건
     * @param strArr : String 배열
     * @param tgtStr : 체크할 문자
     * @return true : 문자열에 특정 문자가 있을 시 <br>
     *         false : other case
     */
    public static boolean isStrOnArrayIgnoreCase(String[] strArr, String tgtStr) {
    	if(strArr.length == 0) return false;

		for (String str : strArr) {
			if (str.equalsIgnoreCase(tgtStr)) {
				return true;
			}
		}
		return false;
    }

    /**
     * 문자열 인코딩을 트랜스코딩 해줍니다.
     *
     * @author 장대건
     * @param str : 바꿀 문자
     * @param orgCharset : 원래 Charset
     * @param tgtCharset : 바꿀 Charset
     * @return 트랜스코딩된 문자 <br>
     * @throws UnsupportedEncodingException
     */
    public static String strTransCode(String str, String orgCharset, String tgtCharset)  {
    	String transcoded = "";
    	try {
    		transcoded = new String( str.getBytes(Charset.forName(orgCharset)), tgtCharset );
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
    	return transcoded;
    }
    
    /**
     * 유니코드 문자열을 한글코드 문자열로 트랜스코딩 해줍니다.
     *
     * @author 장대건
     * @param Unicodestr : 바꿀 문자
     * @return 한글코드로 트랜스코딩된 문자 <br>
     * @throws UnsupportedEncodingException
     */
	public static String uni2ksc(String Unicodestr){
		String transcoded = "";
		try {
			transcoded = new String(Unicodestr.getBytes("8859_1"), "KSC5601");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return transcoded;
	}
    /**
     * 한글코드 문자열을 유니코드 문자열로 트랜스코딩 해줍니다.
     *
     * @author 장대건
     * @param Unicodestr : 바꿀 문자
     * @return 유니코드로 트랜스코딩된 문자 <br>
     * @throws UnsupportedEncodingException
     */
	public static String ksc2uni(String str){
		String transcoded = "";
		try {
			transcoded = new String(str.getBytes("KSC5601"), "8859_1");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return transcoded;
	}

    /**
     * 문자에 한글이 있는지 검사한다.
     *
     * @param str
     * @return boolean
     */
    public static boolean containHangul(String str) {
    	if(str.matches(".*[ㄱ-ㅎㅏ-ㅣ가-힣]+.*")) {
    		return true;
    	}
    	return false;
    }
    
    /**
     * 문자열 자르기
     *
     * @param str
     * @param d
     * @return String
     */
    public static String left(String str, String d) {
        if (str.contains(d)) {
            return str.substring(0, str.indexOf(d)).trim();
        }
        return str.trim();
    }

    /**
     * str문자열중 d문자열 이후 문자열을 얻는다.
     *
     * @param str
     * @param d
     * @return String
     */
    public static String right(String str, String d) {
        if (str.contains(d)) {
            return str.substring(str.indexOf(d) + 1).trim();
        }
        return str.trim();
    }

    /**
     * 정수를 포맷형태의 문자열로 변환한다.
     *
     * @param v 포맷 문자열로 변환할 수
     * @param format 포맷 문자열
     * @return String 포맷 적용 결과 문자열
     */
    public static String numFormat(int v, String format) {
        NumberFormat formatter = new DecimalFormat(format);
        return formatter.format(v);
    }

    /**
     * 현재 년월일 문자열을 얻는다.
     *
     * @return String 현재 년월일 문자열
     */
    public static String getStrDay() {
        GregorianCalendar cal = new GregorianCalendar();
        return new StringBuilder(8)
            .append(numFormat(cal.get(Calendar.YEAR), "0000"))
            .append(numFormat(cal.get(Calendar.MONTH) + 1, "00"))
            .append(numFormat(cal.get(Calendar.DAY_OF_MONTH), "00"))
            .toString();
    }

    /**
     * 문자열 끝의 \r\n문자를 제거한다.
     *
     * @param str 대상 문자열
     * @return String 개행문자를 제거한 문자열
     */
    public static String removeCRLF(String str) {
        if (str.endsWith("\r\n")) {
            return str.substring(0, str.lastIndexOf("\r\n"));
        }
        return str;
    }

    /**
     * 현재 년월일시분초 문자열을 반환한다.
     *
     * @return String 년월일시분초 문자열
     */
    public static String getStrSec() {
        GregorianCalendar cal = new GregorianCalendar();
        return new StringBuilder(14)
            .append(numFormat(cal.get(Calendar.YEAR), "0000"))
            .append(numFormat(cal.get(Calendar.MONTH) + 1, "00"))
            .append(numFormat(cal.get(Calendar.DAY_OF_MONTH), "00"))
            .append(numFormat(cal.get(Calendar.HOUR_OF_DAY), "00"))
            .append(numFormat(cal.get(Calendar.MINUTE), "00"))
            .append(numFormat(cal.get(Calendar.SECOND), "00"))
            .toString();
    }

    /**
     * 년월일시분초 형태의 문자열을 2007-11-10 23:05:03 형식으로 변환한다.
     *
     * @param ymdhms 년월일시분초 문자열
     * @return String 2007-11-10 23:05:03 형식의 문잘열
     */
    public static String formatDate(String ymdhms) {
        return new StringBuilder(19).append(ymdhms.substring(0, 4)).append("-")
            .append(ymdhms.substring(4, 6)).append("-")
            .append(ymdhms.substring(6, 8)).append(" ")
            .append(ymdhms.substring(8, 10)).append(":")
            .append(ymdhms.substring(10, 12)).append(":")
            .append(ymdhms.substring(12, 14)).toString();
    }

    /**
     * 랜덤문자열을 생성해준다.
     *
     * @param len 랜덤 문자열 길이 ( 랜덤 문자열 뒤에는 타임스탬프 값이 들어간다. )
     * @return
     */
    public static String getRandomValue(int len) {
        long baseTimestamp = 1000L * 60 * 60 * 24 * 365 * 40;
        long timeKey =( ( System.currentTimeMillis() - baseTimestamp ) );

        Random rnd =new Random();
        StringBuffer buf =new StringBuffer();

        for(int i=0;i<len;i++){
            if(rnd.nextBoolean()){
                buf.append((char)((int)(rnd.nextInt(26))+97));
            }else{
                buf.append((rnd.nextInt(10)));
            }
        }

        String value =  buf.toString()+timeKey;

        return value;
    }

    /**
     * 오늘 날짜와 ymd날짜 사이에 값을 구한다.
     *
     * @param ymd
     * @return
     */
    public static int getCreateDday(String ymd) {
        int Dday = 0;
        Calendar cal = Calendar.getInstance();
        Calendar cal2 = Calendar.getInstance();
        try {

            int yy = Integer.parseInt(ymd.substring(0, 4));
            int mm = Integer.parseInt(ymd.substring(4, 6))-1;
            int dd = Integer.parseInt(ymd.substring(6, 8));

            cal2.set( yy, mm, dd);
            long day =( cal2.getTimeInMillis() - cal.getTimeInMillis()) / 1000 / 60 / 60 / 24;

            Dday =  (int)day;
        } catch(Exception e){
        }

        return Dday;
    }

    /**
     * 유니코드(ISO_8859_1)를 utf-8로 바꿔준다.
     * 안됨
     *
     * @param String str : 바꿀 문자열 (ISO_8859_1)
     * @return 트랜스코딩된 문자열
     */
	public static String UnicodeToUTF8(String strISO_8859_1) {
		final StringBuilder stringBuilder = new StringBuilder();
		for (int i = 0; i < strISO_8859_1.length(); i++) {
			final char ch = strISO_8859_1.charAt(i);
			if (ch <= 127) {
				stringBuilder.append(ch);
			} else {
				stringBuilder.append(String.format("%02x", (int) ch));
			}
		}
		String s = stringBuilder.toString();
		int len = s.length();
		byte[] data = new byte[len / 2];
		for (int i = 0; i < len; i += 2) {
			data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4) + Character.digit(s.charAt(i + 1), 16));
		}
		String strUTF_8 = new String(data, StandardCharsets.UTF_8);

		return strUTF_8;
	}

	/** '0330000000' 번호형식의 '-'를 추가해준다.
     * @param 문자열
     * @return '-'추가 문자열
     */
    public static String strTelAdd(String str){
        if (str == null || "".equals(str) || "null".equals(str) ){
            return "";
        } else if (str.length() < 10) {
            return str;
        } else {
            String f_num = str.substring(0, 3);
            String s_num = "";
            String t_num = "";
            String num = "";
            if ( str.length() == 10 ) {
                s_num = str.substring(3, 6);
                t_num = str.substring(6, 10);
                num = f_num+"-"+s_num+"-"+t_num;

            } else if ( str.length() == 11 ){

                s_num = str.substring(3, 7);
                t_num = str.substring(7, 11);
                num = f_num+"-"+s_num+"-"+t_num;
            } else {
                num = str;
            }

            return num;
        }

    }
}
