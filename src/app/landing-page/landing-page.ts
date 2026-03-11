import { ChangeDetectionStrategy, Component, signal, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroBoardComponent } from './hero-board.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, HeroBoardComponent],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  mousePos = signal({ x: 50, y: 50 });

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    this.mousePos.set({ x, y });
  }
}
