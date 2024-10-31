import { IsDate, IsString } from "class-validator";

export class DateDto{
    @IsString()
    date: string = "";

    @IsDate()
    startDate: Date;

    @IsDate()
    endDate: Date;
}