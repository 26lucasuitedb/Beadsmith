{{log this}}
<section class="sdbuploadordersmyacc">
  <h2 class="wizard-header-title primary-color">Upload your sales order</h2>
  <div class="import-buttons">
    <div class="upload-csv-top">
      <label>
        {{this.howWorks}}
      </label>
      <div class="file-upload-main">
        <label for="file-upload" class="custom-file-upload">Select a file...</label>
        <input id="file-upload" name='upload_cont_img' type="file">
      </div>
        <div class="capture">
        <button data-action="csvupload" id="csvupload" name="csvupload">UPLOAD ORDER</button>
        <a href="https://staging.beadsmith.com/site/assets/csv_template_example.csv" download="example.csv">Download the
          Example csv Template <i class="icon-cloud-downloads"></i></a>
      </div>
    </div>
    <div data-type="alert-placeholder"></div>
  </div>
  <div class="order-main">
    <div class="order-generated">
      <h2>Your CSV Order Works</h2>
      <p>{{this.order.name}}</p>
    </div>
  </div>
</section>