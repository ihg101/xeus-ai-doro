package gmx.gis.layer.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 *
 * <pre>
 * 레이어의 아이콘 정보를 담당합니다.
 * </pre>
 *
 * @author 이주영
 *
 */
public class GMT_LayerIconVo {

	private int mgrSeq;
	private String imgBase64;
	private boolean useYn;
	private String mkUser;
	private String mkDat;
	@JsonIgnore
	private List<MultipartFile> files;

	public int getMgrSeq() {
		return mgrSeq;
	}
	public String getImgBase64() {
		return imgBase64;
	}
	public boolean isUseYn() {
		return useYn;
	}
	public String getMkUser() {
		return mkUser;
	}
	public String getMkDat() {
		return mkDat;
	}
	public List<MultipartFile> getFiles() {
		return files;
	}
	public void setMgrSeq(int mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public void setImgBase64(String imgBase64) {
		this.imgBase64 = imgBase64;
	}
	public void setUseYn(boolean useYn) {
		this.useYn = useYn;
	}
	public void setMkUser(String mkUser) {
		this.mkUser = mkUser;
	}
	public void setMkDat(String mkDat) {
		this.mkDat = mkDat;
	}
	public void setFiles(List<MultipartFile> files) {
		this.files = files;
	}
	@Override
	public String toString() {
		return "GMT_LayerIconVo [mgrSeq=" + mgrSeq + ", imgBase64=" + imgBase64 + ", useYn=" + useYn + ", mkUser=" + mkUser
				+ ", mkDat=" + mkDat + ", files=" + files + "]";
	}

}
