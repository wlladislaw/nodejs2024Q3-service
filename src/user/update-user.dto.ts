import { IsDefined, IsNotEmpty } from "class-validator";

export class UpdatePasswordDto {
  @IsDefined()
  oldPassword: string; // previous password
  @IsDefined()
  newPassword: string; // new password
}
