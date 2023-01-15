import { body } from 'express-validator';

export const createInvitationValidation = () => {
  return [
    body('guestName')
      .exists()
      .withMessage('required'),
    body('dateOfEntry')
      .exists()
      .withMessage('required'),
    body('expirationDate')
      .exists()
      .withMessage('required')
  ];
};

export const deleteInvitationValidation = () => {
  return [
    body('id')
      .exists()
      .withMessage('required'),
  ];
};
// "guestName"
// "dateOfEntry"
// "expirationDate"