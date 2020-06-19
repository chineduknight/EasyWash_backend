export const users = async (_parent: any, args: any,ctx:any)=>{
  return await ctx.prisma.users();
}