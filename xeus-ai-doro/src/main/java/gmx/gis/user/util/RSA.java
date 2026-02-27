package gmx.gis.user.util;

import java.math.BigInteger;

/**
 * <PRE>
 * 파일명    : RSA.java
 * 파일설명 : 오픈소스파일
 *           RSA복호화 클래스
 *
 * 수정이력 :
 *       2013. 7. 03.  김경호  : 해당없음
 *
 * </PRE>
 *
 */
public class RSA {

    private RSAKey key;

    public RSA(int nbit) {
        key = RSAKey.generate(nbit);
    }

    public RSA() {
        this(1024);
    }

    public RSA(RSAKey key) {
        this.key = key;
    }

    public String decrypt(String encText) {
        BigInteger modulus = key.getModulus();
        BigInteger privateExponent = key.getPrivateExponent();

        BigInteger enc = new BigInteger(encText, 16);
        BigInteger dec = enc.modPow(privateExponent, modulus);

        String plainText = new String(dec.toByteArray());

        return plainText;
    }

    public static String asHex(byte buf[]) {
        StringBuffer strbuf = new StringBuffer(buf.length * 2);
        int i;

        for (i = 0; i < buf.length; i++) {
            if ((buf[i] & 0xff) < 0x10)
                strbuf.append("0");

            strbuf.append(Long.toString(buf[i] & 0xff, 16));
        }

        return strbuf.toString();
    }

}
