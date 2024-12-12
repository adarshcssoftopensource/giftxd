type affiliateModel = {
  [key in string]: any;
};

export const toModel = (enity: affiliateModel): affiliateModel => {
  return {
    _id: enity._id,
    user_name: enity.user_name,
    full_name: enity.full_name,
    email: enity.email,
    company_name: enity.company_name,
    total_payouts: enity.total_payouts,
    payment_method: enity.payment_method,
    date_onboarded: enity.date_onboarded,
  };
};

export const toSearchModel = (entities: affiliateModel[]): affiliateModel[] => {
  return entities.map((entity) => {
    return toModel(entity);
  });
};
