import axios from "axios";
import MyError from "../utils/error";
import { getRandomCode } from "../utils/tools";

const { QPAY_USER, QPAY_PASS, QPAY_INVOICE_CODE, QPAY_HOST } = process.env;

type QpayInvoiceProps = {
  amount: number;
  description: string;
  callback_url: string;
  sender_invoice_no?: string;
  invoice_receiver_code?: string;
};

export const createQpayInvoice = async ({
  amount,
  description,
  callback_url,
  sender_invoice_no = getRandomCode(6),
  invoice_receiver_code = "terminal",
}: QpayInvoiceProps) => {
  const access_token = await getQpayToken();
  if (!access_token) throw new MyError("Qpay access_token байхгүй байна!");

  const url = `${QPAY_HOST}/v2/invoice`;
  const invoice_code = QPAY_INVOICE_CODE;
  const Authorization = `Bearer ${access_token}`;

  let config = {
    method: "post",
    url,
    data: {
      invoice_code,
      sender_invoice_no,
      invoice_description: description,
      invoice_receiver_code,
      amount,
      callback_url,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization,
    },
  };
  try {
    const response = await axios.request(config);
    if (response.status !== 200)
      throw new MyError("Qpay үүсгэхэд алдаа гарлаа!");
    return response.data;
  } catch (error) {
    throw new MyError("Qpay үүсгэхэд алдаа гарлаа!");
  }
};

export const checkQpayInvoice = async (invoice_id: string) => {
  const access_token = await getQpayToken();
  if (!access_token) throw new MyError("Qpay access_token байхгүй байна!", 500);
  const url = `${QPAY_HOST}/v2/payment/check`;

  const Authorization = `Bearer ${access_token}`;

  let config = {
    method: "post",
    url,
    data: {
      object_type: "INVOICE",
      object_id: invoice_id,
      offset: {
        page_number: 1,
        page_limit: 100,
      },
    },
    headers: {
      "Content-Type": "application/json",
      Authorization,
    },
  };
  const { data } = await axios.request(config);
  if (data.count !== 1)
    return { status: 403, message: "Төлбөр хүлээгдэж байна." };
  return { status: 200, message: "Төлбөр төлөгдсөн байна." };
};

export const getQpayToken = async () => {
  const url = `${QPAY_HOST}/v2/auth/token`;

  const Authorization = `Basic ${Buffer.from(
    `${QPAY_USER}:${QPAY_PASS}`
  ).toString("base64")}`;

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url,
    headers: {
      "Content-Type": "application/json",
      Authorization,
    },
  };
  try {
    const { data } = await axios.request(config);
    if (data.status === 401)
      throw new MyError("Qpay Token үүсгэхэд алдаа гарлаа!");
    return data.access_token;
  } catch (error) {
    throw new MyError("Qpay Token үүсгэхэд алдаа гарлаа!");
  }
};
