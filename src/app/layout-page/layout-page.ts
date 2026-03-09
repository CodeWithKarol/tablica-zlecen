import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout-page.html',
  styleUrl: './layout-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutPage { }
