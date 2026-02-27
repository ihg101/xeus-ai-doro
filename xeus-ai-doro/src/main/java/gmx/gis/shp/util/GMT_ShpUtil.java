package gmx.gis.shp.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.Serializable;
import java.net.MalformedURLException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.log4j.Logger;
import org.geotools.data.DataStore;
import org.geotools.data.DataStoreFinder;
import org.geotools.data.DataUtilities;
import org.geotools.data.DefaultTransaction;
import org.geotools.data.FileDataStore;
import org.geotools.data.FileDataStoreFinder;
import org.geotools.data.Transaction;
import org.geotools.data.collection.ListFeatureCollection;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.shapefile.ShapefileDataStoreFactory;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.data.simple.SimpleFeatureStore;
import org.geotools.feature.AttributeTypeBuilder;
import org.geotools.feature.FeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.geotools.feature.NameImpl;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.geotools.feature.simple.SimpleFeatureTypeImpl;
import org.geotools.feature.type.GeometryDescriptorImpl;
import org.geotools.feature.type.GeometryTypeImpl;
import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.opengis.feature.Property;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.feature.type.AttributeDescriptor;
import org.opengis.feature.type.AttributeType;
import org.opengis.feature.type.GeometryDescriptor;
import org.opengis.feature.type.GeometryType;
import org.opengis.filter.identity.FeatureId;
import org.opengis.geometry.MismatchedDimensionException;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.NoSuchAuthorityCodeException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;

import com.vividsolutions.jts.geom.Geometry;

import gmx.gis.util.code.GMT_StrUtil;
import gmx.gis.util.code.GMT_EtcUtil;

/**
*
* <pre>
* <b>History:</b>
* 장대건, 2020. 09. 22 최초 작성
* geotools 관련 Util 함수입니다.
*
* <b>주의:</b>
* postgres에서 흔히 알고있는 스키마 개념과 geotools의 스키마 개념은 다르다.
* postgres에서의 스키마 : 하나의 공간, 내부 스키마(DB의 물리적 저장 형태의 구분)
* geotools에서의 스키마 : DB의 특정 테이블 또는 Shp 파일의 논리적인 형태, 또는 구조를 명시한 것
*
* <b>의존성:</b>
* gmx.gis.util.code.GMT_StrUtil : strTransCode
* gmx.gis.util.code.GMT_EtcUtil : getFile
* </pre>
*
* @author 장대건
*
*/
public class GMT_ShpUtil {

	/*
	 * shp 관련 로그..
	 */
	public static Logger logger = Logger.getLogger("shpLogger");

	/*
	 * DB DataStore를 위한 전역변수
	 * 초기 로드 시, 초기화 해줘야 함.
	 */
	public static String DB_TYPE = "postgis";
	public static String DB_HOST = "10.1.73.14";
	public static String DB_PORT = "5432";
	public static String DB_DATABASE = "gis-mng";
	public static String DB_SCHEMA = "shp";
	public static String DB_USER= "postgres";
	public static String DB_PASSWD= "geomex12#";

    /**
     * DB DataStore를 반환한다.<br>
     * 클래스 내에 선언된 DB 설정관련 전역변수 참조함.
     * 이 함수를 사용하기 전, 전역변수를 초기화 해야함.
     * @return DataStore
     * @author 장대건
     */
    public static DataStore getDbDataStore() {
    	DataStore dataStore = null;
    	Map<String, Object> params = new HashMap<>();
    	params.put("dbtype", DB_TYPE);
    	params.put("host", DB_HOST);
    	params.put("port", DB_PORT);
    	params.put("database", DB_DATABASE);
    	params.put("schema", DB_SCHEMA);
    	params.put("user", DB_USER);
    	params.put("passwd", DB_PASSWD);
    	params.put("charset", "euc-kr");

    	try {
			dataStore = DataStoreFinder.getDataStore(params);
		} catch (IOException e) {
			e.printStackTrace();
		}
    	return dataStore;
    }

    /**
     * DB 내 해당 스키마의 DataStore를 반환한다.
     *
     * @param dbSchema : 참조할 DB 스키마 이름
     * @return DataStore
     * @author 장대건
     */
    public static DataStore getDbDataStore(String dbSchema) {
    	DataStore dataStore = null;
    	Map<String, Object> params = new HashMap<>();
    	params.put("dbtype", DB_TYPE);
    	params.put("host", DB_HOST);
    	params.put("port", DB_PORT);
    	params.put("database", DB_DATABASE);
    	params.put("schema", dbSchema);
    	params.put("user", DB_USER);
    	params.put("passwd", DB_PASSWD);
    	params.put("charset", "euc-kr");

    	try {
			dataStore = DataStoreFinder.getDataStore(params);
		} catch (IOException e) {
			e.printStackTrace();
		}
    	return dataStore;
    }

    /**
     * shp 파일 set을 만든다. (.shp, .dbf, .shx, .prj)
     *
     * @param dir : 파일 경로 ex) D:/folder1/folder2
     * @param fileNm : 파일 이름
     * @return shp 파일의 Charset
     * @author 장대건
     */
    public static void makeShpFileSet(String dir, String fileNm) {
    	String path = dir + "/" + fileNm;
		GMT_EtcUtil.getFile(path + ".shp");
		GMT_EtcUtil.getFile(path + ".shx");
		GMT_EtcUtil.getFile(path + ".dbf");
//		GMT_EtcUtil.getFile(path + ".prj");
    }

    /**
     * shp 파일 set을 zip로 만들어 준다(.shp, .dbf, .shx)
     *
     * @param dir : shp 파일이 저장된 경로
     * @param shpFileNm : 저장된 shp 파일의 이름(확장자 제외)
     * @param zipFileNm : 압축된 압출파일의 이름
     * @return File : 압출 파일
     * @author 장대건
     */
    public static File makeShpZip(String dir, String shpFileNm, String zipFileNm) {
		String zipFile = dir + zipFileNm + ".zip";

		List<String> shpFileSet = new ArrayList<String>();
		shpFileSet.add(dir + "/" + shpFileNm + ".shp");
		shpFileSet.add(dir + "/" + shpFileNm + ".shx");
		shpFileSet.add(dir + "/" + shpFileNm + ".dbf");
		shpFileSet.add(dir + "/" + shpFileNm + ".prj");
		shpFileSet.add(dir + "/" + shpFileNm + ".fix");
		try {
			FileOutputStream fout = new FileOutputStream(zipFile);
			ZipOutputStream zout = new ZipOutputStream(fout);
			for (int i = 0; i < shpFileSet.size(); i++) {
				File tgtFile = new File(shpFileSet.get(i));

				if(!tgtFile.exists())
					continue;

				ZipEntry zipEntry = new ZipEntry(tgtFile.getName());
				zout.putNextEntry(zipEntry);

				FileInputStream fin = new FileInputStream(shpFileSet.get(i));
				byte[] buffer = new byte[1024];
				int length;

				// input file을 1024바이트로 읽음, zip stream에 읽은 바이트를 씀
				while ((length = fin.read(buffer)) > 0) {
					zout.write(buffer, 0, length);
				}
				zout.closeEntry();
				fin.close();
			}
			zout.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return new File(zipFile);
    }

    /**
     * shp 파일의 Charset을 반환한다.
     *
     * @param shpFile shp 파일
     * @return shp 파일의 Charset
     * @author 장대건
     */
    public static String getShpCharset(File shpFile) {
    	String charset = "";
    	ShapefileDataStore SHPdataStore;
		try {
			SHPdataStore = new ShapefileDataStore(shpFile.toURI().toURL());
			charset = SHPdataStore.getCharset().toString();
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
    	return charset;
    }

    /**
     *  DB 테이블 내 피쳐를 출력한다.
     *
     * @param dbSchema : 참조할 DB 스키마 이름
     * @param tbl : 테이블 이름
     * @author 장대건
     */
    public static void printFearture(String dbSchema, String tbl) throws IOException {
		DataStore dataStore = getDbDataStore(dbSchema);

		String[] typeNames = dataStore.getTypeNames();
		for (int i = 0; i < typeNames.length; i++) {
			if(!typeNames[i].equalsIgnoreCase(tbl)) continue;

			SimpleFeatureCollection fc = dataStore.getFeatureSource(typeNames[i]).getFeatures();
			printFearture(fc);
		}
    }

    /**
     *  shp 파일을 출력한다.
     *
     * @param shpFile : 출력할 shp 파일
     * @author 장대건
     */
	public static void printFearture(File shpFile) throws IOException {
		FileDataStore dataStore =  FileDataStoreFinder.getDataStore(shpFile);
		SimpleFeatureCollection fc = dataStore.getFeatureSource().getFeatures();
		printFearture(fc);
	}

   /**
     *  SimpleFeatureCollection의 피쳐들을 출력한다.
     *
     * @param featureCollection : 출력할 SimpleFeatureCollection
     * @author 장대건
     */
	public static void printFearture(SimpleFeatureCollection featureCollection) throws IOException {
		SimpleFeatureIterator iterator = featureCollection.features();
		while (iterator.hasNext()) {
			printFearture(iterator.next());
		}
	}

    /**
     *  피쳐에 담긴 속성과 value를 출력한다.
     *
     * @param SimpleFeature fearture : 출력할 피쳐
     * @author 장대건
     */
    public static void printFearture(SimpleFeature fearture) {
		Collection<Property> propCollection = fearture.getProperties();
		for(Property prop : propCollection) {
			System.out.println(prop.getName() + " : " + prop.getValue());
		}
    }

    /**
     *  피쳐 내에 문자 인코딩 설정을 바꾼다.
     *
     * @param fearture : 피쳐
     * @param srcEncoding : 원본 인코딩 설정
     * @param tgtEncoding : 바꿀 인코딩 설정
     * @author 장대건
     */
    public static void changeFeartureEncoding(SimpleFeature feature, String srcEncoding, String tgtEncoding) {
    	Collection<Property> propCollection = feature.getProperties();
		for(Property prop : propCollection) {
			Object value =  prop.getValue();
			if( value == null ) continue;
			if( !"String".equals(value.getClass().getSimpleName()) ) continue;

			String transVal = GMT_StrUtil.strTransCode( (String)value, srcEncoding, tgtEncoding);
			prop.setValue(transVal);
		}
    }

    /**
     *  SimpleFeatureCollection 내 모든 피쳐의 문자 인코딩 설정을 바꾼다.
     *
     * @param featureCollection : 트랜스 코딩할 SimpleFeatureCollection
     * @param srcEncoding : 원본 인코딩 설정
     * @param tgtEncoding : 바꿀 인코딩 설정
     * @author 장대건
     */
    public static void changeFeartureEncoding(SimpleFeatureCollection featureCollection, String srcEncoding, String tgtEncoding) {
    	SimpleFeatureIterator itr = featureCollection.features();
		while (itr.hasNext()) {
			SimpleFeature srcFeature = itr.next();
			changeFeartureEncoding(srcFeature, srcEncoding, tgtEncoding);
		}
    }


    /**
     * srcfeatureCollection의 피쳐를 복제하여, newSchema로 된 SimpleFeatureCollection울 생성한다. <br>
     *
     * @param srcfeatureCollection : 원본 SimpleFeatureCollection
     * @param newSchema : 복제할 피쳐의 SimpleFeatureType
     * @param srcCRS : 원본 데이터의 CRS -> null 입력 시, 좌표변환 안함.
     * @param tgtCRS : 좌표변환할 CRS -> null 입력 시, 좌표변환 안함.
     * @param orgCharset : 원본 데이터의 Charset -> 공백 입력 시, 좌표변환 안함.
     * @param tgtCharset : 인코딩할 Charset -> 공백 입력 시, 좌표변환 안함.
     * @return SimpleFeatureCollection
     * @author 장대건
     */
    public static SimpleFeatureCollection cloneFeatures(SimpleFeatureCollection srcfeatureCollection, SimpleFeatureType newSchema,
    		CoordinateReferenceSystem srcCRS, CoordinateReferenceSystem tgtCRS, String orgCharset, String tgtCharset) {
		// 파라메타 옵션 체크
		Boolean transCodingChk = !GMT_StrUtil.isEmpty(orgCharset) && !GMT_StrUtil.isEmpty(tgtCharset);
		Boolean transFormChk = (srcCRS!=null ? true : false) && (tgtCRS!=null ? true : false);

		String newGeometryColumn =  GMT_ShpUtil.getGeometryColumn(newSchema);
		try {
			MathTransform transform = transFormChk ? CRS.findMathTransform(srcCRS, tgtCRS, true) : null;
			List<SimpleFeature> newFeatures = new ArrayList<SimpleFeature>();
			SimpleFeatureIterator itr = srcfeatureCollection.features();
			int _gid = 1;
			while (itr.hasNext()) {
				SimpleFeature srcFeature = itr.next();
				SimpleFeature newFeature = DataUtilities.reType(newSchema, srcFeature);
				List<AttributeDescriptor> attributes = srcfeatureCollection.getSchema().getAttributeDescriptors();

				for (AttributeDescriptor attrib : attributes) {
					AttributeType type = attrib.getType();
					if (type instanceof GeometryType) { // 1. 칼럼이 지오메트리 속성인 경우
						try { // 1. 칼럼이 지오메트리 속성인 경우
							if( transFormChk ) {
								Geometry geometry = (Geometry) srcFeature.getAttribute(attrib.getLocalName());
								Geometry transGeometry = JTS.transform(geometry, transform);

								newFeature.setAttribute( newGeometryColumn, transGeometry );
								newFeature.setDefaultGeometry(transGeometry);
							} else {
								newFeature.setAttribute( newGeometryColumn, srcFeature.getAttribute(attrib.getLocalName()) );
							}
						} catch (MismatchedDimensionException | TransformException e) {
							GMT_ShpUtil.logger.error("Fail :: Cannot Tranform Geometry ... ");
							e.printStackTrace();
						}
					} else { // 2. 칼럼이 일반 속성인 경우
						if( transCodingChk ) {
							String attrClass = type.getBinding().getSimpleName();
							String newAttrNm = GMT_StrUtil.strTransCode( attrib.getLocalName(), orgCharset, tgtCharset);
							Object newAttrVal = srcFeature.getAttribute(attrib.getLocalName());
							if("String".equalsIgnoreCase(attrClass))
								newAttrVal = GMT_StrUtil.strTransCode( GMT_StrUtil.chkNull((String) newAttrVal), orgCharset, tgtCharset);

							newFeature.setAttribute( newAttrNm, newAttrVal);
						} else {
							newFeature.setAttribute( attrib.getLocalName(), srcFeature.getAttribute(attrib.getLocalName()) );
						}
					}
				}
				newFeature.setAttribute("_gid", _gid++);
				newFeatures.add(newFeature);
			}
			itr.close();

			return DataUtilities.collection(newFeatures);
		} catch (FactoryException e1) {
			e1.printStackTrace();
		}

		GMT_ShpUtil.logger.error("Error !! :: Occured Method => GMT_ShpUtil.cloneTransformedFeatures ");
		return null;
	}

    /**
     * 스키마를 복하여 새로운 스키마를 생성한다. <br>
     * 인자로 받은 srid로 CRS를 설정한다. <br>
     * ※ _gid 칼럼이 없으면 _gid 칼럼을 생성함. <br>
     * ※ geometry 칼럼명은 무조건 _geometry로 바꿈. <br>
     * ※ SimpleFeatureType 한번 생성된 후에는 수정할 수 없으므로, 초기 생성 시 좌표계 설정을 해줘야함.<br>
     * + ※ 인코딩 설정을 바꾼다
     *
     * @param srcSchema : 원본 SimpleFeatureType (schema)
     * @param tgtCRS : 좌표변환할 CRS -> null 입력 시, 좌표변환 안함.
     * @param orgCharset : 원본 데이터의 Charset -> 공백 입력 시, 좌표변환 안함.
     * @param tgtCharset : 인코딩할 Charset -> 공백 입력 시, 좌표변환 안함.
     * @return SimpleFeatureType
     * @author 장대건
     */
    public static SimpleFeatureType cloneSchema(SimpleFeatureType srcSchema, CoordinateReferenceSystem tgtCRS, String orgCharset, String tgtCharset) {
    	// 파라메타 옵션 체크
    	Boolean transCodingChk = !GMT_StrUtil.isEmpty(orgCharset) && !GMT_StrUtil.isEmpty(tgtCharset);
    	// 새로운 스키마 생성을 위한 빌더 생성
    	SimpleFeatureTypeBuilder builder = new SimpleFeatureTypeBuilder();
    	builder.setName(srcSchema.getName());
    	builder.setSuperType((SimpleFeatureType) srcSchema.getSuper());
    	if( !GMT_ShpUtil.containsCol(srcSchema, "_gid") )
    		builder.add("_gid", Integer.class);

    	AttributeTypeBuilder attributeBuilder = new AttributeTypeBuilder();
    	List<AttributeDescriptor> attributes = srcSchema.getAttributeDescriptors();
    	for (AttributeDescriptor attrib : attributes) {
    		AttributeType type = attrib.getType();
    		if (type instanceof GeometryType) { // 1. 칼럼이 지오메트리 속성인 경우
				builder.setCRS(tgtCRS);
				GeometryDescriptor g = srcSchema.getGeometryDescriptor();
				attributeBuilder.init(g);
				attributeBuilder.setName("_geometry");
				attributeBuilder.setCRS(tgtCRS);

				GeometryDescriptor att = (GeometryDescriptor) attributeBuilder.buildDescriptor("_geometry");

				builder.add(att);
				builder.setDefaultGeometry(att.getLocalName());
    		} else { // 2. 칼럼이 일반 속성인 경우 -> 칼럼명을 트랜스코딩하여 넣음
    			if(transCodingChk) {
    				attributeBuilder.setBinding(attrib.getType().getBinding());
    				attributeBuilder.setNillable(true);

    				AttributeDescriptor attr = attributeBuilder.buildDescriptor( GMT_StrUtil.strTransCode( attrib.getLocalName(), orgCharset, tgtCharset) );
    				builder.add(attr);
    			} else {
    				builder.add(attrib);
    			}
    		}
    	}

    	return builder.buildFeatureType();
    }

    /**
     *  shp 파일의 ShapefileDataStore 객체를 반환한다.
     *
     * @param File : 대상 파일
     * @return ShapefileDataStore : 해당 shp파일의 ShapefileDataStore
     * @author 장대건
     */
    public static ShapefileDataStore getShapefileDataStore(File outfile) {
		ShapefileDataStoreFactory dataStoreFactory = new ShapefileDataStoreFactory();

		Map<String, Serializable> params = new HashMap<String, Serializable>();
		try {
			params.put("url", outfile.toURI().toURL());
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
		params.put("create spatial index", Boolean.TRUE);
//		params.put(ShapefileDataStoreFactory.DBFCHARSET.key, "EUC-KR");

		try {
			return (ShapefileDataStore) dataStoreFactory.createNewDataStore(params);
		} catch (IOException e) {
			e.printStackTrace();
		}

		return null;
	}

    /**
     * FeatureCollection의 피쳐들을 shp파일에 쓴다.
     *
     * @param FeatureCollection : 소스 피쳐 콜렉션
     * @param File : 대상 파일
     * @return boolean : 성공 여부
     * @author 장대건
     */
	public static boolean writeFeaturesOnShp(FeatureCollection<SimpleFeatureType, SimpleFeature> features, File outfile) {
		ShapefileDataStore shpDataStore = getShapefileDataStore(outfile);

		if (shpDataStore == null) {
			throw new IllegalStateException("Datastore can not be null when writing");
		}

		shpDataStore.setCharset(Charset.forName("EUC-KR"));

		SimpleFeatureType schema = features.getSchema();
		GeometryDescriptor geom = schema.getGeometryDescriptor();
		String oldGeomAttrib = "";
		try {

			Transaction transaction = new DefaultTransaction("create");

			String typeName = shpDataStore.getTypeNames()[0];
			SimpleFeatureSource featureSource = shpDataStore.getFeatureSource(typeName);

			/*
			 * Shp 파일의 제약사항.
			 * 1. 지오메트리 속성은 "the_geom"으로 명명되어야 하며, 가장 첫번째에 와야함.
			 * 2. 지오메트리 속성은 Point, MultiPoint, MuiltiLineString, MultiPolygon 타입 중 하나이어야 함.
			 * 3. Shp 파일 내 각 속성 이름에는 길이 제한이 있음. - Attribute names are limited in length
			 * 4. 모든 데이터 타입을 지원하지는 않음 (예로, 타임스탬프는 Date라고 표시함)
			 *
			 * 그러므로, 각 schema의 지오메트리 칼럼 명을 "the_geom"으로 변경하고,
			 * 첫번째 칼럼으로 오도록 수정해주어야 함.
			 */
			List<AttributeDescriptor> attributes = schema.getAttributeDescriptors();
			GeometryType geomType = null;
			List<AttributeDescriptor> attribs = new ArrayList<AttributeDescriptor>();
			for (AttributeDescriptor attrib : attributes) {
				AttributeType type = attrib.getType();
				if (type instanceof GeometryType) {
					geomType = (GeometryType) type;
					oldGeomAttrib = attrib.getLocalName();
				} else {
					attribs.add(attrib);
				}
			}

			// 제약사항 1. 기존 지오메트리 칼럼을 기반으로 "the_geom" 이름의 지오메트리 타입을 생성함.
			GeometryTypeImpl gt = new GeometryTypeImpl(new NameImpl("the_geom"), geomType.getBinding(),
					geomType.getCoordinateReferenceSystem(), geomType.isIdentified(), geomType.isAbstract(),
					geomType.getRestrictions(), geomType.getSuper(), geomType.getDescription());

			GeometryDescriptor geomDesc = new GeometryDescriptorImpl(gt, new NameImpl("the_geom"), geom.getMinOccurs(),
					geom.getMaxOccurs(), geom.isNillable(), geom.getDefaultValue());

			// 제약사항 2. 지오메트리 칼럼은 첫번째에 위치해야 함.
			attribs.add(0, geomDesc);

			SimpleFeatureType shpType = new SimpleFeatureTypeImpl(schema.getName(), attribs, geomDesc,
					schema.isAbstract(), schema.getRestrictions(), schema.getSuper(), schema.getDescription());

			shpDataStore.createSchema(shpType);

			if (featureSource instanceof SimpleFeatureStore) {
				SimpleFeatureStore featureStore = (SimpleFeatureStore) featureSource;

				List<SimpleFeature> feats = new ArrayList<SimpleFeature>();

				FeatureIterator<SimpleFeature> features2 = features.features();
				while (features2.hasNext()) {
					SimpleFeature f = features2.next();
					SimpleFeature reType = DataUtilities.reType(shpType, f, true);
					// 기존 피쳐의 지오메트리 값을, 새 피쳐의 the_geom 칼럼에 입력함.
					reType.setAttribute("the_geom", f.getAttribute(oldGeomAttrib));

					feats.add(reType);
				}
				features2.close();
				SimpleFeatureCollection collection = new ListFeatureCollection(shpType, feats);

				featureStore.setTransaction(transaction);
				try {
					List<FeatureId> ids = featureStore.addFeatures(collection);
					transaction.commit();
				} catch (Exception problem) {
					problem.printStackTrace();
					transaction.rollback();
				} finally {
					transaction.close();
				}
				shpDataStore.dispose();
				return true;
			} else {
				shpDataStore.dispose();
				System.err.println("ShapefileStore not writable");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}


    /**
     * 피쳐들을 모두 순회하여, 각 피쳐들의 좌표계 값 유효성을 검사합니다.<br>
     * 각 피쳐들을 순회하여 좌표계 값이 안들어 가있거나, 유효하지 않은 값일 경우 false<br>
     * 유효한 좌표계가 들어가있는 경우 true<br>
     *
     * @param FeatureCollection : 소스 피쳐 콜렉션
     * @return boolean
     * @author 장대건
     */
	public static boolean validateFeatureGeometry(SimpleFeatureCollection featureCollection) {
		SimpleFeatureIterator iterator = featureCollection.features();
		while (iterator.hasNext()) {
			SimpleFeature feature = iterator.next();
			Geometry geom = (Geometry) feature.getDefaultGeometry();
			if (geom != null && !geom.isValid()) {
				System.err.println("Invalid Geoemtry !! ");
				printFearture(feature);
				return false;
            }
		}
		return true;
	}

    /**
     * 스키마(SimpleFeatureType)의 지오메트리 칼럼에 좌표계 설정이 되어있는 지 확인한다.<br>
     *
     * @param SimpleFeatureType : 스키마
     * @return boolean
     * @author 장대건
     */
    public static boolean schemaHasCRS(SimpleFeatureType srcSchema) {
		List<AttributeDescriptor> attributes = srcSchema.getAttributeDescriptors();
		for (AttributeDescriptor attr : attributes) {
			AttributeType type = attr.getType();
			if (type instanceof GeometryType) { // 1. 칼럼이 지오메트리 속성인 경우
				if (srcSchema.getCoordinateReferenceSystem() == null)
					return false;
				else
					return true;
			}
		}
		return false;
	}

	/**
	 * FeatureCollection의 각 피쳐에 설정된 srid값을 반환한다.
	 * 피쳐에 설정되어 있는 좌표계값을 반환합니다.
	 *
	 * @param FeatureCollection : 소스 피쳐 콜렉션
	 * @return int : SRID 값 (5186, 5179 ... )
	 * @author 장대건
	 */
	public static int getSrid(SimpleFeatureCollection featureCollection) {
		SimpleFeatureIterator iterator = featureCollection.features();
		SimpleFeature feature = iterator.next();
		Geometry geom = (Geometry) feature.getDefaultGeometry();

		return geom.getSRID();
	}

	/**
	 * srcSchema의 지오메트리 타입을 반환한다.
	 *
	 * @param SimpleFeatureType : 소스 피쳐 스키마
	 * @return String : 지오메트리 타입 (Line, MultiPolygon, Point)
	 * @author 장대건
	 */
	public static String getGeomType(SimpleFeatureType srcSchema) {
		List<AttributeDescriptor> attributes = srcSchema.getAttributeDescriptors();
		for (AttributeDescriptor attrib : attributes) {
			AttributeType type = attrib.getType();
			if (!(type instanceof GeometryType))
				continue;

			String geomTyp = type.toString();
			return geomTyp.substring(geomTyp.indexOf("<")+1, geomTyp.indexOf(">"));
		}
		return "";
	}
	/**
	 * srcSchema의 지오메트리 타입을 반환한다.<br>
	 * Shp 파일 입력용 추가
	 * @param File : Shp 파일
	 * @return String : 지오메트리 타입 (Line, MultiPolygon, Point)
	 * @author 장대건
	 */
	public static String getGeomType(File shpFile) {
		try {
			return getGeomType(FileDataStoreFinder.getDataStore(shpFile).getSchema());
		} catch (IOException e) {
			e.printStackTrace();
		}
		return "";
	}

	/**
	 * DB 데이터스토어를 순회하여 특정 테이블의 피쳐콜렉션을 반환한다. <br>
	 * ※ 사용하기 전 DB DataStore 관련 전역변수 꼭 초기화해주어야함
	 * @param dbSchema : 순회할 DB 스키마 명
	 * @return tbl : 가져올 테이블 명
	 * @author 장대건
	 */
	public static SimpleFeatureCollection getDbFeatureCollection(String dbSchema, String tbl) {
		DataStore dataStore = GMT_ShpUtil.getDbDataStore(dbSchema);
		SimpleFeatureCollection featureCollection = null;
		String[] typeNames;
		try {
			typeNames = dataStore.getTypeNames();
			for (int i = 0; i < typeNames.length; i++) {
				String typeName = typeNames[i];
				if (typeName.equals(tbl)) {
					featureCollection = dataStore.getFeatureSource(typeName).getFeatures();
					return featureCollection;
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
			System.err.println("GMT_ShpUtil.getDbFeatureCollection Error... 스키마 또는 테이블을 참조할 수 없습니다.");
		}

		return featureCollection;
	}

	/**
	 * DB 데이터스토어를 순회하여 특정 테이블의 피쳐타입(해당 테이블의 스키마)을 반환한다. <br>
	 * ※ 사용하기 전 DB DataStore 관련 전역변수 꼭 초기화해주어야함
	 * @param dbSchema : 순회할 DB 스키마 명
	 * @return tbl : 가져올 테이블 명
	 * @author 장대건
	 */
	public static SimpleFeatureType getDbTableSchema(String dbSchema, String tbl) {
		DataStore dataStore = GMT_ShpUtil.getDbDataStore(dbSchema);
		SimpleFeatureType featureType = null;
		String[] typeNames;
		try {
			typeNames = dataStore.getTypeNames();
			for (int i = 0; i < typeNames.length; i++) {
				String typeName = typeNames[i];
				if (typeName.equals(tbl)) {
					featureType = dataStore.getSchema(typeName);
					return featureType;
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
			System.err.println("GMT_ShpUtil.getDbTableSchema Error... 스키마를 참조할 수 없습니다.");
		}

		return featureType;
	}

	/**
	 * 해당 스키마에 특정 칼럼(=Attribute)이 있는지 검사한다.<br>
	 *
	 * @param SimpleFeatureType : 조회할 심플피쳐타입(스키마, DB스키마 아님!)
	 * @param String : 찾을 칼럼명(=attribute 명)
	 * @author 장대건
	 * @throws IOException
	 * @throws FactoryException
	 * @throws NoSuchAuthorityCodeException
	 */
	public static boolean containsCol(SimpleFeatureType srcSchema, String tgtCol) {
		List<AttributeDescriptor> attributes = srcSchema.getAttributeDescriptors();
		for (AttributeDescriptor attrib : attributes) {
			if( tgtCol.equalsIgnoreCase(attrib.getLocalName()) )
				return true;
		}
		return false;
	}

	/**
	 * 피쳐콜렉션의 지오메트리 칼럼의 이름을 가져온다. <br>
	 *
	 * @param SimpleFeatureCollection : 조회할 SimpleFeatureCollection
	 * @return String : 지오메트리 칼럼 명
	 * @author 장대건
	 */
	public static String getGeometryColumn(SimpleFeatureType schema) {
		String geometryColumn = "";
		List<AttributeDescriptor> attributes = schema.getAttributeDescriptors();
		for (AttributeDescriptor attrib : attributes) {
			AttributeType type = attrib.getType();
			if (type instanceof GeometryType) {
				geometryColumn = attrib.getLocalName();
				return geometryColumn;
			}
		}
		return geometryColumn;
	}

    /**
     *  스키마의 각 Attribute 명(칼럼명)을 출력한다.
     *
     * @param SimpleFeatureType srcSchema : 출력할 스키마
     * @author 장대건
     */
    public static void printAttributeName(SimpleFeatureType schema) {
    	List<AttributeDescriptor> attributes = schema.getAttributeDescriptors();
		for (AttributeDescriptor attrib : attributes) {
			AttributeType type = attrib.getType();
			if (type instanceof GeometryType) {
				System.out.println("Geometry 타입 : " + attrib.getLocalName());
			} else if (type instanceof AttributeType) {
				System.out.println("AttributeType 타입 : " + GMT_StrUtil.strTransCode( attrib.getLocalName(), "ISO-8859-1", "euc-kr"));
			} else {
				System.out.println("Unknown 타입 : " + attrib.getLocalName());
			}
		}
    }

	/**
	 * SimpleFeatureCollection의 좌표계 설정을 바꾼다. <br>
	 * 각 피쳐들을 해당 좌표계로 모두 transform 한다 <br>
	 * @param SimpleFeatureCollection : 좌표변경 할 SimpleFeatureCollection
	 * @param srcSRID : 원본 좌표계
	 * @param tgtSRID : 바꿀 좌표계
	 * @author 장대건
	 * @throws IOException
	 * @throws FactoryException
	 * @throws NoSuchAuthorityCodeException
	 */
	public static void reprojectGeometry(SimpleFeatureCollection featureCollection, String srcSRID, String tgtSRID) {
		try {
			CoordinateReferenceSystem srcCRS = CRS.decode("epsg:" + srcSRID, true);
			CoordinateReferenceSystem tgtCRS = CRS.decode("epsg:" + tgtSRID, true);
			MathTransform transform = CRS.findMathTransform(srcCRS, tgtCRS, true);

			SimpleFeatureIterator iterator = featureCollection.features();
			while (iterator.hasNext()) {
				SimpleFeature feature = iterator.next();
				Geometry geometry = (Geometry) feature.getDefaultGeometry();
				Geometry transGeometry = JTS.transform(geometry, transform);
				transGeometry.setSRID(Integer.parseInt(tgtSRID));

				feature.setDefaultGeometry(transGeometry);
			}
		} catch (NoSuchAuthorityCodeException e) {
			e.printStackTrace();
			System.err.println("Cannot find Authority code ...");
		} catch (FactoryException e) {
			e.printStackTrace();
			System.err.println("Cannot find CRS code...");
		} catch (MismatchedDimensionException e) {
			e.printStackTrace();
		} catch (TransformException e) {
			e.printStackTrace();
		}
	}

	/**
	 * SimpleFeature의 좌표계 설정을 바꾼다. <br>
	 * 각 피쳐들을 해당 좌표계로 모두 transform 한다 <br>
	 * @param SimpleFeature : 좌표변경 할 feature
	 * @param srcSRID : 원본 좌표계
	 * @param tgtSRID : 바꿀 좌표계
	 * @author 장대건
	 * @throws IOException
	 * @throws FactoryException
	 * @throws NoSuchAuthorityCodeException
	 */
	public static void reprojectGeometry(SimpleFeature feature, String srcSRID, String tgtSRID) {
		try {
			CoordinateReferenceSystem srcCRS = CRS.decode("epsg:" + srcSRID, true);
			CoordinateReferenceSystem tgtCRS = CRS.decode("epsg:" + tgtSRID, true);
			MathTransform transform = CRS.findMathTransform(srcCRS, tgtCRS, true);

			Geometry geometry = (Geometry) feature.getDefaultGeometry();
			Geometry transGeometry = JTS.transform(geometry, transform);
			transGeometry.setSRID(Integer.parseInt(tgtSRID));

			feature.setDefaultGeometry(transGeometry);
		} catch (NoSuchAuthorityCodeException e) {
			e.printStackTrace();
			System.err.println("Cannot find Authority code ...");
		} catch (FactoryException e) {
			e.printStackTrace();
			System.err.println("Cannot find CRS code...");
		} catch (MismatchedDimensionException e) {
			e.printStackTrace();
		} catch (TransformException e) {
			e.printStackTrace();
		}
	}

}
