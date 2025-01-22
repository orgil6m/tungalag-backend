import { ToNumber } from "./tools";

type Pagination = {
  total?: number;
  pageCount?: number;
  start?: number;
  end?: number;
  limit?: number;
  nextPage?: number;
  prevPage?: number;
  page?: number;
};

const paginate = async (
  page: any,
  limit: any,
  model: any,
  queryOptions: {}
) => {
  const total = await model.countDocuments(queryOptions);
  return {
    total,
    page: ToNumber(page),
    limit: ToNumber(limit),
    totalPages: Math.ceil(total / ToNumber(limit)),
  };
};

export default paginate;
