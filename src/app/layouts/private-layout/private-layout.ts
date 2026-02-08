import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrivateSidebarComponent } from './components/private-sidebar/private-sidebar.component';
import { PrivateTopbarComponent } from './components/private-topbar/private-topbar.component';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  templateUrl: './private-layout.html',
  styleUrls: ['./private-layout.css'],
  imports: [RouterOutlet, PrivateSidebarComponent, PrivateTopbarComponent],
})
export class PrivateLayoutComponent {


}
