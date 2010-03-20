var sys = require("sys");
var tmpl =  require("microtemplate");
var str = '<script type="text/html" id="item_tmpl"><div id="<%=id%>" class="<%=(i % 2 == 1 ? " even" : "uneven")%>"><div class="grid_1 alpha right"><img class="righted" src="<%=profile_image_url%>"/></div><div class="grid_6 omega contents"><p><b><a href="/<%=from_user%>"><%=from_user%></a>:</b> <%=text%></p></div></div></script>';

var data = {i:45,  id: 6, profile_image_url: "lipo", from_user: "pedro", text: "this is a text"};
var users = [{url:"1url", nae:"name1"},{url:"2url"},{url:"3url"} ];

var data = { users : [{url:"1url",  name:"name1"},{url:"2url", name:"name2"},{url:"3url"} ] };
var str = '<% for ( var i = 0; i < users.length; i++ ) { %><li><a href="<%=users[i].url%>"><%=users[i].name%></a></li><% } %>'; 

var content = tmpl.render(str, data);

if (content instanceof Error) {
	sys.puts(content.name +': ' +content.message);
} else {
	sys.puts(content);
}

