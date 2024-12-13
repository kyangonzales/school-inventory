import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [ReactiveFormsModule, CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() title: string = ''; 
  @Input() modalTitle: string = ''; 
  @Input() isDuplicateChecker: boolean = false 
  isDisabled: boolean = false 
  @Input() showAddIcon: boolean = true; 
  @Input() fields: Field[] = [];
  @Input() items: Item[] = [];
  @Input() rooms: any= [];
  @Output() onSubmitCallback = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();
  @Output() exportPDFEvent = new EventEmitter<void>();
  @Input() startDate:any;
  @Input() endDate:any;
  @Output() handleStart = new EventEmitter<string>();
  @Output() handleEnd= new EventEmitter<string>();

  isModalOpen = false;

  formGroup: FormGroup;
  filteredOptions: { [key: string]: any[] } = {};
  currentField: any = null;

  onchangeStart(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const selectedDate = inputElement.value;
    this.handleStart.emit(selectedDate); // Emit the start date to the parent
  }

  onchangeEnd(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const selectedDate = inputElement.value;
    this.handleEnd.emit(selectedDate); // Emit the end date to the parent
  }

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({});
  }

  ngOnInit() {
    const formControls: { [key: string]: any } = {};
    this.fields.forEach(field => {
      const {isRequired=true} = field

      formControls[field.name] = ['', isRequired ? Validators.required : null];
      formControls[field.name + '_value'] = ['']; 
      this.filteredOptions[field.name] = [];
    });
    formControls['isBarcodeChange'] = [false];

    this.formGroup = this.formBuilder.group(formControls);

    document.addEventListener('click', this.onClickOutside.bind(this));
    this.onBarcodeChange();
    this.handleChange('brand', 'brand_value');
    this.handleChange('room', 'room_value');
    this.handleChange('name', '');
    this.detectFormGroupChanges();
    this.onNameChange()
  }

  convertChar=(char:string)=>{
    return char?.toLowerCase()?.replace(/\s+/g, '');
  }




  onNameChange() {
    this.formGroup.get('name')?.valueChanges.subscribe((value: any) => {
      const isExist = this.rooms.some(({name=''})=>this.convertChar(name)==this.convertChar(value))
      console.log("is Exist ", isExist)
      if(this.isDuplicateChecker){
        this.isDisabled=isExist
        const errorMessageElement = document.getElementById('errorMessage');
          
          if(isExist){
            if (errorMessageElement) {
              errorMessageElement.innerHTML = "Name is already exist!";
            }
          }else{
            if (errorMessageElement) {
              errorMessageElement.innerHTML = "";
            }
          }
      }
    });
  }






  detectFormGroupChanges() {
    this.formGroup.valueChanges.subscribe((newValues) => {
      const { name, brand, room, barcode, isBarcodeChange=false } = newValues;
      console.log("eto na ",this.formGroup.value)
      if (name && brand && room && !isBarcodeChange) {
        console.log("tite")
        const barcode = this.items.find((item) => {
          return (
            this.convertChar(item.name) === this.convertChar(name) &&
            this.convertChar(item.brand.name) === this.convertChar(brand) &&
            this.convertChar(item.room.name) === this.convertChar(room)
          );
     
        })?.barcode || '';
        const currentBarcode = this.formGroup.get('barcode')?.value
        const isExist=this.items.some((item)=>item.barcode==currentBarcode)
        const newBarcode=barcode?barcode:isExist?'':currentBarcode
          this.formGroup.patchValue(
            { barcode:newBarcode, isBarcodeChange:false},
            
            { emitEvent: false } 
          )
      }
    });
  }
  onBarcodeChange() {
    this.formGroup.get('barcode')?.valueChanges.subscribe((value: any) => {
      const itemFound = this.items.find(({ barcode='' }) => barcode === value && barcode);
      const formGroup = { ...this.formGroup.value };
      if (itemFound) {
        const { brand, room, name, status, barcode } = itemFound;
        
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
      else{
        this.formGroup.patchValue({brand:'', brand_value:'', room: '', room_value: ''}, { emitEvent: false });
      }
      this.formGroup.patchValue({isBarcodeChange:true}, { emitEvent: false });

    });
    
  }


  handleChange(fieldName: string, valueKey: string) {
    this.formGroup.get(fieldName)?.valueChanges.subscribe((value: any) => {
      const fields = this.fields.find((field) => field.name === fieldName)?.options;
      const field = fields?.find(({ label }) => label?.toLowerCase() === value?.toLowerCase());

      if (!field && this.formGroup.get(fieldName)?.value !== "") {
        this.formGroup.patchValue({ [valueKey]: "" }, { emitEvent: false });
      } else if (field) {
        this.formGroup.patchValue({ [valueKey]: field.value }, { emitEvent: false });
      }
      this.formGroup.patchValue({isBarcodeChange:false}, { emitEvent: false });
      console.log("handle change detected")
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
    const query = this.formGroup.get(field.name)?.value?.toLowerCase() || '';
    this.filteredOptions[field.name] = field.options.filter((option: any) => option.label?.toLowerCase()?.includes(query));
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
  toggleModal(){
    this.formGroup.reset();
    this.isModalOpen=true
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
