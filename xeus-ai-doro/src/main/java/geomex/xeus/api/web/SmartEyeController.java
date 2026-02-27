package geomex.xeus.api.web;

import java.util.HashMap;

public class SmartEyeController {

	public byte binaryStringToByte(String s) {
		byte ret = 0, total = 0;
		for (int i = 0; i < 8; ++i) {
			ret = (s.charAt(7 - i) == '1') ? (byte) (1 << i) : 0;
			total = (byte) (ret | total);
		}
		return total;
	}

	public String byteToBinaryString(byte n) {
		StringBuilder sb = new StringBuilder("00000000");
		for (int bit = 0; bit < 8; bit++) {
			if (((n >> bit) & 1) > 0) {
				sb.setCharAt(7 - bit, '1');
			}
		}
		return sb.toString();
	}

	public static HashMap<String, String> readWindPayload(String binary){
		HashMap<String, String> payload = new HashMap<String, String>();

		//1301643E0402C403CF
		String betySet = binary.substring(0, 6);
		String windSet = binary.substring(6);

		String betyVal = betySet.substring(4);
		String windAvgVal = windSet.substring(4, 8);
		String windMaxVal = windSet.substring(8);

		int bety = Integer.parseInt(betyVal, 16);
		int windAvg = Integer.parseInt(windAvgVal, 16) / 100;
		int windMax = Integer.parseInt(windMaxVal, 16) / 100;

		payload.put("bety", "" + bety);
		payload.put("windAvg", "" + windAvg);
		payload.put("windMax", "" + windMax);

		return payload;
	}

}
