import { Injectable } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
const CASHE_FOLDER = "CASHED_IMG";
import {
  Storage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor( private storage: Storage) { }

  async getImage(url:string){
    let imageName = url.split('/').pop();
    if(imageName?.includes('?')){
      imageName = imageName.split("?")[0];
      imageName = imageName.replaceAll("%2","");
    }
    let fileType = url.split('.').pop();
    if(fileType?.includes('?')){
      fileType = fileType.split("?")[0];
    }
   await Filesystem.readFile({
      directory:Directory.Cache,
      path:`${CASHE_FOLDER}/${imageName}`,
      encoding: Encoding.UTF8,
    }).then(readFile=>{
      return `data:image/${fileType};base64,${readFile.data}`;
    }).catch(async e =>{
      // wirte a file
     
      await this.saveImage(url, imageName);
      await Filesystem.readFile({
        directory:Directory.Cache,
        path:`${CASHE_FOLDER}/${imageName}`
      }).then(readFile=>{
        return `data:image/${fileType};base64,${readFile.data}`;
      })
    }).finally(()=>{
    });
  }

 async saveImage(url:string, path){
    const response = await fetch(url);
  // convert to a Blob
    const blob = await response.blob();
    const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
    reader.readAsDataURL(blob);
  });
// convert to base64 data, which the Filesystem plugin requires
  const base64Data = await convertBlobToBase64(blob) as string;
       
  const savedFile = await Filesystem.writeFile({
      path:`${CASHE_FOLDER}/${path}`,
      data: base64Data,
      directory: Directory.Cache
    });
    return savedFile;
  }
  async convertDataUrlToBlob(dataUrl: string) {
    let res = await fetch(dataUrl);
    return res.blob();
  }

  async convertDataUrlToFile(dataUrl: string, fileName: string) {
    /** @description only supports images */
    let blob = await this.convertDataUrlToBlob(dataUrl);
    // currently only supports images
    fileName += '.' + blob.type.split('/')[1];
    return new File([blob], fileName, { type: blob.type });
  }

  async uploadFile(file: File, path: string, objectName: string) {
    // objectName is the name that will be used if any error occurs while uploading or verification
    if (this.verifyImage(file, objectName)) {
      path += `/${file.name}`;
      let fileRef = ref(this.storage, path);
      await uploadBytes(fileRef, file);
      return getDownloadURL(fileRef);
    }
    throw new Error(`Error while uploading ${objectName}`);
  }

  verifyImage(file: File | undefined, name: string): boolean {
    if (!file) {
      alert(`No ${name} image selected`);
      return false;
    }
    if (!file.type.startsWith('image/')) {
      alert(`${name} is not an image`);
      return false;
    }
    if (file.size < 1024 * 1024 * 2) {
      return true;
    }
    alert(`${name} image size is greater than 2MB`);
    return false;
  }
}
