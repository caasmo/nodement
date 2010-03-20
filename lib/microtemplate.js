/**
 * Templating for JS.
 *
 * http://ejohn.org/blog/javascript-micro-templating/
 *
 * MIT Licensed.
 *
 * Tips:
 *
 * 1. Use semicolons after function calls in <% %> blocks.
 * 2. Do not use semicolons after function calls in <%= %> blocks.
 * 3. Do not use // style comments, use /* style.
 * 4. Avoid using single quotes. They cause errors.
 *
 */

/**
 * Render the template within the scope of the vars object.
 *
 * @param String 
 * @param Object	
 * @return string|error
 */
exports.render = function(str, vars) {
	// John Resig - http://ejohn.org/ - MIT Licensed
	var data = vars || {};
	var fn = new Function("obj",
		"var p=[];" +
		// Introduce the data as local variables using with(){}
		"with(obj){p.push('" +

		// Convert the template into pure JavaScript
		// http://www.west-wind.com/weblog/posts/509108.aspx
		str.replace(/[\r\t\n]/g, " ")
			// Matches ' only if it is followed by [^%]*%>
			.replace(/'(?=[^%]*%>)/g, "\t")
			.split("'").join("\\'")
			.split("\t").join("'")
			.replace(/<%=(.+?)%>/g, "',$1,'")
			.split("<%").join("');")
			.split("%>").join("p.push('") 
			+ "');}return p.join('');");

		/*
		str.replace(/[\r\t\n]/g, " ")
			.split("<%").join("\t")
			.replace(/((^|%>)[^\t]*)'/g, "$1\r")
			.replace(/\t=(.*?)%>/g, "',$1,'")
			.split("\t").join("');")
			.split("%>").join("p.push('")
			.split("\r").join("\\'") + "');}return p.join('');");*/

	try {
		return fn(data);
	} catch (err) {
		return err;
	}
};
