var SPELL_CUR_LANG=null,GOOGIE_DEFAULT_LANG="en";
function GoogieSpell(v,w){var n=this;this.array_keys=function(a){var c=[];for(var b in a)c.push([b]);return c};var r=getCookie("language");GOOGIE_CUR_LANG=r!=null?r:GOOGIE_DEFAULT_LANG;this.img_dir=v;this.server_url=w;this.lang_to_word=this.org_lang_to_word={da:"Dansk",de:"Deutsch",en:"English",es:"Espa&#241;ol",fr:"Fran&#231;ais",it:"Italiano",nl:"Nederlands",pl:"Polski",pt:"Portugu&#234;s",fi:"Suomi",sv:"Svenska"};this.langlist_codes=this.array_keys(this.lang_to_word);this.show_change_lang_pic=
true;this.change_lang_pic_placement="right";this.report_state_change=true;this.el_scroll_top=this.ta_scroll_top=0;this.lang_chck_spell="Check spelling";this.lang_revert="Revert to";this.lang_close="Close";this.lang_rsm_edt="Resume editing";this.lang_no_error_found="No spelling errors found";this.lang_no_suggestions="No suggestions";this.show_spell_img=false;this.report_ta_not_found=this.edit_layer_dbl_click=this.use_close_btn=this.decoration=true;this.custom_no_spelling_error=this.custom_ajax_error=
null;this.custom_menu_builder=[];this.custom_item_evaulator=null;this.extra_menu_items=[];this.custom_spellcheck_starter=null;this.main_controller=true;this.all_errors_fixed_observer=this.show_menu_observer=this.spelling_state_observer=this.lang_state_observer=null;this.use_focus=false;this.focus_link_b=this.focus_link_t=null;this.cnt_errors_fixed=this.cnt_errors=0;$(document).bind("click",function(a){$(a.target).attr("googie_action_btn")!="1"&&n.isLangWindowShown()&&n.hideLangWindow();$(a.target).attr("googie_action_btn")!=
"1"&&n.isErrorWindowShown()&&n.hideErrorWindow()});this.decorateTextarea=function(a){if(this.text_area=typeof a=="string"?document.getElementById(a):a){if(!this.spell_container&&this.decoration){a=document.createElement("table");var c=document.createElement("tbody"),b=document.createElement("tr"),d=document.createElement("td"),e=this.isDefined(this.force_width)?this.force_width:this.text_area.offsetWidth,f=this.isDefined(this.force_height)?this.force_height:16;b.appendChild(d);c.appendChild(b);$(a).append(c).insertBefore(this.text_area).width("100%").height(f);
$(d).height(f).width(e).css("text-align","right");this.spell_container=d}this.checkSpellingState()}else this.report_ta_not_found&&alert("Text area not found")};this.setSpellContainer=function(a){this.spell_container=typeof a=="string"?document.getElementById(a):a};this.setLanguages=function(a){this.lang_to_word=a;this.langlist_codes=this.array_keys(a)};this.setCurrentLanguage=function(a){GOOGIE_CUR_LANG=a;var c=new Date;c.setTime(c.getTime()+31536E6);setCookie("language",a,c)};this.setForceWidthHeight=
function(a,c){this.force_width=a;this.force_height=c};this.setDecoration=function(a){this.decoration=a};this.dontUseCloseButtons=function(){this.use_close_btn=false};this.appendNewMenuItem=function(a,c,b){this.extra_menu_items.push([a,c,b])};this.appendCustomMenuBuilder=function(a,c){this.custom_menu_builder.push([a,c])};this.setFocus=function(){try{this.focus_link_b.focus();this.focus_link_t.focus();return true}catch(a){return false}};this.setStateChanged=function(a){this.state=a;this.spelling_state_observer!=
null&&this.report_state_change&&this.spelling_state_observer(a,this)};this.setReportStateChange=function(a){this.report_state_change=a};this.getUrl=function(){return this.server_url+GOOGIE_CUR_LANG};this.escapeSpecial=function(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")};this.createXMLReq=function(a){return'<?xml version="1.0" encoding="utf-8" ?><spellrequest textalreadyclipped="0" ignoredups="0" ignoredigits="1" ignoreallcaps="1"><text>'+a+"</text></spellrequest>"};
this.spellCheck=function(a){this.cnt_errors=this.cnt_errors_fixed=0;this.setStateChanged("checking_spell");this.main_controller&&this.appendIndicator(this.spell_span);this.error_links=[];this.ta_scroll_top=this.text_area.scrollTop;this.ignore=a;this.hideLangWindow();if($(this.text_area).val()==""||a){this.custom_no_spelling_error?this.custom_no_spelling_error(this):this.flashNoSpellingErrorState();this.removeIndicator()}else{this.createEditLayer(this.text_area.offsetWidth,this.text_area.offsetHeight);
this.createErrorWindow();$("body").append(this.error_window);try{netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead")}catch(c){}this.main_controller&&$(this.spell_span).unbind("click");this.orginal_text=$(this.text_area).val();a=this.escapeSpecial(this.orginal_text);var b=this;$.ajax({type:"POST",url:this.getUrl(),data:this.createXMLReq(a),dataType:"text",error:function(d){b.custom_ajax_error?b.custom_ajax_error(b):alert("An error was encountered on the server. Please try again later.");
if(b.main_controller){$(b.spell_span).remove();b.removeIndicator()}b.checkSpellingState()},success:function(d){b.results=b.parseResult(d);if(d.match(/<c.*>/)!=null){b.showErrorsInIframe();b.resumeEditingState()}else b.custom_no_spelling_error?b.custom_no_spelling_error(b):b.flashNoSpellingErrorState();b.removeIndicator()}})}};this.parseResult=function(a){var c=/\w+="(\d+|true)"/g,b=/\t/g;a=a.match(/<c[^>]*>[^<]*<\/c>/g);var d=[];if(a==null)return d;for(var e=0;e<a.length;e++){var f=[];this.errorFound();
f.attrs=[];for(var g=a[e].match(c),h=0;h<g.length;h++){var k=g[h].split(/=/),j=k[1].replace(/"/g,"");f.attrs[k[0]]=j!="true"?parseInt(j):j}f.suggestions=[];g=a[e].replace(/<[^>]*>/g,"").split(b);for(h=0;h<g.length;h++)g[h]!=""&&f.suggestions.push(g[h]);d.push(f)}return d};this.createErrorWindow=function(){this.error_window=document.createElement("div");$(this.error_window).addClass("googie_window").attr("googie_action_btn","1")};this.isErrorWindowShown=function(){return $(this.error_window).is(":visible")};
this.hideErrorWindow=function(){$(this.error_window).css("visibility","hidden");$(this.error_window_iframe).css("visibility","hidden")};this.updateOrginalText=function(a,c,b,d){var e=this.orginal_text.substring(0,a);a=this.orginal_text.substring(a+c.length);this.orginal_text=e+b+a;$(this.text_area).val(this.orginal_text);c=b.length-c.length;for(b=0;b<this.results.length;b++)if(b!=d&&b>d)this.results[b].attrs.o+=c};this.saveOldValue=function(a,c){a.is_changed=true;a.old_value=c};this.createListSeparator=
function(){var a=document.createElement("td"),c=document.createElement("tr");$(a).html(" ").attr("googie_action_btn","1").css({cursor:"default","font-size":"3px","border-top":"1px solid #ccc","padding-top":"3px"});c.appendChild(a);return c};this.correctError=function(a,c,b,d){var e=c.innerHTML;b=b.nodeType==3?b.nodeValue:b.innerHTML;var f=this.results[a].attrs.o;if(d){d=c.previousSibling.innerHTML;c.previousSibling.innerHTML=d.slice(0,d.length-1);e=" "+e;f--}this.hideErrorWindow();this.updateOrginalText(f,
e,b,a);$(c).html(b).css("color","green").attr("is_corrected",true);this.results[a].attrs.l=b.length;this.isDefined(c.old_value)||this.saveOldValue(c,e);this.errorFixed()};this.showErrorWindow=function(a,c){this.show_menu_observer&&this.show_menu_observer(this);var b=this,d=$(a).offset();d.top-=this.edit_layer.scrollTop;$(this.error_window).css({visibility:"visible",top:d.top+20+"px",left:d.left+"px"}).html("");d=document.createElement("table");var e=document.createElement("tbody");$(d).addClass("googie_list").attr("googie_action_btn",
"1");for(var f=false,g=0;g<this.custom_menu_builder.length;g++){var h=this.custom_menu_builder[g];if(h[0](this.results[c])){f=h[1](this,e,a);break}}if(!f){f=this.results[c].suggestions;var k=this.results[c].attrs.o;g=this.results[c].attrs.l;if(f.length==0){g=document.createElement("tr");h=document.createElement("td");var j=document.createElement("span");$(j).text(this.lang_no_suggestions);$(h).attr("googie_action_btn","1").css("cursor","default");h.appendChild(j);g.appendChild(h);e.appendChild(g)}for(i=
0;i<f.length;i++){g=document.createElement("tr");h=document.createElement("td");j=document.createElement("span");$(j).html(f[i]);$(h).bind("mouseover",this.item_onmouseover).bind("mouseout",this.item_onmouseout).bind("click",function(l){b.correctError(c,a,l.target.firstChild)});h.appendChild(j);g.appendChild(h);e.appendChild(g)}if(a.is_changed&&a.innerHTML!=a.old_value){var p=a.old_value;f=document.createElement("tr");g=document.createElement("td");h=document.createElement("span");$(h).addClass("googie_list_revert").html(this.lang_revert+
" "+p);$(g).bind("mouseover",this.item_onmouseover).bind("mouseout",this.item_onmouseout).bind("click",function(l){b.updateOrginalText(k,a.innerHTML,p,c);$(a).attr("is_corrected",true).css("color","#b91414").html(p);b.hideErrorWindow()});g.appendChild(h);f.appendChild(g);e.appendChild(f)}f=document.createElement("tr");g=document.createElement("td");var m=document.createElement("input");h=document.createElement("img");j=document.createElement("form");var s=function(){if(m.value!=""){b.isDefined(a.old_value)||
b.saveOldValue(a,a.innerHTML);b.updateOrginalText(k,a.innerHTML,m.value,c);$(a).attr("is_corrected",true).css("color","green").html(m.value);b.hideErrorWindow()}return false};$(m).width(120).css({margin:0,padding:0});$(m).val(a.innerHTML).attr("googie_action_btn","1");$(g).css("cursor","default").attr("googie_action_btn","1");$(h).attr("src",this.img_dir+"ok.gif").width(32).height(16).css({cursor:"pointer","margin-left":"2px","margin-right":"2px"}).bind("click",s);$(j).attr("googie_action_btn","1").css({margin:0,
padding:0,cursor:"default","white-space":"nowrap"}).bind("submit",s);j.appendChild(m);j.appendChild(h);g.appendChild(j);f.appendChild(g);e.appendChild(f);this.extra_menu_items.length>0&&e.appendChild(this.createListSeparator());var q=function(l){if(l<b.extra_menu_items.length){var o=b.extra_menu_items[l];if(!o[2]||o[2](a,b)){var t=document.createElement("tr"),u=document.createElement("td");$(u).html(o[0]).bind("mouseover",b.item_onmouseover).bind("mouseout",b.item_onmouseout).bind("click",function(){return o[1](a,
b)});t.appendChild(u);e.appendChild(t)}q(l+1)}};q(0);q=null;this.use_close_btn&&e.appendChild(this.createCloseButton(this.hideErrorWindow))}d.appendChild(e);this.error_window.appendChild(d);if($.browser.msie){if(!this.error_window_iframe){d=$("<iframe>").css({position:"absolute","z-index":-1});$("body").append(d);this.error_window_iframe=d}$(this.error_window_iframe).css({visibility:"visible",top:this.error_window.offsetTop,left:this.error_window.offsetLeft,width:this.error_window.offsetWidth,height:this.error_window.offsetHeight})}};
this.createEditLayer=function(a,c){this.edit_layer=document.createElement("div");$(this.edit_layer).addClass("googie_edit_layer").width(a-10).height(c);this.text_area.nodeName.toLowerCase()!="input"||$(this.text_area).val()==""?$(this.edit_layer).css("overflow","auto").height(c-4):$(this.edit_layer).css("overflow","hidden");var b=this;this.edit_layer_dbl_click&&$(this.edit_layer).bind("click",function(d){if(d.target.className!="googie_link"&&!b.isErrorWindowShown()){b.resumeEditing();var e=function(){$(b.text_area).focus();
e=null};window.setTimeout(e,10)}return false})};this.resumeEditing=function(){this.setStateChanged("ready");if(this.edit_layer)this.el_scroll_top=this.edit_layer.scrollTop;this.hideErrorWindow();this.main_controller&&$(this.spell_span).removeClass().addClass("googie_no_style");if(!this.ignore){if(this.use_focus){$(this.focus_link_t).remove();$(this.focus_link_b).remove()}$(this.edit_layer).remove();$(this.text_area).show();if(this.el_scroll_top!=undefined)this.text_area.scrollTop=this.el_scroll_top}this.checkSpellingState(false)};
this.createErrorLink=function(a,c){var b=document.createElement("span"),d=this,e=function(f){d.showErrorWindow(b,c);e=null;return false};$(b).html(a).addClass("googie_link").bind("click",e).attr({googie_action_btn:"1",g_id:c,is_corrected:false});return b};this.createPart=function(a){if(a==" ")return document.createTextNode(" ");a=this.escapeSpecial(a);a=a.replace(/\n/g,"<br>");a=a.replace(/    /g," &nbsp;");a=a.replace(/^ /g,"&nbsp;");a=a.replace(/ $/g,"&nbsp;");var c=document.createElement("span");
$(c).html(a);return c};this.showErrorsInIframe=function(){var a=document.createElement("div"),c=0,b=this.results;if(b.length>0){for(var d=0;d<b.length;d++){var e=b[d].attrs.o,f=b[d].attrs.l,g=this.createPart(this.orginal_text.substring(c,e));a.appendChild(g);c+=e-c;e=this.createErrorLink(this.orginal_text.substr(e,f),d);this.error_links.push(e);a.appendChild(e);c+=f}c=this.createPart(this.orginal_text.substr(c,this.orginal_text.length));a.appendChild(c)}else a.innerHTML=this.orginal_text;$(a).css("text-align",
"left");var h=this;this.custom_item_evaulator&&$.map(this.error_links,function(k){h.custom_item_evaulator(h,k)});$(this.edit_layer).append(a);$(this.text_area).hide();$(this.edit_layer).insertBefore(this.text_area);if(this.use_focus){this.focus_link_t=this.createFocusLink("focus_t");this.focus_link_b=this.createFocusLink("focus_b");$(this.focus_link_t).insertBefore(this.edit_layer);$(this.focus_link_b).insertAfter(this.edit_layer)}};this.createLangWindow=function(){this.language_window=document.createElement("div");
$(this.language_window).addClass("googie_window").width(100).attr("googie_action_btn","1");var a=document.createElement("table"),c=document.createElement("tbody"),b=this;$(a).addClass("googie_list").width("100%");this.lang_elms=[];for(i=0;i<this.langlist_codes.length;i++){var d=document.createElement("tr"),e=document.createElement("td"),f=document.createElement("span");$(f).text(this.lang_to_word[this.langlist_codes[i]]);this.lang_elms.push(e);$(e).attr("googieId",this.langlist_codes[i]).bind("click",
function(g){b.deHighlightCurSel();b.setCurrentLanguage($(this).attr("googieId"));b.lang_state_observer!=null&&b.lang_state_observer();b.highlightCurSel();b.hideLangWindow()}).bind("mouseover",function(g){if(this.className!="googie_list_selected")this.className="googie_list_onhover"}).bind("mouseout",function(g){if(this.className!="googie_list_selected")this.className="googie_list_onout"});e.appendChild(f);d.appendChild(e);c.appendChild(d)}this.use_close_btn&&c.appendChild(this.createCloseButton(function(){b.hideLangWindow.apply(b)}));
this.highlightCurSel();a.appendChild(c);this.language_window.appendChild(a)};this.isLangWindowShown=function(){return $(this.language_window).is(":hidden")};this.hideLangWindow=function(){$(this.language_window).css("visibility","hidden");$(this.switch_lan_pic).removeClass().addClass("googie_lang_3d_on")};this.deHighlightCurSel=function(){$(this.lang_cur_elm).removeClass().addClass("googie_list_onout")};this.highlightCurSel=function(){if(GOOGIE_CUR_LANG==null)GOOGIE_CUR_LANG=GOOGIE_DEFAULT_LANG;for(var a=
0;a<this.lang_elms.length;a++)if($(this.lang_elms[a]).attr("googieId")==GOOGIE_CUR_LANG){this.lang_elms[a].className="googie_list_selected";this.lang_cur_elm=this.lang_elms[a]}else this.lang_elms[a].className="googie_list_onout"};this.showLangWindow=function(a){this.show_menu_observer&&this.show_menu_observer(this);this.createLangWindow();$("body").append(this.language_window);var c=$(a).offset(),b=c.top+$(a).height();a=this.change_lang_pic_placement=="right"?c.left-100+$(a).width():c.left+$(a).width();
$(this.language_window).css({visibility:"visible",top:b+"px",left:a+"px"});this.highlightCurSel()};this.createChangeLangPic=function(){var a=$("<img>").attr({src:this.img_dir+"change_lang.gif",alt:"Change language",googie_action_btn:"1"}),c=document.createElement("span"),b=this;$(c).addClass("googie_lang_3d_on").append(a).bind("click",function(d){d=this.tagName.toLowerCase()=="img"?this.parentNode:this;if($(d).hasClass("googie_lang_3d_click")){d.className="googie_lang_3d_on";b.hideLangWindow()}else{d.className=
"googie_lang_3d_click";b.showLangWindow(d)}});return c};this.createSpellDiv=function(){var a=document.createElement("span");$(a).addClass("googie_check_spelling_link").text(this.lang_chck_spell);this.show_spell_img&&$(a).append(" ").append($("<img>").attr("src",this.img_dir+"spellc.gif"));return a};this.flashNoSpellingErrorState=function(a){this.setStateChanged("no_error_found");var c=this;if(this.main_controller){var b;b=a?function(){a();c.checkSpellingState()}:function(){c.checkSpellingState()};
var d=$("<span>").text(this.lang_no_error_found);$(this.switch_lan_pic).hide();$(this.spell_span).empty().append(d).removeClass().addClass("googie_check_spelling_ok");window.setTimeout(b,1E3)}};this.resumeEditingState=function(){this.setStateChanged("resume_editing");if(this.main_controller){var a=$("<span>").text(this.lang_rsm_edt),c=this;$(this.switch_lan_pic).hide();$(this.spell_span).empty().unbind().append(a).bind("click",function(){c.resumeEditing()}).removeClass().addClass("googie_resume_editing")}try{this.edit_layer.scrollTop=
this.ta_scroll_top}catch(b){}};this.checkSpellingState=function(a){a&&this.setStateChanged("ready");this.switch_lan_pic=this.show_change_lang_pic?this.createChangeLangPic():document.createElement("span");a=this.createSpellDiv();var c=this;this.custom_spellcheck_starter?$(a).bind("click",function(b){c.custom_spellcheck_starter()}):$(a).bind("click",function(b){c.spellCheck()});if(this.main_controller)this.change_lang_pic_placement=="left"?$(this.spell_container).empty().append(this.switch_lan_pic).append(" ").append(a):
$(this.spell_container).empty().append(a).append(" ").append(this.switch_lan_pic);this.spell_span=a};this.isDefined=function(a){return a!="undefined"&&a!=null};this.errorFixed=function(){this.cnt_errors_fixed++;if(this.all_errors_fixed_observer)if(this.cnt_errors_fixed==this.cnt_errors){this.hideErrorWindow();this.all_errors_fixed_observer()}};this.errorFound=function(){this.cnt_errors++};this.createCloseButton=function(a){return this.createButton(this.lang_close,"googie_list_close",a)};this.createButton=
function(a,c,b){var d=document.createElement("tr"),e=document.createElement("td"),f;if(c){f=document.createElement("span");$(f).addClass(c).html(a)}else f=document.createTextNode(a);$(e).bind("click",b).bind("mouseover",this.item_onmouseover).bind("mouseout",this.item_onmouseout);e.appendChild(f);d.appendChild(e);return d};this.removeIndicator=function(a){window.rcmail&&rcmail.set_busy(false)};this.appendIndicator=function(a){window.rcmail&&rcmail.set_busy(true,"checking")};this.createFocusLink=function(a){var c=
document.createElement("a");$(c).attr({href:"javascript:;",name:a});return c};this.item_onmouseover=function(a){if(this.className!="googie_list_revert"&&this.className!="googie_list_close")this.className="googie_list_onhover";else this.parentNode.className="googie_list_onhover"};this.item_onmouseout=function(a){if(this.className!="googie_list_revert"&&this.className!="googie_list_close")this.className="googie_list_onout";else this.parentNode.className="googie_list_onout"}};