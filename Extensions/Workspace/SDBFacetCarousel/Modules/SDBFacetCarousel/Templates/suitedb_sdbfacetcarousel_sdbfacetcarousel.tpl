{{#if shapes.length}}
<div class="SDBFacetCarouselView-title">
  <h2>{{title}}</h2>
</div>
<section class="SDBFacetCarouselView-info-card container">

  {{#each shapes}}
  <div class="container-SDBFacetCarouselView-info-card">
    <div class="SDBFacetCarouselView-info-card-content" data-action="Shape" data-value="{{this.displayName}}">
      
      <img src="{{this.image.src}}" alt="{{this.displayName}}" data-value="{{this.displayName}}">

        <div class="card-name" data-value="{{this.displayName}}">
        {{this.displayName}}
      </div>
      
    </div>
  </div>
  {{/each}}

</section>
{{/if}}