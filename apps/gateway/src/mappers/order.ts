type orderModel = {
  [key in string]: any;
};

export const toModel = (enity: orderModel): orderModel => {
  return {
    _id: enity.user._id,
    employeeId: enity.employeeId,
    order_number: enity.order_number,
    order_amount: enity.order_amount,
    checkout_type: enity.checkout_type,
    risk_score: enity.risk_score,
    limit: enity.limit,
    status: enity.status,
    is_activated: enity.is_activated,
    is_deleted: enity.is_deleted,
  };
};

export const toSearchModel = (entities: orderModel[]): orderModel[] => {
  return entities.map((entity) => {
    return toModel(entity);
  });
};
