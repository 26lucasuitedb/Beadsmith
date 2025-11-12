{{#if isLoggedIn}}

<div class="facets-item-cell-grid-mark-for-add">
  <input
    type="button"
    value="-"
    data-action="sub-qty"
    class="facets-item-cell-grid-add-all-selected-qty-btn"
  />
  <input
    type="number"
    name="add-selected-qty-input"
    id="mark-for-add-later"
    min="0"
    value="0"
    class="facets-item-cell-grid-mark-for-add__input"
    data-action="mark-for-add"
  />
  <input
    type="button"
    value="+"
    data-action="sum-qty"
    class="facets-item-cell-grid-add-all-selected-qty-btn"
  />
</div>
{{/if}}



<!--
  Available helpers:
  {{ getExtensionAssetsPath "img/image.jpg"}} - reference assets in your extension
  
  {{ getExtensionAssetsPathWithDefault context_var "img/image.jpg"}} - use context_var value i.e. configuration variable. If it does not exist, fallback to an asset from the extension assets folder
  
  {{ getThemeAssetsPath context_var "img/image.jpg"}} - reference assets in the active theme
  
  {{ getThemeAssetsPathWithDefault context_var "img/theme-image.jpg"}} - use context_var value i.e. configuration variable. If it does not exist, fallback to an asset from the theme assets folder
-->