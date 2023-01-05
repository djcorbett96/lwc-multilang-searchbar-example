import { LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

import searchbarcss from '@salesforce/resourceUrl/searchbarcss';
import searchtemplates from '@salesforce/resourceUrl/searchtemplates';
import lastsearch from '@salesforce/resourceUrl/lastsearch';
import currentLanguage from '@salesforce/i18n/lang';

// map salesforce locales to Yext locales since they can differ
const localeMappingsSalesforceToYext = {
  "en-US": "en",
  "es": "es"
}

// map necessary variables for each locale, e.g., the experience key and the desired placeholder text
const languageMappings = {
  "en": {
    "experienceKey": "english-experience-key",
    "placeholder": "Search..."
  },
  "es": {
    "experienceKey": "spanish-experience-key",
    "placeholder": "Buscar..."
  },
}

export default class Searchbar extends LightningElement {
    connectedCallback() {
        const locale = localeMappingsSalesforceToYext[currentLanguage];
      
        const html = "<div class='search_form'></div>"
        this.template.innerHTML = html;
        Promise.all([
            loadScript(this, searchtemplates),
            loadScript(this, lastsearch),
            loadStyle(this, searchbarcss)
        ]).then(() => {
            // run the normal searchbar integration code snippet when the necessary scripts load, but reference the locale and language mappings to decide which language version to render
            ANSWERS.init({
                apiKey: "API_KEY",
                experienceKey: languageMappings[locale].experienceKey,
                experienceVersion: "PRODUCTION",
                locale: locale, // e.g. en
                businessId: "BUSINESS_ID",
                templateBundle: TemplateBundle.default,
                onReady: function() {
                  ANSWERS.addComponent("SearchBar", {
                    container: ".search_form",
                    name: "search-bar", //Must be unique for every search bar on the same page
                    redirectUrl: "https://example.my.site.com/s/global-search/query", //set this to the URL of the search results page you create
                    placeholderText: languageMappings[locale].placeholder,
                  });
                },
              });
        });
    }
}