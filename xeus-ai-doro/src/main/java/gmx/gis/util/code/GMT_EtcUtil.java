package gmx.gis.util.code;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Enumeration;
import java.util.HashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
*
* <pre>
* <b>History:</b>
* 장대건, 2020. 09. 22 최초 작성
* 파일이동, 파일 사이즈, sms 전송 등 기타 Util 함수 집합입니다.
* </pre>
*
* @author 장대건
*
*/
public class GMT_EtcUtil {


	private static String apiKey = "2a491b7e474a4f7032c06cbbc8420043";
	private static String addrSrchUrl = "http://dapi.kakao.com/v2/local/search/address.json?query=";
	private static String addrSrchUrlOfProxy = "http://dapi.kakao.com/v2/local/search/address.json&query=";


    /************************************************************
     * File 관련 유틸 함수
     ************************************************************/
    /**
     * 파일 이름을 전달받아서,
     * 해당 파일이 없으면 생성해주고, 있으면 해당 파일 객체를 반환한다.
     * @param String : 파일명
     * @return File : 파일 객체
     * @author 장대건
     */
    public static File getFile(String fileNm){
		File file = new File(fileNm);
		if(!file.exists()){
			try {
				file.createNewFile();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
        return file;
    }

    /**
     * 파일의 크기(GB)를 구한다.
     * @author 장대건
     * @return file_size
     */
    public static double getFileSize(File file){
    	double sizeKb = 1024.0;
    	double sizeMb = sizeKb * sizeKb;
    	double sizeGb = sizeMb * sizeKb;
    	double file_size = file.length() / sizeGb;

    	return file_size;
    }

    /**
     * 폴더 내 모든 파일들을 삭제한다.
     * @author 장대건
     */
    public static void emptyFolder(File file){
    	if(file.isDirectory()) {
    		for(File subFiles : file.listFiles()) {
    			emptyFolder(subFiles);
    		}
    		file.delete();
    	} else {
    		file.delete();
    	}
    }

    /**
     * NIO를 이용하여 파일을 옮기는 메소드다.
     * @author 장대건
     * @param inFileName
     * @param outFileName
     * @return
     */
    public static boolean nioFileMove(String inFileName, String outFileName) {
        Path source = Paths.get(inFileName);
        Path target = Paths.get(outFileName);

        if (source == null) {
            System.out.println(">> ERROR : source must be specified");
            throw new IllegalArgumentException("source must be specified");
        }
        if (target == null) {
            System.out.println(">> ERROR : target must be specified");
            throw new IllegalArgumentException("target must be specified");
        }

        if (!Files.exists(source, new LinkOption[] {})) {
            System.out.println(">> Source file doesn't exist: " + source.toString());
            throw new IllegalArgumentException("Source file doesn't exist: " + source.toString());
        }

        try {
            Files.move(source, target, StandardCopyOption.REPLACE_EXISTING); // 파일이동
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println(">> Error occured in Files.move()...");
            return false;
        }

        if (Files.exists(target, new LinkOption[] {})) {
            return true;
        } else {
            System.out.println(">> Moved file not exist...");
            return false;
        }
    }

    /************************************************************
     * XML 파싱 관련 유틸 함수
     ************************************************************/
    /**
     * XML을 파싱하여 DOM tree를 생성한다.
     *
     * @param is InputStream
     * @return DocumentElement
     * @throws Exception
     */
    public static Element parseDOM(InputStream is) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(is).getDocumentElement();
    }

    /**
     * Element의 하위 Element중 name을 갖는 Element을 얻는다.
     *
     * @param root 시작 Element
     * @param name Element 이름
     * @return Element
     */
    public static Element getElementByName(Element root, String name) {
        return (Element) root.getElementsByTagName(name).item(0);
    }

    /**
     * Attribute 값을 얻는다.
     *
     * @param map NamedNodeMap
     * @param attrName Attribute 명
     * @return Attribute 값
     */
    public static String getAttrValue(NamedNodeMap map, String attrName) {
        Node node = map.getNamedItem(attrName);
        return (node == null) ? null : node.getNodeValue();
    }

    /**
     * Element의 값을 얻는다. <br>
     * 만약 Element가 하위 Element를 가지면 공백을 리턴한다.
     *
     * @param node Element 명
     * @return Element value
     */
    public static String getTagValue(Element node) {
        String value = "";
        NodeList children = node.getChildNodes();
        if (children == null)
            return null;

        for (int i = 0; i < children.getLength(); i++) {
            int type = children.item(i).getNodeType();
            if (type == Node.TEXT_NODE || type == Node.CDATA_SECTION_NODE) {
                value = children.item(i).getNodeValue().trim();
            }
        }

        return value;
    }

    /************************************************************
     * DB 유틸 함수
     ************************************************************/
    /**
     * DBConnection을 얻는다.
     *
     * @param prop
     * @return Connection
     */
    public static Connection getDbConn(String driver, String url, String usr, String pwd) {
        Connection con = null;
        try {
            loadDriver(driver);
            con = DriverManager.getConnection(url, usr, pwd);
        } catch (Exception e) {
            System.err.println("Get DB Connection Failed...");
            e.printStackTrace();
        }
        return con;
    }

    /**
     * JDBC Driver를 등록한다.
     *
     * @param d
     * @throws Exception
     */
    public static void loadDriver(String d) throws Exception {
        if (d == null)
            return;
        boolean exist = false;
        for (Enumeration<Driver> e = DriverManager.getDrivers(); e.hasMoreElements();) {
            Driver dname = e.nextElement();
            String chk = GMT_StrUtil.left(dname.toString(), "Driver") + "Driver";
            if (d.equalsIgnoreCase(chk)) {
                exist = true;
                break;
            }
        }

        if (!exist) {
            Driver driver = (Driver) Class.forName(d).newInstance();
            DriverManager.registerDriver(driver);
        }

    }

    /**
     * SQL객체를 close한다.
     *
     * @param rs
     * @param stmt
     * @param conn
     */
    public static void close(ResultSet rs, Statement stmt, Connection conn) {
        try {
            if (rs != null) {
                rs.close();
            }
        } catch (Exception e) {}
        try {
            if (stmt != null) {
                stmt.close();
            }
        } catch (Exception e) {}
        try {
            if (conn != null) {
                conn.close();
            }
        } catch (Exception e) {}
    }

    /************************************************************
     * 기타 유틸 함수
     ************************************************************/
    /**
     * 플랫폼에 SMS 전송을 요청한다.
     *
     * @author 장대건
     * @param urlStr
     * @param param
     * @throws Exception
     */
    public static void rqstSmsToPlatform(String urlStr, String userId, String title, String msg) throws Exception {

        BufferedReader in = null;
        StringBuilder sb = new StringBuilder();

        try {
            String url = "";
            url += urlStr;
            url += "?userId=" + URLEncoder.encode(userId, "UTF-8");
            url += "&title=" + URLEncoder.encode(title, "UTF-8");
            url += "&msg=" + URLEncoder.encode(msg, "UTF-8");

            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection)obj.openConnection();
            con.setConnectTimeout(1000);
            con.setRequestMethod("GET");
            in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));

            sb.setLength(0);
            String line;
            while((line = in.readLine()) != null) {
                sb.append(line);
            }
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
        }
    }

    /**
	 *   테이블 이름을 반환
	 *   테이블 이름 : 스키마_계정_현재시간(밀리초)
	 * @param map("scheme": value, "userId" : value)
	 * @return
	 */
	public static String getTableName(HashMap<String,String> map) {
    	String result = "";
    	String schema = map.get("schema");
    	String userId = map.get("userId");
    	String nowTime = getCurrentTime("YYYYMMddHHmmssSSS");

    	result = schema+"_"+userId+"_"+nowTime;

    	return result;

    }
    private static String getCurrentTime(String timeFormat){
        return new SimpleDateFormat(timeFormat).format(System.currentTimeMillis());
    }

    /**
     * 주소를 받아서 KAKAO API 호출해서 해당 주소의 경위도 좌표를 반환한다
     *
     * @param addr(주소)
     * @return 경위도 좌표(ex 127,37)
     */
    public static String getAddrFromKaKao(String addr, String dmzUrl) {
		String lat_lan = "";
		try {
			URL url;
			//proxy가 없을 때
			if("".equals(dmzUrl)){
				url = new URL(dmzUrl + addrSrchUrl + URLEncoder.encode(addr, "UTF-8"));
			}else{
				url = new URL(dmzUrl + addrSrchUrlOfProxy + URLEncoder.encode(addr, "UTF-8"));
			}

			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setConnectTimeout(5000); // 서버에 연결되는 Timeout 시간 설정
			con.setReadTimeout(5000); // InputStream 읽어 오는 Timeout 시간 설정
			con.setRequestMethod("GET");
			con.setRequestProperty("Authorization", "KakaoAK " + apiKey);
			con.setUseCaches(false);
			con.setDoInput(true);
			con.setDoOutput(true);

			int responseCode = con.getResponseCode();

			BufferedReader br;
			if (responseCode == 200) { // 정상 호출
				br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"));
			} else { // 에러 발생
				br = new BufferedReader(new InputStreamReader(con.getErrorStream(), "utf-8"));
			}
			String inputLine;
			StringBuffer res = new StringBuffer();
			while ((inputLine = br.readLine()) != null) {
				res.append(inputLine);
			}
			br.close();

			JSONParser jsonParse = new JSONParser();
			JSONObject jsonObj = (JSONObject) jsonParse.parse(res.toString());
			JSONArray docArray = (JSONArray) jsonObj.get("documents");
			JSONObject addrObj = (JSONObject) docArray.get(0);
			JSONObject address = (JSONObject) addrObj.get("address");
			lat_lan = address.get("x") + "," + address.get("y");

		} catch (Exception e) {
			e.printStackTrace();
		}
		return lat_lan;

	}

}
