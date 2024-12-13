import { CommonModule } from '@angular/common';
import { ItemService } from './../../services/item.service';
import { apiService } from '../../services/api.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from '../../component/header/header.component';
import { PaginationComponent } from '../../component/pagination/pagination.component';
import { ModalComponent } from '../../component/modal/modal.component';
import { PaginationService } from '../../services/pagination.service';
import Swal from 'sweetalert2';
import { RoomService } from '../../services/room.service';
import { BrandService } from '../../services/brand.service';
import { ImageService } from '../../services/image.service';
import { PdfService } from '../../services/pdf.service';
import { LucideAngularModule } from 'lucide-angular';

interface Room {
  _id: string;
  name: string;
}
interface Brand {
  _id: string;
  name: string;
}
interface Item {
  _id: string;
  name: string;
  brand: Brand;
  barcode: string;
  status: string;
  room: Room;
}
@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    PaginationComponent,
    ModalComponent, LucideAngularModule
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent implements OnInit {
  private itemService = inject(ItemService);
  private apiService = inject(apiService);
  private roomService = inject(RoomService);
  private brandService = inject(BrandService);

  pageTitle = 'Item List';
  profileForm: FormGroup;
  isAdditionalStatusVisible = false; 
  additionalStatusOptions = [ 
    { label: 'Good', value: 'Good' }, 
    { label: 'Damage', value: 'Damaged' } 
  ];

  currentItem: any = null;
  isModalOpen = false;

  paginationService = inject(PaginationService);
  items: Item[] = [];
  rooms: Room[] = [];
  brands: Brand[] = [];
  filteredItems: any[] = [];

  modalFields: Array<{
    name: string;
    label: string;
    type: string;
    placeholder: string;
    isStatus?: boolean;
    isRequired?: boolean;
    options: Array<{ label: string; value: string }>;
  }> = [
    {
      name: 'barcode',
      label: 'Barcode',
      type: 'text',
      placeholder: 'Enter barcode',
      options: [],
      isRequired:false
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name',
      options: [],
    },
    {
      name: 'room',
      label: 'Room',
      type: 'select',
      placeholder: 'Select Room',
      options: [],
    },
    {
      name: 'brand',
      label: 'Brand',
      type: 'select',
      placeholder: 'Select brand',
      options: [],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      isStatus:true,
      options: [
        { label: 'Find', value: 'Find' },
        { label: 'Good', value: 'Good' },
        { label: 'Damage', value: 'Damage' },
        { label: 'Missing', value: 'Missing' }
      ],
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      placeholder: 'Enter quantity',
      options: [],
    }
  ];

  constructor(private formBuilder: FormBuilder, private pdfService: PdfService) {
    this.profileForm = this.formBuilder.group({
      item: ['', Validators.required],
      brand: ['', Validators.required],
      room: ['', Validators.required],
      status: ['', Validators.required],
      additionalStatus: [''], 
      quantity: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.BROWSE();
  }

  setFieldOptions() {
    const rooms = this.rooms;
    const brands = this.brands;
    // const brands = this.brandService.getItems();
    // const items = this.itemService.getItems();
    this.modalFields.forEach(field => {
      if (field.name === 'room') {
        field.options = rooms.map(room => ({ label: room.name, value: room._id }));
      }
      if (field.name === 'brand') {
        field.options = brands.map(brand => ({ label: brand.name, value: brand._id }));
      }
      if (field.name === 'barcode') {
        // field.options = items.map(item => ({ label: item.barcode, value: item.barcode }));
      }
      if (field.name === 'item') {
        //  field.options = items.map(item => ({ label: item.item, value: item.item }));
      }
    });
  }

  BROWSE = () => {
    this.apiService
      .fetch(this.itemService, 'BROWSE', '')
      .subscribe(({ payload = {} }) => {
        const { rooms, items, brands } = payload;
        this.items = [...items];
        this.rooms = [...rooms];
        this.brands = [...brands];
        this.updateFilteredItems();
        this.rooms.sort((a, b) => a.name.localeCompare(b.name));
        this.paginationService.setItems(items);
        this.setFieldOptions();
        this.updateFilteredItems();
      });
  }

  handleSubmit = (item: Item) => {
    const index = this.items.findIndex(({ _id }) => _id === item._id);
    const isUpdate = index > -1;
    const fakeStorage = localStorage.getItem('auth')
    var auth={_id:""}
    if(fakeStorage){
      auth=JSON.parse(fakeStorage)
    }
    this.apiService
      .fetch(this.itemService, isUpdate ? 'UPDATE' : 'SAVE', {...item, registrar:auth._id})
      .subscribe(({ payload = {} }) => {
        console.log(payload);
        if (isUpdate) {
          this.items[index] = { ...payload };

        } else {
          this.items.unshift(payload);
        }
        Swal.fire({
          title: 'Success!',
          text: `Item ${isUpdate ? 'Updated' : 'Added'} successfully!`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.BROWSE();
        this.paginationService.setItems(this.items);
        this.updateFilteredItems();
        this.isModalOpen = false;
      });
  };

  handleDestroy = (_id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this item',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService
          .fetch(this.itemService, 'DESTROY', { _id })
          .subscribe(({ payload = {} }) => {
            const index = this.items.findIndex(
              ({ _id = '' }) => _id === payload?._id
            );
            this.items?.splice(index, 1);
            this.paginationService.setItems(this.items);
            this.updateFilteredItems();
          });
        Swal.fire('Deleted!', 'The item has been deleted.', 'success');
      }
    });
  };

  updateRoomsAndItems() {
    this.setFieldOptions();
    this.rooms.sort((a, b) => a.name.localeCompare(b.name));
    this.updateFilteredItems();
  }

  openModal(item: Item) {
    this.currentItem = item;
    this.isModalOpen = true;
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
    this.filteredItems = this.items.filter(
      (item: Item) =>
      item.name.toLowerCase().includes(query.toLowerCase())||
      item.brand.name.toLowerCase().includes(query.toLowerCase())||
      item.barcode.toLowerCase().includes(query.toLowerCase())
    );
  }

  exportItemsPdf() {
    this.pdfService.exportPdf(this.filteredItems, 'item', true);
  }

  onStatusChange(event: any) {
    const status = event.target.value;
    this.isAdditionalStatusVisible = status === 'Find';
    if (!this.isAdditionalStatusVisible) {
      this.profileForm.get('additionalStatus')?.reset();
    }
  }
}
