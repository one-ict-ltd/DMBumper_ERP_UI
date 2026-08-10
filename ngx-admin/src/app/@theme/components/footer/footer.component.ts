import { Component } from "@angular/core";

@Component({
  selector: "ngx-footer",
  styleUrls: ["./footer.component.scss"],
  template: `
    <div class="copyright-wrap footer pb-2">
      <div class="blockquote-footer">
        <i> Copyright-2021 - One ICT Limited </i>
        <a href="https://www.oneictltd.com/" target="_blank" title="ONE-ICT"> ONE-ICT </a>
      </div>
    </div>
    <!-- <span class="created-by">     
      Created with ♥ by
      <b><a href="https://www.oneictltd.com/" target="_blank">One-ICT Limited</a></b>
      2021
    </span> -->
    <div class="socials">
      <a href="https://www.oneictltd.com/" target="_blank" class=""><strong> version </strong> 1.0.0</a>
      <a href="https://www.oneictltd.com/" target="_blank" class="ion ion-social-github"></a>
      <a href="https://www.facebook.com/oneictbd" target="_blank" class="ion ion-social-facebook"></a>
      <a href="https://x.com/oneictbd/" target="_blank" class="ion ion-social-twitter"></a>
      <a href="https://www.linkedin.com/company/one-ict" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent { }
