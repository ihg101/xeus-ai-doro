/**
 * jQuery-HTMLTagFilter
 *
 * @author 이주영
 */
/**
 * <pre>
 * input, textarea 의 경우, 치환된 문자열을 복구합니다.
 * </pre>
 */
$.fn.HTMLTagRestore = function(){
	var value = this.val();

	if(this.is("input") || this.is("textarea")){
		this.val(
				value.replaceAll("&lt;", "<")
					 .replaceAll("&gt;", ">")
					 .replaceAll("&amp;", "&")
					 .replaceAll("&quot;", '"')
					 .replaceAll("&#39;", "'")
					 .replaceAll("&apos;", "\\")
					 .replaceAll("&#x2F;", "/")
		);
	}

	return this;
};