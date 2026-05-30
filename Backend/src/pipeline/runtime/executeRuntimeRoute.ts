import prisma from "../../lib/prisma";

export const executeRuntimeRoute = async (
  route: any,
  method: string,
  body: any
) => {

 
  // GET MODEL NAME
 

  const modelName =
    route.path.replace("/", "");

  // Example:
  // /users -> users
  // /products -> products

  const prismaModel =
    (prisma as any)[modelName];

  if (!prismaModel) {

    throw new Error(
      `Prisma model not found: ${modelName}`
    );

  }


  if (method === "GET") {

    return await prismaModel.findMany();

  }



  if (method === "POST") {

    return await prismaModel.create({

      data: body

    });

  }


  if (method === "PUT") {

    return await prismaModel.update({

      where: {
        id: body.id
      },

      data: body

    });

  }

  if (method === "DELETE") {

    return await prismaModel.delete({

      where: {
        id: body.id
      }

    });

  }

  throw new Error(
    `Unsupported method: ${method}`
  );

};