import { Response } from "express";
import {
  Document,
  FilterQuery,
  Model,
  RootFilterQuery,
  Schema,
} from "mongoose";
import MyError from "../utils/error";
import { AuthenticatedRequest } from "../middlewares/auth";
import { isAdmin, isCreator } from "../utils/validators";

type ModelField<T> = keyof T;

type Select<T> = Partial<Record<ModelField<T>, 0 | 1>>;
type Populate<T> = { path: ModelField<T>; select: string };

type ControllerOptions<T> = {
  defaultPopulate?: Populate<T>[];
  defaultSelect?: Select<T>;
  defaultFind?: RootFilterQuery<T>;
};

type CommonProps = {
  req: AuthenticatedRequest;
  res: Response;
};

export type QueryProps<T> = {
  find?: RootFilterQuery<T>;
  select?: Select<T>;
  populate?: Populate<T>[];
  sort?: string;
  page?: number;
  limit?: number;
};

type CommonDocument = Document & {
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
};

export class CommonController<T extends CommonDocument> {
  private model: Model<T>;
  private options?: ControllerOptions<T>;

  constructor(model: Model<T>, options?: ControllerOptions<T>) {
    this.model = model;
    this.options = options;
  }

  public getMany = async ({
    req,
    res,
    ...props
  }: CommonProps & QueryProps<T>) => {
    let { find } = props;
    find = find || this.options?.defaultFind || {};
    const query = this.buildQuery(this.model.find(find), props, true);
    const [data, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(find),
    ]);
    const pagination = this.buildPagination(total, props.page, props.limit);
    res.json({ status: "success", data, pagination });
  };

  public getOne = async ({
    req,
    res,
    ...props
  }: CommonProps & QueryProps<T>) => {
    let { find } = props;
    find = find || this.options?.defaultFind || {};
    const query = this.buildQuery(this.model.findOne(find), props);
    const data = await query.exec();
    if (!data) throw new MyError("Мэдээлэл олдсонгүй.", 404);
    res.json({ status: "success", data });
  };

  public getOneById = async ({
    req,
    res,
    ...props
  }: CommonProps & QueryProps<T>) => {
    const { id } = req.params;
    const query = this.buildQuery(this.model.findById(id), props);
    const data = await query.exec();
    if (!data)
      throw new MyError(`${id} id-тай ${this.model.name} олдсонгүй.`, 404);
    res.json({ status: "success", data });
  };

  public create = async ({ req, res }: CommonProps) => {
    req.body.createdBy = req.userId;
    const newData = new this.model(req.body);
    const savedData = await newData.save();
    res.status(201).json({
      status: "success",
      message: `Шинэ ${this.model.modelName} амжилттай үүсгэлээ.`,
      data: savedData,
    });
  };

  public update = async ({ req, res }: CommonProps) => {
    const { id } = req.params;
    const data = await this.model.findById(id);
    if (!data)
      throw new MyError(
        `Засах үйлдэл амжилтгүй: ${id}-тай ${this.model.modelName} олдсонгүй.`,
        404
      );

    if (!isAdmin(req) && !isCreator(data.createdBy, req)) {
      throw new MyError(
        `Засах үйлдэл амжилтгүй: Та зөвхөн өөрийн үүсгэсэн мэдээллийг засах боломжтой.`,
        404
      );
    }
    req.body.updatedBy = req.userId;
    Object.assign(data, req.body);
    const updatedData = await data.save();
    res.json({
      status: "success",
      message: `${id} id-тай  ${this.model.modelName} амжилттай шинэчлэгдлээ.`,
      data: updatedData,
    });
  };

  public delete = async ({ req, res }: CommonProps) => {
    const { id } = req.params;
    const data = await this.model.findById(id);
    if (!data)
      throw new MyError(
        `Устгах үйлдэл амжилтгүй: ${id}-тай ${this.model.modelName} олдсонгүй.`,
        404
      );

    if (!isAdmin(req) && !isCreator(data.createdBy, req)) {
      throw new MyError(
        `Устгар үйлдэл амжилтгүй: Та зөвхөн өөрийн үүсгэсэн мэдээллийг устгах боломжтой.`,
        404
      );
    }
    await data.deleteOne();
    res.json({
      status: "success",
      message: `${id} id-тай  ${this.model.modelName} амжилттай устлаа.`,
    });
  };

  private buildQuery(query: any, props: QueryProps<T>, isMany = false) {
    let { select, populate, sort, page, limit } = props;
    select = select || this.options?.defaultSelect;
    populate = populate || this.options?.defaultPopulate;

    if (select) query = query.select(select || this.options?.defaultSelect);

    if (populate) {
      populate.forEach((field) => {
        query = query.populate(field.path, field.select);
      });
    }
    if (isMany) {
      const skip = ((page || 1) - 1) * (limit || 20);
      query = query
        .sort(sort || "-createdAt")
        .skip(skip)
        .limit(limit || 20);
    }

    return query;
  }

  private buildPagination(
    total: number,
    page = 1,
    limit = 20
  ): PaginationResult {
    const totalPages = Math.ceil(total / limit);
    return {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }
}

type PaginationResult = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
