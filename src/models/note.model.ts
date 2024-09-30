import { DatePipe } from "@angular/common";

export interface Note {
    id: string;
    title: string;
    description: string;
    likes: number;
    created: DatePipe;
    lastEdited:  DatePipe;
    links: string[];
    bookmarked: boolean;
}