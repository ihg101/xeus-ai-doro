package geomex.xeus.tvius.util;

import com.sun.jna.Library;
import com.sun.jna.Native;


public class TMS4FIOXLIB {

    public interface CLibraryX extends Library {

        /*CLibraryX INSTANCE = (CLibraryX) Native.loadLibrary(
            ("D:/_WORK/01. 영상반출/06. 개발 관련/00. 암호화 서비스/테르텐/2GB 이상 암호화/TMS4FIOXLIB/64bit/TMS4FIOXLIB.dll"), CLibraryX.class);*/

        int TMS4EInitInstanceA(String value);

        int TMS4EFileEncryptA( String lpszOrgFilePath,
                String lpszEncFolderPath,
                int nHint,
                String lpszHddSerial,
                String lpszMacAddress,
                String lpszUsbSerial,
                String lpszPassWord,
                String lpszDeviceSerial,
                String lpszStreaming,
                String lpszUserID,
                String lpszSellerCotentsID,
                String lpszURL,
                String lpszWatermarkString,
                int nDay,
                int nCount,
                int nServiceLevel );

        int TMS4EFileDecryptA( String lpszEncFilePath,
                String lpszDecFolderPath,
                String lpszHddSerial,
                String lpszMacAddress,
                String lpwzUsbSerial,
                String lpwzPassWord,
                String lpwzDeviceSerial,
                String lpwzStreaming );

    }
}
