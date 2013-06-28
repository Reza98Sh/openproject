//-- copyright
// OpenProject is a project management system.
//
// Copyright (C) 2012-2013 the OpenProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// See doc/COPYRIGHT.rdoc for more details.
//++

// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery.ui.all
//= require jquery.menu_expand
//= require jquery_ujs
//= require jquery_noconflict
//= require prototype
//= require effects
//= require dragdrop
//= require controls
//= require i18n/translations
//= require select2
//= require action_menu
//= require openproject
//= require breadcrumb
//= require findDomElement
//= require context_menu
//= require jstoolbar
//= require calendar
//= require ajaxappender
//= require issues

//source: http://stackoverflow.com/questions/8120065/jquery-and-prototype-dont-work-together-with-array-prototype-reverse
if (typeof []._reverse == 'undefined') {
    jQuery.fn.reverse = Array.prototype.reverse;
} else {
    jQuery.fn.reverse = Array.prototype._reverse;
}

jQuery(document).ajaxError(function(event, request, settings) {
  if (request.status === 401 && /Reason: login needed/.match(request.getAllResponseHeaders())) {
    if (confirm(I18n.t("js.logoff") + "\r\n" + I18n.t("js.redirect_login"))) {
      location.href = openProject.loginUrl + "?back_url=" + encodeURIComponent(location.href);
    }
  }
});


function checkAll (id, checked) {
	var els = Element.descendants(id);
	for (var i = 0; i < els.length; i++) {
    if (els[i].disabled==false) {
      els[i].checked = checked;
    }
	}
}

function toggleCheckboxesBySelector(selector) {
	boxes = $$(selector);
	var all_checked = true;
	for (i = 0; i < boxes.length; i++) { if (boxes[i].checked == false) { all_checked = false; } }
	for (i = 0; i < boxes.length; i++) { boxes[i].checked = !all_checked; }
}

function setCheckboxesBySelector(checked, selector) {
  var boxes = $$(selector);
  boxes.each(function(ele) {
    ele.checked = checked;
  });
}

function showAndScrollTo(id, focus) {
	Element.show(id);
	if (focus!=null) { Form.Element.focus(focus); }
	Element.scrollTo(id);
}

function toggleRowGroup(el) {
	var tr = Element.up(el, 'tr');
	var n = Element.next(tr);
	tr.toggleClassName('open');
	while (n != undefined && !n.hasClassName('group')) {
		Element.toggle(n);
		n = Element.next(n);
	}
}

function collapseAllRowGroups(el) {
  var tbody = Element.up(el, 'tbody');
  tbody.childElements('tr').each(function(tr) {
    if (tr.hasClassName('group')) {
      tr.removeClassName('open');
    } else {
      tr.hide();
    }
  })
}

function expandAllRowGroups(el) {
  var tbody = Element.up(el, 'tbody');
  tbody.childElements('tr').each(function(tr) {
    if (tr.hasClassName('group')) {
      tr.addClassName('open');
    } else {
      tr.show();
    }
  })
}

function toggleAllRowGroups(el) {
	var tr = Element.up(el, 'tr');
  if (tr.hasClassName('open')) {
    collapseAllRowGroups(el);
  } else {
    expandAllRowGroups(el);
  }
}

function toggleFieldset(el) {
	var fieldset = Element.up(el, 'fieldset');
	fieldset.toggleClassName('collapsed');
	Effect.toggle(fieldset.down('>div'), 'slide', {duration:0.2});
}

function hideFieldset(el) {
	var fieldset = Element.up(el, 'fieldset');
	fieldset.toggleClassName('collapsed');
	fieldset.down('>div').hide();
}

var fileFieldCount = 1;

function addFileField() {
  fileFieldCount++;
  if (fileFieldCount >= 10) return false
  var clone = $('attachment_template').cloneNode(true);
  clone.writeAttribute('id', '');
  clone.innerHTML = clone.innerHTML.replace(/\[1\]/g, '['+ fileFieldCount + ']');
  $('attachments_fields').appendChild(clone);
}

function showTab(name) {
    var f = $$('div#content .tab-content');
	for(var i=0; i<f.length; i++){
		Element.hide(f[i]);
	}
    var f = $$('div.tabs a');
	for(var i=0; i<f.length; i++){
		Element.removeClassName(f[i], "selected");
	}
	Element.show('tab-content-' + name);
	Element.addClassName('tab-' + name, "selected");
        Element.insert('tab-' + name, {top: $$('div.tabs .hidden-for-sighted')[0]})
	return false;
}

function moveTabRight(el) {
	var lis = Element.up(el, 'div.tabs').down('ul').childElements();
	var tabsWidth = 0;
	var i;
	for (i=0; i<lis.length; i++) {
		if (lis[i].visible()) {
			tabsWidth += lis[i].getWidth() + 6;
		}
	}
	if (tabsWidth < Element.up(el, 'div.tabs').getWidth() - 60) {
		return;
	}
	i=0;
	while (i<lis.length && !lis[i].visible()) {
		i++;
	}
	lis[i].hide();
}

function moveTabLeft(el) {
	var lis = Element.up(el, 'div.tabs').down('ul').childElements();
	var i = 0;
	while (i<lis.length && !lis[i].visible()) {
		i++;
	}
	if (i>0) {
		lis[i-1].show();
	}
}

function displayTabsButtons() {
	var lis;
	var tabsWidth = 0;
	var i;
	$$('div.tabs').each(function(el) {
		lis = el.down('ul').childElements();
		for (i=0; i<lis.length; i++) {
			if (lis[i].visible()) {
				tabsWidth += lis[i].getWidth() + 6;
			}
		}
		if ((tabsWidth < el.getWidth() - 20) && (lis[0].visible())) {
			el.down('div.tabs-buttons').hide();
		} else {
			el.down('div.tabs-buttons').show();
		}
	});
}

function setPredecessorFieldsVisibility() {
    relationType = $('relation_relation_type');
    if (relationType && (relationType.value == "precedes" || relationType.value == "follows")) {
        Element.show('predecessor_fields');
    } else {
        Element.hide('predecessor_fields');
    }
}

function promptToRemote(text, param, url) {
    value = prompt(text + ':', '');
    if (value) {
        new Ajax.Request(url + '?' + param + '=' + encodeURIComponent(value), {asynchronous:true, evalScripts:true});
        return false;
    }
}

function collapseScmEntry(id) {
    var els = document.getElementsByClassName(id, 'browser');
	for (var i = 0; i < els.length; i++) {
	   if (els[i].hasClassName('open')) {
	       collapseScmEntry(els[i].id);
	   }
       Element.hide(els[i]);
    }
    $(id).removeClassName('open');
}

function expandScmEntry(id) {
    var els = document.getElementsByClassName(id, 'browser');
	for (var i = 0; i < els.length; i++) {
       Element.show(els[i]);
       if (els[i].hasClassName('loaded') && !els[i].hasClassName('collapsed')) {
            expandScmEntry(els[i].id);
       }
    }
    $(id).addClassName('open');
}

function scmEntryClick(id) {
    el = $(id);
    if (el.hasClassName('open')) {
        collapseScmEntry(id);
        el.addClassName('collapsed');
        return false;
    } else if (el.hasClassName('loaded')) {
        expandScmEntry(id);
        el.removeClassName('collapsed');
        return false;
    }
    if (el.hasClassName('loading')) {
        return false;
    }
    el.addClassName('loading');
    return true;
}

function scmEntryLoaded(id) {
    Element.addClassName(id, 'open');
    Element.addClassName(id, 'loaded');
    Element.removeClassName(id, 'loading');
}

function randomKey(size) {
	var chars = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
	var key = '';
	for (i = 0; i < size; i++) {
  	key += chars[Math.floor(Math.random() * chars.length)];
	}
	return key;
}

// Automatic project identifier generation
var projectIdentifierLocked;
var projectIdentifierDefault;
var projectIdentifierMaxLength;

function generateProjectIdentifier() {
  var identifier = $('project_name').getValue() // project name
  var diacriticsMap = [
      {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
      {'base':'aa','letters':/[\uA733\uA732]/g},
      {'base':'ae','letters':/[\u00E4\u00E6\u01FD\u01E3\u00C4\u00C6\u01FC\u01E2]/g},
      {'base':'ao','letters':/[\uA735\uA734]/g},
      {'base':'au','letters':/[\uA737\uA736]/g},
      {'base':'av','letters':/[\uA739\uA73B\uA738\uA73A]/g},
      {'base':'ay','letters':/[\uA73D\uA73C]/g},
      {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
      {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
      {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
      {'base':'dz','letters':/[\u01F3\u01C6\u01F1\u01C4\u01F2\u01C5]/g},
      {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
      {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
      {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
      {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
      {'base':'hv','letters':/[\u0195]/g},
      {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
      {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249\u004A\u24BF\uFF2A\u0134\u0248]/g},
      {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
      {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
      {'base':'lj','letters':/[\u01C9\u01C7\u01C8]/g},
      {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
      {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
      {'base':'nj','letters':/[\u01CC\u01CA\u01CB]/g},
      {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
      {'base':'oe','letters': /[\u00F6\u0153\u00D6\u0152]/g},
      {'base':'oi','letters':/[\u01A3\u01A2]/g},
      {'base':'ou','letters':/[\u0223\u0222]/g},
      {'base':'oo','letters':/[\uA74F\uA74E]/g},
      {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
      {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
      {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
      {'base':'s','letters':/[\u0073\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
      {'base':'ss','letters':/[\u00DF]/g},
      {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
      {'base':'tz','letters':/[\uA729\uA728]/g},
      {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
      {'base':'ue','letters':/[\u00FC\u00DC]/g},
      {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
      {'base':'vy','letters':/[\uA761\uA760]/g},
      {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
      {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
      {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
      {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g}
  ];

  for(var i=0; i<diacriticsMap.length; i++) {
    identifier = identifier.replace(diacriticsMap[i].letters, diacriticsMap[i].base);
  }
  identifier = identifier.replace(/[^a-z0-9]+/gi, '-'); // remaining non-alphanumeric => hyphen
  identifier = identifier.replace(/^[-\d]*|-*$/g, ''); // remove hyphens and numbers at beginning and hyphens at end
  identifier = identifier.toLowerCase(); // to lower
  identifier = identifier.substr(0,projectIdentifierMaxLength); // max characters
  return identifier;
}

function observeProjectName() {
  var f = function() {
    if(!projectIdentifierLocked) {
      $('project_identifier').setValue(generateProjectIdentifier());
    }
  };
  Event.observe('project_name', 'keyup', f);
}

function observeProjectIdentifier() {
  var f = function() {
    if($('project_identifier').getValue() != '' && $('project_identifier').getValue() != generateProjectIdentifier()) {
      projectIdentifierLocked = true;
    } else {
      projectIdentifierLocked = false;
    }
  };
  Event.observe('project_identifier', 'keyup', f);
}

function observeParentIssueField(url) {
  new Ajax.Autocompleter('issue_parent_issue_id',
                         'parent_issue_candidates',
                         url,
                         { minChars: 1,
                           frequency: 0.5,
                           paramName: 'q',
                           updateElement: function(value) {
                             document.getElementById('issue_parent_issue_id').value = value.id;
                           },
                           parameters: 'scope=all'
                           });
}

function observeRelatedIssueField(url) {
  new Ajax.Autocompleter('relation_issue_to_id',
                         'related_issue_candidates',
                         url,
                         { minChars: 1,
                           frequency: 0.5,
                           paramName: 'q',
                           updateElement: function(value) {
                             document.getElementById('relation_issue_to_id').value = value.id;
                           },
                           parameters: 'scope=all'
                           });
}

function setVisible(id, visible) {
  var el = $(id);
  if (el) {if (visible) {el.show();} else {el.hide();}}
}

function observeProjectModules() {
  var f = function() {
    /* Hides trackers and issues custom fields on the new project form when issue_tracking module is disabled */
    var c = ($('project_enabled_module_names_issue_tracking').checked == true);
    setVisible('project_trackers', c);
    setVisible('project_issue_custom_fields', c);
  };

  Event.observe(window, 'load', f);
  Event.observe('project_enabled_module_names_issue_tracking', 'change', f);
}

/*
 * Class used to warn user when leaving a page with unsaved textarea
 * Author: mathias.fischer@berlinonline.de
*/

var WarnLeavingUnsaved = Class.create({
	observedForms: false,
	observedElements: false,
	changedForms: false,
	message: null,

	initialize: function(message){
		this.observedForms = $$('form');
		this.observedElements =  $$('textarea');
		this.message = message;

		this.observedElements.each(this.observeChange.bind(this));
		this.observedForms.each(this.submitAction.bind(this));

		window.onbeforeunload = this.unload.bind(this);
	},

	unload: function(){
		if(this.changedForms)
      return this.message;
	},

	setChanged: function(){
    this.changedForms = true;
	},

	setUnchanged: function(){
    this.changedForms = false;
	},

	observeChange: function(element){
    element.observe('change',this.setChanged.bindAsEventListener(this));
	},

	submitAction: function(element){
    element.observe('submit',this.setUnchanged.bindAsEventListener(this));
	}
});

/*
 * 1 - registers a callback which copies the csrf token into the
 * X-CSRF-Token header with each ajax request.  Necessary to
 * work with rails applications which have fixed
 * CVE-2011-0447
 * 2 - shows and hides ajax indicator
 */
document.observe("dom:loaded", function() {
  Ajax.Responders.register({
    onCreate: function(request){
      var csrf_meta_tag = $$('meta[name=csrf-token]')[0];

      if (csrf_meta_tag) {
        var header = 'X-CSRF-Token',
        token = csrf_meta_tag.readAttribute('content');

        if (!request.options.requestHeaders) {
          request.options.requestHeaders = {};
        }
        request.options.requestHeaders[header] = token;
      }

      if ($('ajax-indicator') && Ajax.activeRequestCount > 0) {
        Element.show('ajax-indicator');
      }
    },
    onComplete: function(){
      if ($('ajax-indicator') && Ajax.activeRequestCount == 0) {
        Element.hide('ajax-indicator');
      }
      addClickEventToAllErrorMessages();
    }
  });
});

function hideOnLoad() {
  $$('.hol').each(function(el) {
  	el.hide();
	});
}

function addClickEventToAllErrorMessages() {
  $$('a.afocus').each(function(a) {
    $(a).observe('click', function(event) {
      var field;
      field = $($(a).readAttribute('href').substr(1));
      if (field == null) {
        // Cut off '_id' (necessary for select boxes)
        field = $($(a).readAttribute('href').substr(1).concat('_id'));
      }
      if (field) {
        field.down('input, textarea, select').focus();
      }
      Event.stop(event);
      return false;
    });
  });
}

function toggleEmailDecoratorFields() {
  lang = jQuery("#emails_decorators_switch").val();
  jQuery(".emails_decorators").hide();
  jQuery("#emails_decorators_" + lang).show();
}

$(document).observe('dom:loaded', function() {
  // Set focus on first error message
  var error_focus = $$('a.afocus').first();
  var input_focus = $$('.autofocus').first();
  if (error_focus != undefined) {
    error_focus.focus();
  }
  else if (input_focus != undefined){
    input_focus.focus();
    if (input_focus.tagName === "INPUT") {
      input_focus.select();
    }
  }
  // Focus on field with error
  addClickEventToAllErrorMessages();
});

Event.observe(window, 'load', hideOnLoad);

// a few constants for animations speeds, etc.
var animationRate = 100;

/* jQuery code from #263 */
// returns viewport height
jQuery.viewportHeight = function() {
     return self.innerHeight ||
        jQuery.boxModel && document.documentElement.clientHeight ||
        document.body.clientHeight;
};


/*
* 1 - registers a callback which copies the csrf token into the
* X-CSRF-Token header with each ajax request.  Necessary to
* work with rails applications which have fixed
* CVE-2011-0447
* 2 - shows and hides ajax indicator
*/
jQuery(document).ready(function($) {
  document.ajaxActive = false;
  $(document).ajaxSend(function (event, request) {
    document.ajaxActive = true;
    var csrf_meta_tag = $('meta[name=csrf-token]');

    if (csrf_meta_tag) {
      var header = 'X-CSRF-Token',
      token = csrf_meta_tag.attr('content');

      request.setRequestHeader[header] = token;
    }
  });
  // ajaxStop gets called when ALL Requests finish, so we won't need a counter as in PT
  $(document).ajaxStop(function () {
    document.ajaxActive = false;
    if ($('#ajax-indicator')) {
      $('#ajax-indicator').hide();
    }
    addClickEventToAllErrorMessages();
  });

    var propagateOpenClose = function () {
      if ($(this).is(":visible")) {
        $(this).parents('li.drop-down').trigger("opened");
      } else {
        $(this).parents('li.drop-down').trigger("closed");
      }
    };

  $.extend($.fn.select2.defaults, {
    formatNoMatches: function () {
      return I18n.t("js.select2.no_matches");
    },
    formatInputTooShort: function (input, min) {
      return I18n.t("js.select2.input_too_short", {count: min - input.length});
    },
    formatSelectionTooBig: function (limit) {
      return I18n.t("js.select2.selection_too_big", {limit: limit});
    },
    formatLoadMore: function (pageNumber) {
      return I18n.t("js.select2.load_more");
    },
    formatSearching: function () {
      return I18n.t("js.select2.searching");
    }
  });

  $('#project-search-container .select2-select').each(function (ix, select) {
    var PROJECT_JUMP_BOX_PAGE_SIZE = 50;

    select = $(select);
    var select2,
        menu = select.parents('li.drop-down'),
        that = this;

    select.select2({
        formatResult : OpenProject.Helpers.Search.formatter,
        matcher      : OpenProject.Helpers.Search.matcher,
        query        : OpenProject.Helpers.Search.projectQueryWithHierarchy(
                                    jQuery.proxy(openProject, 'fetchProjects'),
                                    PROJECT_JUMP_BOX_PAGE_SIZE),
        dropdownCssClass : "project-search-results",
        containerCssClass : "select2-select",
      }).
      on('change', function (e) {
          if (e.val) {
            window.location = select2.data().project.url;
          }
        }).
      on('close', function () {
          if (menu.is('.open')) {
            menu.slideAndFocus(that.propagateOpenClose);
          }
        });

    select2 = select.data('select2');

    // Adding an event handler to change select2's default behavior concerning
    // TAB and ESC
    select2.search.keydown(function (e) {
      switch (e.which) {
        case 9: // TAB
          closestVisible = select2.container.children(".select2-choice").closest(":visible");
          if (e.shiftKey) {
            closestVisible.previousElementInDom(":input:visible, a:visible").focus();
          } else {
            closestVisible.nextElementInDom(":input:visible, a:visible").focus();
          }
          e.stopImmediatePropagation();
          e.preventDefault();
          return false;
        case 27: // ESC
          e.stopImmediatePropagation();
          e.preventDefault();
          return false;
      }
    });
    // Moving the newly attached handler to the beginning of the handler chain
    select2.search.data('events').keydown.unshift(select2.search.data('events').keydown.pop());

    menu.bind("closed", function () {
      // Close select2 result list, when menu is closed
      select2.close();
    });

    menu.bind("opened", function () {
      // Open select2 element, when menu is opened
      select2.open();

      setTimeout(function () {
        $("#select2-drop-mask").hide();
      }, 50);

      // Include input in tab cycle by attaching keydown handlers to previous
      // and next interactive DOM element.
      select2.container.previousElementInDom(":input:visible, a:visible").keydown(function (e) {
        if (!e.shiftKey && e.which === 9) {
          select2.search.focus();
          e.preventDefault();
        }
      });

      select2.container.nextElementInDom(":input:visible:not(.select2-input), a:visible:not(.select2-input)").keydown(function (e) {
        if (e.shiftKey && e.which === 9 && select2.search.is(":visible")) {
          select2.search.focus();
          e.preventDefault();
        }
      });
    });
  });

	// file table thumbnails
	$("table a.has-thumb").hover(function() {
		$(this).removeAttr("title").toggleClass("active");

		// grab the image dimensions to position it properly
		var thumbImg = $(this).find("img");
		var thumbImgLeft = -(thumbImg.outerWidth() );
		var thumbImgTop = -(thumbImg.height() / 2 );
		thumbImg.css({top: thumbImgTop, left: thumbImgLeft}).show();

	}, function() {
		$(this).toggleClass("active").find("img").hide();
	});

	// show/hide the files table
	$(".attachments h4").click(function() {
	  $(this).toggleClass("closed").next().slideToggle(animationRate);
	});

	// custom function for sliding the main-menu. IE6 & IE7 don't handle sliding very well
	$.fn.slideAndFocus = function(callback) {
          this.toggleClass("open").find("> ul").mySlide(function() {
              // actually a simple focus should be enough.
              // The rest is only there to work around a rendering bug in webkit (as of Oct 2011) TODO: fix
              if ($("input#username-pulldown").is(":visible")) {
                var input = $("input#username-pulldown");
              } else {
                var input = $(this).find(".select2-search input");
              }
              if (input.is(":visible")) {
                input.blur();
                setTimeout(function() {
                    input.focus();
                  }, 100);
              }
              else {
                $(this).find("li > a:first").focus();
              }
              if (typeof callback === 'function') {
                callback.apply(this);
              }
            });
            return false;
          };
	// custom function for sliding the main-menu. IE6 & IE7 don't handle sliding very well
	$.fn.mySlide = function(callback) {
		if (parseInt($.browser.version, 10) < 8 && $.browser.msie) {
			// no animations, just toggle
			this.toggle();
                        if (typeof callback === 'function') {
                          callback.apply(this);
                        }
			// this forces IE to redraw the menu area, un-bollocksing things
			$("#main-menu").css({paddingBottom:5}).animate({paddingBottom:0}, 10);
		} else {
			this.slideToggle(animationRate,callback);
		}

		return this;
	};

  $.fn.onClickDropDown = function(){
    var that = this;
    $('html').click(function() {
      that.find(" > li.drop-down.open").removeClass("open").find("> ul").mySlide(propagateOpenClose);
      that.removeClass("hover");
    });

    // Do not close the login window when using it
    that.find("li li").click(function(event){
       event.stopPropagation();
    });

    // trap all mouseevents inside dropdown menu items to prevent side effects
    this.find(" > li.drop-down").bind("mousedown mouseup click", function (event) {
      event.stopPropagation();
    });

    this.find(" > li.drop-down").click(function(event) {
      // if an h2 tag follows the submenu should unfold out at the border
      var menu_start_position;
      if (that.next().get(0) != undefined && (that.next().get(0).tagName == 'H2')){
        menu_start_position = that.next().innerHeight() + that.next().position().top;
        that.find("ul.action_menu_more").css({ top: menu_start_position });
      }
      else if(that.next().hasClass("wiki-content") && that.next().children().next().first().get(0) != undefined && that.next().children().next().first().get(0).tagName == 'H1'){
        var wiki_heading = that.next().children().next().first();
        menu_start_position = wiki_heading.innerHeight() + wiki_heading.position().top;
        that.find("ul.action_menu_more").css({ top: menu_start_position });
      }

      $(this).toggleSubmenu(that);
      return false;
    });
  };

  $.fn.toggleSubmenu = function(menu){
    if (menu.find(" > li.drop-down.open").get(0) !== $(this).get(0)){
      menu.find(" > li.drop-down.open").removeClass("open").find("> ul").mySlide(propagateOpenClose);
    }

    $(this).slideAndFocus(propagateOpenClose);
    menu.toggleClass("hover");
  };


	// open and close the main-menu sub-menus
	$("#main-menu li:has(ul) > a").not("ul ul a")
		.append("<span class='toggler'></span>")
		.click(function() {

			$(this).toggleClass("open").parent().find("ul").not("ul ul ul").mySlide(propagateOpenClose);

			return false;
	});

	// submenu flyouts
	$("#main-menu li li:has(ul)").hover(function() {
		$(this).find(".profile-box").show();
		$(this).find("ul").slideDown(animationRate);
	}, function() {
		$(this).find("ul").slideUp(animationRate);
	});

	// add filter dropdown menu
	$(".button-large:has(ul) > a").click(function(event) {
		var tgt = $(event.target);

		// is this inside the title bar?
		if (tgt.parents().is(".title-bar")) {
			$(".title-bar-extras:hidden").slideDown(animationRate);
		}

		$(this).parent().find("ul").slideToggle(animationRate, propagateOpenClose);

		return false;
	});

        jQuery("#account-nav > li").hover(function() {
          if ($("#account-nav").hasClass("hover") && ($("#account-nav > li.drop-down.open").get(0) !== $(this).get(0))){
                //Close all other open menus
                //Used to work around the rendering bug  TODO: fix
                jQuery("input#username-pulldown").blur();
                $("#account-nav > li.drop-down.open").toggleClass("open").find("> ul").mySlide(function () {
                  $(this).parents("li.drop-down").trigger("closed");
                });
                $(this).slideAndFocus(function () {
                  $(this).parents("li.drop-down").trigger("opened");
                });
                return false;
            }
        },
        function(){
          return false;
          });
        $("#account-nav").onClickDropDown();

	// deal with potentially problematic super-long titles
	$(".title-bar h2").css({paddingRight: $(".title-bar-actions").outerWidth() + 15 });

	// rejigger the main-menu sub-menu functionality.
	$("#main-menu .toggler").remove(); // remove the togglers so they're inserted properly later.

$(window).resize(function() {
    // wait 200 milliseconds for no further resize event
    // then readjust breadcrumb

    if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
    }, 200);
});

$(window).bind('resizeEnd', function() {
    jQuery("div#breadcrumb ul.breadcrumb").adjustBreadcrumbToWindowSize();
});

	$("#main-menu li:has(ul) > a").not("ul ul a")
		// 1. unbind the current click functions
		.unbind("click")
		// 2. wrap each in a span that we'll use for the new click element
		.wrapInner("<span class='toggle-follow ellipsis'></span>")
		// 3. reinsert the <span class="toggler"> so that it sits outside of the above
		.append("<span class='toggler'></span>")
		// 4. attach a new click function that will follow the link if you clicked on the span itself and toggle if not
		.click(function(event) {

			if ($(event.target).hasClass("toggler") ) {
                          var menuParent = $(this).toggleClass("open").parent().find("ul").not("ul ul ul");
                          menuParent.mySlide(propagateOpenClose);
                          if ($(this).hasClass("open")) {
                            menuParent.find("li > a:first").focus();
                          }
                        return false;
                      }
		});

        // Do not close the login window when using it
        $('#nav-login-content').click(function(event){
             event.stopPropagation();
         });

        jQuery('table.cal div.issue.tooltip').each(function(){
          var div = $(this);
          div.find('a').first().focus(function(){
            div.addClass('hover');
          });
          div.find('a').first().blur(function(){
            div.removeClass('hover');
          });
        });

        // Users of some old IEs are out of luck ATM. A userData implementation
        // could be provided though, that would be great!
        var remember_menu_state;

        if (typeof window.sessionStorage !== 'undefined') {
          remember_menu_state = function (match) {
            if (typeof match === 'undefined') {
              return sessionStorage.getItem('openproject:navigation-toggle');
            } else {
              return sessionStorage.setItem('openproject:navigation-toggle',
                                            match.length > 0 ? 'collapsed' : 'expanded');
            }
          };
        }
        else {
          remember_menu_state = function (match) {
            return false;
          };
        }

        var toggle_navigation = function() {
          var height = $(document).height() - $('#main-menu').offset().top - 32;
          $('#main-menu, #menu-sidebar').toggleClass('hidden');
          $('#content').toggleClass('hidden-navigation');
          $('#toggle-project-menu').removeAttr("style").toggleClass('show');
          remember_menu_state($('#toggle-project-menu.show').css({height:height}));
        };

        // register toggler, and toggle for the first time if remembered to be closed.
        jQuery('#toggle-project-menu .navigation-toggler').click(toggle_navigation);
        if ($('#main-menu').length > 0 && remember_menu_state() === "collapsed") {
          toggle_navigation();
        }
});



var Administration = (function ($) {
  var update_default_language_options,
      init_language_selection_handling,
      toggle_default_language_select;

  update_default_language_options = function (input) {
    var default_language_select = $('#setting_default_language select'),
        default_language_select_active;

    if (input.attr('checked')) {
      default_language_select.find('option[value="' + input.val() + '"]').removeAttr('disabled');
    } else {
      default_language_select.find('option[value="' + input.val() + '"]').attr('disabled', 'disabled');
    }

    default_language_select_active = default_language_select.find('option:not([disabled="disabled"])');

    toggle_disabled_state(default_language_select_active.size() === 0);

    if (default_language_select_active.size() === 1) {
      default_language_select_active.attr('selected', true);
    } else if (default_language_select.val() === input.val() && !input.attr('checked')) {
      default_language_select_active.first().attr('selected', true);
    }
  };

  toggle_disabled_state = function (active) {
    $('#setting_default_language select').attr('disabled', active)
                                         .closest('form')
                                         .find('input:submit')
                                         .attr('disabled', active);
  };

  init_language_selection_handling = function () {
    $('#setting_available_languages input:not([checked="checked"])').each(function (index, input) {
      update_default_language_options($(input));
    });
    $('#setting_available_languages input').click(function () {
      update_default_language_options($(this));
    });
  };

  return {
    init_language_selection_handling: init_language_selection_handling
  };
}(jQuery));

var I18nForms = (function ($) {
  var event_handler,
      init,
      id_memo = {},
      memorize_ids,
      submit_preparer;

  event_handler = (function() {
    var active_locale_selectors,
        add_locale_fields,
        destroy_locale,
        init,
        observe_add_locale_link,
        observe_destroy_locale_links,
        select_first_untaken_option,
        taken_options,
        update_add_link_status,
        update_destroy_link_status,
        update_interaction_elements,
        update_locale_availability;

    active_locale_selectors = function (localized_p) {
      return localized_p.find('.locale_selector');
    };

    add_locale_fields = function (localized_p) {
      var backup = localized_p.find('.translation').first(),
          add_link = localized_p.find('.add_locale'),
          new_items = backup.clone();

      new_items.find('input, textarea').val("");
      new_items.insertBefore(add_link);

      select_first_untaken_option(new_items.find('.locale_selector'), active_locale_selectors(localized_p));
      update_interaction_elements(localized_p);

      new_items.find('.destroy_locale').click(function () {
        destroy_locale($(this));
      });
    };

    destroy_locale = function (element) {
      var localized_p = element.closest('p');

      element.closest('.translation').remove();

      update_interaction_elements(localized_p);
    };

    observe_add_locale_link = function () {
      $('.add_locale').click(function () {
        add_locale_fields($(this).closest('p'));
      });
    };

    observe_destroy_locale_links = function () {
      $('.destroy_locale').click(function () {
        destroy_locale($(this));
      });
    };

    select_first_untaken_option = function (select, others) {
      var taken,
          available;

      taken = taken_options(others);

      available = select.find('option').map(function (index, element) {
        element = $(element);

        if (taken.indexOf(element.val()) < 0) {
          return element.val();
        }
      }).get();

      select.val(available.pop());
    };

    update_add_link_status = function (localized_p) {
      var indicator_selector = active_locale_selectors(localized_p),
          taken = taken_options(indicator_selector),
          all_options,
          available,
          add_link = localized_p.find('.add_locale');

      available = indicator_selector.first().find('option').map(function (index, element) {
        element = $(element);

        if (taken.indexOf(element.val()) < 0) {
          return element.val();
        }
      }).get();

      add_link.toggle(available.size() > 0);
    };

    update_destroy_link_status = function (localized_p) {
      var active_selectors = active_locale_selectors(localized_p);

      localized_p.find('.destroy_locale').toggle(active_selectors.size() > 1);
    };

    update_interaction_elements = function (localized_p) {
      update_locale_availability(localized_p);
      update_add_link_status(localized_p);
      update_destroy_link_status(localized_p);
    };

    update_locale_availability = function (localized_p) {
      var active_selectors = active_locale_selectors(localized_p),
          active_locales = taken_options(active_selectors);

      active_selectors.each(function (index, element) {
        var selector = $(element),
            selected_value = selector.val();

        selector.find('option').each(function (index, element) {
          var option = $(element);

          option.attr('disabled', (active_locales.indexOf(option.val()) >= 0 && option.val() !== selected_value));
        });
      });
    };

    taken_options = function (select_collection) {
      return select_collection.map(function (index, element) {
        element = $(element);

        return element.val();
      }).get();
    };

    init = function () {
      observe_add_locale_link();
      observe_destroy_locale_links();

      $('form .translation').closest('p').each(function (i, element) {
        element = $(element);
        update_interaction_elements(element);
      });
    }

    return {
      init : init
    }
  })();


  memorize_ids = function (form) {
    var translations = $('.translation');

    translations.each(function (i, element) {
      var id,
          locale;
      element = $(element);

      id = element.find(".translation_id").val();
      locale = element.find(".locale_selector").val();

      if (locale !== "" && id !== "" && id_memo[locale] === undefined) {
        id_memo[locale] = id;
      }
    });
  };

  submit_preparer = (function() {
    var add_destroy_elements,
        add_empty_values_for_missing_attributes,
        collect_elements_by_locale,
        collect_translation_classes,
        element_numerator,
        prepare,
        unify_translations_across_attribute;

    add_destroy_elements = function(locale) {
      var translation,
          destroy_element,
          id_element,
          destroy_id_elements;

      translation = $('.translation').first();
      destroy_id_elements = translation.find('.destroy_flag, .translation_id').clone();
      destroy_element = translation.filter('.destroy_flag');
      id_element = translation.filter('.translation_id');

      translation.after(destroy_id_elements);

      destroy_id_elements.filter('.destroy_flag').attr('disabled', false);
      destroy_id_elements.filter('.translation_id').attr('value', id_memo[locale]);

      element_numerator.set_next_number_in_name(destroy_id_elements);
    };

    add_empty_values_for_missing_attributes = function (locale, translation_classes) {
      var new_translations = $('');

      $.each(translation_classes, function(i, translated_attribute) {
        var translations = $('.' + translated_attribute),
            locale_selectors = translations.find('.locale_selector'),
            included,
            new_translation;

        included = locale_selectors.map(function(i, element) {
          return $(element).val();
        }).get().indexOf(locale) >= 0;

        if (!included) {
          new_translation = translations.first().clone();
          new_translation.hide();
          new_translation.find('.destroy_flag').val('1')
                                               .attr('disabled', false);
          new_translation.find('input, textarea').val('');
          new_translation.find('.locale_selector').val(locale);
          new_translation.insertAfter(translations.first());

          new_translations = new_translations.add(new_translation);
        }
      });

      return new_translations;
    };

    collect_elements_by_locale = function(translations) {
      var locales = {};

      translations.each(function (i, element) {
        var locale;

        element = $(element);
        locale = element.find('.locale_selector').val();

        if (locales[locale] === undefined) {
          locales[locale] = element;
        } else {
          locales[locale] = locales[locale].add(element);
        }
      });

      return locales;
    };

    collect_translation_classes = function (translations) {
      var translation_classes = [];

      translations.each(function (i, element) {
        var translation_class;

        element = $(element);

        translation_class = /\w+_translation/.exec(element.attr('class'))[0];

        if (translation_classes.indexOf(translation_class) < 0) {
          translation_classes.push(translation_class);
        }
      });

      return translation_classes;
    };

    element_numerator = (function() {
      var init,
          num,
          number_matcher = /([\[_])(\d+)([\]\[_]{1,2}\w+\]?$)/,
          replace_number_in_name,
          set_next_number_in_name;

      init = function() {
        num = 0;
      }

      set_next_number_in_name = function(elements) {
        replace_number_in_name(elements, num);
        num += 1;
      }

      replace_number_in_name = function (element, rep_number) {
        element.each(function (index, e) {
          e = $(e);
          e.attr('name', e.attr('name').replace(number_matcher, "$1" + rep_number + "$3"));
        });
      };

      return {
        init : init,
        set_next_number_in_name : set_next_number_in_name
      };
    })();

    prepare = function (form) {
      var locales,
          translation_classes = [],
          translations = form.find('.translation');

      element_numerator.init();

      translation_classes = collect_translation_classes(translations);
      locales = collect_elements_by_locale(translations);

      $.each(locales, function(locale, elements) {
        empty_value_elements = add_empty_values_for_missing_attributes(locale, translation_classes);
        unify_translations_across_attribute(locale, elements.add(empty_value_elements), translation_classes);
      });

      $.each(id_memo, function(locale, id) {
        if (!locales.hasOwnProperty(locale)) {
          add_destroy_elements(locale);
        }
      });
    };

    unify_translations_across_attribute = function (locale, elements, translation_classes) {
      var current_id,
          i,
          to_destroy,
          to_keep;

      element_numerator.set_next_number_in_name(elements.find('select, textarea, input'));

      current_id = id_memo[locale] !== undefined ? id_memo[locale] : '';
      elements.find('.translation_id').val(current_id);

      to_destroy = elements.filter(':hidden');
      to_keep = elements.filter(':visible');

      if (to_keep.size() > 0) {
        to_destroy.find('.destroy_flag').attr('disabled', true);
        for (i = 0; i < translation_classes.size(); i += 1) {
          if (to_keep.filter("." + translation_classes[i]).size() === 0) {
            to_destroy.filter("." + translation_classes[i]).find('input[type=text], textarea').val('');
          }
        }
      }
    };

    return {
      prepare : prepare
    };
  })();

  init = function () {
    var translated_paragraph = $('form .translation').closest('p');

    if (translated_paragraph.size() > 0) {
      memorize_ids();
      event_handler.init();

      translated_paragraph.closest('form').submit(function () {
        submit_preparer.prepare($(this));
        // allow default behaviour
      });

    }
  };

  return {
    init : init
  };
}(jQuery));

jQuery(document).ready(I18nForms.init);

var SubmitConfirm = (function($) {
  var init;

  init = function(element, question) {
    element.submit(function() {
      if(!confirm(question)) {
        return false;
      }
    });
  };

  return {
    init: init
  };
})(jQuery);

var Preview = (function ($) {
  $('document').ready(function() {
      $('html').on('click','a.preview', function() {
        $.ajax({
          url: $(this).attr('href'),
          type: 'POST',
          data: $("#" + $(this).attr('id').replace(/-preview/, "")).serialize().replace('_method=put&', ''),
          success: function(data) { $('#preview').html(data);
                                    $('html, body').animate({
                                        scrollTop: $('#preview').offset().top
                                      },
                                      'slow');
                                  }
        });

        return false;
      });
    });
})(jQuery);


