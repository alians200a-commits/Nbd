export interface ManagedChapter { id:number; title:string; description:string;image:string;visible:boolean;order:number }
export interface ManagedLesson { id:string;chapter:number;title:string;text:string;page:number;question:string;answer:string;images:string[];visible:boolean;order:number }
export interface ManagedAnnouncement {id:string;title:string;text:string;image:string;visible:boolean;order:number}
export interface ManagedCatalog {
 version:number; updatedAt:string;
 chapters:ManagedChapter[];
 lessons:ManagedLesson[];
 announcements:ManagedAnnouncement[];
}
export const emptyCatalog=():ManagedCatalog=>({version:1,updatedAt:'',chapters:[],lessons:[],announcements:[]});
