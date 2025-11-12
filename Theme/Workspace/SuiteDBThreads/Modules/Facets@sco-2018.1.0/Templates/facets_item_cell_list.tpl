{{! Edited for Threads Theme }}
{{#if itemChangesPLP}}
<div
  class="facets-item-cell-list"
  itemprop="itemListElement"
  data-item-id="{{itemId}}"
  data-track-productlist-list="{{track_productlist_list}}"
  data-track-productlist-category="{{track_productlist_category}}"
  data-track-productlist-position="{{track_productlist_position}}"
  data-sku="{{sku}}"
  data-min-qty="{{itemChangesPLP.minimumquantityTbl}}"
>
{{else}}
<div
  class="facets-item-cell-list"
  itemprop="itemListElement"
  data-item-id="{{itemId}}"
  data-track-productlist-list="{{track_productlist_list}}"
  data-track-productlist-category="{{track_productlist_category}}"
  data-track-productlist-position="{{track_productlist_position}}"
  data-sku="{{sku}}"
  data-min-qty="{{itemChangesPLP.minimumquantityTbl}}"
>
{{/if}}
  <div class="facets-item-cell-list-left">
    <div class="facets-item-cell-list-image-wrapper">
      <div data-view="ItemThumbnail"></div>
      {{#if itemIsNavigable}}
        <a class="facets-item-cell-list-anchor" href="{{url}}">
          {{#if itemChangesPLP}}
          <img
            class="facets-item-cell-list-image"
            src="{{resizeImage itemChangesPLP.thumbnail 'thumbnail'}}"
            alt="{{thumbnail.altimagetext}}"
            itemprop="image"
          />
          {{else}}
           <img
            class="facets-item-cell-list-image"
            src="{{resizeImage thumbnail.url 'thumbnail'}}"
            alt="{{thumbnail.altimagetext}}"
            itemprop="image"
          />
          {{/if}}
        </a>
      {{else}}
        <img
          class="facets-item-cell-list-image"
          src="{{resizeImage thumbnail.url 'thumbnail'}}"
          alt="{{thumbnail.altimagetext}}"
          itemprop="image"
        />
      {{/if}}
      {{#if isEnvironmentBrowser}}
        <div class="facets-item-cell-list-quick-view-wrapper">
          <a
            href="{{url}}"
            class="facets-item-cell-list-quick-view-link"
            data-toggle="show-in-modal"
          >
            <i class="facets-item-cell-list-quick-view-icon"></i>
            {{translate "Quick View"}}
          </a>
        </div>
      {{/if}}
    </div>
  </div>
  <div class="facets-item-cell-list-right">
    <h2 class="facets-item-cell-list-title">
      {{#if itemIsNavigable}}
        <a class="facets-item-cell-list-name" href="{{url}}">
          <span itemprop="name">
            {{name}}
          </span>
        </a>
      {{else}}
        <span itemprop="name">
          {{name}}
        </span>
      {{/if}}
    </h2>
    <div>{{sku}}</div>
    <div>{{itemChangesPLP.country}}</div>
    {{#if itemChangesPLP}}
    {{#if itemChangesPLP.isLoggedIn}}
    <span class="facets-item-cell-grid-quantity-stock-available">
      Quantity Available:
      {{itemChangesPLP.quantityavailable}}</span>
    {{/if}}
    <div class="facets-item-cell-list-price">
      <div data-view="ItemViews.Price"></div>
    </div>
    {{#if itemChangesPLP.isLoggedIn}}
      <div class="facets-item-cell-list-price">
        <table class="facets-item-cell-list-table">
          <tr class="facets-item-cell-list-table-row">
            <td class="facets-item-cell-list-table-cell">Min Qty</td>
            {{#each itemChangesPLP.prices}}
              <td
                class="facets-item-cell-list-table-cell"
              >{{minimumquantity}}+</td>
            {{/each}}
          </tr>

          <tr class="facets-item-cell-list-table-row">

            <td
              class="facets-item-cell-list-table-cell"
            >{{itemChangesPLP.minimumquantityTbl}}</td>

            {{#each itemChangesPLP.prices}}
              <td
                class="facets-item-cell-list-table-cell"
              >{{price_formatted}}</td>
            {{/each}}
          </tr>
        </table>
      <div data-view="ItemViews.MarkForAddLater"></div>
      </div>
    {{else}}
      <a
        class="header-profile-login-link-list"
        data-touchpoint="login"
        data-hashtag="login-register"
        href="#"
      >
        Please log in to see price
      </a>
    {{/if}}
    {{/if}}
    {{#unless itemChangesPLP}}
      <div data-view="ItemViews.Price"></div> 

      <div data-view="Quantity.Pricing"></div>

      <div data-view="Cart.QuickAddToCart"></div>

      {{#if showRating}}
        <div
          class="facets-item-cell-grid-rating"
          itemprop="aggregateRating"
          data-view="GlobalViews.StarRating"
        >
        </div>
      {{/if}}

      <div data-view="ItemDetails.Options"></div>

      <div data-view="StockDescription"></div>
      <div data-view="ItemViews.MarkForAddLater"></div>
    {{/unless}}

  </div>
</div>

{{!
Use the following context variables when customizing this template: 
	
	itemId (Number)
	name (String)
	url (String)
	sku (String)
	isEnvironmentBrowser (Boolean)
	thumbnail (Object)
	thumbnail.url (String)
	thumbnail.altimagetext (String)
	itemIsNavigable (Boolean)
	showRating (Boolean)
	rating (Number)

}}