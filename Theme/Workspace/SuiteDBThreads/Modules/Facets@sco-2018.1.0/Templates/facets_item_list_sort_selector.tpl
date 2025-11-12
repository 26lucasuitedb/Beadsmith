{{!-- Edited for Threads Theme --}}

<div class="facets-item-list-sort-selector-dropdown-wrapper">
    <div class="facets-item-list-show-selector-label">
        {{translate 'Sort by'}}
    </div>
    <div class="facets-item-list-sort-selector-dropdown-container">
        <button class="dropdown-toggle facets-item-list-sort-selector" type="button" id="facets-item-list-sort-selector-dropdown" data-toggle="dropdown" aria-expanded="true"
            data-type="navigator">
            {{#each options}} {{#if isSelected}} {{name}} {{/if}} {{/each}}
            <span class="caret"></span>
        </button>
        <ul class="facets-item-list-sort-selector-dropdown-menu" role="menu" aria-labelledby="facets-item-list-sort-selector-dropdown">
            {{#each options}}
            <li role="presentation" class="{{#if isSelected}}active{{/if}}">
                <a role="menuitem" tabindex="-1" href="{{configOptionUrl}}" class="{{className}} {{#if isSelected}}active{{/if}}" {{#if isSelected}} selected="" {{/if}}>{{name}}</a>
            </li>
            {{/each}}
        </ul>
    </div>
</div>


{{!----
Use the following context variables when customizing this template: 
	
	options (Array)

----}}

