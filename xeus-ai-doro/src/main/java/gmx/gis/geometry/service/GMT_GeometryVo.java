package gmx.gis.geometry.service;

public class GMT_GeometryVo {

	String fTableCatalog;
	String fTableSchema;
	String fTableName;
	String fGeometryColumn;
	int coordDimension;
	int srid;
	String type;
	String lyrNm;
	boolean isView;

	public String getfTableCatalog() {
		return fTableCatalog;
	}
	public String getfTableSchema() {
		return fTableSchema;
	}
	public String getfTableName() {
		return fTableName;
	}
	public String getfGeometryColumn() {
		return fGeometryColumn;
	}
	public int getCoordDimension() {
		return coordDimension;
	}
	public int getSrid() {
		return srid;
	}
	public String getType() {
		return type;
	}
	public String getLyrNm() {
		return lyrNm;
	}
	public boolean getIsView() {
		return isView;
	}
	public void setfTableCatalog(String fTableCatalog) {
		this.fTableCatalog = fTableCatalog;
	}
	public void setfTableSchema(String fTableSchema) {
		this.fTableSchema = fTableSchema;
	}
	public void setfTableName(String fTableName) {
		this.fTableName = fTableName;
	}
	public void setfGeometryColumn(String fGeometryColumn) {
		this.fGeometryColumn = fGeometryColumn;
	}
	public void setCoordDimension(int coordDimension) {
		this.coordDimension = coordDimension;
	}
	public void setSrid(int srid) {
		this.srid = srid;
	}
	public void setType(String type) {
		this.type = type;
	}
	public void setLyrNm(String lyrNm) {
		this.lyrNm = lyrNm;
	}
	public void setIsView(boolean isView) {
		this.isView = isView;
	}

}
