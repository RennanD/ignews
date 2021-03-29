import { NextApiRequest, NextApiResponse } from "next";

export default async ( request: NextApiRequest, response: NextApiResponse) => {

  console.log('chegou o evento');

  return response.status(200).json({ ok: true });
}