import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import axios from "axios";
const FormData = require("form-data");
import * as jwt from "jsonwebtoken";
import * as fs from "fs";

@Injectable()
export class SmsService {
  async sendSMS(phone_number: string, otp: string) {
    const data = new FormData();
    data.append("mobile_hone", phone_number);
    data.append("message", "This is test from Eskiz");
    data.append("from", "4546");

    var token: string = this.readToken();

    if (!token) {
      token = await this.getToken();
    }

    const decoded: any = jwt.decode(process.env.SMS_TOKEN!);

    if (!decoded || !decoded.exp) {
      throw new InternalServerErrorException("Invalid token");
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (decoded.exp < currentTimestamp) {
      token = await this.refreshToken();
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.SMS_SERVICE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  readToken() {
    const filePath = "./token.json";

    const rawData = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(rawData);

    var token: string = jsonData.token;

    return token;
  }

  async refreshToken() {
    const apiUrl = "notify.eskiz.uz/api/auth/refresh";
    const token = this.readToken();

    const response = await axios.patch(
      apiUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response["data"]["token"];
  }

  async getToken(): Promise<string> {
    const apiUrl = "notify.eskiz.uz/api/auth/login";

    const response = await axios.post(apiUrl, {
      email: "asadullohyusupov001@gmail.com",
      password: "d6kuIdhxeSmD7WpFjtVYi9COVhpKkV5YwKmn3DrE",
    });

    return response["data"]["token"];
  }
}
