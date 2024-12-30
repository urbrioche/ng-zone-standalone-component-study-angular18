import {
  afterNextRender,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  NgZone,
  OnInit,
  signal,
} from '@angular/core';
import { SIGNAL, SignalNode } from '@angular/core/primitives/signals';
import { HttpClient } from '@angular/common/http';

declare const Zone: any;

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CounterComponent implements AfterViewInit, OnInit {
  count = signal(0);
  count2 = computed(() => {
    // 想要看看什麼時候會進來，打開 console 看一下
    console.log('enter count2 callback');
    return 2 * this.count();
  });
  count3 = 0;
  countNode = this.count[SIGNAL] as SignalNode<number>;
  http = inject(HttpClient);
  private ngZone = inject(NgZone);

  constructor() {
    effect(() => {
      // 執行順序 3
      console.log('3. execute effect');
      this.count3 = this.count() * 3;
    });

    afterNextRender(() => {
      // 執行順序 2
      console.log('2. execute afterNextRender');
    });
  }

  ngOnInit(): void {
    this.ngZone.run(() => {});
    console.log('current zone of CounterComponent:', Zone.current.name);
  }

  ngAfterViewInit(): void {
    // 執行順序 1
    console.log('1. afterViewInit');
  }

  add(): void {
    this.count.update((c) => {
      // 不改變數字，count2 的 callback
      if (c >= 5) {
        return 5;
      }

      // 改變數字，count2 的 callback
      return c + 1;
    });

    console.log('add():', this.count2());
  }

  reset(): void {
    this.count.set(0);
  }

  // 先留著，沒用到
  getPerson(id: number) {
    const URL = 'https://swapi.dev/api/people';
    return this.http.get<any>(`${URL}/${id}`);
  }
}
