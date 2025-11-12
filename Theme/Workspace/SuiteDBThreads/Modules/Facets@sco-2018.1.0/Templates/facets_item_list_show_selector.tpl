{{!-- Edited for Threads Theme --}}

<div class="facets-item-list-show-selector-dropdown-wrapper">
    <div class="facets-item-list-show-selector-label">
        {{translate 'Show'}}
    </div>
    <div class="facets-item-list-show-selector-dropdown-container">
        <button class="dropdown-toggle facets-item-list-show-selector" type="button" id="facets-item-list-show-selector-dropdown" data-toggle="dropdown" aria-expanded="true"
            data-type="navigator">
            {{#each options}} {{#if isSelected}} {{name}} {{/if}} {{/each}}
            <span class="caret"></span>
        </button>
        <ul class="facets-item-list-show-selector-dropdown-menu" role="menu" aria-labelledby="facets-item-list-show-selector-dropdown">
            {{#each options}}
            <li role="presentation" class="{{#if isSelected}}active{{/if}}">
                <a role="menuitem" tabindex="-1" href="{{configOptionUrl}}" class="{{className}} {{#if isSelected}}active{{/if}}" {{#if isSelected}} selected="" {{/if}}>{{name}}</a>
            </li>
            {{/each}}
        </ul>
    </div>
</div>


{{!---- Use the following context variables when customizing this template: options (Array) ----}}
