import type { User } from "src/features/user/types/user.interface";
import type { ResponseBase } from "src/shared/types/response-base.interface";

export interface ReadSingleUserResponse extends ResponseBase {
    user?: User;
}
