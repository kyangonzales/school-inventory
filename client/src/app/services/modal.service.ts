import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Field } from '../interface/field';
interface ModalState {
  isOpen: boolean;
  modalTitle: string;
  fields: Field[];
  onSubmitCallback: (formValue: any) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalState = new BehaviorSubject<ModalState>({
    isOpen: false,
    modalTitle: '',
    fields: [],
    onSubmitCallback: () => {}
  });

  getModalState() {
    return this.modalState.asObservable();
  }

  openModal(modalTitle: string, fields: Field[], onSubmitCallback: (formValue: any) => void) {
    this.modalState.next({
      isOpen: true,
      modalTitle,
      fields,
      onSubmitCallback
    });
  }

  closeModal() {
    this.modalState.next({ ...this.modalState.value, isOpen: false });
  }
}
