package gmx.gis.layer.service;

import java.util.List;

public class GMT_StyleVo {

	private GMT_LayerVo layer;
	private GMT_LayerGroupVo group;
	private GMT_LayerStyleVo style;
	private List<GMT_LayerThemeVo> theme;

	public GMT_LayerVo getLayer() {
		return layer;
	}

	public GMT_LayerGroupVo getGroup() {
		return group;
	}

	public GMT_LayerStyleVo getStyle() {
		return style;
	}

	public List<GMT_LayerThemeVo> getTheme() {
		return theme;
	}

	public void setLayer(GMT_LayerVo layer) {
		this.layer = layer;
	}

	public void setGroup(GMT_LayerGroupVo group) {
		this.group = group;
	}

	public void setStyle(GMT_LayerStyleVo style) {
		this.style = style;
	}

	public void setTheme(List<GMT_LayerThemeVo> theme) {
		this.theme = theme;
	}

}
