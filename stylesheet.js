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
              allRules.push({
                sheetIndex,
                ruleIndex,
                selectorText: rule.selectorText,
                cssText: rule.cssText,
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
    // Method to find all CSS rules that use a CSS variable
    findRulesUsingVariable(variableName) {
        let variableRules = [];
        this.rules.forEach(rule => {
        // Check if the rule's CSS text contains the variable
        if (rule.cssText.includes(`var(${variableName}`)) {
            variableRules.push(rule);
        }
        });
        return variableRules;
    }
    // Method to select rules by selector
    getRulesBySelector(selector) {
      return this.rules.filter(rule => rule.selectorText === selector);
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
  // Example usage
  // const styleWrapper = new StyleSheetWrapper();
  
  // Get all rules with a specific selector
  // const rules = styleWrapper.getRulesBySelector('.my-class');
  // console.log(rules);
  
  // Update a rule with new styles
  // styleWrapper.updateRule('.my-class', { backgroundColor: 'blue', color: 'white' });
  // Or update using a string
  // styleWrapper.updateRule('.my-class', 'background-color: green; color: yellow;');
  
  // Get all rules where 'background' property is set
  // const backgroundRules = styleWrapper.getRulesByProperty('background');
  // console.log(backgroundRules);
  
  // Reload rules if needed
  // styleWrapper.reloadRules();

