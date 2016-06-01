var fs = require('fs');
var _ = require('underscore');

var supportedLangages = ["en", "fr", "cs", "da", "de", "el", "es-es", "fi", "hu", "id", "it", "ja", "ko", "nl", "no", "pl", "pt-br", "ru", "sv", "th", "tr", "zh-cn", "zh-tw"];

module.exports.validate = function(from) {
  var jsonObj = JSON.parse(fs.readFileSync(from));

  validateMissingLanguages(jsonObj);
  validateNumberOfVariables(jsonObj);
  validateTags(jsonObj, "sn");
  validateTags(jsonObj, "pl");
  validateEmptyTags(jsonObj, "sn");
  validateEmptyTags(jsonObj, "pl");
} 

function validateMissingLanguages(jsonObj) {
  _.each(_.keys(jsonObj), function(key) {
    _.each(_.keys(supportedLangages), function(lang) {
      if(jsonObj[key][supportedLangages[lang]] == undefined || jsonObj[key][supportedLangages[lang]] == "")
        console.log("WARNING: Key:" + key + " Lang:" + supportedLangages[lang] + " Translation is missing");
    });
  });
}

function extractPlaceholders(str) {
  return _.sortBy(str.match(/{[0-9]*}/g), function (name) {return name});
}

function validateNumberOfVariables (jsonObj) {
  _.each(_.keys(jsonObj), function(key) {
    var baseLangPlaceholders = extractPlaceholders(jsonObj[key].en);

    _.each(_.keys(jsonObj[key]), function(langKey) {
      var placeholders = extractPlaceholders(jsonObj[key][langKey]);

      if(_.uniq(_.intersection(placeholders, baseLangPlaceholders)).toString() != _.uniq(baseLangPlaceholders).toString() || 
        _.uniq(_.intersection(placeholders, baseLangPlaceholders)).toString() != _.uniq(placeholders).toString()) {
        console.log("ERROR: Key:" + key + " Lang:" + langKey + " The number of placeholder ids does not match");
      }
      else if(placeholders.length != baseLangPlaceholders.length) {
        console.log("WARNING: Key:" + key + " Lang:" + langKey + " The number of placeholder tags does not match");
      }
    });
  });
}

function validateTags(jsonObj, tag) {
  var reg = new RegExp("<" + tag + ">[^<]*</" + tag + ">", "g");

    _.each(_.keys(jsonObj), function(key) {
      _.each(_.keys(jsonObj[key]), function(langKey) {
        // Validate that there's the same number of tags
        if (jsonObj[key][langKey].split("<" + tag + ">").length == jsonObj[key][langKey].split("</" + tag + ">").length) {
          if (jsonObj[key][langKey].split("<" + tag + ">").length != 1) {
            //Validate that each tag is well formed
            var match = jsonObj[key][langKey].match(reg);
            if (match == undefined || match.length != jsonObj[key][langKey].split("<" + tag + ">").length - 1) {
              console.log("ERROR: Key:" + key + " Lang:" + langKey + " Tags <" + tag + "></" + tag + "> does not match");
            }
          }
        } else {
          console.log("ERROR: Key:" + key + " Lang:" + langKey + " Number of <" + tag + "></" + tag + "> tags does not match");
        }
      });
    });
  }

  function validateEmptyTags(jsonObj, tag) {
    var reg = new RegExp("<" + tag + "></" + tag + ">", "g", "i");

    _.each(_.keys(jsonObj), function(key) {
      _.each(_.keys(jsonObj[key]), function(langKey) {
        if(jsonObj[key][langKey].match(reg) != null) {
          console.log("ERROR: Key:" + key + " Lang:" + langKey + " Empty <" + tag + "></" + tag + "> tag");
        } 
      });
    });
  }

  function validateKeywords(jsonObj) {
    var keywords = ["Coveo", "Outlook"];

    _.each(_.keys(jsonObj), function(key) {
      _.each(_.keys(keywords), function(keyword) {
        if(jsonObj[key].en.split(keywords[keyword]).length != 1) {
          _.each(_.keys(jsonObj[key]), function(langKey) {
            if(jsonObj[key][langKey].split(keywords[keyword]).length == 1) {
              console.log("ERROR: Key:" + key + " Lang:" + langKey + " Does not contain keyword " + keywords[keyword]);
            }
          });
        }
      });
    });
  }