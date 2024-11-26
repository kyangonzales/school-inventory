import { Component, EventEmitter, Input, Output } from '@angular/core'; 
import { CommonModule } from'@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
@Component({
  selector: 'pagination',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent { 
  @Input() totalItems!: number; 
  @Input() itemsPerPage: number = 5; 
  @Input() currentPage: number = 1; 
  @Output() itemsPerPageChange = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>(); 

   get totalPages(): number { 
    return Math.ceil(this.totalItems / this.itemsPerPage); 
  } 

  previousPage() { 
    if (this.currentPage > 1) { 
      this.currentPage--; this.pageChange.emit(this.currentPage); 
    } 
  } 

  nextPage() { 
    if (this.currentPage < this.totalPages) { 
        this.currentPage++; this.pageChange.emit(this.currentPage); 
    }
  }
}
