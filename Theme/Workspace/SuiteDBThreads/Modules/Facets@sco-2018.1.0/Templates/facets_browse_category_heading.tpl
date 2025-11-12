{{!-- Edited for Threads Theme --}}

<section class="facets-browse-category-heading-list-header {{#if hasBanner}}facets-browse-category-heading-list-header-with-image{{/if}}">
	<div class="facets-browse-category-heading">
		<h1>{{pageheading}}</h1>
	</div>

	{{#if hasBanner}}
		<div class="facets-browse-category-heading-main-image" style="background-image:url('{{banner}}');">
			<img src="{{resizeImage banner 'categorybanner'}}" alt="{{pageheading}}" />
		</div>
	{{/if}}

    {{#if showDescription}}
    <div class="facets-browse-category-heading-main-description">
        <p>{{{description}}}</p>
    </div>
    {{/if}}
</section>




{{!----
Use the following context variables when customizing this template:

	name (String)
	banner (String)
	description (String)
	pageheading (String)
	hasBanner (Boolean)
	showDescription (Boolean)

----}}

