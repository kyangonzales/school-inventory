import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../component/header/header.component';
import { InventoryService } from '../../services/inventory.service';
import { PaginationService } from '../../services/pagination.service';
import { PaginationComponent } from '../../component/pagination/pagination.component';
import { Field } from '../../interface/field';
import { ModalComponent } from '../../component/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../services/brand.service';
import { RoomService } from '../../services/room.service';
import { ItemService } from '../../services/item.service';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, PaginationComponent, ModalComponent, ReactiveFormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  pageTitle = 'Inventory Logs';
  private inventoryService = inject(InventoryService);
  private brandService =inject(BrandService)
  private roomService =  inject(RoomService)
  private itemService = inject(ItemService)
  paginationService = inject(PaginationService); 
  inventory = this.inventoryService.getInventory(); // galing service to
  formGroup: FormGroup;
  filteredInventory: any[] = []; 

  constructor(private fb: FormBuilder, private pdfService:PdfService) { 
    this.formGroup = this.fb.group({});
    this.paginationService.setItems(this.inventory);
    this.updateFilteredInventory();
  }

  modalFields: Field[] = [ 
    { name: 'barcode', label: 'Barcode', type: 'select', placeholder: 'Enter barcode', options:[] },
    { name: 'item', label: 'Item Name', type: 'select', placeholder: 'Select Item', options: []},
    { name: 'brand', label: 'Brand', type: 'select', placeholder: 'Select item', options: []},
    { name: 'room', label: 'Room Name', type: 'select', placeholder: 'Select Room', options: []}, 
    { name: 'status', label: 'Status', type: 'select', placeholder: 'Select status', options: 
      [ 
        { label: 'Find', value: 'Find' },
        { label: 'Good', value: 'Good' },
        { label: 'Damage', value: 'Damaged' },
        { label: 'Missing', value: 'Missing' }
      ]},
      { name: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity' },
  ];

  ngOnInit() {
    const rooms = this.roomService.getRoom();
    const brands = this.brandService.getItems();
    const items = this.itemService.getItems();
    this.modalFields.forEach(field => {
      if (field.name === 'room') {
        field.options = rooms.map(room => ({ label: room.name, value: room.name }));
      }
      if (field.name === 'brand') {
        field.options = brands.map(brand => ({ label: brand.name, value: brand.name }));
      }
      if (field.name === 'barcode') {
        field.options = items.map(item => ({ label: item.barcode, value: item.barcode }));
      }
      if (field.name === 'item') {
        field.options = items.map(item => ({ label: item.item, value: item.item }));
      }
    });
  }
  handleAddInventory(formValue: any) {
    this.inventoryService.addInventory(formValue);
    this.paginationService.setItems(this.inventory);
    this.updateFilteredInventory();
  }
 
  currentLog: any = null;
  isModalOpen = false; 

  openModal(log: any) {
    this.currentLog = log;
    this.isModalOpen = true; 
    console.log("log: ", log);
  } 

  handleFormSubmit(formData: any) { 
    console.log('Form Data:', formData); 
    this.isModalOpen = false;
  }

  onInventoryPerPageChange(inventoryPerPage: number) {
    this.paginationService.changeItemsPerPage(inventoryPerPage);
    this.updateFilteredInventory();
  }

  onPageChange(page: number) {
    this.paginationService.changePage(page);
    this.updateFilteredInventory();
  }

  updateFilteredInventory() {
    this.filteredInventory = this.paginationService.getFilteredItems();
  }

  onSearch(query: string) { 
    this.filteredInventory = this.inventory.filter(log => 
      log.item.toLowerCase().includes(query.toLowerCase()) || 
      log.brand.toLowerCase().includes(query.toLowerCase()) || 
      log.status.toLowerCase().includes(query.toLowerCase()) || 
      log.registrar.toLowerCase().includes(query.toLowerCase()) ||
      log.date.toLowerCase().includes(query.toLowerCase())
     ); 
  }
  exportInventory() {
    this.pdfService.exportPdf(this.filteredInventory, 'inventory'); // Just pass filteredItems directly
  }
}
