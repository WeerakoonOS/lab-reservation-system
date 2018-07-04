import { Component, OnInit } from '@angular/core';
import { Booking } from '../models/booking.model';
import { BookingService } from '../services/booking.service';
import { LabService } from '../services/lab.service';
import { Lab } from '../models/lab.model';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {

  bookings: Booking[];
  bookingList = new Map<String, Booking[]>();
  labs: Lab[];
  selected = 'option2';

  constructor(private bookingService: BookingService, private labService: LabService) { }

  ngOnInit() {
    this.refreshLabList();
    this.refreshBookingList();
  }

  // Save Booking
  saveBooking(booking: Booking) {
    if (booking._id === '') {
      // New booking
      this.bookingService.postBooking(booking).subscribe((res) => {
        console.log(res);
        this.refreshBookingList();
      }, (err) => {
        console.log(err.error);
      });
    } else {
      // Update booking
      this.bookingService.putBooking(booking).subscribe((res) => {
        console.log(res);
        this.refreshBookingList();
      }, (err) => {
        console.log(err.error);
      });
    }
  }

  // Delete a booking
  deleteBooking(booking: Booking) {
    if (confirm('Are you sure, you want to delete the reservation?') === true) {
      this.bookingService.deleteBooking(booking).subscribe((res) => {
        console.log('Deleted');
        const index: number = this.bookings.indexOf(booking);
        if (index !== -1) {
          this.bookings.splice(index, 1);
        }
      }, (err) => {
        console.log(err);
      });
    }
  }

  // Refresh Bookings
  refreshBookingList() {
    this.bookingService.getBookingList().subscribe((res) => {
      this.bookings = res as Booking[];
      this.labs.forEach(lab => {
        this.bookingList.set(lab.name, this.bookings.filter(book => book.labId === lab.name));
      });
      console.log(this.bookingList);
    }, (err) => {
      console.log(err);
    });
  }

  // Refresh Lab list
  refreshLabList() {
    this.labService.getLabList().subscribe((res) => {
      this.labs = res as Lab[];
    }, (err) => {
      console.log(err);
    });
  }
}
