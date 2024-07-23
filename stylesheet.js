class StyleSheetWrapper {
    constructor() {
      this.stylesheets = Array.from(document.styleSheets);
      this.rules = this.loadAllRules();
    }
  
    // Method to load all rules from all stylesheets
    loadAllRules() {
      let allRules = [];
      this.stylesheets.forEach((sheet, sheetIndex) => {
        try {
          const rules = Array.from(sheet.cssRules);
          rules.forEach((rule, ruleIndex) => {
            if (rule.style) {
                var obj={},array=rule.cssText.split(/\{|\}/)[1]
                    .split(/[\;\ ]?[\;\ ]?([a-z\-]+)\:/).slice(1);
                    while(array.length)obj[array.shift().trim()]=array.shift().trim();
              allRules.push({
                sheetIndex,
                ruleIndex,
                selectorText: rule.selectorText,
                cssText: rule.cssText,
                css: obj,
                style: rule.style
              });
            }
          });
        } catch (e) {
          console.warn("Failed to access stylesheet:", e);
        }
      });
  
      return allRules;
    }
    getRuleApplicableElements(selector) {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(element => {
        let path = [];
        let currentElement = element;
        while (currentElement && currentElement !== document.body) {
            let index = Array.from(currentElement.parentNode.children).indexOf(currentElement);
            path.unshift(index);
            currentElement = currentElement.parentNode;
        }
        return {
            element: element,
            path: path
        };
        });
    }
    collectAllVariables() {
        let variables = [];
        this.rules.forEach(rule => {
          for (let i = 0; i < rule.style.length; i++) {
            const property = rule.style[i];
            if (property.startsWith('--')) {
              variables.push({
                selectorText: rule.selectorText,
                variable: property,
                value: rule.style.getPropertyValue(property)
              });
            }
          }
        });
        return variables;
    }
    collectRefs() {
        let variables = [];
        this.rules.forEach(rule => {
          for (let i = 0; i < rule.style.length; i++) {
            const property = rule.style[i];
            if (property.test(/var\(\ ?\-/)) {
              variables.push({
                selectorText: rule.selectorText,
                variable: property,
                value: rule.style.getPropertyValue(property)
              });
            }
          }
        });
        return variables;
    }
    // Method to select rules by selector
    
    getRulesBySelector(selector) {
      return this.rules.filter(rule => rule.selectorText === selector);
    }
    getMediaQueryRules(screenWidth) {
        let matchingRules = [];
        this.stylesheets.forEach((sheet, sheetIndex) => {
          try {
            const rules = Array.from(sheet.cssRules);
            rules.forEach((rule, ruleIndex) => {
              if (rule instanceof CSSMediaRule) {
                const media = rule.media;
                if (media.mediaText.includes('min-width') || media.mediaText.includes('max-width')) {
                  let minWidthMatch = media.mediaText.match(/min-width:\s*(\d+)px/);
                  let maxWidthMatch = media.mediaText.match(/max-width:\s*(\d+)px/);
                  let minWidth = minWidthMatch ? parseInt(minWidthMatch[1]) : 0;
                  let maxWidth = maxWidthMatch ? parseInt(maxWidthMatch[1]) : Infinity;
      
                  if (screenWidth >= minWidth && screenWidth <= maxWidth) {
                    matchingRules.push({
                      sheetIndex,
                      ruleIndex,
                      mediaText: media.mediaText,
                      cssText: rule.cssText,
                      rules: rule.cssRules
                    });
                  }
                }
              }
            });
          } catch (e) {
            console.warn("Failed to access stylesheet:", e);
          }
        });
      
        return matchingRules;
      }
    // Method to update a rule by selector
    updateRule(selector, newStyles) {
      const rulesToUpdate = this.getRulesBySelector(selector);
  
      rulesToUpdate.forEach(rule => {
        const sheet = this.stylesheets[rule.sheetIndex];
        const cssRule = sheet.cssRules[rule.ruleIndex];
  
        if (typeof newStyles === 'string') {
          cssRule.cssText = `${selector} { ${newStyles} }`;
        } else if (typeof newStyles === 'object') {
          Object.keys(newStyles).forEach(property => {
            cssRule.style[property] = newStyles[property];
          });
        }
  
        // Update the rule in our internal representation
        rule.cssText = cssRule.cssText;
        rule.style = cssRule.style;
      });
    }
  
    // Method to reload all rules (useful after updates)
    reloadRules() {
      this.rules = this.loadAllRules();
    }
  
    // Method to query rules by property
    getRulesByProperty(property) {
      return this.rules.filter(rule => rule.style[property]);
    }
  }
  function cssO(){
    return new StyleSheetWrapper();
  }