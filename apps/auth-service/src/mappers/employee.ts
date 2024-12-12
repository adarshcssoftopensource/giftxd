type clientModel = {
  [key in string]: any;
};

export const toModel = (enity: clientModel): clientModel => {
  return {
    _id: enity.user._id,
    country_code: enity.user.country_code,
    phone_number: enity.user.phone_number,
    firstname: enity.user.firstname,
    lastname: enity.user.lastname,
    country: enity.user.country,
    avatar: enity.user.avatar,
    email: enity.user.email,
    // emp fields
    can_accept_orders: enity.can_accept_orders,
    terminated_period: enity.terminated_period,
    can_void_orders: enity.can_void_orders,
    employment_type: enity.employment_type,
    two_factor_auth: enity.two_factor_auth,
    strikes_count: enity.strikes_count,
    created_at: enity.created_at,
    updated_at: enity.updated_at,
    assign_to: enity.assign_to,
    teminated: enity.teminated,
    address: enity.address
  };
};

export const toSearchModel = (entities: clientModel[]): clientModel[] => {
  return entities.map((entity) => {
    return toModel(entity);
  });
};

// @Prop()
// employment_type: string;

// @Prop()
// assign_to: string;

// @Prop()
// address: string;

// // @Prop()
// // phone_number: number;

// // @Prop()
// // password: string;

// @Prop()
// two_factor_auth: boolean;

// @Prop()
// can_accept_orders: boolean;

// @Prop()
// can_void_orders: boolean;

// @Prop()
// teminated: boolean;

// @Prop()
// terminated_period: number;

// @Prop()
// strikes_count: number;
