{{! Edited for Threads Theme }}
{{#if itemChangesPLP}}
<div
  class="facets-item-cell-grid"
  data-type="item"
  data-item-id="{{itemId}}"
  itemprop="itemListElement"
  data-track-productlist-list="{{track_productlist_list}}"
  data-track-productlist-category="{{track_productlist_category}}"
  data-track-productlist-position="{{track_productlist_position}}"
  data-sku="{{sku}}"
  data-min-qty="{{itemChangesPLP.minimumquantityTbl}}"
>
{{else}}
<div
  class="facets-item-cell-grid"
  data-type="item"
  data-item-id="{{itemId}}"
  itemprop="itemListElement"
  data-track-productlist-list="{{track_productlist_list}}"
  data-track-productlist-category="{{track_productlist_category}}"
  data-track-productlist-position="{{track_productlist_position}}"
>
{{/if}}

  <div class="facets-item-cell-grid-image-wrapper">
    <div data-view="ItemThumbnail"></div>
    <div data-view="ItemDetails.Options"></div>
    <a class="facets-item-cell-grid-link-image" href="{{url}}">
      {{#if itemChangesPLP}}
      <img
        class="facets-item-cell-grid-image"
        src="{{itemChangesPLP.thumbnail}}"
        alt="{{thumbnail.altimagetext}}"
        itemprop="image"
      />
      {{else}}
      <img
        class="facets-item-cell-grid-image"
        src="{{thumbnail.url}}"
        alt="{{thumbnail.altimagetext}}"
        itemprop="image"
      />
      {{/if}}
    </a>
    {{#if isEnvironmentBrowser}}
      <div class="facets-item-cell-grid-quick-view-wrapper">
        <a
          href="{{url}}"
          class="facets-item-cell-grid-quick-view-link"
          data-toggle="show-in-modal"
        >
          <i class="facets-item-cell-grid-quick-view-icon"></i>
          {{translate "Quick View"}}
        </a>
      </div>
    {{/if}}
  </div>

  <div class="facets-item-cell-grid-details">
    <a class="facets-item-cell-grid-title" href="{{url}}">
      <span itemprop="name">{{name}}</span>
    </a>
    <div>{{sku}}</div>
    <div>{{itemChangesPLP.country}}</div>
    {{#if itemChangesPLP.isLoggedIn}}
    <span class="facets-item-cell-grid-quantity-stock-available">
      Quantity Available:
      {{itemChangesPLP.quantityavailable}}</span>
    {{/if}}
    <div class="facets-item-cell-grid-price" data-view="ItemViews.Price">
    </div>
    {{#if itemChangesPLP}}
    {{#if itemChangesPLP.isLoggedIn}}
      <div class="facets-item-cell-grid-price">
        <table class="facets-item-cell-grid-table">
          <tr class="facets-item-cell-grid-table-row">
            <td class="facets-item-cell-grid-table-cell">Min Qty</td>
            {{#each itemChangesPLP.prices}}
              <td
                class="facets-item-cell-grid-table-cell"
              >{{minimumquantity}}+</td>
            {{/each}}
          </tr>

          <tr class="facets-item-cell-grid-table-row">

            <td
              class="facets-item-cell-grid-table-cell"
            >{{itemChangesPLP.minimumquantityTbl}}</td>
            {{#each itemChangesPLP.prices}}
              <td
                class="facets-item-cell-grid-table-cell"
              >{{price_formatted}} {{#if hasSale}}<span class="product-views-price-old">{{oldPrice}}</span>{{/if}}</td>
            {{/each}}
          </tr>
        </table>
      </div>
      <div data-view="ItemViews.MarkForAddLater"></div>
    {{else}}
      <a
        class="header-profile-login-link-grid"
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
