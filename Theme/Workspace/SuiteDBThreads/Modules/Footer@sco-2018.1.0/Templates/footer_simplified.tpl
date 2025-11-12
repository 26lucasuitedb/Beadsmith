{{!-- Edited for Threads Theme --}}

<div data-view="Global.BackToTop"></div>
<div class="footer-content">
	<div id="banner-footer" class="content-banner banner-footer" data-cms-area="simplified_footer_banner" data-cms-area-filters="global"></div>

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
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}

