package geomex.xeus.user.util;

import java.math.BigInteger;
import java.security.SecureRandom;

/**
 * <PRE>
 * 파일명    : RSAKey.java
 * 파일설명 : 오픈소스파일
 *           RSAKey생성 클래스
 *              
 * 수정이력 : 
 *       2013. 7. 03.  김경호  : 내용없음
 * 
 * </PRE>
 * 
 */
public class RSAKey {
    private BigInteger privateExponent;
    private BigInteger publicExponent;
    private BigInteger modulus;

    public RSAKey(BigInteger d, BigInteger e, BigInteger m) {
        this.privateExponent = d;
        this.publicExponent = e;
        this.modulus = m;
    }

    public BigInteger getPrivateExponent() {
        return this.privateExponent;
    }

    public BigInteger getPublicExponent() {
        return this.publicExponent;
    }

    public BigInteger getModulus() {
        return this.modulus;
    }

    public static RSAKey generate(int nbit) {
        // generate an N-bit (roughly) public and private key

        SecureRandom random = new SecureRandom();
        BigInteger one = new BigInteger("1");

        BigInteger p = BigInteger.probablePrime(nbit / 2, random);
        BigInteger q = BigInteger.probablePrime(nbit / 2, random);
        BigInteger phi = (p.subtract(one)).multiply(q.subtract(one));

        BigInteger m = p.multiply(q);
        BigInteger e = new BigInteger("65537"); // common value in practice =
                                                // 2^16 + 1
        BigInteger d = e.modInverse(phi);

        return new RSAKey(d, e, m);
    }

    public static String toHex(BigInteger value) {
        byte b[] = value.toByteArray();

        StringBuffer strbuf = new StringBuffer(b.length * 2);
        int i;

        for (i = 0; i < b.length; i++) {
            if ((b[i] & 0xff) < 0x10)
                strbuf.append("0");

            strbuf.append(Long.toString(b[i] & 0xff, 16));
        }

        return strbuf.toString();
    }
}
