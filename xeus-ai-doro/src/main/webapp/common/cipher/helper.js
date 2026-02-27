var _CipherManager = {};

_CipherManager.fn = {
	
	/**
	 * TEA 사용을 위한 키 생성
	 * @returns
	 */
	generateTEAKey : function(){
		var time = new Date().getTime();
		var random = Math.floor(65536 * Math.random());
		return (time * random).toString();
	},
	
	/**
	 * TEA알고리즘으로 암호화 한다.
	 * 
	 * @param k
	 *            key
	 * @param text
	 *            평문
	 * @returns 암호문
	 */
	encryptTEA : function(k, text){
		return Tea.encrypt(text, k);
	},
	
	/**
	 * TEA 알고리즘으로 복호화 한다.
	 * 
	 * @param k
	 * @param text
	 * @returns
	 */
	decryptTEA : function(k, text){
		return Tea.decrypt(text, k);
	},
	
	/**
	 * RSA알고리즘으로 암호화 한다.
	 * 
	 * @param m
	 *            Modulus
	 * @param e
	 *            Exponent
	 * @param text
	 *            평문
	 * @returns 암호문
	 */
	encryptRSA : function(m, e, text){
		var rsa = new RSAKey();
		rsa.setPublic(m, e);
		return rsa.encrypt(text);
	}
};