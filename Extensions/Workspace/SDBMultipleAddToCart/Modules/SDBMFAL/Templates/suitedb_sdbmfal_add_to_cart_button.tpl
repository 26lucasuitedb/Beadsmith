{{#if isLoggedIn}}
<div
  class="cart-add-to-cart-button-container mark-for-later-add-to-cart-button-container"
>
  <div class="cart-add-to-cart-button">
    <button
      type="submit"
      data-type="add-to-cart"
      data-action="sticky"
      class="cart-add-to-cart-button-button"
    >
      {{translate "Add all selected"}}
    </button>
  </div>

  <div data-type="alert-placeholder"></div>
</div>
{{/if}}