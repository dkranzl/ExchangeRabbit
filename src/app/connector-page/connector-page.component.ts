import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { environment } from 'src/environments/environment';
import { ExchangeService } from '../services/exchange.service';

@Component({
  selector: 'app-connector-page',
  templateUrl: './connector-page.component.html',
  styleUrls: ['./connector-page.component.less']
})
export class ConnectorPageComponent implements OnInit {

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value: string | null = null;
  deviceName: string = 'Unknown';

  constructor(
    private exchangeService: ExchangeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.value = `${environment.appUrl}/exchange/${this.exchangeService.peer.id}`;
    console.log(this.value);

    this.exchangeService.connectedEvent.subscribe(() => {
      this.router.navigateByUrl('/exchange');
    });

    this.deviceName = this.exchangeService.deviceInfo.name;
  }

}
