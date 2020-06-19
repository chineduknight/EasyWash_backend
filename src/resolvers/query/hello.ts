export const hello = (prt: any, arg: any, ctx: any) => {
  console.log(ctx.req.session)
  return 'Hello World';
}