import { UnprocessableEntityException } from '@nestjs/common';

type clientModel = {
  [key in string]: any;
};

export const toModel = (enity: clientModel): clientModel => {
  return {
    _id: enity.user._id,
    firstname: enity.user.firstname,
    lastname: enity.user.lastname,
    email: enity.user.email,
    avatar: enity.user.avatar,
    phone_number: enity.user.phone_number,
    country: enity.user.country,
    country_code: enity.user.country_code,
    limit: enity.limit,
    completed: enity.completed,
    number_of_orders: 0,
    is_activated: enity.is_activated,
    is_deleted: enity.is_deleted,
    twofa_enabled: enity.twofa_enabled,
    twofa_secret: enity.twofa_secret,
    signup_date: enity.signup_date,
    identity_verif_status: enity.identity_verif_status,
    residency_verif_status: enity.residency_verif_status,
    created_at: enity.created_at,
    updated_at: enity.updated_at,
  };
};

export const toSearchModel = (entities: clientModel[]): clientModel[] => {
  return entities.map((entity) => {
    return toModel(entity);
  });
};
