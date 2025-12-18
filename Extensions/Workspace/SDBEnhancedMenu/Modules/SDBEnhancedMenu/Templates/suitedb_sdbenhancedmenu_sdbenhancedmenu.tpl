{{!---- Edited for Threads ----}}

<nav class="header-menu-secondary-nav megamenu-layout">

	{{!-- <div class="header-menu-search search-link">
		<button class="header-menu-search-link" data-action="show-sitesearch" title="{{translate 'Search'}}">
			<i class="header-menu-search-icon"></i>
		</button>
	</div> --}}

	<ul class="header-menu-level1">

		{{#each categories}}
		{{#if text}}
		<li {{#if categories}}data-toggle="categories-menu" {{/if}}>
			<a class="{{class}}" {{objectToAtrributes this}}>
				{{translate text}}
			</a>
			{{#if categories}}
			<ul class="header-menu-level-container">
				<li
					class="header-menu-levels-wrapper {{#if noSubs}}no-subs{{/if}} {{#unless imageurl}}no-img{{/unless}}">

					<div class="mega-columns" {{#if columnCount}}style="--column-count: {{columnCount}};" {{/if}}>

						{{!-- Left-side columns --}}

						{{#each columns}}
						<div class="mega-col">
							{{#each this}}
							<a class="{{#if ../../preventCategoriesSplit}}lvl2 {{/if}}{{class}}" {{objectToAtrributes this}}>
								{{translate this.text}}
							</a>

							{{#if this.categories}} 
							<ul class="lvl3-list">
								{{#each this.categories}}
								<li>
									<a class="{{class}}" {{objectToAtrributes data}}>
										{{translate text}}
									</a>
								</li>
								{{/each}}
							</ul>
							{{/if}}
							{{/each}}
						</div>
						{{/each}}

						{{!-- Right-side image column --}}
						{{#if imageurl}}
						<div class="mega-col image-col">
							<img src="{{imageurl}}" alt="{{text}} Category">

							{{#if info}}
								<p class="mega-information">{{info}}
							{{#if linkname}}
							<a class="image-link" href="{{linkurl}}" target="_blank" rel="noopener noreferrer">{{linkname}}</a>
							{{/if}}

								</p>
							{{/if}}

						</div>
						{{/if}}

					</div>
				</li>
			</ul>
			{{/if}}
		</li>
		{{/if}}
		{{/each}}

	</ul>

	<div class="header-menu-search">
		<div class="header-site-search search-desktop" data-view="SiteSearch" data-type="SiteSearch"></div>
	</div>

</nav>




{{!----
Use the following context variables when customizing this template:

categories (Array)
showExtendedMenu (Boolean)
showLanguages (Boolean)
showCurrencies (Boolean)

----}}