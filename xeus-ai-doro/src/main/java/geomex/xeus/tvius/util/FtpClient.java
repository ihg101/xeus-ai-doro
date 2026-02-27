package geomex.xeus.tvius.util;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.SocketException;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPReply;

public class FtpClient {

    private String svrIp;
    private int port;
    private String user;
    private String passwd;
    private String defaultPath;

    public FtpClient(String svrIp, String user, String passwd, String defaultPath) {
        this.svrIp = svrIp;
        this.user = user;
        this.passwd = passwd;
        this.defaultPath = defaultPath;
    }

    public FtpClient(String svrIp, int port, String user, String passwd, String defaultPath) {
    	this.svrIp = svrIp;
    	this.port = port;
    	this.user = user;
    	this.passwd = passwd;
    	this.defaultPath = defaultPath;
    }

    /**
     * 파일 업로드
     * @param org 원본파일
     * @param targetFile 저장할 파일위치/파일명
     * @param workPath 작업할 위치
     * @throws IOException
     * @throws SocketException
     */
    public boolean upload(File org, String targetFile, String workPath, String basicPath)
            throws SocketException, IOException, Exception {

        FileInputStream fis = null;

        org.apache.commons.net.ftp.FTPClient clnt = new org.apache.commons.net.ftp.FTPClient();
        clnt.setControlEncoding("euc-kr");

        try {
            clnt.connect(svrIp);
            //clnt.setBufferSize(1024*1024);
            int reply = clnt.getReplyCode();
            if (!FTPReply.isPositiveCompletion(reply)) {
                throw new Exception("ftp connection refused");
            }

            clnt.setSoTimeout(1000 * 3600);
            clnt.login(user, passwd);
            clnt.setFileType(FTP.BINARY_FILE_TYPE);
            //clnt.setFileType(FTP.ASCII_FILE_TYPE);

            //clnt.enterLocalActiveMode();
            clnt.enterLocalPassiveMode();

            //폴더를 만들땐 최상위 폴더로 이동한 후 생성한다.
            //clnt.changeWorkingDirectory("");

            //서구청에 맞게 최상위 폴더 위치로 이동한다.
            clnt.changeWorkingDirectory(basicPath);

            if ( !"".equals(workPath) ) {
                clnt.makeDirectory(basicPath+workPath);
                clnt.changeWorkingDirectory(basicPath+workPath);
            }

            fis = new FileInputStream(org);
            return clnt.storeFile(targetFile, fis);
        }catch(Exception e){
            e.printStackTrace();
            //LogManager.getManager().getLogger("package-logger").error(e.toString());
            return false;
        } finally {
            if (clnt.isConnected()) {
                clnt.disconnect();
            }
            if (fis != null) {
                fis.close();
            }
        }
    }


    /**
     * 파일 다운로드
     * @param target FTP에 저장된 파일명
     * @param storePath 저장될 위치
     * @param storeNm 저장될 파일명
     * @param workPath FTP 하위폴더명
     * @param basicPath FTP 최상위 폴더
     * @throws IOException
     * @throws SocketException
     */
    public boolean download(String target, String storePath, String storeNm, String basicPath, String workPath)
            throws SocketException, IOException, Exception {

        FileOutputStream fos = null;

        org.apache.commons.net.ftp.FTPClient clnt = new org.apache.commons.net.ftp.FTPClient();
        clnt.setControlEncoding("euc-kr");

        try {
            clnt.connect(svrIp);
            //clnt.setBufferSize(1024*1024);
            int reply = clnt.getReplyCode();
            if (!FTPReply.isPositiveCompletion(reply)) {
                throw new Exception("ftp connection refused");
            }

            clnt.setSoTimeout(1000 * 3600);
            clnt.login(user, passwd);
            clnt.setFileType(FTP.BINARY_FILE_TYPE);

            clnt.enterLocalPassiveMode();

            //clnt.changeWorkingDirectory("/seogu/CRMS_STORAGE"+"하위폴더명");
            clnt.changeWorkingDirectory(basicPath+workPath);

            File f = new File(storePath, storeNm);

            fos = new FileOutputStream(f);
            return clnt.retrieveFile(target, fos);
        } finally {

            if (clnt.isConnected()) {
                clnt.disconnect();
            }
            if (fos != null) {
                fos.close();
            }
        }

    }


    /**
     * 파일 다운로드
     * @param target FTP에 저장된 파일명
     * @param storePath 저장될 위치
     * @param storeNm 저장될 파일명
     * @param workPath FTP 하위폴더명
     * @param basicPath FTP 최상위 폴더
     * @throws IOException
     * @throws SocketException
     */
    public boolean download(String fileName, String localDir, String localFName) throws SocketException, IOException, Exception {

    	FileOutputStream fos = null;

    	org.apache.commons.net.ftp.FTPClient clnt = new org.apache.commons.net.ftp.FTPClient();
    	clnt.setControlEncoding("euc-kr");

    	try {
    		clnt.setDefaultPort(port);
    		clnt.connect(svrIp);
    		int reply = clnt.getReplyCode();
    		if (!FTPReply.isPositiveCompletion(reply)) {
    			throw new Exception("ftp connection refused");
    		}

    		clnt.setSoTimeout(1000 * 3600);
    		clnt.login(user, passwd);
    		clnt.setFileType(FTP.BINARY_FILE_TYPE);

    		clnt.enterLocalPassiveMode();

    		File f = new File(localDir, localFName);

    		fos = new FileOutputStream(f);
    		return clnt.retrieveFile(fileName, fos);
    	} finally {

    		if (clnt.isConnected()) {
    			clnt.disconnect();
    		}
    		if (fos != null) {
    			fos.close();
    		}
    	}

    }


    /**
     * 폴더 생성
     * @param pathname 만들 폴더명
     * @throws IOException
     * @throws SocketException
     */
    public void makeDir(String pathname)
            throws SocketException, IOException, Exception {

        org.apache.commons.net.ftp.FTPClient clnt = new org.apache.commons.net.ftp.FTPClient();
        clnt.setControlEncoding("euc-kr");

        try {
            clnt.connect(svrIp);
            //clnt.setBufferSize(1024*1024);
            int reply = clnt.getReplyCode();
            if (!FTPReply.isPositiveCompletion(reply)) {
                throw new Exception("ftp connection refused");
            }

            clnt.setSoTimeout(1000 * 100);
            clnt.login(user, passwd);
            clnt.setFileType(FTP.BINARY_FILE_TYPE);


            //clnt.enterLocalActiveMode();
            clnt.enterLocalPassiveMode();

            //폴더를 만들땐 최상위 폴더로 이동한 후 생성한다.
            clnt.changeWorkingDirectory("");
            //폴더를 생성한다. 있으면 아무동작 안함.
            clnt.makeDirectory(pathname);

        } finally {
            if (clnt.isConnected()) {
                clnt.disconnect();
            }
        }
    }

    /**
     * FTP 서버 파일 삭제
     * @param basicPath FTP 최상위 폴더
     * @param path 저장된 하위폴더명
     * @param pathNm 저장된 파일 이름
     * @throws IOException
     * @throws SocketException
     */
    public boolean deleteFile(String basicPath, String path, String fileNm)
            throws SocketException, IOException, Exception {

        org.apache.commons.net.ftp.FTPClient clnt = new org.apache.commons.net.ftp.FTPClient();
        clnt.setControlEncoding("euc-kr");

        try {
            clnt.connect(svrIp);
            //clnt.setBufferSize(1024*1024);
            int reply = clnt.getReplyCode();
            if (!FTPReply.isPositiveCompletion(reply)) {
                throw new Exception("ftp connection refused");
            }

            clnt.setSoTimeout(1000 * 1000);
            clnt.login(user, passwd);
            clnt.setFileType(FTP.BINARY_FILE_TYPE);

            //clnt.enterLocalActiveMode();
            clnt.enterLocalPassiveMode();

            clnt.changeWorkingDirectory(basicPath + path);
            return clnt.deleteFile(fileNm);

        } finally {
            if (clnt.isConnected()) {
                clnt.disconnect();
            }
        }
    }

    /*public static void main(String[] args){
    	// http://127.0.0.1:8080/xeus/monitor/getFtpCarImg.do?ftpIp=101.102.121.218&ftpPort=21&ftpUser=lpr&ftpPwd=1234qwer&ftpPath=D/SC01/VMS/out/20181128/14/SC01-20181128-144147-000-01-0-11더1411.jpg&filenm=11더1411.jpg

    	String ftpIp = "101.102.121.218";
    	String ftpPort = "21";
    	String ftpUser = "lpr";
    	String ftpPwd = "1234qwer";
    	String ftpPath = "D/SC01/VMS/out/20181128/14/SC01-20181128-144147-000-01-0-11더1411.jpg";
    	String fileNm = "11더1411.jpg";

    	FtpClient ftp = new FtpClient(ftpIp, Integer.parseInt(ftpPort), ftpUser, ftpPwd, "");
    	try {
			ftp.download(ftpPath, "D:/DRM/00.XEUS-PLATFORM/DOWNLOAD_FILES/car", fileNm);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }*/

}
