{{#if message}}
<div class="backorder-history-message">
  <p>{{message}}</p>
</div>
{{/if}}
{{#if filters.length}}
<div id="current-filters-container">
  <p>Current Filters:</p>
  {{#each filters}}
  <a data-value="{{list}}" data-id="{{id}}" data-action="removeFilter">{{name}} <i class="remove-filter-icon"></i></a>
  {{/each}}
</div>
{{/if}}
<div class="list-header-view">
  <div class="list-header-view-accordion">
    <div id="backorder-filters-container" class="list-header-view-accordion-body">
      {{!-- <div class="list-header-view-accordion-body-header">
        <label for="backorder-item-filter">Item: </label>
        <select id="backorder-item-filter">
          {{#each items}}
          <option class="list-header-view-accordion-body-input" value="{{item}}" {{#if selected}}selected{{/if}}>
            {{item_name}}</option>
          {{/each}}
        </select>
      </div> --}}
      {{!-- <div class="list-header-view-accordion-body-header">
        <label for="backorder-order-filter">Order: </label>
        <select id="backorder-order-filter">
          {{#each orders}}
          <option class="list-header-view-accordion-body-input" value="{{internalid}}" {{#if selected}}selected{{/if}}>
            {{tranid}}</option>
          {{/each}}
        </select>
      </div> --}}
      <div class="list-header-view-datepicker-from">
        <label class="list-header-view-from" for="date-from">From:</label>
        <div class="list-header-view-datepicker-container-input">
          <input class="list-header-view-accordion-body-input" id="date-from" type="date" data-action="filterDateFrom">
          <i class="list-header-view-accordion-body-calendar-icon"></i>
        </div>
      </div>
      <div class="list-header-view-datepicker-to"><label class="list-header-view-to" for="date-to">To:</label>
        <div class="list-header-view-datepicker-container-input">
          <input class="list-header-view-accordion-body-input" id="date-to" type="date" data-action="filterDateTo">
          <i class="list-header-view-accordion-body-calendar-icon"></i>
        </div>
      </div>
      <div class="list-header-view-accordion-body-header">
        <label for="backorder-eligible-filter">Eligible to ship: </label>
        <select id="backorder-eligible-filter">
          {{#each eligible}}
          <option class="list-header-view-accordion-body-input" value="{{value}}" {{#if selected}}selected{{/if}}>
            {{value}}</option>
          {{/each}}
        </select>
      </div>
      {{!-- <div class="list-header-view-accordion-body-header">
        <label for="backorder-sales-rep-filter">Sales Rep: </label>
        <select id="backorder-sales-rep-filter">
          {{#each sales_reps}}
          <option class="list-header-view-accordion-body-input" value="{{rep_id}}" {{#if selected}}selected{{/if}}>
            {{rep_name}}</option>
          {{/each}}
        </select>
      </div> --}}
      {{!-- <div class="list-header-view-accordion-body-header">
        <label for="backorder-service-rep-filter">Service Rep: </label>
        <select id="backorder-service-rep-filter">
          {{#each service_reps}}
          <option class="list-header-view-accordion-body-input" value="{{rep_id}}" {{#if selected}}selected{{/if}}>
            {{rep_name}}</option>
          {{/each}}
        </select>
      </div> --}}
    </div>
  </div>
</div>
{{#unless lines.length}}
<div>
  <p>
    {{#if loading}}
    {{translate 'Loading...'}}
    {{else}}
    {{translate 'There are no backorder items pending to ship'}}
    {{/if}}
  </p>
</div>
{{else}}
<div id="all-line-actions-container">
  <label>Fulfillable Total: {{formatted_fulfillable_total}}</label>
  <a class="button-secondary button-small" data-action="fulfill-all">Release All</a>
  <a class="button-secondary button-small" data-action="close-all">Close All</a>
</div>

{{!-- table start needs to change gridish --}}
<div class="backorder-history-list-recordviews-container">
  <div class="backorder-history-table">
    <div class="backorder-history-table__header">
      <div class="backorder-history-header-wrapper">
        <div class="backorder-history-header"><span>{{translate 'Order'}}</span></div>
        <div class="backorder-history-header"><span>{{translate 'Date'}}</span></div>
      </div>
      <div class="backorder-history-header-wrapper">
        <div class="backorder-history-header"><span>{{translate 'Item'}}</span></div>
        <div class="backorder-history-header"><span>{{translate 'Item Description'}}</span></div>
      </div>
      <div class="backorder-history-header-wrapper">
        <div class="backorder-history-header"><span>{{translate 'Backorder Quantity'}}</span></div>
        <div class="backorder-history-header"><span>{{translate 'Quantity Available'}}</span></div>
      </div>
      <div class="backorder-history-header-wrapper">
        <div class="backorder-history-header"><span>{{translate 'Price'}}</span></div>
        <div class="backorder-history-header"><span>{{translate 'Total'}}</span></div>
      </div>
      <div class="backorder-history-header-wrapper image-holder"></div>
      <div class="backorder-history-header-wrapper action-holder">
        <span class="backorder-history-header">{{translate 'Actions'}}</span>
      </div>

    </div>
    <div class="backorder-history-table__body">
      {{#each lines}}
      <div class="backorder-history-item-line">

        <div class="backorder-history-item-line-wrapper">
          <div class="backorder-history-item-line-value" data-title="Order"><span>{{tranid}}</span></div>
          <div class="backorder-history-item-line-value" data-title="Date"><span>{{trandate}}</span></div>
        </div>
        <div class="backorder-history-item-line-wrapper">
          <div class="backorder-history-item-line-value" data-title="Item"><span>{{item_name}}</span></div>
          <div class="backorder-history-item-line-value" data-title="Item Description"><span>{{item_description}}</span>
          </div>
        </div>
        <div class="backorder-history-item-line-wrapper">
          <div class="backorder-history-item-line-value" data-title="Backorder Quantity">
            <span>{{quantity_backorder}}</span>
          </div>
          <div class="backorder-history-item-line-value" data-title="Quantity Available"><span>{{#if
              total_quantity_available}}{{total_quantity_available}}{{else}}0{{/if}}</span></div>
        </div>
        <div class="backorder-history-item-line-wrapper">
          <div class="backorder-history-item-line-value" data-title="Price"><span>{{formatted_item_rate}}</span></div>
          <div class="backorder-history-item-line-value" data-title="Total"><span>{{formatted_total}}</span></div>
        </div>
        <div class="backorder-history-item-line-wrapper image-holder">
          <img data-loader="false" class="typeahead-image"
            src="{{resizeImage fileurl 'tinythumb'}}"
            alt="{{item_name}}">
        </div>
        <div class="backorder-history-item-line-wrapper action-holder">
          {{#if fulfillable}}
          <a class="button-secondary button-small" disabled data-action="fulfill"
            data-value="{{item}}|{{internalid}}">Release</a>
          {{/if}}
          <a class="button-secondary button-small" disabled data-action="close"
            data-value="{{item}}|{{internalid}}">Close</a>
        </div>

      </div>
      {{/each}}
    </div>
  </div>

</div>


<div class="order-history-list-case-list-paginator">
  <nav class="global-views-pagination">
    <ul class="global-views-pagination-links">
      {{#each pager}}
      <li>
        <a {{#if current}}class="global-views-pagination-active" {{/if}}data-action="changePage"
          data-value="{{index}}">{{number}}</a>
      </li>
      {{/each}}
    </ul>
  </nav>
</div>
{{/unless}}

