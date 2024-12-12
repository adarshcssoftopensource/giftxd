type employeeModel = {
  [key in string]: any;
};

export const toModel = (enity: employeeModel): employeeModel => {
  return {
    _id: enity._id,
    employment_type: enity.employment_type,
    full_name: enity.full_name,
    email: enity.email,
    assign_to: enity.assign_to,
    address: enity.address,
    phone_number: enity.phone_number,
    password: enity.password,
    two_factor_auth: enity.two_factor_auth,
    onboarded_date: enity.onboarded_date,
    avatar: enity.avatar,
    orders_completed: 0,
  };
};

export const toSearchModel = (entities: employeeModel[]): employeeModel[] => {
  return entities.map((entity) => {
    return toModel(entity);
  });
};
