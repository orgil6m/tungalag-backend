import asyncHandler from "express-async-handler";
import { Document, Model, Query } from "mongoose";
import MyError from "../utils/error";
import { AuthenticatedRequest } from "../middlewares/auth";
import paginate from "../utils/paginate";
import { ToNumber } from "../utils/tools";

interface ControllerOptions {
  select?: any;
  sort?: any;
  populate?: { path: string; select: string }[];
}

interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class CommonController<T extends Document> {
  constructor(
    private model: Model<T>,
    private options: ControllerOptions = {}
  ) {}

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { select, populate } = this.options;

    let query = this.model.findById(id).select(select);
    if (populate) {
      populate.forEach((field) => {
        query = query.populate(field.path, field.select);
      });
    }

    const data = await query;
    if (!data) throw new MyError(`${this.model.modelName} not found`);
    res.status(200).json({ success: true, data });
  });

  getAll = asyncHandler(async (req, res) => {
    const { select, sort, page, limit, search } = this.parseQuery(req.query);

    const queryOptions = this.buildSearchQuery(search);

    const query = this.buildQuery({
      queryOptions,
      select,
      sort,
      page,
      limit,
    });

    const [data, total] = await Promise.all([
      query.lean({ virtuals: true }),
      this.model.countDocuments(queryOptions),
    ]);

    if (!data.length) {
      throw new MyError(
        `${this.model.modelName}s not found with the current query criteria.`
      );
    }

    const pagination = this.buildPagination(page, limit, total);

    res.status(200).json({
      success: true,
      data,
      pagination,
    });
  });

  create = asyncHandler(async (req: AuthenticatedRequest, res) => {
    const createdBy = req.userId;
    if (!createdBy) throw new MyError("Та дахин нэвтэрнэ үү!", 403);
    req.body.createdBy = createdBy;
    const newData = new this.model(req.body);

    const savedData = await newData.save();
    res.status(201).json({ success: true, data: savedData });
  });

  updateById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { select } = this.options;

    const updatedData = await this.model
      .findByIdAndUpdate(id, req.body, { new: true })
      .select(select);

    if (!updatedData) throw new MyError(`${this.model.modelName} not found`);
    res.status(200).json({ success: true, data: updatedData });
  });

  deleteById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedData = await this.model.findByIdAndDelete(id);
    if (!deletedData) throw new MyError(`${this.model.modelName} not found`);
    res
      .status(200)
      .json({ success: true, message: `${this.model.modelName} deleted` });
  });

  private parseQuery = (
    query: any
  ): {
    select?: string;
    sort?: string;
    page: number;
    limit: number;
    search?: string;
  } => {
    return {
      select: query.select as string,
      sort: query.sort as string,
      page: parseInt(query.page as string, 10) || 1,
      limit: parseInt(query.limit as string, 10) || 10,
      search: query.search as string,
    };
  };

  private buildSearchQuery = (search?: string): any => {
    if (!search) return {};

    const searchFields = Object.keys(this.model.schema.paths).filter(
      (field) => !["createdAt", "updatedAt", "__v"].includes(field)
    );

    return {
      $or: searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })),
    };
  };

  private buildQuery = ({
    queryOptions,
    select,
    sort,
    page,
    limit,
  }: {
    queryOptions: any;
    select?: string;
    sort?: string;
    page: number;
    limit: number;
  }) => {
    let query = this.model.find(queryOptions);

    if (select) {
      query = query.select(select) as any;
    } else if (this.options.select) {
      query = query.select(this.options.select) as any;
    }

    if (this.options.populate) {
      this.options.populate.forEach((field) => {
        query = query.populate(field);
      });
    }

    query = query.sort(sort || this.options.sort || "-createdAt");

    const skip = (page - 1) * limit;
    return query.skip(skip).limit(limit);
  };

  private buildPagination = (
    page: number,
    limit: number,
    total: number
  ): PaginationResult => {
    const totalPages = Math.ceil(total / limit);
    return {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  };
}
