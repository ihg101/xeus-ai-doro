package gmx.gis.sysmgr.service;

import java.util.HashMap;
import java.util.List;

public class GMT_ListHashMapVo {

	private int pk;
	private HashMap<String, String> st;
	private List<HashMap<String, Object>> kv;
	private List<HashMap<String, Object>> typ;

	private HashMap<String, Object> spatialSt;
	private List<HashMap<String, Object>> spatialKv;
	private List<HashMap<String, Object>> spatialTyp;

	private HashMap<String, Object> featureKv;

	public int getPk() {
		return pk;
	}

	public HashMap<String, String> getSt() {
		return st;
	}

	public List<HashMap<String, Object>> getKv() {
		return kv;
	}

	public List<HashMap<String, Object>> getTyp() {
		return typ;
	}

	public HashMap<String, Object> getSpatialSt() {
		return spatialSt;
	}

	public List<HashMap<String, Object>> getSpatialKv() {
		return spatialKv;
	}

	public List<HashMap<String, Object>> getSpatialTyp() {
		return spatialTyp;
	}

	public HashMap<String, Object> getFeatureKv() {
		return featureKv;
	}

	public void setPk(int pk) {
		this.pk = pk;
	}

	public void setSt(HashMap<String, String> st) {
		this.st = st;
	}

	public void setKv(List<HashMap<String, Object>> kv) {
		this.kv = kv;
	}

	public void setTyp(List<HashMap<String, Object>> typ) {
		this.typ = typ;
	}

	public void setSpatialSt(HashMap<String, Object> spatialSt) {
		this.spatialSt = spatialSt;
	}

	public void setSpatialKv(List<HashMap<String, Object>> spatialKv) {
		this.spatialKv = spatialKv;
	}

	public void setSpatialTyp(List<HashMap<String, Object>> spatialTyp) {
		this.spatialTyp = spatialTyp;
	}

	public void setFeatureKv(HashMap<String, Object> featureKv) {
		this.featureKv = featureKv;
	}

	@Override
	public String toString() {
		return "GMT_ListHashMapVo [pk=" + pk + ", st=" + st + ", kv=" + kv + ", typ=" + typ + ", spatialSt=" + spatialSt
				+ ", spatialKv=" + spatialKv + ", spatialTyp=" + spatialTyp + ", featureKv=" + featureKv + "]";
	}

}
