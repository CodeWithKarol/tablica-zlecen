import { ChangeDetectionStrategy, Component } from '@angular/core';
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
export class LandingPage {}
