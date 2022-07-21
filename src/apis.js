import axios from "axios";
import { LIMIT } from "./constants";

//建立一個自定義的axios
const worldTimeRequest = axios.create({
  baseURL: "https://worldtimeapi.org/api",
  headers: { "Access-Control-Allow-Origin": "*" }
});

const loremPicsumRequest = axios.create({
  baseURL: "https://picsum.photos",
  headers: { "Access-Control-Allow-Origin": "*" }
});

export const getAllTimeZone = () => worldTimeRequest.get("/timezone");
export const getImageList = (page = 1, limit = LIMIT) =>
  loremPicsumRequest.get(`/v2/list?page=${page}&limit=${limit}`);
