import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Field } from '../../interface/field';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'header',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() title: string = ''; 
  @Input() modalTitle: string = ''; 
  @Input() fields: Field[] = [];
  @Output() onSubmitCallback = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();
  @Output() exportPDFEvent = new EventEmitter<void>();

  isModalOpen = false;
  formGroup: FormGroup;
  filteredOptions: { [key: string]: any[] } = {};
  currentField: any = null;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({});
  }

  ngOnInit() {
    const formControls: { [key: string]: any } = {};
    this.fields.forEach(field => {
      formControls[field.name] = ['', Validators.required];
      formControls[field.name + '_value'] = ['']; 
      this.filteredOptions[field.name] = [];
    });
    this.formGroup = this.formBuilder.group(formControls);

    document.addEventListener('click', this.onClickOutside.bind(this));
  }
  
  onSearch(event: any) { 
    this.search.emit(event.target.value); 
  }

  showOptions(field: any) {
    if (field.options) {
      this.filteredOptions[field.name] = [...field.options]; 
    }
    this.currentField = field; 
  }

  filterOptions(field: any) {
    const query = this.formGroup.get(field.name)?.value.toLowerCase() || '';
    this.filteredOptions[field.name] = field.options.filter((option: any) => option.label.toLowerCase().includes(query));
  }
  
  hideOptions() {
    if (!this.isInteractingWithDropdown) {
      this.currentField = null;
    }
  }

  selectOption(fieldName: string, value: string, label: string) {
    this.formGroup.get(fieldName)?.setValue(label);  
    this.formGroup.get(fieldName + '_value')?.setValue(value);  
    this.filteredOptions[fieldName] = [];
    this.currentField = null; 

    const formValue = { ...this.formGroup.value };  
    const fields = [...this.fields];  
  
    if (formValue.status_value === "Find" && !formValue.hasOwnProperty("condition")) {
      fields.splice(fields.length - 1, 0, {
        name: "condition",
        label: "Condition",
        placeholder: "Find Condition",
        type: "select",
        options: [
          { label: "Good", value: "Good" },
          { label: "Damage", value: "Damage" },
        ],
      });

      if (!this.formGroup.contains("condition")) {
        this.formGroup.addControl("condition", this.formBuilder.control("", Validators.required));
        this.formGroup.addControl("condition_value", this.formBuilder.control(""));
      }
      if (!this.formGroup.contains("quantity")) {
        this.formGroup.addControl("quantity", this.formBuilder.control("", Validators.required));
        this.formGroup.addControl("quantity_value", this.formBuilder.control(""));
      }
    } else if (formValue.status_value !== "Find") {
      const conditionIndex = fields.findIndex(field => field.name === "condition");
      if (conditionIndex !== -1) {
        fields.splice(conditionIndex, 1);  
        this.formGroup.removeControl("condition");  
        this.formGroup.removeControl("condition_value"); 
      }
      if (!this.formGroup.contains("quantity")) {
        this.formGroup.addControl("quantity", this.formBuilder.control("", Validators.required));
        this.formGroup.addControl("quantity_value", this.formBuilder.control(""));
      }
    }
    this.currentField = null;
    this.fields = fields;
  }

  isShowStatus(): boolean {
    const formValue = { ...this.formGroup.value };
    
    if (!formValue.hasOwnProperty('status')) {
      return false;
    }
    return formValue.status === 'Find';
  }
  
  onSubmit() {
    if (this.formGroup.valid) {
      const formValue = { ...this.formGroup.value };
      this.fields.forEach(field => {
        if (field.type === 'select') {
          formValue[field.name] = formValue[field.name + '_value']; 
          delete formValue[field.name + '_value']; 
        }
      });
      this.onSubmitCallback.emit(formValue);
      this.formGroup.reset();
      this.isModalOpen = false;
    }
  }

  exportPDF() { 
    this.exportPDFEvent.emit();
  }

  isInteractingWithDropdown = false;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement | null;
    if (this.currentField && target && !target.closest('.dropdown')) {
      this.hideOptions();
    }
  }
  onDropdownMouseEnter() {
    this.isInteractingWithDropdown = true; 
  }
  
  onDropdownMouseLeave() {
    this.isInteractingWithDropdown = false; 
  }
  
}
