import axios from "axios";
import { smsToken } from "../config/env";

export const sendMessage = async (number: string, message: string) => {
  const smsUrl = `http://web2sms.skytel.mn/apiSend?token=${smsToken}&sendto=${number}&message=${message}`;
  const response = await axios.get(smsUrl);
  return response;
};
