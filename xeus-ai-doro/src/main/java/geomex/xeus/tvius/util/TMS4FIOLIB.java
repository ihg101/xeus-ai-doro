package geomex.xeus.tvius.util;

import com.sun.jna.Library;
import com.sun.jna.Native;


public class TMS4FIOLIB {

   public interface CLibrary extends Library {

       /*CLibrary INSTANCE = (CLibrary) Native.loadLibrary(
           (path), CLibrary.class);*/
       		//("D:/DRM/00.XEUS-PLATFORM/CRMS_PKG_HOME/bin/TMS4FIOLIB.dll"), CLibrary.class);
           //"D:/TMS4FIOLIB.dll"
           //D:/CRMS_PKG_HOME/bin/TMS4FIOLIB.dll
       		//("c:/Users/lek/Desktop/dll/TMS4FIOLIB.dll"), CLibrary.class);window.print()

       int TMS4EInitInstance(String value);
       int TMS4EFileEncrypt(String lpszOrgFilePath, String lpszEncFolderPath, int nHint, String lpszHddSerial, String lpszMacAddress, String lpszUsbSerial, String lpszUserID, String lpszURL, String lpszWatermarkString, String lpszSellerCotentsID, int nDay, int nCount, int nServiceLevel);
       //int TMS4EFileDecrypt(String lpszEncFilePath, String lpszDecFolderPath, String lpszMacAddress, String lpszHddSerial, String lpszUsbSerial );
       int TMS4EFileDecrypt(String lpszEncFilePath, String lpszDecFolderPath, String lpszHddSerial, String lpszMacAddress, String lpszUsbSerial );


       int TMS4EFileEncryptEx( String lpszOrgFilePath,
    		   	String lpszEncFolderPath,
    			int nHint,
    			String lpszHddSerial,
    			String lpszMacAddress,
    			String lpszUsbSerial,
    			String lpszPassWord,
    			String lpszUserID,
    			String lpszURL,
    			String lpszWatermarkString,
    			String lpszSellerCotentsID,
    			int nDay,
    			int nCount,
    			int nServiceLevel );

       int TMS4EFileDecryptEx( String lpszEncFilePath,
    		   String lpszDecFolderPath,
    		   String lpszHddSerial,
    		   String lpszMacAddress,
    		   String lpszUsbSerial,
    		   String lpszPassWord );

   }
}
