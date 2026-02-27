package geomex.xeus.tvius.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import geomex.xeus.tvius.service.WorkChk;

public class FFmpegUtil{
    private String fileName, basePath, ffmpegPath;

    public FFmpegUtil(String fileName, String basePath, String ffmpegPath) {
        this.fileName = fileName;
        this.basePath = basePath;
        this.ffmpegPath = ffmpegPath;
    }

    //FFMpeg를 이용하여 파일을 변환한다.
    public String convertVideoToFlv(String extension) {

        File fOriginal = new File(basePath + System.getProperty("file.separator")
                                              + fileName);
        String outputName = fileName.substring(0, fileName.indexOf("."))+ "."+extension;//+".flv"
        File fResult = new File(basePath + System.getProperty("file.separator")
                                             + outputName);
        //콘솔에 실행할 명령어를 입력
        //양식 => c:\>ffmpeg -i "ok.flv" -an -ss 00:00:01 -r 1 -vframes 1 -y "%d.jpg"
        String[] cmdLine = new String[]{ffmpegPath,
                                        "-i",
                                        fOriginal.getPath(),
                                        "-ar",
                                        "11025",
                                        "-f",
                                        extension,//"fiv"
                                        fResult.getPath()};

        //변환하려는 확장자가 동일 확장자면 리턴
        if(fOriginal.getPath().endsWith("."+extension)) {
         return outputName;
        }
        //프로세스 속성을 관리하는 ProcessBuilder 생성.
        ProcessBuilder pb = new ProcessBuilder(cmdLine);
        pb.redirectErrorStream(true);
        Process p = null;

        try {
            // 프로세스 작업을 실행
            p = pb.start();
        } catch (Exception e) {
            e.printStackTrace();
            p.destroy();
            return null;
        }

        // 자식 프로세스에서 발생되는 인풋스트림 소비
        exhaustInputStream(p.getInputStream());
        try {
            // p의 자식 프로세스의 작업이 완료될 동안 p를 대기시킴
            p.waitFor();
        } catch (InterruptedException e) {
            p.destroy();
        }
         // 정상 종료가 되지 않았을 경우
        if (p.exitValue() != 0) {
         System.out.println("변환 중 에러 발생");
            return null;
        }
        // 변환을 하는 중 에러가 발생하여 파일의 크기가 0일 경우
        if (fResult.length() == 0) {
            System.out.println("변환된 파일의 사이즈가 0임");
            return null;
        }
        //fOriginal.delete(); // 원본 파일 삭제
        return outputName;
    }

    //영상 파일의 썸네일을 생성한다.
    public WorkChk getImage(String mediaFileNm, String resultFileNm) {
        //작업 결과를 저장할 인스턴스 생성
        WorkChk workChk = new WorkChk();

        File fResult = new File(basePath + resultFileNm);
        //콘솔에서 실행될 명령어 입력
        //양식 : ffmpeg -i D:\암복호화.avi -ss 00:00:00 -vframes 1 D:\out.jpg
        String[] cmdLine = new String[]{ffmpegPath,
                                       "-i",
                                       basePath + mediaFileNm,
                                       "-ss",
                                       "00:00:00",
                                       "-vframes",
                                       "1",
                                       basePath + resultFileNm};

        // 프로세스 속성을 관리하는 ProcessBuilder 생성.
        ProcessBuilder pb = new ProcessBuilder(cmdLine);
        pb.redirectErrorStream(true);
        Process p = null;

        try {
            // 프로세스 작업을 실행
            p = pb.start();
        } catch (Exception e) {
            p.destroy();
            workChk.setResult(false);
            workChk.setWorkMsg("Thumbnail extraction failed");
            return workChk;
        }
        // 자식 프로세스에서 발생되는 인풋스트림 소비
        exhaustInputStream(p.getInputStream());
        try {
            // p의 자식 프로세스의 작업이 완료될 동안 p를 대기시킴
            p.waitFor();
        } catch (InterruptedException e) {
            p.destroy();
            workChk.setResult(false);
            workChk.setWorkMsg("Child Thread Waiting Error");
            return workChk;
        }
         // 정상 종료가 되지 않았을 경우
        if (p.exitValue() != 0) {
            workChk.setResult(false);
            workChk.setWorkMsg("썸네일 추출 작업 실패");
            return workChk;
        }
        // 변환을 하는 중 에러가 발생하여 파일의 크기가 0일 경우
        if (fResult.length() == 0) {
            workChk.setResult(false);
            workChk.setWorkMsg("썸네일 파일 크기 오류");
            return workChk;
        }

        workChk.setResult(true);
        workChk.setWorkMsg(resultFileNm);
        return workChk;
    }

    private void exhaustInputStream(final InputStream is) {
        // InputStream.read() 에서 블럭상태에 빠지기 때문에 따로 쓰레드를 구현하여 스트림을
        // 소비한다.
        new Thread() {
            public void run() {
                try {
                    BufferedReader br = new BufferedReader(new InputStreamReader(is));
                    String cmd;
                    while((cmd = br.readLine()) != null) { // 읽어들일 라인이 없을때까지 계속 반복
//                        System.out.println(cmd);
                    }
                } catch(IOException e) {
                    e.printStackTrace();
                }
            }
        }.start();
    }
}
