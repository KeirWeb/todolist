import axios from "axios"

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "f09daa5b-2834-4b3b-81d6-287ed58b49b1",
  },
})
