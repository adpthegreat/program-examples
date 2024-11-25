import { Account, String, Pubkey, Result, Signer, u8 } from '@solanaturbine/poseidon';

export default class CloseAccount {
  static PROGRAM_ID = new Pubkey('AtUc6zMfozxrQoK4PbDUnd5daS86XCPuT2og1293P5XXo');

  createUser(user: Signer, userState: UserState, name: String<50>): Result {
    userState.derive(['USER', user.key]).init(user);

    userState.userBump = userState.getBump();

    userState.user = user.key;

    userState.name = name;
  }
  closeUser(userAccount: UserState, user: Signer): Result {
    userAccount.derive(['USER', user.key]).close(user);
  }
}

export interface UserState extends Account {
  userBump: u8;
  name: String<50>;
  user: Pubkey;
}