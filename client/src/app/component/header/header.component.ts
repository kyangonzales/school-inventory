import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Field } from '../../interface/field';
import { LucideAngularModule } from 'lucide-angular';


interface Brand{
  name:string,
  _id:string
}
interface Room{
  name:string,
  _id:string
}
interface Item {
  _id: string;
  name: string;
  brand: Brand;
  status:string,
  barcode: string;
  room: Room;
}
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
  @Input() items: Item[] = [];
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
    this.onBarcodeChange();
    this.handleChange('brand', 'brand_value');
    this.handleChange('room', 'room_value');
  }

   


  onBarcodeChange() {
    this.formGroup.get('barcode')?.valueChanges.subscribe((value: any) => {
      const itemFound = this.items.find(({ barcode }) => barcode === value);
  
      if (itemFound) {
        const { brand, room, name, status, barcode } = itemFound;
        const formGroup = { ...this.formGroup.value };
  
        formGroup.brand = brand?.name;
        formGroup.brand_value = brand._id;
        formGroup.room = room.name;
        formGroup.room_value = room._id;
        formGroup.name = name;
        formGroup.name_value = name;
        formGroup.quantity = 1;
        formGroup.quantity_value = 1;
        formGroup.barcode = barcode;
        this.formGroup.patchValue(formGroup, { emitEvent: false });
      }
    });
  }
  handleChange(fieldName: string, valueKey: string) {
    this.formGroup.get(fieldName)?.valueChanges.subscribe((value: any) => {
      const fields = this.fields.find((field) => field.name === fieldName)?.options;
      const field = fields?.find(({ label }) => label.toLowerCase() === value.toLowerCase());
      console.log(`before updating ${valueKey}:`, this.formGroup.value);
      if (!field && this.formGroup.get(fieldName)?.value !== "") {
        this.formGroup.patchValue({ [valueKey]: "" }, { emitEvent: false });
      } else if (field) {
        this.formGroup.patchValue({ [valueKey]: field.value }, { emitEvent: false });
      }
      console.log(`after updating ${valueKey}:`, this.formGroup.value);
    });
  }
  
  // onRoomChange() {
  //   this.formGroup.get('room')?.valueChanges.subscribe((value: any) => {
  //     const rooms = this.fields.find((field) => field.name === 'room')?.options;
  //     const room = rooms?.find(({ label }) => label.toLowerCase() === value.toLowerCase());
  
  //     console.log('before updating room_value:', this.formGroup.value);

  //     if (!room && this.formGroup.get('room')?.value !== "") {
  //       this.formGroup.patchValue({ room_value: "" }, { emitEvent: false });
  //     } else if (room) {
  //       this.formGroup.patchValue({ room_value: room.value }, { emitEvent: false });
  //     }
  //     console.log('after updating room_value:', this.formGroup.value);
  //   });
  // }
  
  
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
    this.formGroup.get(fieldName)?.setValue(label);  // eto para sa label
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
