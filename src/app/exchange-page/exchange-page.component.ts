import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExchangeService, IMessage } from '../services/exchange.service';

@Component({
  selector: 'app-exchange-page',
  templateUrl: './exchange-page.component.html',
  styleUrls: ['./exchange-page.component.less']
})
export class ExchangePageComponent implements OnInit, OnDestroy {

  private subscription: Subscription | null = null;
  
  chatPartnerName: string = 'Unkown';
  allMessages: IMessage[] = [];

  messageControl = new FormControl('');

  constructor(
    private exchangeService: ExchangeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {
      if(params['id']) {
        this.exchangeService.connect(params['id']);
      }
    });

    this.exchangeService.receiveEvent.subscribe(msg => {
      this.chatPartnerName = msg.senderName;
      this.allMessages = this.exchangeService.allMessages;
    });

    this.exchangeService.errorEvent.subscribe(error => {
      console.error(error);
      this.router.navigateByUrl("/");
    });
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler(event: any) {
    confirm("sure?");
  }

  onSend() {
    if(this.messageControl.value && this.messageControl.value.length > 0) {
      const textMsg = this.messageControl.value;
      try {
        this.exchangeService.send(textMsg);
      } catch(error: any) {
        console.error(error);
        this.router.navigateByUrl("/");
      }
      this.allMessages = this.exchangeService.allMessages;
      this.messageControl.reset();
    }
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }    
  }

}
