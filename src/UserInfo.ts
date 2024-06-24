import { DataClass, FilterType } from "./DataController";

export class UserInfo extends DataClass {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    gender: string
  ) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.gender = gender;
  }
  static fromString(data: string, delimiter = ",") {
    const [id, firstName, lastName, email, gender] = data.split(delimiter);
    return new UserInfo(id, firstName, lastName, email, gender)
  }
  filter(filter: FilterType<this>) {
    return Object.entries(filter).some(([key, value]) => this[key] === value);
  }
}
