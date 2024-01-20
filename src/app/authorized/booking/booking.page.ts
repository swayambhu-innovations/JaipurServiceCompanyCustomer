import { Component, OnInit } from '@angular/core';
import { BookingService } from './booking.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  customerReviews: any[] = [];
  currentDate = new Date();
  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.getAllRevies();
  }

  getAllRevies() {
    this.bookingService.getAllReviews().then((reviews) => {
      reviews.docs.map((review) => {
        let aReview = review.data()
        aReview['date'] = new Date((aReview['date'])*1000).toDateString();
        this.customerReviews.push(aReview);
      });
    });
  }

  reviewForm = new FormGroup({
    name: new FormControl('', Validators.required),
    review: new FormControl('', Validators.required),
    comment: new FormControl('', Validators.required),
    date: new FormControl(this.currentDate),
    rating: new FormControl('', Validators.required),
  });

  onSubmit() {
    this.setOpen(false);
    if (this.reviewForm.valid) {
      const newReview: Review = {
        name: this.name?.value,
        date: this.currentDate,
        review: this.review?.value,
        comment: this.comment?.value,
        // there is a problem when i convert this rating to  number
        rating: this.rating?.value,
      };

      this.bookingService.addReview(newReview);
    }
  }

  get name() {
    return this.reviewForm.get('name');
  }
  get review() {
    return this.reviewForm.get('review');
  }
  get comment() {
    return this.reviewForm.get('comment');
  }
  get rating() {
    return this.reviewForm.get('rating');
  }

  CustomerReview = [
    {
      Name: 'Vikas Rajput',
      review: 'Excellent Service',
      date: '12 Jan, 2023',
      Comment:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Excellent service 👍',
    },
    {
      Name: 'Vikas Rajput',
      review: 'Excellent Service',
      date: '12 Jan, 2023',
      Comment:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Excellent service 👍',
    },
    {
      Name: 'Vikas Rajput',
      review: 'Excellent Service',
      date: '12 Jan, 2023',
      Comment: '4517 Washington Ave. Manchester, Kentucky 39495',
    },
  ];

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}

export interface Review {
  id?: string | null | undefined;
  name: string | null | undefined;
  date: Date | null | undefined;
  review: string | null | undefined;
  comment: string | null | undefined;
  rating: string | null | undefined;
}
