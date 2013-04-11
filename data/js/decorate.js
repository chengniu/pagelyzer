var dump_loaded = true;
var dump_text = '';
var cont=1;

function puts(s) {
	dump_text += s;
}

function textNode(pNode) {
	return(pNode.nodeType==3);
}

function rgb2hex(rgbString) {
	if (rgbString != 'rgba(0, 0, 0, 0)') {
		var parts = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		delete (parts[0]);
		for (var i = 1; i <= 3; ++i) {
			parts[i] = parseInt(parts[i]).toString(16);
			if (parts[i].length == 1) parts[i] = '0' + parts[i];
		}
		return '#'+parts.join('');
	} else {
		return '#ffffff'
	}
}

function css(pNode,prop) {
	return(document.defaultView.getComputedStyle(pNode,null).getPropertyValue(prop));
}

function walk(pNode,nLevel,pretext) {
	var tab = '';
	var src = '';
	var aux = '';
	for(var k=0;k<nLevel;k++) {tab+=' ';}
	var attr = \" uid='\"+cont+\"'\";
	if (pNode.id) {
		attr += \" id='\"+(pNode.id)+\"'\";
	} else {
		attr += \" id='element-\"+(cont)+\"'\";
	}
	attr += \" elem_left='\"+(new String(getElemLeft(pNode)))+\"'\";
	attr += \" elem_top='\"+(new String(getElemTop(pNode)))+\"'\";
	attr += \" elem_width='\"+(new String(getElemLeft(pNode)+getElemWidth(pNode)))+\"'\";
	attr += \" elem_height='\"+(new String(getElemTop(pNode)+getElemHeight(pNode)))+\"'\";
	if (pNode.style) {
		attr += \" margin_left='\"+(new String(css(pNode,'margin-left')))+\"'\";
		attr += \" background_color='\"+(new String(css(pNode,'background-color')))+\"'\";
		attr += \" font_size='\"+(new String(css(pNode,'font-size')))+\"'\";
		attr += \" font_weight='\"+(new String(css(pNode,'font-weight')))+\"'\";
		attr += \" display='\"+(new String(css(pNode,'display')))+\"'\";
		attr += \" visibility='\"+(new String(css(pNode,'visibility')))+\"'\";
		attr += \" style='\"+(pNode.style.cssText)+\"'\";
	}
	cont+=1;
	
		if (pNode.tagName == 'A') {
			if (pNode.href)
				attr += \" href='\"+pNode.href+\"'\";
		}
		
		if ((pNode.tagName!='TBODY') && (pNode.tagName!='IMG') && (pNode.tagName!='CANVAS') && (pNode.id!='fxdriver-screenshot-canvas')) {
			if (!textNode(pNode) && (pNode.tagName)) {
				src += tab + '<'+pNode.tagName+' '+ attr+'>';
				if (nLevel==0) {
					src += pretext;
				}
			}
		}
		if (pNode.tagName=='IMG') {
			src += tab + \"<\"+pNode.tagName+\" \"+ attr +\" src='\"+pNode.src+\"' alt='\"+pNode.alt+\"'/>\";
		}
				
		for (var i = 0;i<pNode.childNodes.length;i++) {
			if (textNode(pNode.childNodes[i])) {
				src += pNode.childNodes[i].data.trim();
			} else {
				src += walk(pNode.childNodes[i],nLevel+1,'');
			}
		}
		
		if ((pNode.tagName!='TBODY') && (pNode.tagName!='IMG') && (pNode.tagName!='CANVAS') && (pNode.id!='fxdriver-screenshot-canvas')) {
			if (!textNode(pNode) && (pNode.tagName)) {
				src += tab + '</'+pNode.tagName+'>';
			}
		}
	return(src);
}

function getDocHeight() {
	var d = document;
	return Math.max(
		Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
		Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
		Math.max(d.body.clientHeight, d.documentElement.clientHeight)
		);
}

function getDocWidth() {
	var d = document;
	return Math.max(
		Math.max(d.body.scrollWidth, d.documentElement.scrollWidth),
		Math.max(d.body.offsetWidth, d.documentElement.offsetWidth),
		Math.max(d.body.clientWidth, d.documentElement.clientWidth)
		);
}

function getElemLeft(element) {
	return element.offsetLeft;
}

function getElemTop(element) {
	return element.offsetTop;
}

function getElemWidth(element) {
	return element.offsetWidth;
}

function getElemHeight(element) {
	return element.offsetHeight;
}

function dump_start() {
	var src = '';
	var now = new Date();
	var then = now.getFullYear()+'-'+now.getMonth()+'-'+now.getDay()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
	pre = '<!-- window: {width : '+ window.innerWidth + ', height: ' + window.innerHeight+'}, ';
	pre += 'document: {width: '+ getDocWidth() + ', height: ' + getDocHeight()+'}, ';
	pre += 'page: {url: \"'+  location.href + '\", date: \"'+ then + '\"} -->';
	src += walk(document.getElementsByTagName('html')[0],0,pre);
	return(src);
}
