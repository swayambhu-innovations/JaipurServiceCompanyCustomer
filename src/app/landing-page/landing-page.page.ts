import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  /*
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      console.log("firebase.firestore", firebase.firestore)
    })
    AOS.init();
    $('.js-tilt').tilt({
      scale: 1.1
    })
    document.getElementById("franchiseForm").addEventListener("submit", submit);
    function submit(event) {
      event.preventDefault();
      event.stopPropagation();
      console.log(document.getElementById('franchiseName'))
      // add html with franchiseName, contactNumber, email, message in a table
      var html = `
      <table>
        <tr>
          <td>Franchise Name</td>
          <td>${document.getElementById('franchiseName').value}</td>
        </tr>
        <tr>
          <td>Contact Number</td>
          <td>${document.getElementById('contactNumber').value}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>${document.getElementById('email').value}</td>
        </tr>
        <tr>
          <td>Message</td>
          <td>${document.getElementById('message').value}</td>
        </tr>
      </table>
      `
      var data = {
        "franchiseName": document.getElementById('franchiseName').value,
        "contactNumber": document.getElementById('contactNumber').value,
        "email": document.getElementById('email').value,
        "message": document.getElementById('message').value,
        to: "info@urbanlaundry.co",
        message: {
          subject: 'Franchise Request',
          html: html,
        },
      }
      console.log(data);
      firebase.firestore().collection('webMail').add(data).then(() => {
        alert("Thank you for your interest in Urban Laundry. We will get back to you soon.")
      });
    }
  </script>
  */
}
