import { apiService } from './../../services/api.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../component/header/header.component';
import { BrandService } from '../../services/brand.service';
import { PaginationService } from '../../services/pagination.service';
import { PaginationComponent } from '../../component/pagination/pagination.component';
import { ModalComponent } from '../../component/modal/modal.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { PdfService } from '../../services/pdf.service';
import { LucideAngularModule } from 'lucide-angular';

interface Brand {
  _id: string;
  name: string;
}
@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, PaginationComponent, ModalComponent, LucideAngularModule],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css'
})
export class BrandComponent {
  private apiService = inject(apiService)
  brandService = inject(BrandService);
  paginationService = inject(PaginationService);
  brand = this.brandService.getItems();
  pageTitle = 'Brand List';
  filteredItems: any[] = [];
  brands:Brand []= [];
  currentBrand: any = null;
  isModalOpen = false; 
  brandForm: FormGroup

  modalFields = [
    { name: 'name', label: 'Brand Name', type: 'text', placeholder: 'Enter brand name',   fullWidth: true }
  ];

  
  constructor(private formBuilder:FormBuilder, private pdfService:PdfService) {
    this.brandForm = this.formBuilder.group({
      brand: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.BROWSE();
  }
  
  BROWSE = () => {
    this.apiService
      .fetch(this.brandService, 'BROWSE', '')
      .subscribe(({ payload = [] }) => {
        this.brands = [...payload];
      
        this.paginationService.setItems(payload);
        this.updateFilteredItems();
        console.log("payload", payload)
      });
      
  };
  handleSubmit = (brand: Brand) => {
    const index = this.brands.findIndex(({ _id }) => _id === brand._id);
    const isUpdate = index > -1;
      this.apiService
        .fetch(this.brandService, isUpdate ? 'UPDATE' : 'SAVE', brand)
        .subscribe(({ payload = {} }) => {
          console.log(payload);
          if (isUpdate) {
            this.brands[index] = { ...payload };
          } else {
            this.brands.unshift(payload);
          }
          Swal.fire({
            title: 'Success!',
            text:  `Brand ${isUpdate ? 'Updated' : 'Added'} successfully!`,
            icon: 'success',
            confirmButtonText: 'OK'
          });

          this.paginationService.setItems(this.brands);
          this.updateFilteredItems();
          this.isModalOpen = false;
        });  
  };

  handleDestroy = (_id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this brand',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService
          .fetch(this.brandService, 'DESTROY', { _id })
          .subscribe(({ payload = {} }) => {
            const index = this.brands.findIndex(
              ({ _id = '' }) => _id === payload?._id
            );
            this.brands?.splice(index, 1);
            this.paginationService.setItems(this.brands);
            this.updateFilteredItems();
          });
        Swal.fire('Deleted!', 'The item has been deleted.', 'success');
      }
    });
  };
  

  openModal(brand: any) {
    this.currentBrand = brand;
    this.isModalOpen = true; 
    console.log("brand: ", brand);
  } 


  onItemsPerPageChange(itemsPerPage: number) {
    this.paginationService.changeItemsPerPage(itemsPerPage);
    this.updateFilteredItems();
  }

  onPageChange(page: number) {
    this.paginationService.changePage(page);
    this.updateFilteredItems();
  }

  updateFilteredItems() {
    this.filteredItems = this.paginationService.getFilteredItems();
  }


  onSearch(query: string) { 
    this.filteredItems = this.brand.filter(brand => 
      brand.name.toLowerCase().includes(query.toLowerCase())
    ); 
  }
  exportBrand() {
    this.pdfService.exportPdf(this.filteredItems, 'brand'); // Just pass filteredItems directly
  }
}
