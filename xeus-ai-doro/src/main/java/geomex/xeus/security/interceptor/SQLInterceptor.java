package geomex.xeus.security.interceptor;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 * <pre>
 * 파일명 :  SQLInterceptor.java
 * 설  명 :
 *
 *   SQL Injection 공격에 대한 가능성을 제거합니다.
 * 	 Prepared Statement 를 사용하지 않는 ORDER BY, LIMIT, OFFSET 키워드에 해당됩니다.
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-06-22      이주영          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 22.
 * @version :  1.0
 * @see
 */
public class SQLInterceptor extends HandlerInterceptorAdapter {

	@SuppressWarnings("unchecked")
	public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws IOException{
		String reqUrl = req.getRequestURL().toString();
		String[] blackList = { "--", ";", "/*", "*/", "*", "@@", "@", "'", "\"", "(", ")" };
			                  //"alter", "create", "delete", "drop", "insert", "update", "where", "select", "from"};

		String sortCol = req.getParameter("sortCol");
		String sortTyp = req.getParameter("sortTyp");
		String limit = req.getParameter("limit");
		String offset = req.getParameter("offset");

		String error = "SQL Injection 공격성이 가능한 문구는 포함할 수 없습니다.";

		boolean bool = true;

		/* Order by 컬림명 Injection 방지 */
		if(!"".equals(sortCol) && sortCol != null){
			for(int i=0; i<blackList.length; i++){
				if(sortCol.contains(blackList[i])){
					error = "[C]" + error;
					bool = false;
				}
			}
		}

		/* Order by 방식 Injection 방지 */
		if(!"".equals(sortTyp) && sortTyp != null){
			if(!"asc".equals(sortTyp.toLowerCase()) && !"desc".equals(sortTyp.toLowerCase())){
				error = "[T]" + error;
				bool = false;
			}
		}

		/* Limit Injection 방지 */
		if(!"".equals(limit) && limit != null){
			try {
				Integer.parseInt(limit);
			} catch (Exception e) {
				error = "[L]" + error;
				bool = false;
			}
		}

		/* Offset Injection 방지 */
		if(!"".equals(offset) && offset != null){
			try {
				Integer.parseInt(offset);
			} catch (Exception e) {
				error = "[O]" + error;
				bool = false;
			}
		}

		if(!bool){
			if(reqUrl.endsWith(".json")){
				res.setCharacterEncoding("UTF-8");
				res.setContentType("application/json; charset=UTF-8");
				PrintWriter out = res.getWriter();
				JSONObject json = new JSONObject();
				json.put("error", error);
				out.print(json);
				out.flush();
				out.close();

				return false;
			}
		}

		return bool;

	}

}