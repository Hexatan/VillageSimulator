;(function($) {

	$.wng = function(options) {

		var defaults = {
			'sound'	: 'random',
			'size'	: 'random',
			'leet'	: 0
		};

        var plugin = this;
		plugin.settings = {};
		
		var vowels = ['a','e','i','o','u','y'];
		var consonants = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','z'];
		
		var vowelCombos = ['a','ai','ae','e','ea','ee','ey','i','ia','ie','o','oo','ou','u','y','ye'];
		
		var vowelsStart = ['a','e','i','o','u'];
		var consonantsHardStart = ['B','Bl','Br','Cr','D','Dr','G','Gr','K','Kr','P','Pr','Sp','St','T','Tr'];
		var consonantsSoftStart = ['C','Ch','F','H','J','L','M','N','Ph','Qu','R','S','Sh','Sm','Sn','Th','V','W','X','Y','Z'];
		
		var consonantsHardMid = consonantsHardStart.slice(0).concat(['hm','mbl','rb','rbl']);
		var consonantsSoftMid = consonantsSoftStart.slice(0).concat(['sm','sn','sr']);
		
		var consonantsHardEnd = ['b','c','ck','d','g','k','nd','p','rt','sp','st','t'];
		var consonantsSoftEnd = ['f','h','j','l','m','n','r','rs','s','th','v','w','x','y','z'];

		var init = function() {
			plugin.settings = $.extend({}, defaults, options);
		};

		plugin.generate = function(options) {
			var isConst = true;
			var isHard = true;
			
			if (plugin.settings.sound == "random") {
				isConst = randRange(0, 1);
				isHard = (randRange(0, 1)) ? true : false;
			} else if (plugin.settings.sound == "soft") {
				isHard = false;
				isConst = false;
			}
			
			var weirdName = [];

			var part = "";
			
			if (isConst) {
				if (isHard) {
					weirdName.push(validCombo(weirdName, consonantsHardStart));
				} else {
					weirdName.push(validCombo(weirdName, consonantsSoftStart));
				}
			} else {
				weirdName.push(validCombo(weirdName, vowelsStart).toUpperCase());
			}
			
			var isValid = true;

            if(plugin.settings.size == "random"){
                plugin.settings.size = randRange(3,6);
            }
				
			for (var i = 0; i < plugin.settings.size - 2; i++) {
				isConst = (isConst == false);
				
				if (plugin.settings.sound == "random") {
					isHard = (isHard == false);
				}
				
				if (isConst) {
					if (isHard) {
						part = validCombo(weirdName, consonantsHardMid).toLowerCase();
					} else {
						part = validCombo(weirdName, consonantsSoftMid).toLowerCase();
					}
				} else {
					if (randRange(0,3) == 0) {
						part = validCombo(weirdName, vowelCombos);
					} else {
						part = validCombo(weirdName, vowels);
					}
				}
				
				weirdName.push(part);
			}
			
			isConst = (isConst == false);
			
			if (isConst) {
				if (isHard) {
					weirdName.push(validCombo(weirdName, consonantsHardEnd));
				} else {
					weirdName.push(validCombo(weirdName, consonantsSoftEnd));
				}
				
				if (randRange(0, 2) == 0) {
					weirdName.push(validCombo(weirdName, vowels));
				}
			} else {
				weirdName.push(validCombo(weirdName, vowels));
				
				if (randRange(0, 2) == 0) {
					weirdName.push(validCombo(weirdName, consonants));
				}
			}

			if (plugin.settings.leet) {
				return this.leet(weirdName.join(""), plugin.settings.leet);
			} else {
				return weirdName.join("");
			}
		};

		var validCombo = function( name, parts ) {
			var validPart;
			var isValid = true;
			
			do {
				validPart = parts[randRange(0, parts.length - 1)];
			
				switch((name[name.length - 1] + validPart).toLowerCase()) {
					case "yy":
					case "quu":
					case "quy":
					case "cie":
                    case "chr":
					isValid = false;
					break;
					
					default :
					isValid = true;
					break;
				}
				
				// Too many y's are a bad thing...
				if (isValid && validPart.indexOf("y") > -1 && randRange(0, 2) == 1) {
					isValid = false;
				}
			
			} while(!isValid)
			
			return validPart;
		};
		
		var randRange = function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		init();

	};

})(jQuery);
