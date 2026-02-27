package geomex.xeus.user.util;

/**
 * <PRE>
 * 파일명    : TEA.java
 * 파일설명 : 오픈소스파일
 *           평문이 5자리 이상이어여 정상적인 암호화 복호화를 수행함
 *
 * 수정이력 :
 *       2013. 7. 03.  김경호  : strToLongs and longsToStr 코드 교체
 *
 * </PRE>
 *
 */
public class TEA {

    private final int delta = 0x9E3779B9;

    private int[] S = new int[4];

    /**
     * Initialize the cipher for encryption or decryption.
     *
     * @param key a 16 byte (128-bit) key
     */
    public TEA(byte[] key) {
        if (key == null)
            throw new RuntimeException("Invalid key: Key was null");
        if (key.length < 16)
            throw new RuntimeException(
                "Invalid key: Length was less than 16 bytes");
        for (int off = 0, i = 0; i < 4; i++) {
            S[i] = ((key[off++] & 0xff)) | ((key[off++] & 0xff) << 8)
                | ((key[off++] & 0xff) << 16) | ((key[off++] & 0xff) << 24);
        }

    }

    public TEA(String key) {
        this(key.getBytes());
    }

    /*
     * encrypt text using Corrected Block TEA (xxtea) algorithm
     * @param {string} plaintext String to be encrypted (multi-byte safe)
     * @param {string} password Password to be used for encryption (1st 16
     * chars)
     * @returns {string} encrypted text
     */
    public byte[] encrypt(byte[] clear) {

        int[] v = strToLongs(clear);
        int n = v.length;

        // ---- <TEA coding> ----
        int z = v[n - 1];
        int y = v[0];

        int mx, e;
        int q = 6 + 52 / n;
        int sum = 0;

        while (q-- > 0) { // 6 + 52/n operations gives between 6 & 32 mixes on
                          // each word
            sum += delta;
            e = sum >>> 2 & 3;
            for (int p = 0; p < n; p++) {
                y = v[(p + 1) % n];
                mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y)
                    + (S[p & 3 ^ e] ^ z);
                z = v[p] += mx;
            }
        }
        // ---- </TEA> ----
        return longsToStr(v);
    }

    /*
     * decrypt text using Corrected Block TEA (xxtea) algorithm
     * @param {byte[]} ciphertext byte arrays to be decrypted
     * @returns {byte[]} decrypted array
     */
    public byte[] decrypt(byte[] crypt) {
        int[] v = strToLongs(crypt);
        int n = v.length;

        // ---- <TEA decoding> ----
        int z = v[n - 1];
        int y = v[0];

        int mx, e;
        int q = 6 + 52 / n;
        int sum = q * delta;

        while (sum != 0) {
            e = sum >>> 2 & 3;
            for (int p = n - 1; p >= 0; p--) {
                z = v[p > 0 ? p - 1 : n - 1];
                mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y)
                    + (S[p & 3 ^ e] ^ z);
                y = v[p] -= mx;
            }
            sum -= delta;
        }

        // ---- </TEA> ----

        byte[] plainBytes = longsToStr(v);

        // strip trailing null chars resulting from filling 4-char blocks:
        int len;
        for (len = 0; len < plainBytes.length; len++) {
            if (plainBytes[len] == 0)
                break;
        }

        byte[] plainTrim = new byte[len];
        System.arraycopy(plainBytes, 0, plainTrim, 0, len);

        return plainTrim;
    }

    /*
     * decrypt text using Corrected Block TEA (xxtea) algorithm
     * @param {string} ciphertext String to be decrypted
     * @returns {string} decrypted text
     */
    public String decrypt(String ciphertext) {
        String plainText = null;
        byte[] plainTextBytes = decrypt(Base64.decode(ciphertext));
        try {
            plainText = new String(plainTextBytes, "UTF-8");
        } catch (Exception e) {}

        return plainText;
    }

    // 2013.07.04 김경호 수정
    // IndexOutOfBoundsException 오류로 코드 변경 XXTEA코드 참조
    private int[] strToLongs(byte[] data) {
        int n = (((data.length & 3) == 0) ? (data.length >>> 2)
            : ((data.length >>> 2) + 1));

        int[] result = new int[n];

        // if (false) {
        // result = new int[n + 1];
        // result[n] = data.length;
        // } else {
        // result = new int[n];
        // }
        n = data.length;
        for (int i = 0; i < n; i++) {
            result[i >>> 2] |= (0x000000ff & data[i]) << ((i & 3) << 3);
        }
        return result;
    }

    // 2013.07.04 김경호 수정
    // IndexOutOfBoundsException 오류로 코드 변경 XXTEA코드 참조
    private byte[] longsToStr(int[] data) {
        // convert array of longs back to string
        int n = data.length << 2;

        // if (false) {
        // int m = data[data.length - 1];
        //
        // if (m > n) {
        // return null;
        // } else {
        // n = m;
        // }
        // }
        byte[] result = new byte[n];

        for (int i = 0; i < n; i++) {
            result[i] = (byte) ((data[i >>> 2] >>> ((i & 3) << 3)) & 0xff);
        }
        return result;
    }

}
