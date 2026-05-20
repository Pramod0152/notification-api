import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export class PaginationDto {
    @ApiPropertyOptional({ description: 'The limit of the data. Default is 10.'})
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    limit?: number;

    @ApiPropertyOptional({ description: 'The page number. Default is 1.'})
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    offset?: number;


}