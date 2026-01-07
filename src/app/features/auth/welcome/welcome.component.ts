import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent {
  @Output() chooseGmail = new EventEmitter<void>();
  @Output() chooseEmail = new EventEmitter<void>();

  onYes() {
    this.chooseGmail.emit();
  }

  onNo() {
    this.chooseEmail.emit();
  }
}
