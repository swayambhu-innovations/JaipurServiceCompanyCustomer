import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { FileService } from '../db_services/file.service';
import { async } from 'rxjs';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { log } from 'console';
import { ProfileService } from '../db_services/profile.service';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { DataProviderService } from 'src/app/core/data-provider.service';
const CASHE_FOLDER = "CASHED_IMG";

interface bannerConfig {
  image: string;
  url: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  todayDate: number = Date.now();

  promotionalBanners: bannerConfig[] = [
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com',
    },
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com',
    },
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com',
    },
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com',
    },
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com',
    },
  ];

  // stageClasses = {
  //   pending: "red",
  //   complete: 
  // }




  banners: any[] = [];
  recentActivityData: any[] = [];
  categories: any[] = []; // added by ronak
  icon: any[] = []; // added by ronak
 

  constructor(private router: Router, private profileService: ProfileService,private dataProvider:DataProviderService, public homeService: HomeService, private imageService: FileService, private http: HttpClient) {

  }

  ngOnInit() {
    this.fetchBanners();
    this.recentActivity();
    this.fetchMainCategory(); // added by ronak
    this.fetchMainCategoryIcon(); // added by ronak
    this.dataProvider.mainCategories.subscribe(categories => {
      this.categories = categories;
    })
  }

  fetchBanners() {
    this.homeService.getBanners().then((images) => {
      this.banners = images.docs.map((doc) => {
        return doc.data()
      });
      this.getImage(this.banners[0].img);
    });
  }
  // added by ronak
  async fetchMainCategory() {

    // await this.homeService.getCategory().then((name) => {
    //   this.categories = name.docs.map((doc) => {
    //     this.categories = [...this.categories];
    //     return doc.data()
    //   });
    // })
  }
  fetchMainCategoryIcon() {
    this.homeService.getCategory().then((icon) => {
      this.icon = icon.docs.map((doc) => {
        this.icon = [...this.icon];
        return doc.data()
      });
    })
  }
  // till here 

  cart() {
    this.router.navigate(['cart']);
  }

  booking() {
    this.router.navigate(['booking']);
  }

  home() {
    this.router.navigate(['home']);
  }
  notification() {
    this.router.navigate(['notification']);
  }


  async recentActivity(){
    await this.homeService.getRecentBookings().then((activity) => {
      this.recentActivityData = activity.docs.map((doc) => {
        return doc.data();
      })
    })
  }

  condition: boolean = true;
  prevText: string = '';
  // programmingLanguages: any[] = ['java', 'c++',
  //     'python', 'c', 'javascript'];
  res_list = [];
  res_cnt: number = 0;
  public searchInput!: any;
  public programmingLanguages: Array<any> = [
    'Python',
    'TypeScript',
    'C',
    'C++',
    'Java',
    'Go',
    'JavaScript',
    'PHP',
    'Ruby',
    'Swift',
    'Kotlin',
  ];

  Cleaning = [
    {
      label: 'Kitchen Cleaning',
      img: '/assets/Mask Group.png',
    },
    {
      label: 'Deep House Clean',
      img: '/assets/Mask Group (1).png',
    },
    {
      label: 'Deep House Clean',
      img: '/assets/Mask Group.png',
    },
  ];
  ACRepair = [
    {
      label: 'AC Deep Cleaning',
      img: '/assets/Group 34037.png',
    },
    {
      img: '/assets/Mask Group (2).png',
      label: 'Noise/Smell Issues',
    },
    {
      label: 'Noise/Smell Issues',
      img: '/assets/Group 34037.png',
    },
  ];
  BathroomCleanings = [
    {
      label: 'Monthly Cleaning',
      img: '/assets/Group 34037 (1).png',
    },
    {
      label: 'Quarterly Cleaning',
      img: '/assets/Mask Group (3).png',
    },
    {
      label: 'Quarterly Cleaning',
      img: '/assets/Mask Group (3).png',
    },
  ];

  onSubmit($event: KeyboardEvent) {
    if ($event.keyCode === 13) {
      this.condition = !this.condition;
      this.prevText = this.searchInput;
      this.res_cnt = 0;
      this.res_list = [];
      // setTimeout(() => {
      //     this.condition = false;
      //     for (let i = 0; i < this.programmingLanguages.length; i++) {
      //         if (this.programmingLanguages[i] === this.prevText.toLowerCase()
      //             || this.programmingLanguages[i].startsWith(this.prevText)) {
      //             this.res_cnt += 1;
      //             // this.res_list.push(this.programmingLanguages[i]);
      //         }
      //     }
      // }, 3000);
      this.searchInput = null;
    }
  }

  getImage(url: string) {
    let imageName = url.split('/').pop();
    if (imageName?.includes('?')) {
      imageName = imageName.split("?")[0];
      imageName = imageName.replaceAll("%2", "");
    }
    let fileType = url.split('.').pop();
    if (fileType?.includes('?')) {
      fileType = fileType.split("?")[0];
    }
    //debugger
    Filesystem.readFile({
      directory: Directory.Cache,
      path: `${CASHE_FOLDER}/${imageName}`
    }).then(async readFile => {
      //console.log("Local File",imageName, readFile);
      if (readFile.data === "") {
        let file = await this.saveImage(url, imageName);
        // console.log("server file")
        return `data:image/${fileType};base64,${file}`;
      } else
        return `data:image/${fileType};base64,${readFile.data}`;
    }).catch(async e => {
      // wirte a file
      //console.log("e........: ", e)
      let file = await this.saveImage(url, imageName);
      Filesystem.readFile({
        directory: Directory.Cache,
        path: `${CASHE_FOLDER}/${imageName}`
      }).then(readFile => {
        return `data:image/${fileType};base64,${readFile.data}`;
      })
    }).finally(() => {
      // console.log("CASHE_FOLDER........: ", CASHE_FOLDER)
    });
  }

  async saveImage(url: string, path) {
    //debugger
    // this.http.get(url).subscribe({
    //   next:(rspose)=>{
    //     console.log("response: ",response)
    //   },
    //   error:(error)=>{
    //     console.log("eer.........:",error)
    //   }

    // })
    // let xhr = new XMLHttpRequest();
    // xhr.responseType = 'blob';
    // xhr.onload = (event) => {
    //   console.log("xhr.response: ",xhr.response)
    //   const blob = xhr.response;
    //   console.log("blob...........: ",blob)
    // };
    // xhr.open('GET', url,true);
    // xhr.setRequestHeader("Origin",location.origin);
    // xhr.setRequestHeader("mode",'no-cors');
    // xhr.send();

    const response: any = await fetch(url, {
      headers: new Headers({
        'Origin': location.origin
      }),
      mode: 'no-cors'
    }).then(response => {
      // console.log("response....... ",response.body)
    }).catch(error => {
      console.log("errror.....", error);
    });
    // convert to a Blob
    // debugger
    let blob = await response.body?.blob();
    const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      //console.log("blob...........: ",blob)
      reader.readAsDataURL(blob);
    });
    // convert to base64 data, which the Filesystem plugin requires
    const base64Data = await convertBlobToBase64(blob) as string;
    // console.log("Saving.................");

    const savedFile = await Filesystem.writeFile({
      path: `${CASHE_FOLDER}/${path}`,
      data: base64Data,
      directory: Directory.Cache
    });
    return savedFile;
  }
}

export interface Banner {
  id?: string | null | undefined;
  title: string | null | undefined;
  bannerUrl: string | null | undefined;
  start: string | null | undefined;
  end: string | null | undefined;
  img: string;
  bannerNo?: number | null | undefined;
}