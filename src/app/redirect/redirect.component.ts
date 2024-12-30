import { Component, NgZone, OnInit, inject, signal } from '@angular/core';

declare const Zone: any;

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.css',
})
export class RedirectComponent implements OnInit {
  private ngZone = inject(NgZone);
  num = 0;
  numSignal = signal(0);
  ngOnInit(): void {
    console.log('current zone of RedirectComponent:', Zone.current.name);

    console.log(
      'isInAngularZone of RedirectComponent:',
      NgZone.isInAngularZone()
    );

    // ERROR RuntimeError: NG0101: ApplicationRef.tick is called recursively
    this.ngZone.run(() => {});
  }

  plus(): void {
    this.num++;
    // console.log('isInAngularZone of plus:', NgZone.isInAngularZone());
    this.ngZone.run(() => {});

    // console.log('isInAngularZone of plus:', NgZone.isInAngularZone());

    // this.ngZone.run(() => {
    //   this.num++;
    // });

    // 註解掉這行，你會發現即使不跑在 angulr zone，UI 的 `num` 也會跟著變
    // this.numSignal.update((val) => val + 1);
  }
}
