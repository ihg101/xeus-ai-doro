package geomex.xeus.bigdata.service;

import javax.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;
import org.springmodules.validation.bean.conf.loader.annotation.handler.NotEmpty;
import org.springmodules.validation.bean.conf.loader.annotation.handler.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class BigDataAnalyDataVo {

	@NotNull(message="레이어ID는 필수사항입니다.")
	@NotEmpty(message="레이어ID는 필수사항입니다.")
	@Size(min=0, max=50, message="레이어ID는 최대 100자 까지 입력하실 수 있습니다.")
	private String layerId;

	private String userId;

	@NotNull(message="레이어명은 필수사항입니다.")
	@NotEmpty(message="레이어명은 필수사항입니다.")
	@Size(min=0, max=50, message="레이어명은 최대 100자 까지 입력하실 수 있습니다.")
	private String layerNm;

	private String layerGbnCd;

	private String regDat;

	@NotNull(message="파일이름은 필수사항입니다.")
	@NotEmpty(message="파일이름은 필수사항입니다.")
	@Size(min=0, max=50, message="파일이름은 최대 200자 까지 입력하실 수 있습니다.")
	private String fileNm;

	@NotNull(message="파일경로는 필수사항입니다.")
	@NotEmpty(message="파일경로는 필수사항입니다.")
	@Size(min=0, max=50, message="파일경로는 최대 200자 까지 입력하실 수 있습니다.")
	private String filePath;

	private String attrJson;

	private String geomType;

	private String isDraw;

	@JsonIgnore
	private MultipartFile file;

	public String getLayerId() {
		return layerId;
	}
	public void setLayerId(String layerId) {
		this.layerId = layerId;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getLayerNm() {
		return layerNm;
	}
	public void setLayerNm(String layerNm) {
		this.layerNm = layerNm;
	}
	public String getLayerGbnCd() {
		return layerGbnCd;
	}
	public void setLayerGbnCd(String layerGbnCd) {
		this.layerGbnCd = layerGbnCd;
	}
	public String getRegDat() {
		return regDat;
	}
	public void setRegDat(String regDat) {
		this.regDat = regDat;
	}
	public String getFileNm() {
		return fileNm;
	}
	public void setFileNm(String fileNm) {
		this.fileNm = fileNm;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public String getAttrJson() {
		return attrJson;
	}
	public void setAttrJson(String attrJson) {
		this.attrJson = attrJson;
	}
	public String getGeomType() {
		return geomType;
	}
	public void setGeomType(String geomType) {
		this.geomType = geomType;
	}
	public MultipartFile getFile() {
		return file;
	}
	public void setFile(MultipartFile file) {
		this.file = file;
	}
	public String getIsDraw() {
		return isDraw;
	}
	public void setIsDraw(String isDraw) {
		this.isDraw = isDraw;
	}

}
