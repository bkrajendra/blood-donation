export class CreateUserDto {
  mobile: string;
  name: string;
  email: string;
  age: number;
  bloodGroup: string;
  address: string;
  hasHealthIssues?: boolean;
  healthIssueDetails?: string;
  isEligible?: boolean;
}