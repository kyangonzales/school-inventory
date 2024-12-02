import { apiService } from './../../services/api.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../component/header/header.component';
import { RoomService } from '../../services/room.service';
import { PaginationService } from '../../services/pagination.service';
import { PaginationComponent } from '../../component/pagination/pagination.component';
import { ModalComponent } from '../../component/modal/modal.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { PdfService } from '../../services/pdf.service';
import { LucideAngularModule } from 'lucide-angular';

interface Room {
  _id: string;
  name: string;
  items:any[],
}
@Component({
  selector: 'app-room',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, PaginationComponent, ModalComponent, LucideAngularModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent {

  // modal don sa view
  viewRoom = false
  items:any
  toggleModal() {
    this.viewRoom = !this.viewRoom;
  }
 handleViewItems(items:any){
  this.items=items
  this.toggleModal()
 }

  exportData() {
    // this.pdfService.exportPdf(this.filteredItems, 'roomInventory'); 
    // palitan mo ng kung ano yung filtered na room item yung mga name tapos good, damage, missing, pasahan mo ng parameter na roomInventory 
  }




  private apiService = inject(apiService)
  roomService = inject(RoomService);
  paginationService = inject(PaginationService);
  roomForm: FormGroup
  pageTitle = 'Room List';
  modalFields = [
    { name: 'name', label: 'Room Name', type: 'text', placeholder: 'Enter Room name',  fullWidth: true }
  ];
  filteredItems: any[] = [];
  rooms:Room []= [];

  constructor(private formBuilder:FormBuilder, private pdfService:PdfService ) {
    this.roomForm = this.formBuilder.group({
      item: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.BROWSE();
  }

  BROWSE = () => {
    this.apiService
      .fetch(this.roomService, 'BROWSE', '')
      .subscribe(({ payload = [] }) => {
        this.rooms = [...payload];
        this.paginationService.setItems(payload);
        this.updateFilteredItems();
      });
  };


  handleSubmit = (room: Room) => {
    const index = this.rooms.findIndex(({ _id }) => _id === room._id);
    const isUpdate = index > -1;
      this.apiService
        .fetch(this.roomService, isUpdate ? 'UPDATE' : 'SAVE', room)
        .subscribe(({ payload = {} }) => {
          console.log(payload);
          if (isUpdate) {
            this.rooms[index] = { ...payload };
          } else {
            this.rooms.unshift(payload);
          }
          Swal.fire({
            title: 'Success!',
            text:  `Room ${isUpdate ? 'Updated' : 'Added'} successfully!`,
            icon: 'success',
            confirmButtonText: 'OK'
          });

          this.paginationService.setItems(this.rooms);
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
          .fetch(this.roomService, 'DESTROY', { _id })
          .subscribe(({ payload = {} }) => {
            const index = this.rooms.findIndex(
              ({ _id = '' }) => _id === payload?._id
            );
            this.rooms?.splice(index, 1);
            this.paginationService.setItems(this.rooms);
            this.updateFilteredItems();
          });
        Swal.fire('Deleted!', 'The item has been deleted.', 'success');
      }
    });
  };
  
    currentRoom: any = null;
    isModalOpen = false; 

    openModal(brand: any) {
      this.currentRoom = brand;
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
      this.filteredItems.sort((a, b) => a.name.localeCompare(b.name));  
    }

    onSearch(query: string) { 
      this.filteredItems = this.rooms.filter(room => 
        room.name.toLowerCase().includes(query.toLowerCase())
      ); 
    }
    exportRoomPdf() {
      this.pdfService.exportPdf(this.filteredItems, 'room'); 
      console.log(this.filteredItems)
    }
 
}
