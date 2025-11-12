{{!-- Edited for Threads Theme --}}

<div data-view="Global.BackToTop"></div>
<div class="footer-content">

	<div id="banner-footer" class="content-banner banner-footer" data-cms-area="global_banner_footer" data-cms-area-filters="global"></div>

    <section class="footer-content-upper-section-container">
        <div class="footer-content-upper-section">
          {{#if extraFooterViewContext.showLegacyNewsletter}}
            {{#if extraFooterViewContext.title}}
              <h5 class="footer-content-upper-section-title">{{extraFooterViewContext.title}}</h5>
            {{/if}}
            <div data-view="FooterContent" class="footer-content-newsletter-container"></div>
          {{else}}
            <div class="newsletter-cct-area" data-cms-area="newsletter-cct-area" data-cms-area-filters="global"></div>
          {{/if}}
        </div>
    </section>

    <section class="footer-content-middle-section-container">
        <div class="footer-content-middle-section">
            {{#if extraFooterViewContext.socialMediaLinks}}
                <div class="footer-content-social">
                    <div class="footer-logo-view-container" data-view="Footer.Logo.View"></div>
                    <ul class="footer-content-social-list">
                    {{#if extraFooterViewContext.socialMediaLinksTitle}}<li class="footer-content-social-media-links-title">{{extraFooterViewContext.socialMediaLinksTitle}}</li>{{/if}}
                    {{#each extraFooterViewContext.socialMediaLinks}}
                        <li><a {{objectToAtrributes item}} data-hashtag="{{datahashtag}}" data-touchpoint="{{datatouchpoint}}" data-target="{{datatarget}}" class="footer-content-social-link" target="_blank">{{#if icon}}<i class="footer-content-social-icon icon-{{icon}}"></i>{{else}}{{text}}{{/if}}</a></li>
                    {{/each}}
                    </ul>
                </div>
	        {{/if}}

            <div class="footer-columns">
                {{!----
                    Because this issue: 628879 SCS/SCA Themes > Footer > Column assignment is not being followed
                    We're moving the column wrapper outside from condition because, from a cost/time/benefits balance 
                    perspective, is the cheaper one (footer uses display grid and some calcs to ...)
                ----}}
                <div class="footer-column-links">
                {{#if extraFooterViewContext.col1Links}}
                    <ul>
                    {{#each extraFooterViewContext.col1Links}}
                    {{#if href}}
                        <li class="footer-column-link-listitem"><a class="footer-column-link" {{objectToAtrributes item}} data-hashtag="{{datahashtag}}" data-touchpoint="{{datatouchpoint}}" data-target="{{datatarget}}" {{#if datatarget includeZero=true}}target="_blank"{{/if}}>{{text}}</a></li>
                    {{else}}
                        <li class="footer-column-heading-listitem"><h4 class="footer-column-heading">{{text}}</h4></li>
                    {{/if}}
                    {{/each}}
                    </ul>
                {{/if}}
                </div>
                
                <div class="footer-column-links">
                {{#if extraFooterViewContext.col2Links}}
                    <ul>
                    {{#each extraFooterViewContext.col2Links}}
                    {{#if href}}
                        <li class="footer-column-link-listitem"><a class="footer-column-link" {{objectToAtrributes item}} data-hashtag="{{datahashtag}}" data-touchpoint="{{datatouchpoint}}" data-target="{{datatarget}}" {{#if datatarget includeZero=true}}target="_blank"{{/if}}>{{text}}</a></li>
                    {{else}}
                        <li class="footer-column-heading-listitem"><h4 class="footer-column-heading">{{text}}</h4></li>
                    {{/if}}
                    {{/each}}
                    </ul>
                {{/if}}
                </div>

                <div class="footer-column-links">
                {{#if extraFooterViewContext.col3Links}}
                    <ul>
                    {{#each extraFooterViewContext.col3Links}}
                    {{#if href}}
                        <li class="footer-column-link-listitem"><a class="footer-column-link" {{objectToAtrributes item}} data-hashtag="{{datahashtag}}" data-touchpoint="{{datatouchpoint}}" data-target="{{datatarget}}" {{#if datatarget includeZero=true}}target="_blank"{{/if}}>{{text}}</a></li>
                    {{else}}
                        <li class="footer-column-heading-listitem"><h4 class="footer-column-heading">{{text}}</h4></li>
                    {{/if}}
                    {{/each}}
                    </ul>
                {{/if}}
                </div>

                <div class="footer-column-links">
                {{#if extraFooterViewContext.col4Links}}
                    <ul>
                    {{#each extraFooterViewContext.col4Links}}
                    {{#if href}}
                        <li class="footer-column-link-listitem"><a class="footer-column-link" {{objectToAtrributes item}} data-hashtag="{{datahashtag}}" data-touchpoint="{{datatouchpoint}}" data-target="{{datatarget}}" {{#if datatarget includeZero=true}}target="_blank"{{/if}}>{{text}}</a></li>
                    {{else}}
                        <li class="footer-column-heading-listitem"><h4 class="footer-column-heading">{{text}}</h4></li>
                    {{/if}}
                    {{/each}}
                    </ul>
                {{/if}}
                </div>
            </div>
        </div>
    </section>

    {{#with extraFooterViewContext.copyright}}
    {{#unless hide}}
        <section class="footer-content-bottom-section-container">
            <div class="footer-content-bottom-section">
                <div class="footer-content-copyright">
                    {{#if showRange}}
                        {{translate '&copy; $(0) &#8211; $(1) $(2)' initialYear currentYear companyName}}
                        <!-- an en dash &#8211; is used to indicate a range of values -->
                    {{else}}
                        {{translate '&copy; $(0) $(1)' currentYear companyName}}
                    {{/if}}
                </div>
            </div>
        </section>
    {{/unless}}
    {{/with}}
</div>



{{!----
Use the following context variables when customizing this template:

	showFooterNavigationLinks (Boolean)
	footerNavigationLinks (Array)

----}}

