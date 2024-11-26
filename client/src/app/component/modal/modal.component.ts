import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
interface FilteredOptions {
   [key: string]: Array<{ value: string; label: string }>; 
} 
interface Option {
   value: string; label: string; 
  }
@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() modalTitle: string = '';
  @Input() fields: any[] = [];
  @Input() editRow: any = null;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();

  formGroup!: FormGroup;
  filteredOptions: { [key: string]: Option[] } = {};
  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({});
  }

  ngOnInit() {
    this.formGroup = this.fb.group(
      this.fields.reduce((group, field) => {
        group[field.name] = ['', field ? Validators.required : []]
        return group
      }, {})
    );
      this.formGroup.addControl('_id', this.fb.control(''))
  }

  
  ngOnChanges(changes: SimpleChanges) {
    
    if (changes['editRow'] && this.editRow) {
      const patchedValues = { ...this.editRow };
  
      this.fields.forEach(field => {
        if (field.type === 'select' && this.editRow[field.name]) {
          if (typeof this.editRow[field.name] === 'object' && this.editRow[field.name] !== null) {
            patchedValues[field.name] = this.editRow[field.name]._id;
          } else {
            patchedValues[field.name] = this.editRow[field.name];
          }
        }
      });
  
      this.formGroup.patchValue(patchedValues);
  
      if (this.editRow && this.editRow._id) {
        this.formGroup.get('_id')?.setValue(this.editRow._id);
      } else {
        this.formGroup.get('_id')?.setValue('');
      }
  
      console.log('formGroup after patching:', this.formGroup);
    }
  }
  
  
  filterOptions(field: any) {
    const query = this.formGroup.get(field.name)?.value.toLowerCase() || '';
    this.filteredOptions = field.options.filter((option: any) => option.label.toLowerCase().includes(query));
  }

  selectOption(fieldName: string, value: any, label: string) {
    this.formGroup.get(fieldName)?.setValue(value)
    this.filteredOptions[fieldName] = []
  }
  

  onSubmit() {
    if (this.formGroup.valid) {
      this.formSubmit.emit(this.formGroup.value);
      console.log("child component log received: ", this.formGroup.value);
    }
  }

  close() {
    this.closeModal.emit();
  }
}
