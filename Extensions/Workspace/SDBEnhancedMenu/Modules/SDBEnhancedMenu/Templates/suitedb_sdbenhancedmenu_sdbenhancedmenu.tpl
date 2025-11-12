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
				<li {{#if categories}}data-toggle="categories-menu"{{/if}}>
					<a class="{{class}}" {{objectToAtrributes this}}>
					{{translate text}}
					</a>
					{{#if categories}}
					<ul class="header-menu-level-container">
						<li class="header-menu-levels-wrapper {{#if noSubs}}no-subs{{/if}} {{#unless imageurl}}no-img{{/unless}}" {{#if columnCount}}style="--column-count: {{columnCount}};"{{/if}}>
						{{!-- <li> --}}
							<ul class="header-menu-level2">
								{{#each categories}}
								{{!-- <li {{#if categories}}class="sub-categories-menu" data-toggle="sub-categories-menu"{{/if}}> --}}
								<li {{#if categories}}class="categories-menu-arrow"{{/if}}>
									<a class="{{class}}{{#if categories}} categories-menu-arrow{{/if}}" {{objectToAtrributes this}}>{{translate text}}</a>

									{{#if categories}}
									<ul class="header-menu-level3">
										{{#each categories}}
										<li>
											<a class="{{class}}" {{objectToAtrributes this}}>{{translate text}}</a>
										</li>
										{{/each}}
									</ul>
									{{/if}}

								</li>
								{{/each}}

								{{!-- {{#unless noSubs}}
								<div class="header-menu-level3 navigation-info-holder is-open">
									<p class="navigation-info">{{translate 'Hover over a category to display subcategories'}}</p>
								</div>
								{{/unless}} --}}
							</ul>
						</li>

						{{#if imageurl}}
							<div class="megamenu-image-wrapper">
							<img src="{{imageurl}}" alt="{{text}} Category">
							</div>
						{{/if}}
					
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

