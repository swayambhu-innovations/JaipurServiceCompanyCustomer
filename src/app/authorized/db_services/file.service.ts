import { Injectable } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
const CASHE_FOLDER = "CASHED_IMG";
@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

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
    debugger
   await Filesystem.readFile({
      directory:Directory.Cache,
      path:`${CASHE_FOLDER}/${imageName}`,
      encoding: Encoding.UTF8,
    }).then(readFile=>{
      debugger
      console.log("e........: ", readFile)
      console.log("Local File", readFile);
      return `data:image/${fileType};base64,${readFile.data}`;
    }).catch(async e =>{
      // wirte a file
      console.log("e........: ", e)
      await this.saveImage(url, imageName);
      await Filesystem.readFile({
        directory:Directory.Cache,
        path:`${CASHE_FOLDER}/${imageName}`
      }).then(readFile=>{
        return `data:image/${fileType};base64,${readFile.data}`;
      })
    }).finally(()=>{
      console.log("CASHE_FOLDER........: ", CASHE_FOLDER)
    });
  }

 async saveImage(url:string, path){
  debugger
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
}
