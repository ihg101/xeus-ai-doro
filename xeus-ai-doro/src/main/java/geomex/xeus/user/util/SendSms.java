package geomex.xeus.user.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;

import net.minidev.json.JSONObject;

public class SendSms {
	public static String sendSms(HashMap<String, String> map) {

		String sendRslt = "F0";
		BufferedReader in = null;
		StringBuilder sb = new StringBuilder();
		try {

			// TODO 환경변수로 받아올 수 있도록 변경해야 함.
			URL obj = new URL(map.get("url"));

			JSONObject cred = new JSONObject();
			for (String key : map.keySet()) {
				if (!"url".equals(key)) {
					cred.put(key, String.valueOf(map.get(key)));
				}
			}

			HttpURLConnection conn = (HttpURLConnection) obj.openConnection();
			conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
			conn.setRequestMethod("POST");
			conn.setConnectTimeout(3000);
			conn.setDoOutput(true);
			conn.setDoInput(true);

			if (cred.size() > 0) {
				OutputStream os = conn.getOutputStream();
				os.write(cred.toString().getBytes("UTF-8"));
				os.close();
			}
			in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

			sb.setLength(0);
			String line;
			while ((line = in.readLine()) != null) {
				sb.append(line);
			}
			if (sb.toString().contains("true")) {
				sendRslt = "S0";
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (in != null)
				try {
					in.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
		}

		return sendRslt;
	}
}
