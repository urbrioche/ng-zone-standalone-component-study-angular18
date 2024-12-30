import {
  ApplicationConfig,
  Component,
  inject,
  OnInit,
  NgZone,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CounterComponent } from './app/counter/counter.component';
import { provideHttpClient } from '@angular/common/http';
import { RedirectComponent } from './app/redirect/redirect.component';

declare const Zone: any;

@Component({
  selector: 'app-root',
  imports: [CounterComponent],
  standalone: true,
  template: `
    <app-counter></app-counter>
  `,
})
export class App implements OnInit {
  ngOnInit(): void {
    console.log('current zone of App:', Zone.current.name);
  }
  name = 'Angular';
}

// https://stackoverflow.com/questions/47236963/no-provider-for-httpclient
// With the recent changes in angular (Angular 17) there is no app.module file. So with the new structure you will have to update it in app.config file and add
const appConfig: ApplicationConfig = {
  providers: [provideHttpClient()],
};
bootstrapApplication(App, appConfig).then((appRef) => {
    appRef.bootstrap(RedirectComponent);
});
