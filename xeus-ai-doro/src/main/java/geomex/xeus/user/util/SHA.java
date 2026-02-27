/**
 *
 */
package geomex.xeus.user.util;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * <PRE>
 * 파일명   : SHA.java
 * 파일설명 : SHA-256, SHA-512로 패스워드용 Hash값을 구한다.
 * 수정이력 :
 *       2013. 8. 27.  이규하  : 최초작성
 *       2015. 11. 25. 이주영 : 메소드 추가
 * </PRE>
 *
 * @author 이규하
 *
 */
public class SHA {

    /**
     * SHA-256으로 Hash
     *
     * @param s Hash할 문자열
     * @param salt salt 문자열
     * @return Base64로 인코딩된 Hash값
     * @throws NoSuchAlgorithmException
     * @throws UnsupportedEncodingException
     */
    public static String enc256(String s, String salt) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        return Base64.encodeString(getHash(digest, s, salt, 1000));
    }

    public static String enc256(String s) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        return enc256(s, "");
    }

    /**
     * SHA-512으로 Hash
     *
     * @param s Hash할 문자열
     * @param salt salt 문자열
     * @return Base64로 인코딩된 Hash값
     * @throws NoSuchAlgorithmException
     * @throws UnsupportedEncodingException
     */
    public static String enc512(String s, String salt) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        MessageDigest digest = MessageDigest.getInstance("SHA-512");
        return Base64.encodeString(getHash(digest, s, salt, 1000));
    }

    public static String enc512(String s) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        return enc512(s, "");
    }

    /**
     * @param digest MessageDigest
     * @param s Hash할 문자열
     * @param salt
     *
     * @param iter 반복횟수
     * @return
     * @throws NoSuchAlgorithmException
     * @throws UnsupportedEncodingException
     */
    private static byte[] getHash(MessageDigest digest, String s, String salt, int iter) throws NoSuchAlgorithmException,
        UnsupportedEncodingException {
        digest.reset();
        digest.update(salt.getBytes("UTF-8"));
        byte[] input = digest.digest(s.getBytes("UTF-8"));
        for (int i = 0; i < iter; i++) {
            digest.reset();
            input = digest.digest(input);
        }
        return input;
    }

    /**
     * SHA-512으로 Hash
     *
     * @param s Hash할 문자열
     * @return Base64로 인코딩된 Hash값
     * @throws NoSuchAlgorithmException
     * @throws UnsupportedEncodingException
     */
    public static String simpleEnc512(String s) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        MessageDigest digest = MessageDigest.getInstance("SHA-512");
        return Base64.encodeString(getSimpleHash(digest, s));
    }

    /**
     * @param digest MessageDigest
     * @param s Hash할 문자열
     *
     * @return
     * @throws NoSuchAlgorithmException
     * @throws UnsupportedEncodingException
     */
    private static byte[] getSimpleHash(MessageDigest digest, String s) throws NoSuchAlgorithmException, UnsupportedEncodingException {
		digest.reset();
    	return digest.digest(s.getBytes("UTF-8"));
    }

}
