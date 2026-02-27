package geomex.xeus.smartcity;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;

/**
 * <pre>
 * ===========================================================
 * 파일명 :  SFTP.java
 * 작성자 :  홍길동
 * 작성일 :  2018. 4. 15.
 * 버전   :  1.0
 * 설명   :
 * 클래스 설명을 쓰시오
 *
 * 수정이력
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 *
 * ===========================================================
 * </pre>
 */
public class SFTP {

    protected Logger logger = LoggerFactory.getLogger(SFTP.class);

    private JSch jsch = null;
    private Session session = null;

    private Channel channel = null;
    private ChannelSftp sftpChannel = null;

    private String host = "";
    private int port = 2;
    private String user = "";
    private String pwd = "";

    //
    public SFTP(String host, int port, String user, String pwd) {
        this.host = host;
        this.port = port;
        this.user = user;
        this.pwd = pwd;
    }

    private void connect() throws JSchException {
        // 1. JSch 객체를 생성한다.
        jsch = new JSch();
        // 2. 세션 객체를 생성한다(사용자 이름, 접속할 호스트, 포트를 인자로 전달한다.)
        session = jsch.getSession(user, host, port);
        // 4. 세션과 관련된 정보를 설정한다.
        session.setConfig("StrictHostKeyChecking", "no");
        // 4. 패스워드를 설정한다.
        session.setPassword(pwd);
        // 5. 접속한다.
        session.connect();
        // 6. sftp 채널을 연다.
        channel = session.openChannel("sftp");
        // 7. 채널에 연결한다.
        channel.connect();
        // 8. 채널을 FTP용 채널 객체로 캐스팅한다.
        sftpChannel = (ChannelSftp) channel;
    }

    public void upload(String fName, String remoteDir, String remoteFName) throws Exception {
        FileInputStream fis = null;
        // 앞서 만든 접속 메서드를 사용해 접속한다.
        connect();
        try {
            // Change to output directory
            sftpChannel.cd(remoteDir);
            // Upload file
            File file = new File(fName);
            // 입력 파일을 가져온다.
            fis = new FileInputStream(file);
            // 파일을 업로드한다.
            sftpChannel.put(fis, remoteFName);

            String msg = "File uploaded successfully "
                + file.getAbsolutePath() + " to " + remoteDir + "/" + remoteFName;
            logger.debug(msg);

        } catch (Exception e) {
            logger.error(ExceptionUtils.getStackTrace(e));
        } finally {
            IOUtils.closeQuietly(fis);
            disconnect();
        }
    }

    public void download(String fileName, String localDir, String localFName) throws Exception {
        byte[] buffer = new byte[1024];
        BufferedOutputStream bos = null;
        BufferedInputStream bis = null;
        connect();
        try {
            // Change to output directory
            String cdDir = fileName.substring(0, fileName.lastIndexOf("/") + 1);
            sftpChannel.cd(cdDir);

            File file = new File(fileName);
            bis = new BufferedInputStream(sftpChannel.get(file.getName()));

            File newFile = new File(localDir + "/" + localFName);

            // Download file
            bos = new BufferedOutputStream(new FileOutputStream(newFile));
            int readCount;
            while ((readCount = bis.read(buffer)) > 0) {
                bos.write(buffer, 0, readCount);
            }

            String msg = "File downloaded successfully - " + file.getAbsolutePath() + " from " + fileName;
            logger.debug(msg);

        } catch (Exception e) {
            logger.error(ExceptionUtils.getStackTrace(e));
        } finally {
            IOUtils.closeQuietly(bis);
            IOUtils.closeQuietly(bos);
            disconnect();
        }
    }

    private void disconnect() {
        try {
            if (session.isConnected()) {
                logger.debug("sftp disconnecting...");
                sftpChannel.disconnect();
                channel.disconnect();
                session.disconnect();
            }
        } catch (Exception e) {}
    }

    //  public static void main(String args[]) throws Exception {
    //      //String host, int port, String user, String pwd
    //      SFTP sftp = new SFTP("10.1.73.58", 22, "tta", "tta");
    //      sftp.upload("d:/in-dcs-gis0329.zip", "/upload", "test.zip");
    //  }
}
