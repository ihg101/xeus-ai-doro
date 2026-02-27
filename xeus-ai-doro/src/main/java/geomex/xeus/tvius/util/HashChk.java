package geomex.xeus.tvius.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.sun.jna.Native;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.web.multipart.MultipartFile;

import geomex.xeus.tvius.service.WorkChk;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.tvius.util.TMS4FIOXLIB.CLibraryX;

public class HashChk {

    //파일 삭제 목록을 저장할 변수
    private ArrayList<String> delList = null;

    //파일 목록을 가져온다.
    //path : 작업을 진행할 폴더
    //list : 삭제 대상 확장자
    private void subDirList(String path, List<String> list) {

        File dir = new File(path);
        File[] fileList = dir.listFiles();
        try {
            for (int i = 0; i < fileList.length; i++) {
                File file = fileList[i];
                if (file.isFile()) {
                    String [] splitFileNm = file.getName().split("\\.");
                    String extension = splitFileNm[splitFileNm.length-1];
                    if(list.contains(extension.toLowerCase())){
                        delList.add(file.getCanonicalPath());
                    }
                }
            }
        } catch (IOException e) {}
    }

    //파일 삭제 목록을 순차적으로 삭제한다.
    private void deleteFile() {
        for (int i = 0; i < delList.size(); i++) {
            try {
                File delFile = new File(delList.get(i));
                if (delFile.isFile()) {
                    delFile.delete();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    //위 함수들을 호출하는 함수
    //path : 작업을 진행할 폴더
    //str : 삭제 대상 확장자
    //      배열로 넘어와 subDirList호출시에는 list로 변환
    public void delFileInFolder(String path, String[] str){
        delList = new ArrayList<String>();
        List<String> list = Arrays.asList(str);
        subDirList(path, list);
        deleteFile();
    }

    //해시코드 조회할 파일을 서버의 지정된 경로로 이동한다.
    public WorkChk uploadHashChkFile(String hashPath, MultipartFile file) throws Exception {
        //작업결과를 저장할 인스턴스
        WorkChk workChk = new WorkChk();
        if(file.isEmpty()){
            workChk.setResult(false);
            workChk.setWorkMsg("파일이 선택되지 않았습니다.");
        }else{
            String [] splitFileNm = file.getOriginalFilename().split("\\.");
            String extension = "." + splitFileNm[splitFileNm.length-1];
            String uploadFileNm = DateUtil.getStrMilSec() + extension;
            //String realFileNm = DateUtil.getStrMilSec() + "-" + file.getOriginalFilename();
            //MS$확장자만 업로드한다.
            if(".ms4".equalsIgnoreCase(extension)){
                File pathDir = new File(hashPath);
                if(!pathDir.exists()) pathDir.mkdirs();
                File img = new File(hashPath + uploadFileNm);
                file.transferTo(img);

                workChk.setResult(true);
                //작업 성공 시 실제 업로드된 파일명을 리턴한다.
                workChk.setWorkMsg(uploadFileNm);
                workChk.setWorkMsg2(Long.toString(img.length()));
            }else{
                workChk.setResult(false);
                workChk.setWorkMsg("MS4 확장자의 파일만 업로드 할 수 있습니다.");
            }
        }
        return workChk;
    }

    public static WorkChk getHashCode(String path, String fileNm){
        //작업결과를 저장할 인스턴스
        WorkChk workChk = new WorkChk();
        String md5Cde = "";
        String shaCde="";
        File f = new File(path + fileNm);
        FileInputStream fis = null;
        try {
            //파일이 존재하는지.
            if ( f.isFile() ) {
                fis = new FileInputStream(f);
                md5Cde =  DigestUtils.md5Hex(fis);
                fis.close();
                fis = new FileInputStream(f);
                shaCde =  DigestUtils.sha256Hex(fis);
            }
            workChk.setResult(true);
            workChk.setWorkMsg(shaCde);
            workChk.setWorkMsg2(md5Cde);
        } catch ( IOException e ) {
            workChk.setResult(false);
            workChk.setWorkMsg("업로드 파일의 해시코드 조회 작업이 실패하였습니다.");
        } finally {
            try{
              fis.close();
            }catch(Exception e){}
        }
        return workChk;
    }

    //파일 이동 함수
    public static void renameFile(String before, String after){
        File beforeFile = new File(before);
        File afterFile = new File(after);
        beforeFile.renameTo(afterFile);
    }

    //DRM 영상 복호화 함수
    public static WorkChk decryptFile(String path, String fileNm, String systemId, String nHint, String macAddr, String usbSerial, String mediaExtension, String deviceSerial, String streaming, String libPath, String password){
        //작업결과를 저장할 인스턴스
        WorkChk workChk = new WorkChk();
        int i = -1;
        try {
            //2GB 제한 기능 로직
            /*CLibrary INSTANCE = (CLibrary) Native.loadLibrary(libPath, CLibrary.class);
            //TODO 현재 513 정책에 대해서만 지원, 추후에 타 정책에 대해서도 개발 예정
            if(nHint.equals("513")){
                i = INSTANCE.TMS4EFileDecrypt(
                //i = CLibrary.INSTANCE.TMS4EFileDecrypt(
                    path + fileNm,  //파일경로
                    path,           //작업 후 파일 저장 경로
                    "hddSerial",    //하드 시리얼, 아무거나 들어가도 된다.
                    macAddr,        //맥 어드레스
                    usbSerial);     //usb 시리얼
                //0 : 정상코드
                //그 외 코드 발생 시 작업 실패로 처리
                if(i == 0){
                    //MS4 확장자가 사라지기 때문에 영상 실제 확장자로 변경
                    //ex) test.MS4 -> test -> test.avi
                    File workFile = new File(path + fileNm.replace(".MS4", ""));
                    File decryptFile = new File(path + fileNm.replace(".MS4", "") + "." + mediaExtension);
                    workFile.renameTo(decryptFile);

                    workChk.setResult(true);
                    workChk.setWorkMsg(decryptFile.getName());
                } else{
                    workChk.setResult(false);
                    workChk.setWorkMsg(Integer.toString(i));
                }
            } else {
                //TODO 513정책 이외의 로직이 처리되지 않으면 일단은 false로 넘긴다.
                workChk.setResult(false);
                workChk.setWorkMsg("513정책만 가능합니다.");
            }*/

            //2GB 이상 지원 가능 로직
            CLibraryX INSTANCE = (CLibraryX) Native.loadLibrary(libPath, CLibraryX.class);
            //TODO 현재 513 정책에 대해서만 지원, 추후에 타 정책에 대해서도 개발 예정
            if("513".equals(nHint)){

                i = INSTANCE.TMS4EInitInstanceA(systemId);
                if(i != 0) {
                    workChk.setResult(false);
                    workChk.setWorkMsg("init instance error : " + Integer.toString(i));
                    return workChk;
                }

                i = INSTANCE.TMS4EFileDecryptA(
                    path + fileNm,  //파일경로
                    path,           //작업 후 파일 저장 경로
                    "hddSerial",    //하드 시리얼, 아무거나 들어가도 된다.
                    macAddr,        //맥 어드레스
                    usbSerial,      //usb 시리얼
                    password,       //패스워드
                    deviceSerial,   //deviceSerial
                    streaming     //streaming
            		);
                //0 : 정상코드
                //그 외 코드 발생 시 작업 실패로 처리
                if(i == 0){
                    //MS4 확장자가 사라지기 때문에 영상 실제 확장자로 변경
                    //ex) test.MS4 -> test -> test.avi
                    File workFile = new File(path + fileNm.replace(".MS4", ""));
                    File decryptFile = new File(path + fileNm.replace(".MS4", "") + "." + mediaExtension);
                    workFile.renameTo(decryptFile);

                    workChk.setResult(true);
                    workChk.setWorkMsg(decryptFile.getName());
                } else{
                    workChk.setResult(false);
                    workChk.setWorkMsg("decrypt error : " + Integer.toString(i));
                }
            } else {
                //TODO 513정책 이외의 로직이 처리되지 않으면 일단은 false로 넘긴다.
                workChk.setResult(false);
                workChk.setWorkMsg("513정책만 가능합니다.");
            }
        } catch ( Exception e ) {
            workChk.setResult(false);
            workChk.setWorkMsg("파일 복호화 도중 에러가 발생하였습니다.");
        }
        return workChk;
    }

}
