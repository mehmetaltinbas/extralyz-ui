import type { PublicUser } from 'src/features/user/types/public-user.interface';
import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface ReadSinglePublicUserResponse extends ResponseBase {
    user?: PublicUser;
}
