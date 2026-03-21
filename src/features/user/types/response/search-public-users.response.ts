import type { PublicUser } from 'src/features/user/types/public-user.interface';
import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface SearchPublicUsersResponse extends ResponseBase {
    users?: PublicUser[];
}
