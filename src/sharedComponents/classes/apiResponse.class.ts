import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from "@nestjs/swagger";

export class ApiResponseDto<T> {
    @ApiProperty({ description: 'The data of the response' })
    data: T;
}

export const ApiResponseWrapper = <T extends Type<any>>(model: T) => {
    return applyDecorators(
        ApiExtraModels(ApiResponseDto, model),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ApiResponseDto) },
                    {
                        properties: {
                            data: { $ref: getSchemaPath(model) },
                        },
                    },
                ],
            },
        }),
    );
};