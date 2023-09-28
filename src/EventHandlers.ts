import {
  ERC4626Contract_Approval_loader,
  ERC4626Contract_Approval_handler,
  ERC4626Contract_Transfer_loader,
  ERC4626Contract_Transfer_handler,
  ERC4626Contract_Deposit_handler,
  ERC4626Contract_Deposit_loader,
  ERC4626Contract_Withdraw_handler,
  ERC4626Contract_Withdraw_loader,
} from "../generated/src/Handlers.gen";

import { shareEntity } from "../generated/src/Types.gen";
import { ERC4626Contract } from "./src/Types.bs";

ERC4626Contract_Approval_loader(({ event, context }) => {
  // loading the required accountEntity
  context.share.ownerShareChangesLoad(event.params.owner.toString());
});

ERC4626Contract_Approval_handler(({ event, context: { share } }) => {
  //  getting the owner accountEntity
  let ownerShare = share.ownerShareChanges;

  // setting the new allowance for owner
  let shareObject: shareEntity = {
    id: ownerShare?.id || event.params.owner.toString(),
    approval: event.params.amount,
    balance: ownerShare?.balance || 0n,
  };

  // store the new owner allowance
  share.set(shareObject);
});

ERC4626Contract_Transfer_loader(({ event, context }) => {
  // loading the required accountEntity
  context.share.senderShareChangesLoad(event.params.from.toString());
  context.share.receiverShareChangesLoad(event.params.to.toString());
});

ERC4626Contract_Transfer_handler(({ event, context: { share } }) => {
  // getting the sender accountEntity
  let senderShare = share.senderShareChanges;

  // setting the new allowance for owner
  let senderShareObject: shareEntity = {
    id: senderShare?.id || event.params.from.toString(),
    approval: event.params.amount || 0n,
    balance: senderShare?.balance || 0n - event.params.amount,
  };  

  // setting the accountEntity with the new transfer field value
  share.set(senderShareObject);

  // getting the sender accountEntity
  let receiverShare = share.receiverShareChanges;

  // setting the new allowance for owner
  let receiverShareObject: shareEntity = {
    id: receiverShare?.id || event.params.from.toString(),
    approval: event.params.amount || 0n,
    balance: receiverShare?.balance || 0n + event.params.amount,
  };  


  if (receiverAccount != undefined) {
    // setting accountEntity object
    let accountObject: accountEntity = {
      id: receiverAccount.id,
      approval: receiverAccount.approval,
      balance: receiverAccount.balance + event.params.amount,
    };

    // setting the accountEntity with the new transfer field value
    account.set(accountObject);
  } else {
    // setting accountEntity object
    let accountObject: accountEntity = {
      id: event.params.to.toString(),
      approval: 0n,
      balance: event.params.amount,
    };

    // setting the accountEntity with the new transfer field value
    account.set(accountObject);
  }
});

ERC4626Contract_Deposit_loader(({ event, context }) => {
  // loading the required accountEntity
  context.account.depositAccountChangesLoad(event.params.account.toString());
});