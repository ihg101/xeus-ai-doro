/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package geomex.xeus.util.code;

import java.io.InputStream;
import java.nio.CharBuffer;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;

import javax.servlet.http.HttpServletRequest;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.helpers.DefaultHandler;

/**
 *
 * @author xparan
 */
public class Utils {

	public static String formatYear(String y){
		String n = "";
		if(y.length() == 1){
			n = "00"+y;
		}else if(y.length() == 2){
			n = "0"+y;
		}else if(y.length() == 3){
			n = y;
		}
		return n;
	}

    public static String chkZero(String n) {
        if ("0".equalsIgnoreCase(n)) {
            return "";
        }
        return n;
    }

    public static String chkZeroIsNumber(String n) {
        if ("".equals(chkNull(n))) {
            return "0";
        }
        return n;
    }

    public static String chkNull(String str) {
        if (str == null) {
            return "";
        }
        return str;
    }

    public static double chkNull(double str) {
        if (str == 0) {
            return 0;
        }
        return str;
    }

    public static int chkNull(int str) {
        if (str == 0) {
            return 0;
        }
        return str;
    }

    public static String chkNull(String str, String returnStr) {
        if ("".equals(chkNull(str))) {
            return returnStr;
        }
        return str;
    }

    public static boolean toBoolean(String srg) {
        boolean rv = false;
        try {
            rv = Boolean.parseBoolean(srg);

        } catch (Exception e) {
            rv = false;
        }
        return rv;
    }

    /**
     * HttpServletRequest에서 name으로 주어진 파라메터의 값을 반환한다. 만약 req가 null이거나 예외 발생시
     * null을 반환한다.
     *
     * @param req
     * @param name
     * @return
     */
    public static String getParam(HttpServletRequest req, String name) {

        if (req == null) {
            return "";
        }
        String value = null;
        try {
            //value = new String(req.getParameter(name).getBytes("8859_1"),"UTF-8");
            value = req.getParameter(name);
        } catch (Exception e) {
            value = "";
        }
        return chkNull(value);
    }

    public static String formatYMD(String ymd) {
        // 2007.10.10
        if (ymd.length() < 8) {
            return ymd;
        }
        StringBuilder sb = new StringBuilder();
        sb.append(ymd.substring(0, 4));
        sb.append(ymd.substring(4, 6));
        sb.append(ymd.substring(6, 10));

        //sb.append(ymd.substring(0, 4)).append("");
        //sb.append(ymd.substring(4, 6)).append("월");
        //sb.append(ymd.substring(6, 8)).append("일");
        return sb.toString();
    }

    public static String formatHM(String ymd) {
        // 2007-11-10 23:05:03
        if (ymd.length() < 4) {
            return ymd;
        }
        StringBuilder sb = new StringBuilder();
        sb.append(ymd.substring(0, 2)).append(":");
        sb.append(ymd.substring(2, 4));
        return sb.toString();
    }

    /**
     * 주어진 PNU값에서 지번만 뽑는다.
     *
     * @param ymdhms
     * @return
     */
    public static String formatPNU(String pnu) {
        String jibun = "";
        String bon = "";
        String bu = "";
        jibun = pnu.substring(11);
        bon = jibun.substring(0, 4);
        bu = jibun.substring(4);
        return bon + "-" + bu;
    }

    /**
     * 주어진 년월일시분초 형태의 문자열을 2007-11-10 23:05:03 형식으로 변환한다.
     *
     * @param ymdhms
     * @return
     */
    public static String formatDate(String ymdhms) {
        // 2007-11-10 23:05:03
        StringBuilder sb = new StringBuilder();
        sb.append(ymdhms.substring(0, 4)).append("-");
        sb.append(ymdhms.substring(4, 6)).append("-");
        sb.append(ymdhms.substring(6, 8)).append(" ");
        sb.append(ymdhms.substring(8, 10)).append(":");
        sb.append(ymdhms.substring(10, 12)).append(":");
        sb.append(ymdhms.substring(12, 14));
        return sb.toString();
    }

    /**
     * 주어진 년월일시분초 형태의 문자열을 2007년 11월 10일 23:05:03 형식으로 변환한다.
     *
     * @param ymdhms
     * @return
     */
    public static String formatTxtDate(String ymdhms) {
        // 2007-11-10 23:05:03
        StringBuilder sb = new StringBuilder();
        sb.append(ymdhms.substring(0, 4)).append("년 ");
        sb.append(ymdhms.substring(4, 6)).append("월 ");
        sb.append(ymdhms.substring(6, 8)).append("일 ");
        sb.append(ymdhms.substring(8, 10)).append(":");
        sb.append(ymdhms.substring(10, 12)).append(":");
        sb.append(ymdhms.substring(12, 14));
        return sb.toString();
    }

    /**
     * 주어진 년월일시분초 형태의 문자열을 2007년 11월 10일형식으로 변환한다.
     *
     * @param ymdhms
     * @return
     */
    public static String formatTxtYMD(String ymdhms) {
        // 2007-11-10 23:05:03
        StringBuilder sb = new StringBuilder();
        if (ymdhms.length() != 8) {
            sb.append(ymdhms);
        } else {
            sb.append(ymdhms.substring(0, 4)).append("년 ");
            sb.append(ymdhms.substring(4, 6)).append("월 ");
            sb.append(ymdhms.substring(6, 8)).append("일 ");
        }
        return sb.toString();
    }

    /**
     * 주어진 년월일시분초 형태의 문자열을 23시05분03초 형식으로 변환한다.
     *
     * @param ymdhms
     * @return
     */
    public static String formatTxtHMS(String ymdhms) {
        // 2007-11-10 23:05:03
        StringBuilder sb = new StringBuilder();
        sb.append(ymdhms.substring(8, 10)).append("시 ");
        sb.append(ymdhms.substring(10, 12)).append("분 ");
        sb.append(ymdhms.substring(12, 14)).append("초");
        return sb.toString();
    }

    /**
     * 주어진 지번을 1234 본번 형식으로 변환한다.
     *
     * @param ymdhms
     * @return
     */
    public static String formatTxtbon(String jibon) {
        // 2007-11-10 23:05:03
        StringBuilder sb = new StringBuilder();
        sb.append(jibon.substring(0, 4));
        return sb.toString();
    }

    /**
     * 주어진 지번을 1234 부번 형식으로 변환한다.
     *
     * @param ymdhms
     * @return
     */
    public static String formatTxtbu(String jibon) {
        // 2007-11-10 23:05:03
        StringBuilder sb = new StringBuilder();
        sb.append(jibon.substring(4, 8));
        return sb.toString();
    }

    /**
     * 주어진 년월일시분초 문자열을 long 형 timestamp로 바꾸어 변환한다.
     *
     * @param ymdhms
     * @return
     */
    public static long toTimeMillisSec(String ymdhms) {
        //년월일시분초
        GregorianCalendar cal = new GregorianCalendar(
            Integer.parseInt(ymdhms.substring(0, 4)),
            Integer.parseInt(ymdhms.substring(4, 6)) - 1,
            Integer.parseInt(ymdhms.substring(6, 8)),
            Integer.parseInt(ymdhms.substring(8, 10)),
            Integer.parseInt(ymdhms.substring(10, 12)),
            Integer.parseInt(ymdhms.substring(12, 14)));
        return cal.getTimeInMillis();
    }

    /**
     * 현재 년월일 문자열을 반환한다.
     *
     * @return
     */
    public static String getStrDay() {
        GregorianCalendar cal = new GregorianCalendar();
        StringBuilder sb = new StringBuilder();
        sb.append(Utils.numFormat(cal.get(Calendar.YEAR), "0000")).
            append(Utils.numFormat(cal.get(Calendar.MONTH) + 1, "00")).
            append(Utils.numFormat(cal.get(Calendar.DAY_OF_MONTH), "00"));
        return sb.toString();
    }

    /**
     * 주어진 long형 timestamp를 년월일 형태의 문자열로 반환한다.
     *
     * @param stamps
     * @return
     */
    public static String getStrDay(long stamps) {
        Calendar cal = new GregorianCalendar();
        cal.setTimeInMillis(stamps);
        StringBuilder sb = new StringBuilder();
        sb.append(Utils.numFormat(cal.get(Calendar.YEAR), "0000")).
            append(Utils.numFormat(cal.get(Calendar.MONTH) + 1, "00")).
            append(Utils.numFormat(cal.get(Calendar.DAY_OF_MONTH), "00"));
        return sb.toString();
    }

    /**
     * 현재 년월일시 문자열을 반환한다.
     *
     * @return
     */
    public static String getStrHour() {
        GregorianCalendar cal = new GregorianCalendar();
        StringBuilder sb = new StringBuilder();
        sb.append(Utils.numFormat(cal.get(Calendar.YEAR), "0000")).
            append(Utils.numFormat(cal.get(Calendar.MONTH) + 1, "00")).
            append(Utils.numFormat(cal.get(Calendar.DAY_OF_MONTH), "00")).
            append(Utils.numFormat(cal.get(Calendar.HOUR_OF_DAY), "00"));
        return sb.toString();
    }

    /**
     * 주어진 long형 timestamp를 년월일시 형태의 문자열로 반환한다.
     *
     * @param stamps
     * @return
     */
    public static String getStrHour(long stamps) {
        Calendar cal = new GregorianCalendar();
        cal.setTimeInMillis(stamps);
        StringBuilder sb = new StringBuilder();
        sb.append(Utils.numFormat(cal.get(Calendar.YEAR), "0000")).
            append(Utils.numFormat(cal.get(Calendar.MONTH) + 1, "00")).
            append(Utils.numFormat(cal.get(Calendar.DAY_OF_MONTH), "00")).
            append(Utils.numFormat(cal.get(Calendar.HOUR_OF_DAY), "00"));
        return sb.toString();
    }

    /**
     * 현재 년월일시분 문자열을 반환한다.
     *
     * @return
     */
    public static String getStrMin() {
        GregorianCalendar cal = new GregorianCalendar();
        StringBuilder sb = new StringBuilder();
        sb.append(Utils.numFormat(cal.get(Calendar.YEAR), "0000")).
            append(Utils.numFormat(cal.get(Calendar.MONTH) + 1, "00")).
            append(Utils.numFormat(cal.get(Calendar.DAY_OF_MONTH), "00")).
            append(Utils.numFormat(cal.get(Calendar.HOUR_OF_DAY), "00")).
            append(Utils.numFormat(cal.get(Calendar.MINUTE), "00"));
        return sb.toString();
    }

    /**
     * 주어진 long형 timestamp를 년월일시분 형태의 문자열로 반환한다.
     *
     * @param stamps
     * @return
     */
    public static String getStrMin(long stamps) {
        Calendar cal = new GregorianCalendar();
        cal.setTimeInMillis(stamps);
        StringBuilder sb = new StringBuilder();
        sb.append(Utils.numFormat(cal.get(Calendar.YEAR), "0000")).
            append(Utils.numFormat(cal.get(Calendar.MONTH) + 1, "00")).
            append(Utils.numFormat(cal.get(Calendar.DAY_OF_MONTH), "00")).
            append(Utils.numFormat(cal.get(Calendar.HOUR_OF_DAY), "00")).
            append(Utils.numFormat(cal.get(Calendar.MINUTE), "00"));
        return sb.toString();
    }

    /**
     * 현재 년월일시분초 문자열을 반환한다.
     *
     * @return
     */
    public static String getStrSec() {
        GregorianCalendar cal = new GregorianCalendar();
        StringBuilder sb = new StringBuilder();
        sb.append(Utils.numFormat(cal.get(Calendar.YEAR), "0000")).
            append(Utils.numFormat(cal.get(Calendar.MONTH) + 1, "00")).
            append(Utils.numFormat(cal.get(Calendar.DAY_OF_MONTH), "00")).
            append(Utils.numFormat(cal.get(Calendar.HOUR_OF_DAY), "00")).
            append(Utils.numFormat(cal.get(Calendar.MINUTE), "00")).
            append(Utils.numFormat(cal.get(Calendar.SECOND), "00"));
        return sb.toString();
    }

    /**
     * 주어진 long형 timestamp를 년월일시분초 형태의 문자열로 반환한다.
     *
     * @param stamps
     * @return
     */
    public static String getStrSec(long stamps) {
        Calendar cal = new GregorianCalendar();
        cal.setTimeInMillis(stamps);
        StringBuilder sb = new StringBuilder();
        sb.append(Utils.numFormat(cal.get(Calendar.YEAR), "0000")).
            append(Utils.numFormat(cal.get(Calendar.MONTH) + 1, "00")).
            append(Utils.numFormat(cal.get(Calendar.DAY_OF_MONTH), "00")).
            append(Utils.numFormat(cal.get(Calendar.HOUR_OF_DAY), "00")).
            append(Utils.numFormat(cal.get(Calendar.MINUTE), "00")).
            append(Utils.numFormat(cal.get(Calendar.SECOND), "00"));
        return sb.toString();
    }

    public static String numFormat(int v, String format) {
        NumberFormat formatter = new DecimalFormat(format);
        return formatter.format(v);
    }

    public static String numFormat(String v, String format) {
        if ("".equals(chkNull(v))) v = "0";
        NumberFormat formatter = new DecimalFormat(format);
        return formatter.format(Double.parseDouble(v));
    }

    public static String numFormat(double v, String format) {
        NumberFormat formatter = new DecimalFormat(format);
        return formatter.format(v);
    }

    public static void parseXML(InputStream is, DefaultHandler handler) throws Exception {
        SAXParserFactory factory = SAXParserFactory.newInstance();
        SAXParser saxParser = factory.newSAXParser();
        saxParser.parse(new InputSource(is), handler);
    }

    public static String asc2ksc(String s) {
        try {
            s = new String(s.getBytes("8859_1"), "KSC5601");
        } catch (java.io.UnsupportedEncodingException e) {} catch (NullPointerException e) {}
        return s;
    }

    public static String ksc2asc(String s) {
        try {
            s = new String(s.getBytes("KSC5601"), "8859_1");
        } catch (java.io.UnsupportedEncodingException e) {} catch (NullPointerException e) {}
        return s;
    }

    public static boolean isHangul(char c) {
        //( 0xAC00 <= c && c <= 0xD7A3 ) 초중종성이 모인 한글자
        //( 0x3131 <= c && c <= 0x318E ) 자음 모음
        if (!((0xAC00 <= c && c <= 0xD7A3) || (0x3131 <= c && c <= 0x318E))) {
            return false;
        }
        return true;
    }

    public static boolean isNumber(char ch) {
        if (0x30 <= ch && ch <= 0x39) {
            return true;
        }
        return false;
    }

    public static boolean isAlphabet(char ch) {
        if (0x41 <= ch && ch <= 0x5A) {
            return true;
        } // 대문자
        if (0x61 <= ch && ch <= 0x7A) {
            return true;
        } // 소문자
        return false;
    }

    public static String getStackTrace(Throwable e) {
        java.io.ByteArrayOutputStream bos = new java.io.ByteArrayOutputStream();
        java.io.PrintWriter writer = new java.io.PrintWriter(bos);
        e.printStackTrace(writer);
        writer.flush();
        return bos.toString();
    }

    /**
     * 두 점간 방위각을 구한다. 도, 분, 초 degree값
     *
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @return
     */
    public static String getDegree(double x1, double y1, double x2, double y2) {
        double tmp = ((y2 - y1) / (x2 - x1));
        double va = Math.atan(tmp);
        double rs = Math.toDegrees(va);
        if (x2 > x1 && y2 < y1) {
            rs = rs + 360.0;
        } else if (x2 > x1 && y2 > y1) {} else if (x2 < x1 && y2 > y1) {
            rs = rs + 180.0;
        } else if (x2 < x1 && y2 < y1) {
            rs = rs + 180.0;
        }
        return numFormat(rs, "####.########");
    }

    /**
     * 두 좌표점의 거리를 구한다.
     *
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @return
     */
    public static String getDistance(double x1, double y1, double x2, double y2) {
        double len = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        return numFormat(len, "########.###");
    }

    public static String replaceDbStr(String str)
    {
        String rplcStr = Utils.chkNull(str);
        if (!"".equals(chkNull(rplcStr))) {
            rplcStr = rplcStr.replaceAll("'", "\\\\'");
            rplcStr = "'" + rplcStr + "'";
        } else {
            rplcStr = "null";
        }

        return rplcStr;
    }

    /**
     * 문자로된 숫자의 표현식을 자리수에 맞는 숫자로표현(예: 23->0023)
     *
     * @param number
     * @param cnt
     * @return
     */
    public static String stringNumberToZeroStringNumber(String number, int cnt) {
        String str = number.trim();
        if (number == null) return "";

        cnt = cnt - str.length();
        for (int i = 0; i < cnt; i++)
        {
            str = "0" + str;
        }
        return str;
    }

    public static String getLocCodeToPnu(String dCode, String sanCode, String bon, String bu)
    {

        String pnu = dCode;
        //if("M00".equals(sanCode)){
        pnu += sanCode;
        //}else if("M01".equals(sanCode)){
        //pnu += "2";
        //}

        bon = bon.trim();
        bu = bu.trim();
        if (bon.length() != 4) {
            pnu += stringNumberToZeroStringNumber(bon, 4);
        } else {
            pnu += bon;
        }
        if (bu.length() != 4) {
            pnu += stringNumberToZeroStringNumber(bu, 4);
        } else {
            pnu += bu;
        }

        return pnu;
    }

    public static String getSanCodeToName(String c) {
        if ("1".equals(c)) {
            return "";
        } else if ("2".equals(c)) {
            return "산";
        } else {
            return "";
        }
    }

    //public class XmlPrinter{
    private static StringBuffer sb = new StringBuffer();

    public static String printCloseNode(Node node) {
        sb.append("</" + node.getNodeName() + ">");
        return "</" + node.getNodeName() + ">";
    }

    private static String printNodeNameWithAttr(Node node) {
        StringBuffer tempSb = new StringBuffer();
        //sb.append("<"+node.getNodeName());
        tempSb.append("<" + node.getNodeName());
        NamedNodeMap nnm = node.getAttributes();
        for (int i = 0; i < nnm.getLength(); i++) {
            Node attr = nnm.item(i);
            //sb.append(" "+attr.getNodeName()+"=\""+attr.getNodeValue()+"\"");
            tempSb.append(" " + attr.getNodeName() + "=\"" + attr.getNodeValue() + "\"");
        }
        //sb.append(">");
        tempSb.append(">");
        return tempSb.toString();
    }

    public static String colorRgb2Hex(String rgb) {
        if ("".equals(chkNull(rgb))) return "";
        int r = Integer.parseInt(rgb.split(",")[0]);
        int g = Integer.parseInt(rgb.split(",")[1]);
        int b = Integer.parseInt(rgb.split(",")[2]);

        String s_r = stringNumberToZeroStringNumber(Integer.toHexString(r & 0x00ff), 2);
        String s_g = stringNumberToZeroStringNumber(Integer.toHexString(g & 0x00ff), 2);
        String s_b = stringNumberToZeroStringNumber(Integer.toHexString(b & 0x00ff), 2);
        return s_r + s_g + s_b;

    }

    //geomex RGBT r,g,b,t -> google RGBT t,b,g,r
    public static String colorGmxRgbt2GoogleHex(String rgbt) {
        if ("".equals(chkNull(rgbt))) return "";
        int r = Integer.parseInt(rgbt.split(",")[0]);
        int g = Integer.parseInt(rgbt.split(",")[1]);
        int b = Integer.parseInt(rgbt.split(",")[2]);
        int t = Integer.parseInt(rgbt.split(",")[3]);
        //Color c = new Color(t,b,g,r);
        String s_t = stringNumberToZeroStringNumber(Integer.toHexString(t & 0x00ff), 2);
        String s_r = stringNumberToZeroStringNumber(Integer.toHexString(r & 0x00ff), 2);
        String s_g = stringNumberToZeroStringNumber(Integer.toHexString(g & 0x00ff), 2);
        String s_b = stringNumberToZeroStringNumber(Integer.toHexString(b & 0x00ff), 2);
        return s_t + s_b + s_g + s_r;

    }

    public static String ToXMLString(String name) {
        CharBuffer cb = CharBuffer.wrap(name);
        String xmlString = "";
        while (cb.hasRemaining()) {
            char tempChar = cb.get();
            if (tempChar == '"') {
                xmlString += "&quot;";
            } else if (tempChar == '&') {
                xmlString += "&amp;";
            } else if (tempChar == '\'') {
                xmlString += "&apos;";
            } else if (tempChar == '<') {
                xmlString += "&lt;";
            } else if (tempChar == '>') {
                xmlString += "&gt;";
            } else {
                xmlString += tempChar;
            }
        }
        return xmlString;
    }

    public static String getCommaCreate(double num) {
        String CR = "";
        DecimalFormat df = new DecimalFormat("###,###,###,###");
        CR = df.format(num);
        return CR;
    }

    public static String getCommaCreate(int num) {
        String CR = "";
        DecimalFormat df = new DecimalFormat("###,###,###,###");
        CR = df.format(num);
        return CR;
    }

    public static String getCommaCreate(String num) {
        String CR = "";
        //NumberFormat nf = NumberFormat.getNumberInstance();
        DecimalFormat df = new DecimalFormat("###,###,###,###");
        if (!"".equals(num)) {
            CR = df.format(Integer.parseInt(num));
        }
        return CR;
    }

}
