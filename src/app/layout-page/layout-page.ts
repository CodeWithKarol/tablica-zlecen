import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-page',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layout-page.html',
  styleUrl: './layout-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.user;

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }

  getInitials(email: string | undefined): string {
    if (!email) return '??';
    const parts = email.split('@')[0].split(/[._-]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  getWorkshopName(email: string | undefined): string {
    if (!email) return 'GOŚĆ';
    return email.split('@')[0].replace(/[._-]/g, ' ').toUpperCase();
  }
}
