<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="geomex.xeus.util.sms.ServiceSMSSoapProxy"%>

<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ page import="java.util.TreeSet"%>
<%@ page import="java.security.MessageDigest" %>
<%@ page import="java.security.*" %>

<%@ page import="org.apache.axis.client.*" %>

<%@ include file="../common.jsp" %>

<% request.setCharacterEncoding("UTF-8"); %>

<%!
// HASH 구현을 위한 클래스 파일생성
		public class CEncrypt
		{
				MessageDigest md;
				String strSRCData = "";
				String strENCData = "";

				public CEncrypt(){}
				//인스턴스 만들 때 한방에 처리할 수 있도록 생성자 중복시켰습니다.
				public CEncrypt(String EncMthd, String strData)
				{
						this.encrypt(EncMthd, strData);
				}

				//암호화 절차를 수행하는 메소드입니다.
				public void encrypt(String EncMthd, String strData)
			 {
					 try
					{
							MessageDigest md = MessageDigest.getInstance(EncMthd); // "MD5" or "SHA1"
						 byte[] bytData = strData.getBytes();
						 md.update(bytData);

						 byte[] digest = md.digest();
						 for(int i =0;i<digest.length;i++)
						 {
								 strENCData = strENCData + String.format("%02x",digest[i] & 0xFF).toLowerCase();
						 }
					 }catch(NoSuchAlgorithmException e)
					{
						 System.out.print("암호화 알고리즘이 없습니다.");
					};

					//나중에 원본 데이터가 필요할지 몰라서 저장해 둡니다.
					strSRCData = strData;
				}

				//접근자 인라인 함수(아니, 메소드)들입니다.
				public String getEncryptData(){return strENCData;}
				public String getSourceData(){return strSRCData;}

				//데이터가 같은지 비교해주는 메소드입니다.
				public boolean equal(String strData)
				{
					//암호화 데이터랑 비교를 하던, 원본이랑 비교를 하던 맘대로....
					if(strData == strENCData) return true;
					return false;
				}
		}    //CEncrypt


		//전송결과 처리
	//1 : 발송성공
	//1~N : 콤마로 연결하여 다중 발송을 하였을 경우에는 성공한 정수 숫자로 리턴됩니다.
	//0 : SMS발송 가능량 부족
	//-1 : SMS 아이디 /패스워드 이상
	//-2 : SMS 아이디 공백
	//-3 : 다중 전송시 모두 실패(수신번호이상)
	//-4 : 해쉬공백
	//-5 : 해쉬이상
	//-8: 발신자 전화번호 공백
	//-9: 전송내용 공백
	//-10: 예약 날짜 이상
	//-11: 예약 시간 이상
	//-12: 예약 가능시간 지남
	//-13: 스팸 동의서가 접수되지 않음
	//-21: 데이타 베이스 이상
	//-25: 주간 총 발송량 초과
	//-26: 주간 URL 발송량 초과
	//-27: 수/발신자 번호 동일
    //-30: 발신번호 등록 X, 기존에 등록되어있던 번호 사용하면 됨. 필요하면 추가
	//-50: 잘못된 전화번호

%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/ui-1.12.1/themes/ui-darkness/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.iconMng.css">
<script type="text/javascript" src="<%= context %>/common/jquery-3.2.0.min.js"></script>
<script type="text/javascript" src="<%= context %>/common/ui-1.12.1/jquery-ui.min.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.gridster.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.spin.min.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.paging.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.timepicker.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.bpopup.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.form.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.download.js"></script>
<script type="text/javascript" src="<%= context %>/common/tooltipsy.min.js"></script>
<script type="text/javascript" src="<%= context %>/common/cipher/tea-block.js"></script>
<script type="text/javascript" src="<%= context %>/common/cipher/base64.js"></script>
<script type="text/javascript" src="<%= context %>/common/cipher/utf8.js"></script>
<script type="text/javascript" src="<%= context %>/common/cipher/jsbn.js"></script>
<script type="text/javascript" src="<%= context %>/common/cipher/rsa.js"></script>
<script type="text/javascript" src="<%= context %>/common/cipher/helper.js"></script>
<script type="text/javascript" src="<%= context %>/common/string.js"></script>
<script type="text/javascript" src="<%= context %>/common/HashMap.js"></script>
<script type="text/javascript" src="<%= context %>/common/string.js"></script>
<script type="text/javascript" src="<%= context %>/common/Date.js"></script>
<script type="text/javascript" src="<%= context %>/common/common.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.system.mng.icon.js"></script>
<script type="text/javascript">
var ctxPath = "<%= context %>";
</script>
<title>SMS TEST | XEUS-Platform</title>
</head>
<body>

<!-- #wrap #content #userList th {
xeus.userMng.css
-->
    <div id="wrap">

<%-- <jsp:useBean id="smsid" scope="session" class="geomex.xeus.util.sms.ServiceSMSSoapProxy" /> --%>
<%

    ServiceSMSSoapProxy smsid = new ServiceSMSSoapProxy();

    if (request.getParameter("endpoint") != null && request.getParameter("endpoint").length() > 0)
		smsid.setEndpoint(request.getParameter("endpoint"));


	String smsID = "nowcns";
	String hashValue = "now3217";
	String hash_temp = "";
	String senderPhone = "0332613217";
	String receivePhone ="01089630524";
	String smsContent = "문자발송테스트11";
	String resultReturn = "";
	String reserveDate ="";
	String reserveTime = "";
	String userDefine = "";
	String callbackUrl = "";
	String searchValue = "";
	String mode = "";
	CEncrypt encrypt;

	int methodID = 2;
	boolean gotMethod = false;

	try {
			gotMethod = true;
			hash_temp = (smsID + hashValue + receivePhone); //아이디, 패스워드,수신번호를 hash화시킴
			encrypt = new CEncrypt("MD5", hash_temp);
			String sendSMS = smsid.sendSMS(smsID, encrypt.getEncryptData(), senderPhone, receivePhone, smsContent);
			out.println("결과코드 : " + sendSMS);

    } catch (Exception e) {
%>
	Exception: <%= e %>
<%
	return;
}
%>

	</div>

</body>
</html>
