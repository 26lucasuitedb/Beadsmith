{{!-- Edited for Threads Theme --}}

<div class="home">
	<div data-cms-area="home_cms_area_1" data-cms-area-filters="path"></div>

	<div class="home-slider-container">
		<div class="home-image-slider">
			<ul data-slider id="home-image-slider-list" class="home-image-slider-list">
                {{#if extraHomeViewContext.isReady}}
                    {{#if extraHomeViewContext.showCarousel}}
                        {{#each extraHomeViewContext.carousel}}
                            <li class="{{#if text}}caption-on{{/if}} {{#if title}}caption-on{{/if}} {{#if linktext}}caption-on{{/if}}">
                                <div class="home-slide-main-container home-slide-main-container-{{@index}}">

                                    {{#if isAbsoluteUrl}}
                                    <div class="home-slide-image-container use-image" style="background-image:url('{{image}}');">
																		<a{{objectToAtrributes item}} class="home-slide-wrap-link">
																			<img src="{{image}}" class="home-slide-image" />
																		</a>
                                    </div>
                                    {{else}}
                                    <div class="home-slide-image-container
																		{{#if imageBehaviour}}
																			use-image
																		{{else}}
																			{{#if backgroundCrop}}
																					{{backgroundCrop}}
																			{{/if}}
																		{{/if}}" style="background-image:url('{{getThemeAssetsPathWithDefault image 'img/threads-carousel-home-1.jpg'}}');">
																				<a{{objectToAtrributes item}} class="home-slide-wrap-link">
																					<img src="
					                                    {{#if isAbsoluteUrl}}
					                                        {{image}}
					                                    {{else}}
					                                        {{getThemeAssetsPathWithDefault image 'img/threads-carousel-home-1.jpg'}}
					                                    {{/if}}"
					                                    class="home-slide-image {{#if imageMobile}}hide-small{{/if}}" />
																					{{#if imageMobile}}
																						<img src="{{imageMobile}}" class="home-slide-image-mobile" />
																					{{/if}}
																				</a>
                                    </div>
                                    {{/if}}

                                    <div class="home-slide-caption-container home-slide-caption-container-{{@index}} {{#if class}}{{class}}{{else}}carousel-left{{/if}} {{#if isAbsoluteUrl}}carousel-center-box{{/if}} {{#if text}}caption-display{{/if}} {{#if title}}caption-display{{/if}} {{#if linktext}}caption-display{{/if}}">
                                        <div class="home-slide-caption home-slide-caption-{{@index}} {{captionTextAlign}}">
																					{{#if title}}<h2 class="home-slide-caption-title" style="color:{{captionColor}}">{{title}}</h2>{{/if}}
																					{{#if text}}<p style="color:{{captionColor}}">{{{text}}}</p>{{/if}}

																					{{#if linktext}}
																						<div class="home-slide-caption-button-container">
																								<a href="{{href}}" class="home-slide-caption-button">{{linktext}}</a>
																						</div>
																					{{/if}}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        {{/each}}
                    {{else}}
                    <li>
                        <div class="home-slide-main-container home-slide-main-container-0">
                            <div class="home-slide-image-container" style="background-image:url('{{getThemeAssetsPath 'img/threads-carousel-home-1.jpg'}}');">
                                <img src="{{getThemeAssetsPath 'img/threads-carousel-home-1.jpg'}}" alt="" />
                            </div>

                            <div class="home-slide-caption-container home-slide-caption-container-0 carousel-left">
                                <div class="home-slide-caption home-slide-caption-0">
                                    <h1 class="home-slide-caption-title">Denim is in</h1>
                                    <p>It's official, our stylists said so.</p>
                                    <div class="home-slide-caption-button-container">
                                        <a href="/search" class="home-slide-caption-button">Shop Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="home-slide-main-container home-slide-main-container-1">
                            <div class="home-slide-image-container" style="background-image:url('{{getThemeAssetsPath 'img/threads-carousel-home-2.jpg'}}');">
                                <img src="{{getThemeAssetsPath 'img/threads-carousel-home-2.jpg'}}" alt="" />
                            </div>

                            <div class="home-slide-caption-container home-slide-caption-container-1 carousel-left">
                                <div class="home-slide-caption home-slide-caption-1">
                                    <h1 class="home-slide-caption-title">Summer vibing</h1>
                                    <p>This summer's looks, all for you.</p>
                                    <div class="home-slide-caption-button-container">
                                        <a href="/search" class="home-slide-caption-button">Shop Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="home-slide-main-container home-slide-main-container-2">
                            <div class="home-slide-image-container" style="background-image:url('{{getThemeAssetsPath 'img/threads-carousel-home-3.jpg'}}');">
                                <img src="{{getThemeAssetsPath 'img/threads-carousel-home-3.jpg'}}" alt="" />
                            </div>

                            <div class="home-slide-caption-container home-slide-caption-container-2 carousel-left">
                                <div class="home-slide-caption home-slide-caption-2">
                                    <h1 class="home-slide-caption-title">Find your fit</h1>
                                    <p>One size does not fit all, and we know it.</p>
                                    <div class="home-slide-caption-button-container">
                                        <a href="/search" class="home-slide-caption-button">Shop Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    {{/if}}
                {{/if}}
			</ul>
		</div>
	</div>

    <div data-cms-area="home_cms_area_2" data-cms-area-filters="path"></div>

    {{#if extraHomeViewContext.infoblock}}
    <div class="home-infoblock-container">
        <ul class="home-infoblock-list">
        {{#each extraHomeViewContext.infoblock}}
            <li class="home-infoblock-list-item home-infoblock-list-item{{@index}}">
                <a href="{{href}}" class="home-infoblock-cell-link">
                    <div class="home-infoblock-cell home-infoblock-cell{{@index}}">
                        <div class="home-infoblock-cell-image home-infoblock-cell-image{{@index}}" style="{{#if image}} background-image: url('{{image}}');{{/if}} {{#if color}} background-color: {{color}}; {{else}}background-color:#DADBDA;{{/if}}"></div>
                        <div class="home-infoblock-content-container">
                            <div class="home-infoblock-content">
                                {{#if title}}
                                <h4 class="home-infoblock-title">{{title}}</h4>
                                {{/if}}
                                {{#if text}}
                                <p class="home-infoblock-text">{{text}}</p>
                                {{/if}}
                            </div>
                        </div>
                    </div>
                </a>
            </li>
        {{/each}}
        </ul>
    </div>
    {{/if}}


    <div class="home-freetext-container">
        {{#if extraHomeViewContext.freeTextTitle}}
            <h2 class="home-freetext-title">{{extraHomeViewContext.freeTextTitle}}</h2>
        {{/if}}
        {{#if extraHomeViewContext.freeTextSubtitle}}
            <h3 class="home-freetext-subtitle">{{extraHomeViewContext.freeTextSubtitle}}</h3>
        {{/if}}
        <hr class="home-freetext-divider" />
        {{#if extraHomeViewContext.freeTextText}}
            <div class="home-freetext-text">{{{extraHomeViewContext.freeTextText}}}</div>
        {{/if}}
        {{#if extraHomeViewContext.freeTextBtnHref}}
            <a href="{{extraHomeViewContext.freeTextBtnHref}}" class="home-freetext-link">
                {{extraHomeViewContext.freeTextBtnText}}
            </a>
        {{/if}}
    </div>

    <div data-cms-area="home_cms_area_3" data-cms-area-filters="path"></div>

	<div class="home-merchandizing-zone">
		<div data-id="your-merchandising-zone" data-type="merchandising-zone"></div>
	</div>

    <div data-cms-area="home_cms_area_4" data-cms-area-filters="path"></div>
</div>

{{!----
Use the following context variables when customizing this template:

	imageHomeSize (String)
	imageHomeSizeBottom (String)
	carouselImages (Array)
	bottomBannerImages (Array)

----}}

