package gmx.gis.layer.service;

/**
 *
 * <pre>
 * 레이어의 기본 스타일 정보를 담당합니다.
 * 예) 점, 선, 면 색상, 굵기 등
 * </pre>
 *
 * @author 이주영
 *
 */
public class GMT_LayerStyleVo {

	private int mgrSeq;
	private int lyrMgrSeq;
	private String strokeColor;
	private String strokeWidth;
	private String strokeLineDash;
	private String fillColor;
	private String textTextAlign;
	private String textTextBaseline;
	private String textFont;
	private String textText;
	private String textFillColor;
	private String textStrokeColor;
	private String textStrokeWidth;
	private String textMinResolution;
	private String textMaxResolution;
	private int textOffsetX;
	private int textOffsetY;
	private int textRotation;
	private int circleRadius;
	private int iconMgrSeq;
	private String imgBase64;

	public int getMgrSeq() {
		return mgrSeq;
	}
	public int getLyrMgrSeq() {
		return lyrMgrSeq;
	}
	public String getStrokeColor() {
		return strokeColor;
	}
	public String getStrokeWidth() {
		return strokeWidth;
	}
	public String getStrokeLineDash() {
		return strokeLineDash;
	}
	public String getFillColor() {
		return fillColor;
	}
	public String getTextTextAlign() {
		return textTextAlign;
	}
	public String getTextTextBaseline() {
		return textTextBaseline;
	}
	public String getTextFont() {
		return textFont;
	}
	public String getTextText() {
		return textText;
	}
	public String getTextFillColor() {
		return textFillColor;
	}
	public String getTextStrokeColor() {
		return textStrokeColor;
	}
	public String getTextStrokeWidth() {
		return textStrokeWidth;
	}
	public String getTextMinResolution() {
		return textMinResolution;
	}
	public String getTextMaxResolution() {
		return textMaxResolution;
	}
	public int getTextOffsetX() {
		return textOffsetX;
	}
	public int getTextOffsetY() {
		return textOffsetY;
	}
	public int getTextRotation() {
		return textRotation;
	}
	public int getCircleRadius() {
		return circleRadius;
	}
	public int getIconMgrSeq() {
		return iconMgrSeq;
	}
	public String getImgBase64() {
		return imgBase64;
	}
	public void setMgrSeq(int mgrSeq) {
		this.mgrSeq = mgrSeq;
	}
	public void setLyrMgrSeq(int lyrMgrSeq) {
		this.lyrMgrSeq = lyrMgrSeq;
	}
	public void setStrokeColor(String strokeColor) {
		this.strokeColor = strokeColor;
	}
	public void setStrokeWidth(String strokeWidth) {
		this.strokeWidth = strokeWidth;
	}
	public void setStrokeLineDash(String strokeLineDash) {
		this.strokeLineDash = strokeLineDash;
	}
	public void setFillColor(String fillColor) {
		this.fillColor = fillColor;
	}
	public void setTextTextAlign(String textTextAlign) {
		this.textTextAlign = textTextAlign;
	}
	public void setTextTextBaseline(String textTextBaseline) {
		this.textTextBaseline = textTextBaseline;
	}
	public void setTextFont(String textFont) {
		this.textFont = textFont;
	}
	public void setTextText(String textText) {
		this.textText = textText;
	}
	public void setTextFillColor(String textFillColor) {
		this.textFillColor = textFillColor;
	}
	public void setTextStrokeColor(String textStrokeColor) {
		this.textStrokeColor = textStrokeColor;
	}
	public void setTextStrokeWidth(String textStrokeWidth) {
		this.textStrokeWidth = textStrokeWidth;
	}
	public void setTextMinResolution(String textMinResolution) {
		this.textMinResolution = textMinResolution;
	}
	public void setTextMaxResolution(String textMaxResolution) {
		this.textMaxResolution = textMaxResolution;
	}
	public void setTextOffsetX(int textOffsetX) {
		this.textOffsetX = textOffsetX;
	}
	public void setTextOffsetY(int textOffsetY) {
		this.textOffsetY = textOffsetY;
	}
	public void setTextRotation(int textRotation) {
		this.textRotation = textRotation;
	}
	public void setCircleRadius(int circleRadius) {
		this.circleRadius = circleRadius;
	}
	public void setIconMgrSeq(int iconMgrSeq) {
		this.iconMgrSeq = iconMgrSeq;
	}
	public void setImgBase64(String imgBase64) {
		this.imgBase64 = imgBase64;
	}
	@Override
	public String toString() {
		return "GMT_LayerStyleVo [mgrSeq=" + mgrSeq + ", lyrMgrSeq=" + lyrMgrSeq + ", strokeColor=" + strokeColor
				+ ", strokeWidth=" + strokeWidth + ", strokeLineDash=" + strokeLineDash + ", fillColor=" + fillColor
				+ ", textTextAlign=" + textTextAlign + ", textTextBaseline=" + textTextBaseline + ", textFont="
				+ textFont + ", textText=" + textText + ", textFillColor=" + textFillColor + ", textStrokeColor="
				+ textStrokeColor + ", textStrokeWidth=" + textStrokeWidth + ", textMinResolution=" + textMinResolution
				+ ", textMaxResolution=" + textMaxResolution + ", textOffsetX=" + textOffsetX + ", textOffsetY="
				+ textOffsetY + ", textRotation=" + textRotation + ", circleRadius=" + circleRadius + ", iconMgrSeq="
				+ iconMgrSeq + ", imgBase64=" + imgBase64 + "]";
	}

}
