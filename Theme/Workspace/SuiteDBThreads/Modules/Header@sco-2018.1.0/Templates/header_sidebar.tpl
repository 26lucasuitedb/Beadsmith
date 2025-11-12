{{!-- Edited for Threads Theme --}}

<div class="header-sidebar-wrapper">
    <div class="header-logo-wrapper">
        <div data-view="Header.SideBarLogo.View"></div>
    </div>

	<div class="header-sidebar-menu-wrapper" data-type="header-sidebar-menu">
        <div class="header-sidebar-profile-menu" data-view="Header.Profile"></div>
        
		<ul class="header-sidebar-menu">
			{{#each categories}}
				{{#if text}}
					<li>
						<a {{objectToAtrributes this}} {{#if categories}}data-action="push-menu"{{/if}} name="{{text}}">
							{{translate text}}
							{{#if categories}}<i class="header-sidebar-menu-push-icon"></i>{{/if}}
						</a>
						{{#if categories}}
							<ul>
								<li>
									<a href="#" class="header-sidebar-menu-back" data-action="pop-menu" name="back-sidebar">
										<i class="header-sidebar-menu-pop-icon"></i>
										{{translate 'Back'}}
									</a>
								</li>

								<li>
									<a {{objectToAtrributes this}}>
										{{translate 'Browse $(0)' text}}
									</a>
								</li>

								{{#each categories}}
								<li>
									<a {{objectToAtrributes this}} {{#if categories}}data-action="push-menu"{{/if}}>
									{{text}}
									{{#if categories}}<i class="header-sidebar-menu-push-icon"></i>{{/if}}
									</a>

									{{#if categories}}
									<ul>
										<li>
											<a href="#" class="header-sidebar-menu-back" data-action="pop-menu">
												<i class="header-sidebar-menu-pop-icon"></i>
												{{translate 'Back'}}
											</a>
										</li>

										<li>
											<a {{objectToAtrributes this}}>
												{{translate 'Browse $(0)' text}}
											</a>
										</li>

										{{#each categories}}
										<li>
											<a {{objectToAtrributes this}} name="{{text}}">{{text}}</a>
										</li>
										{{/each}}
									</ul>
									{{/if}}
								</li>
								{{/each}}
							</ul>
						{{/if}}
					</li>
				{{/if}}
			{{/each}}

			{{#if showExtendedMenu}}
				<li class="header-sidebar-menu-myaccount" data-view="Header.Menu.MyAccount"></li>
			{{/if}}
			<li class="header-menu-quickorder-mobile" data-view="QuickOrderHeaderLink"></li>
			<li class="header-menu-requestquote-mobile" data-view="RequestQuoteWizardHeaderLink"></li>
            <li class="header-menu-locator-mobile" data-view="StoreLocatorHeaderLink"></li>
		</ul>
	</div>

	{{#if showExtendedMenu}}
	<a class="header-sidebar-user-logout" href="#" data-touchpoint="logout" name="logout">
		<i class="header-sidebar-user-logout-icon"></i>
		{{translate 'Sign Out'}}
	</a>
	{{/if}}

	{{#if showLanguages}}
	<div data-view="Global.HostSelector"></div>
	{{/if}}
	{{#if showCurrencies}}
	<div data-view="Global.CurrencySelector"></div>
	{{/if}}

</div>



{{!----
Use the following context variables when customizing this template:

	categories (Array)
	showExtendedMenu (Boolean)
	showLanguages (Boolean)
	showCurrencies (Boolean)

----}}

