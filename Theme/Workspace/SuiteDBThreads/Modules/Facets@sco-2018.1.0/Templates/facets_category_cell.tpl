{{!-- Edited for Threads Theme --}}

<div class="facets-category-cell">
	{{#if hasImage}}
		<div class="facets-category-cell-thumbnail">
			<a href="{{url}}" class="facets-category-cell-anchor">
                <div class="facets-category-cell-content-container">
                    <div class="facets-category-cell-image-container" style="background-image: url('{{image}}');"></div>
                    <div class="facets-category-cell-title-container">
                        <h4 class="facets-category-cell-title">
                            {{name}}
                        </h4>
                    </div>
                </div>
			</a>
		</div>
	{{else}}
        <div class="facets-category-cell-title">
            <a href="{{url}}" class="facets-category-cell-anchor">
                {{name}}
            </a>
        </div>
    {{/if}}
</div>


{{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}

