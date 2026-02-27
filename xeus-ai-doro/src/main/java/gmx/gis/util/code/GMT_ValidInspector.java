package gmx.gis.util.code;

import java.util.List;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

/**
 * <pre>
 * 객체 검증을 위한 클래스 입니다.
 * </pre>
 *
 * @author 이주영
 */
public class GMT_ValidInspector {

	/**
	 * <pre>
	 * BindingResult 통해 에러를 검출합니다.
	 * 검증 중 문제가 발견 될 경우,
	 *
	 * VO에 설정된 어노테이션의 <b>message 구문</b>을 리턴합니다.
	 * </pre>
	 *
	 * @param br - BindingResult
	 * @return msg - 에러문자열 또는 pass 문자열
	 */
	public static String findError(final BindingResult br) {
		String msg = null;

		if(br.hasErrors()){
		    List<FieldError> errors = br.getFieldErrors();
		    for(FieldError error : errors){
		    	msg = error.getDefaultMessage();
		    }
		}else{
			msg = "pass";
		}

		return msg;
	}

	/**
	 * <pre>
	 * BindingResult 통해 에러를 검출합니다.
	 * 검증 중 문제가 발견 될 경우,
	 *
	 * VO에 설정된 어노테이션의 <b>message 구문</b>을 리턴합니다.
	 *
	 * 추가 파라미터를 통하여 필드명이 같을 경우, 해당 검증은 제외합니다.
	 * </pre>
	 *
	 * @param br - BindingResult
	 * @param ignoreField - String Array
	 * @return msg - 에러문자열 또는 pass 문자열
	 */
	public static String findError(final BindingResult br, String ignoreField[]) {
		String msg = null;

		if(br.hasErrors()){
			List<FieldError> errors = br.getFieldErrors();
			for(FieldError error : errors){
				boolean isIgnore = false;
				for(String field : ignoreField){
					if(field.equals(error.getField())){
						isIgnore = true;
						break;
					}
				}
				if(isIgnore){
					msg = "pass";
				}else{
					msg = error.getDefaultMessage();
				}
			}
		}else{
			msg = "pass";
		}

		return msg;
	}

	/**
	 * <pre>
	 * 파일명을 검증합니다.
	 * 경로 조작의 위험성이 있는 문자열을 모두 제거합니다.
	 * </pre>
	 *
	 * @param fileName - 파일명
	 * @return fileName - 수정된 파일명
	 */
	public static String replacePathAttack(String fileName) {

		String[] blackString = {"..\\", "..", "\\", "/"};

		for(int i=0; i<blackString.length; i++){
			if(fileName.contains(blackString[i])){
				fileName = fileName.replaceAll(blackString[i], "");
			}
		}

		return fileName;
	}

	/**
	 * <pre>
	 * 파일명을 검증합니다.
	 * 경로 조작의 위험성이 있는 문자열을 포함한다면 true를 리턴합니다.
	 * </pre>
	 *
	 * @param fileName - 파일명
	 * @return boolean - true(공격대상) : false(공격성없음)
	 */
	public static boolean isPathAttack(String fileName) {

		boolean bool = false;

		String[] blackString = {"..\\", "..", "\\", "/"};

		for(int i=0; i<blackString.length; i++){
			if(fileName.contains(blackString[i])){
				bool = true;
			}
		}

		return bool;
	}

	/**
	 * <pre>
	 * 파라미터로 전달받은 파일명의 확장자를 검사합니다.
	 * </pre>
	 *
	 * @param extenssion - 확장자
	 * @param fileName - 파일명
	 * @return bool - 결과
	 */
	public static boolean extensionCheck(String extenssion, String fileName) {
		boolean bool = false;

		if(fileName.endsWith(extenssion)){
			bool = true;
		}else{
			bool = false;
		}

		return bool;
	}

	/**
	 * <pre>
	 * 빅데이터용 확장자인지 확인합니다.
	 * </pre>
	 *
	 * @param fileName - 파일명
	 * @return bool - 결과
	 */
	public static boolean isBigDataExtension(String fileName) {
		boolean bool = false;

		fileName = fileName.toLowerCase();
		if( fileName.endsWith(".xls")  ||
			fileName.endsWith(".xlsx"))
		{
			bool = true;
		}else{
			bool = false;
		}

		return bool;
	}

	/**
	 * <pre>
	 * 이미지 확장자인지 확인합니다.
	 * </pre>
	 *
	 * @param fileName - 파일명
	 * @return bool - 결과
	 */
	public static boolean isImageExtension(String fileName) {
		boolean bool = false;

		fileName = fileName.toLowerCase();
		if( fileName.endsWith(".gif")  ||
			fileName.endsWith(".jpg")  ||
			fileName.endsWith(".jpeg") ||
			fileName.endsWith(".png"))
		{
			bool = true;
		}else{
			bool = false;
		}

		return bool;
	}

	/**
     * <pre>
     * 동영상 확장자인지 확인합니다.
     * </pre>
     *
     * @param fileName - 파일명
     * @return bool - 결과
     */
    public static boolean isVideoExtension(String fileName) {
        boolean bool = false;

        fileName = fileName.toLowerCase();
        if( fileName.endsWith(".avi")  ||
            fileName.endsWith(".mkv")  ||
            fileName.endsWith(".mp4")  ||
            fileName.endsWith(".wmv"))
        {
            bool = true;
        }else{
            bool = false;
        }

        return bool;
    }

    /**
     * <pre>
     * 압축파일 확장자를 체크합니다.
     * </pre>
     *
     * @param fileName - 파일명
     * @return bool - 결과
     */
    public static boolean isCompExtension(String fileName) {
        String[] ALLOW_ARRAY = {
               ".alz", ".gz", ".rar", ".tar", ".tgz", ".z", ".zip", "7z"
        };
        boolean bool = false;

        fileName = fileName.toLowerCase();
        for(int i=0; i<ALLOW_ARRAY.length; i++){
            if(fileName.endsWith(ALLOW_ARRAY[i])){
                bool = true;
            }
        }

        return bool;
    }

	/**
	 * <pre>
	 * 알려진 확장자 (압축, 문서 등) 객체를 체크합니다.
	 * </pre>
	 *
	 * @param fileName - 파일명
	 * @return bool - 결과
	 */
	public static boolean isDataExtension(String fileName) {
		String[] ALLOW_ARRAY = {
               ".gif", ".jpg", ".jpeg", ".png",
               ".txt", ".hwp", ".docx", ".doc", ".pdf",
               ".ppt", ".pptx", ".xls", ".xlsx",
               ".alz", ".gz", ".rar", ".tar", ".tgz", ".z", ".zip"
		};
		boolean bool = false;

		fileName = fileName.toLowerCase();
		for(int i=0; i<ALLOW_ARRAY.length; i++){
			if(fileName.endsWith(ALLOW_ARRAY[i])){
				bool = true;
			}
		}

		return bool;
	}

	/**
     * <pre>
     * 화면캡처 이미지 업로드용 확장자 객체를 체크합니다.
     * </pre>
     *
     * @param fileName - 파일명
     * @return bool - 결과
     */
    public static boolean isImgRqstExtension(String fileName) {
        String[] ALLOW_ARRAY = {
               ".gif", ".jpg", ".jpeg", ".png",
               ".alz", ".gz", ".rar", ".tar", ".tgz", ".z", ".zip"
        };
        boolean bool = false;

        fileName = fileName.toLowerCase();
        for(int i=0; i<ALLOW_ARRAY.length; i++){
            if(fileName.endsWith(ALLOW_ARRAY[i])){
                bool = true;
            }
        }

        return bool;
    }

	/**
	 * <pre>
	 * 확장자를 추출합니다.
	 * comma(boolean) 파라미터가 true 일 경우, 콤마를 포함한 확장자를 추출합니다.
	 * <pre>
	 *
	 * @param fileName
	 * @return extention
	 */
	public static String getExtension(String fileName, boolean comma) {
		String extention = "";

		if(fileName != null && !"".equals(fileName)){
			if(comma){
				extention = fileName.substring(fileName.lastIndexOf("."));
			}else{
				extention = fileName.substring(fileName.lastIndexOf(".") + 1);
			}
		}

		return extention;

	}
}
